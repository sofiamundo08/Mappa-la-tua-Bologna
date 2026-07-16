let map;

let luoghi = [];
let risposte = [];

let markerLayer = L.layerGroup();


const colori = {
    "Felicità": "#FFD700",
    "Tristezza": "#4169E1",
    "Disagio": "#DC143C",
    "Autenticità": "#32CD32",
    "Cambiamento": "#FF8C00"
};


map = L.map("map")
    .setView([44.4949, 11.3426], 13);


L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap"
    }
).addTo(map);


markerLayer.addTo(map);



Promise.all([

    fetch("data/luoghi.json").then(r => r.json()),

    fetch("data/risposte.json").then(r => r.json())

])

.then(([luoghiData, risposteData]) => {

    luoghi = luoghiData;
    risposte = risposteData;

    aggiornaMappa();

});




function aggiornaMappa(){

    let filtro = document
        .getElementById("filtro-emozione")
        .value;


    markerLayer.clearLayers();



    luoghi.forEach(luogo => {


        let risposteLuogo = risposte.filter(r =>

            r.Luogo.trim() === luogo.Luogo.trim()

        );


        if(filtro !== "tutte"){

            risposteLuogo =
            risposteLuogo.filter(r =>

                r.Emozione === filtro

            );

        }



        if(risposteLuogo.length === 0)
            return;



        // conta le emozioni presenti

        let conteggio = {};

        risposteLuogo.forEach(r => {

            conteggio[r.Emozione] =
            (conteggio[r.Emozione] || 0) + 1;

        });



        // emozione più frequente

        let emozionePrincipale =
        Object.keys(conteggio)
        .reduce((a,b)=>

            conteggio[a] > conteggio[b] ? a : b

        );



        // dimensione in base alle risposte

        let raggio =
        Math.min(
            8 + risposteLuogo.length * 2,
            35
        );



        let marker = L.circleMarker(

            [
                luogo.Latitudine,
                luogo.Longitudine
            ],

            {

                radius: raggio,

                fillColor:
                colori[emozionePrincipale],

                color:
                colori[emozionePrincipale],

                fillOpacity:0.7

            }

        );



        marker.bindPopup(

        `
        <b>${luogo.Luogo}</b><br><br>

        Totale risposte: ${risposteLuogo.length}<br><br>

        ${
        Object.entries(conteggio)
        .map(
            ([emo,num]) =>
            `${emo}: ${num}`
        )
        .join("<br>")
        }

        `

        );



        marker.addTo(markerLayer);


    });

}





document
.getElementById("filtro-emozione")
.addEventListener(

"change",

aggiornaMappa

);
