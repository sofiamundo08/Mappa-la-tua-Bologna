let map;

let luoghi = [];
let risposte = [];


const colori = {

"Felicità":"gold",

"Tristezza":"blue",

"Disagio":"red",

"Autenticità":"green",

"Cambiamento":"orange"

};



map = L.map('map')
.setView([44.4949,11.3426],13);



L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:
'© OpenStreetMap'
}

).addTo(map);



Promise.all([

fetch("data/luoghi.json").then(r=>r.json()),

fetch("data/risposte.json").then(r=>r.json())

])

.then(data=>{


luoghi=data[0];

risposte=data[1];


creaMappa();


});





function creaMappa(){


luoghi.forEach(luogo=>{


let emozioni = risposte.filter(

r => r.Luogo === luogo.Luogo

);



if(emozioni.length===0)
return;



let principale =
emozioni[0].Emozione;



let marker = L.circleMarker(

[
luogo.Latitudine,
luogo.Longitudine
],

{

radius:10,

color:
colori[principale] || "black",

fillColor:
colori[principale] || "black",

fillOpacity:0.8

}


).addTo(map);



let testo =

"<b>"+luogo.Luogo+"</b><br>"+

"Emozione prevalente: "+principale+
"<br><br>"+

luogo.Note;



marker.bindPopup(testo);



});


}




document
.getElementById("filtro-emozione")
.addEventListener(
"change",

function(){


let scelta=this.value;


document
.querySelectorAll(".leaflet-marker-icon")
.forEach(e=>e.style.display="block");


}

);
