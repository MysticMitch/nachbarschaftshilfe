const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const logger = require("./logger");
const PORT = process.env.PORT || 5000;
const app = express();

const dbRead = require("./database/databaseRead.js");
const dbAdd = require("./database/databaseAdd.js");
  
app.set("view-engine", "ejs");
app.listen(PORT, () => console.log("Server läuft auf Port "+PORT));
app.use("/public", express.static("./public")); //EJS Bilder laden
app.use(express.urlencoded({extended:false})); //ermöglicht req.body.value
app.use(session({secret: "secret-key", resave: false, saveUninitialized: false}));
//app.use(logger); 


app.get("/", function(req,res){req.session.success=false; res.render("login.ejs");});

app.get("/login", (req, res) => {
  req.session.success = false;
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
    req.session.success = false;
    res.render("register.ejs");
});

app.post("/login", async (req, res) => {
  try {
    let dbPasswort = await dbRead.getPassword(req.body.nutzername);
    let vergleich = await bcrypt.compare(req.body.passwort, dbPasswort);

    if (vergleich) {
      console.log("Login erfolgreich.");
      req.session.idperson = await dbRead.getID(req.body.nutzername);
      req.session.success = true;
      res.render("menu.ejs");
    } else {
      console.log("Login fehlgeschlagen.");
      res.render("login.ejs");
    }
  } catch {
    console.log("Fehler");
    res.render("errorpage.ejs");
  }
});

app.post("/register", async (req, res) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        let passwort = await bcrypt.hash(req.body.passwort, salt);
        console.log(passwort);
        dbAdd.personAnlegen(req.body.nutzername, passwort, req.body.vorname, req.body.nachname, req.body.telefon, req.body.ortsname, req.body.plz, req.body.strasse, req.body.hausnr);
        res.render("login.ejs");
    }
    catch {
        console.log("Fehler");
        res.render("errorpage.ejs");
    }
  });

  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("login.ejs");
  });

//-------------------------------------------------------------------------

app.get("/index", (req, res) => {
  req.session.success = false;
  res.render("login.ejs");
});

app.get("/einkaufen", (req, res) => {
  if(req.session.success !== true){
    res.render("login.ejs");
    return;
  }
    res.render("einkaufen.ejs");
});

app.get("/empfangen", (req, res) => {
  if(req.session.success !== true){
    res.render("login.ejs");
    return;
  }
    res.render("empfangen.ejs");
});


app.get("/grunden",  (req, res) => {
  if(req.session.success !== true){
    res.render("login.ejs");
    return;
  }
    res.render("gründen.ejs");
});

app.get("/menu", (req, res) => {
  if(req.session.success !== true){
    res.render("login.ejs");
    return;
  }
  res.render("menu.ejs");
});

app.get("/ansehen", async (req, res) => {
  if(req.session.success !== true){
    res.render("login.ejs");
    return;
  }
    let gemeinden = await dbRead.getGemeinden();
    res.render("ansehen.ejs", {gemeinden});
});

  app.post("/grunden", async (req, res) =>{
    if(req.session.success !== true){
      res.render("login.ejs");
      return;
    }
    try{
      dbAdd.gemeindeAnlegen(req.body.bezeichnung, req.body.ortsname, req.body.plz, req.body.strasse, req.body.hausnr);
        console.log("Gemeinschaft wurde angelegt.");
        res.render("menu.ejs");
    }
    catch {
        console.log("Fehler");
        res.render("errorpage.ejs");
    }
  });

//---------------------------------------------------------------

app.get("/test", (req, res) => {
  res.render("test.ejs");
});

app.post("/beitreten", (req, res) => {

console.log(req.body.auswahl);
res.redirect("back");
//res.render("menu.ejs");
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