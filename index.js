const express = require("express");
const logger = require("./logger");
const PORT = process.env.PORT || 5000;
const app = express();
const db = require("./database/databaseAdd.js");

app.get("/", function(req,res){res.send("<h1>Hi</h1>");});
app.listen(PORT, () => console.log("Server läuft auf Port "+PORT));
app.use(logger);    




db.personAnlegen("EpicMan", "Test", "Tim", "Bovo", 053532, "Weingarten", 88284, "Kolpstr", 10);



































//db.gemindeAnlegen("Aldi Süd", "Ravensburg", 88212, "Hallostraße", 11);

//db.personAnlegen("Dragonslayer", "12345", "Tim", "Maier", 07052, "Ravensburg", 88212, "Haistraße", 10);

//db.addEinkaufsliste(1,1);

//db.addProdukt(1, "Apfel", "Oetker", 10, 5.0, 10.5, 0.7);

/*
let produktA = {bezeichnung:"Capri", marke:"Oetker", menge:10, kilogramm:5 ,liter:7, preis:50};
let produktB = {bezeichnung:"Sonne", marke:"Oetker", menge:10, kilogramm:5 ,liter:7, preis:50};

let produkte = [produktA, produktB];

db.einkaufslisteAnlegen(1,22, produkte); 
*/

//db.addBeitritt(2,22);

//db.gemeindeAnlegen("Südstadt", "Weingarten", 88100, "Lauch", 22);


//console.log(produktReihe[0].marke);

//db.einkaufslisteAnlegen();
/*
db.getWohnsitzPrimary(function(result){
    console.log(result);
 });*/

//db.addWohnsitz("Südstadt", 888212, 20, "Test");
//db.addGemeinde("Neu", 400);