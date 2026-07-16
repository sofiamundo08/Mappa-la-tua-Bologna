fetch("data/risposte.json")
.then(response => response.json())
.then(data => {

    document.getElementById("numero-risposte").innerHTML = data.length;

})
.catch(error => {
    console.log("Errore caricamento risposte:", error);
});


fetch("data/luoghi.json")
.then(response => response.json())
.then(data => {

    document.getElementById("numero-luoghi").innerHTML = data.length;

})
.catch(error => {
    console.log("Errore caricamento luoghi:", error);
});
