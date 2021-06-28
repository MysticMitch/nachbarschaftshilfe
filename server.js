const express = require("express");
const bcrypt = require("bcryptjs");
const logger = require("./logger");
const PORT = process.env.PORT || 5000;
const app = express();
const ejs = require("ejs");

const dbRead = require("./database/databaseRead.js");
const db = require("./database/databaseAdd.js");
const { response } = require("express");
//const dbEdit = require("./database/databaseEdit.js");
  
app.set("view-engine", "ejs");
app.listen(PORT, () => console.log("Server läuft auf Port "+PORT));
app.use(express.urlencoded({extended:false})); //ermöglicht req.body.value
//app.use(logger); 

app.get("/", function(req,res){res.render("login.ejs")});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/index", (req, res) => {
  res.render("index.ejs");
});

app.get("/menu", (req, res) => {
  let zeug = ["Eins", "Zwei", "Drei"];
  res.render("menu.ejs", {daten:zeug});
});

app.post("/login", async (req, res) => {
  try {
    let dbPasswort = await dbRead.getPassword(req.body.nutzername);
    let vergleich = await bcrypt.compare(req.body.passwort, dbPasswort);

    console.log("PW Vergleich: " + vergleich);

    if (vergleich) {
      console.log("Login.");
      res.redirect("/menu");
    } else {
      console.log("Daten falsch.");
      res.redirect("/login");
    }
  } catch {
    console.log("Fehler");
  }
});


app.post("/register", async (req, res) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        let passwort = await bcrypt.hash(req.body.passwort, salt);
        console.log(passwort);
        db.personAnlegen(req.body.nutzername, passwort, req.body.vorname, req.body.nachname, req.body.telefon, req.body.ortsname, req.body.plz, req.body.strasse, req.body.hausnr);
        res.redirect("/login");
    }
    catch {
        console.log("Fehler");
        res.redirect("/index");
    }
  });
























//db.personAnlegen("EpicMan", "Test", "Tim", "Bovo", 053532, "Weingarten", 88284, "Kolpstr", 10);
//db.gemeindeAnlegen("7 Zwerge", "Frankfurt", 53520, "Klausstraße", 5);

//dbEdit.updateBearbeiter(2, 10);

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