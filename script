let map = L.map('map')
.setView([44.4949,11.3426],13);


L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);



let markers=[];



function aggiornaMappa(){


markers.forEach(m=>{
map.removeLayer(m);
});


markers=[];



let emozione =
document.getElementById("emozione").value;


let eta =
document.getElementById("eta").value;


let sesso =
document.getElementById("sesso").value;


let quartiere =
document.getElementById("quartiere").value;



let filtrati=dati.filter(d=>{


return (

(emozione==="Tutte" || d.emozione===emozione)

&&

(eta==="Tutte" || d.eta===eta)

&&

(sesso==="Tutti" || d.sesso===sesso)

&&

(quartiere==="Tutti" || d.quartiere===quartiere)

);


});



// raggruppamento luoghi

let luoghi={};



filtrati.forEach(d=>{


if(!luoghi[d.luogo]){

luoghi[d.luogo]={
lat:d.lat,
lon:d.lon,
numero:0,
commenti:[]
}

}


luoghi[d.luogo].numero++;

luoghi[d.luogo].commenti.push(d.commento);


});



// creazione pallini


Object.keys(luoghi).forEach(nome=>{


let luogo=luoghi[nome];


let marker=L.circleMarker(

[luogo.lat,luogo.lon],

{

radius:5 + luogo.numero*5

}

)


.addTo(map);



marker.bindPopup(

`
<h3>${nome}</h3>

<p>
<b>Citazioni:</b>
${luogo.numero}
</p>


<p>
${luogo.commenti.join("<br><br>")}
</p>

`

);



markers.push(marker);


});


}



aggiornaMappa();



document
.querySelectorAll("select")
.forEach(select=>{

select.addEventListener(
"change",
aggiornaMappa
);

});
