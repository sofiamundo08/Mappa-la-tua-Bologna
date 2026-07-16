fetch("data/risposte.json")

.then(r=>r.json())

.then(data=>{


let emozioni={};


data.forEach(r=>{


let e=r.Emozione;


if(!emozioni[e])
emozioni[e]=0;


emozioni[e]++;


});



new Chart(

document
.getElementById("grafico-emozioni"),

{

type:"doughnut",

data:{

labels:Object.keys(emozioni),

datasets:[{

data:Object.values(emozioni)

}]

}

}

);






let eta={};



data.forEach(r=>{


let e=r.Fascia_eta;


if(!eta[e])
eta[e]=0;


eta[e]++;


});



new Chart(

document
.getElementById("grafico-eta"),

{

type:"bar",

data:{

labels:Object.keys(eta),

datasets:[{

label:"Risposte per età",

data:Object.values(eta)

}]

}

}

);



});
