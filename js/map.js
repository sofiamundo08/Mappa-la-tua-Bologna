let map;

let luoghi = [];
let risposte = [];

let markers = [];


const colori = {

    "Felicità": "gold",
    "Tristezza": "blue",
    "Disagio": "red",
    "Autenticità": "green",
    "Cambiamento": "orange"

};



map = L.map('map')
.setView([44.4949, 11.3426], 13);



L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap'
    }
).addTo(map);




Promise.all([

    fetch("data/luoghi.json").then(r => r.json()),

    fetch("data/risposte.json").then(r => r.json())

])

.then(([l, r]) => {

    luoghi = l;
    risposte = r;

    creaMappa();

});




function creaMappa(emozioneFiltro = "tutte"){


    // elimina vecchi punti

    markers.forEach(m => {
        map.removeLayer(m.marker);
    });


    markers = [];



    luoghi.forEach(luogo => {



        let risposteLuogo = risposte.filter(

            r => r.Luogo.trim() === luogo.Luogo.trim()

        );



        if(risposteLuogo.length === 0)
            return;



        // applica filtro emozione

        if(emozioneFiltro !== "tutte"){

            risposteLuogo =
            risposteLuogo.filter(
                r => r.Emozione === emozioneFiltro
            );


            if(risposteLuogo.length === 0)
                return;

        }



        let emozione = risposteLuogo[0].Emozione;



        // dimensione proporzionale

        let dimensione =
        Math.min(
            8 + risposteLuogo.length * 3,
            35
        );



        let marker = L.circleMarker(

            [
                luogo.Latitudine,
                luogo.Longitudine
            ],

            {

                radius: dimensione,

                color: colori[emozione],

                fillColor: colori[emozione],

                fillOpacity:0.65

            }

        )
        .addTo(map);



        marker.bindPopup(

            `
            <b>${luogo.Luogo}</b><br>
            Emozione: ${emozione}<br>
            Risposte: ${risposteLuogo.length}
            `

        );



        markers.push({

            marker: marker,

            emozione: emozione

        });



    });

}






document
.getElementById("filtro-emozione")
.addEventListener(

"change",

function(){

    creaMappa(this.value);

}

);
