let map;

const colori = {
    "Felicità": "gold",
    "Tristezza": "blue",
    "Disagio": "red",
    "Autenticità": "green",
    "Cambiamento": "orange"
};


map = L.map('map').setView([44.4949, 11.3426], 13);


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

.then(([luoghi, risposte]) => {

    console.log("Luoghi:", luoghi);
    console.log("Risposte:", risposte);


    luoghi.forEach(luogo => {


        let risposteLuogo = risposte.filter(
            r => r.Luogo.trim() === luogo.Luogo.trim()
        );


        if (risposteLuogo.length === 0) {
            return;
        }


        let emozione = risposteLuogo[0].Emozione;


        let marker = L.circleMarker(
            [
                luogo.Latitudine,
                luogo.Longitudine
            ],
            {
                radius: 10,
                color: colori[emozione] || "black",
                fillColor: colori[emozione] || "black",
                fillOpacity: 0.8
            }
        );


        marker.addTo(map);


        marker.bindPopup(
            `
            <b>${luogo.Luogo}</b><br>
            Emozione: ${emozione}<br>
            Risposte: ${risposteLuogo.length}
            `
        );


    });


})

.catch(error => {

    console.error(
        "Errore caricamento dati:",
        error
    );

});
