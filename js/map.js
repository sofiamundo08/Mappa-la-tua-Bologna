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

    creaFiltri();

    aggiornaMappa();

});




function aggiornaMappa(){


    let filtroEmozione =
    document.getElementById("filtro-emozione").value;


    let filtroEta =
    document.getElementById("filtro-eta").value;


    let filtroSesso =
    document.getElementById("filtro-sesso").value;


    let filtroOccupazione =
    document.getElementById("filtro-occupazione").value;


    let filtroQuartiere =
    document.getElementById("filtro-quartiere").value;



    markerLayer.clearLayers();



    luoghi.forEach(luogo => {


        let risposteLuogo = risposte.filter(r =>

            r.Luogo.trim() === luogo.Luogo.trim()

        );



        // Applica tutti i filtri

        risposteLuogo = risposteLuogo.filter(r => {


            return (

                (filtroEmozione === "tutte" || 
                r.Emozione === filtroEmozione)

                &&

                (filtroEta === "tutte" || 
                r.Fascia_eta === filtroEta)

                &&

                (filtroSesso === "tutte" || 
                r.Sesso === filtroSesso)

                &&

                (filtroOccupazione === "tutte" || 
                r.Occupazione === filtroOccupazione)

                &&

                (filtroQuartiere === "tutti" || 
                r.Quartiere_Bologna === filtroQuartiere)

            );

        });



        if(risposteLuogo.length === 0)
            return;



        // Conta emozioni

        let conteggio = {};


        risposteLuogo.forEach(r => {

            conteggio[r.Emozione] =
            (conteggio[r.Emozione] || 0) + 1;

        });



        // Emozione prevalente

        let emozionePrincipale =
        Object.keys(conteggio)
        .reduce((a,b) =>

            conteggio[a] > conteggio[b] ? a : b

        );



        // Dimensione pallino

        let raggio = Math.min(
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

                fillColor: colori[emozionePrincipale],

                color: colori[emozionePrincipale],

                fillOpacity: 0.7

            }

        );



       let commenti = risposteLuogo
    .filter(r => r.Commento)
    .map(r => 
        `<p>💬 "${r.Commento}"</p>`
    )
    .join("");



marker.bindPopup(

`
<b>${luogo.Luogo}</b><br><br>

<strong>Risposte:</strong> ${risposteLuogo.length}

<br><br>

<strong>Emozioni:</strong><br>

${
    Object.entries(conteggio)
    .map(([emo,num]) =>
        `${emo}: ${num}`
    )
    .join("<br>")
}

<br><br>

<strong>Commenti:</strong>

${commenti || "Nessun commento disponibile"}

`

);


        marker.addTo(markerLayer);


    });

}






// Tutti i filtri aggiornano la mappa

document
.querySelectorAll(".filters select")
.forEach(select => {

    select.addEventListener(
        "change",
        aggiornaMappa
    );

});






function creaFiltri(){


    creaOpzioni(
        "filtro-eta",
        "Fascia_eta"
    );


    creaOpzioni(
        "filtro-sesso",
        "Sesso"
    );


    creaOpzioni(
        "filtro-occupazione",
        "Occupazione"
    );


    creaOpzioni(
        "filtro-quartiere",
        "Quartiere_Bologna"
    );

}





function creaOpzioni(id, campo){

    let select = document.getElementById(id);

    if(!select){
        console.log("Filtro non trovato:", id);
        return;
    }


    let valori = risposte
        .map(r => r[campo])
        .filter(v => v !== null && v !== undefined && v !== "")
        .map(v => v.trim());


    valori = [...new Set(valori)];

    valori.sort();



    valori.forEach(v => {

        let option = document.createElement("option");

        option.value = v;

        option.textContent = v;

        select.appendChild(option);

    });


    console.log(campo, valori);

}
