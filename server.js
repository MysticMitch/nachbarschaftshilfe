const checkSession = require("./checkSession").checkSession;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const port = 5000;

const dbRead = require("./database/databaseRead.js");
const dbAdd = require("./database/databaseAdd.js");
const dbDelete = require("./database/databaseDelete.js");
const dbEdit = require("./database/databaseEdit.js");

//EJS wird genutzt
app.set("view-engine", "ejs");

//Auf Port hören
app.listen(port, () => console.log("Server läuft auf Port "+port+" - "+new Date));

//Public Ordner static enthält Bilder
app.use("/public", express.static("./public")); 

//Ermöglicht req.body.value
app.use(express.urlencoded({extended:false}));

//Session Standard Werte
app.use(session({secret: "s-secret-key", resave: false, saveUninitialized: false}));

//**************************** HTTP GET METHODEN ********************************//

app.get("/", (req, res) => {
  req.session.success = false;
  res.render("login.ejs");
  });

app.get("/login", (req, res) => {
req.session.success = false;
res.render("login.ejs");
});

app.get("/registrieren", (req, res) => {
  req.session.success = false;
  res.render("registrieren.ejs");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("login.ejs");
});

app.get("/profil", async (req, res) => {
  if(!checkSession(req,res)){return;}
  let daten = new Object();
  daten.person = await dbRead.getPerson(req.session.idperson);
  daten.listen = await dbRead.getEinkaufslistenSelf(req.session.idperson);
  daten.arbeit = await dbRead.getEinkaufslistenBearbeitung(req.session.idperson);
  res.render("profil.ejs", {daten});
});

app.get("/einkaufen", async (req, res) => {
if(!checkSession(req,res)){return;}
let listen = await dbRead.getEinkaufslisten(req.session.idperson);
res.render("einkaufen.ejs", {listen});
});

app.get("/empfangen", (req, res) => {
if(!checkSession(req,res)){return;}
  res.render("empfangen.ejs");
});

app.get("/grunden",  (req, res) => {
if(!checkSession(req,res)){return;}
  res.render("gründen.ejs");
});

app.get("/menu", (req, res) => {
if(!checkSession(req,res)){return;}
res.render("menu.ejs");
});

app.get("/gemeinden", async (req, res) => {
if(!checkSession(req,res)){return;}
  let gemeinden = await dbRead.getGemeinden();
  res.render("gemeinden.ejs", {gemeinden});
});

//Falsche GET Requests landen hier
app.get("*", (req, res) => {
  if(!checkSession(req,res)){return;}
  res.render("menu.ejs");
});

//************************ HTTP POST METHODEN ******************************//

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
    console.log("Fehler beim Login");
    res.render("login.ejs");
  }
  });
  
  app.post("/registrieren", async (req, res) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        let passwort = await bcrypt.hash(req.body.passwort, salt);
        dbAdd.personAnlegen(req.body.nutzername, passwort, req.body.vorname, req.body.nachname, req.body.telefon, req.body.ortsname, req.body.plz, req.body.strasse, req.body.hausnr);
        res.render("login.ejs");
    }
    catch {
        console.log("Fehler bei der Registrierung");
        res.render("login.ejs");
    }
  });

  app.post("/aufnehmen", async (req, res) =>{
    if(!checkSession(req,res)){return;}
    dbEdit.updateBearbeiter(req.body.liste, req.session.idperson);
    res.render("menu.ejs");
  });

  app.post("/entfernen", async (req, res) =>{
    if(!checkSession(req,res)){return;}
    dbDelete.deleteEinkaufsliste(req.body.liste);
    res.render("menu.ejs");
  });

app.post("/grunden", async (req, res) =>{
  if(!checkSession(req,res)){return;}
  try{
    dbAdd.gemeindeAnlegen(req.session.idperson, req.body.bezeichnung, req.body.ortsname, req.body.plz, req.body.strasse, req.body.hausnr);
      console.log("Gemeinschaft wurde angelegt.");
      res.render("menu.ejs");
  }
  catch {
    console.log("Fehler bei Gemeinschaft Gründung");
    res.render("menu.ejs");
  }
});

app.post("/beitretenoderverlassen", (req, res) => {
  if(req.body.beitreten){
  dbAdd.addBeitritt(req.session.idperson, req.body.beitreten);
  }else if(req.body.verlassen){
  dbDelete.deleteBeitritt(req.session.idperson, req.body.verlassen, function(exists){if(!exists)return;
  dbDelete.deleteBesitzt(req.session.idperson, req.body.verlassen)});
  }
  res.render("menu.ejs");
  });

  app.post("/aufgeben", (req, res) => {
    let bezeichnungen = req.body.bezeichnung;
    let marken = req.body.marke;
    let mengen = req.body.menge;
    let kilogramm = req.body.kilogramm;
    let liter = req.body.liter;
    let produkte = [];

    if(mengen < 0){
      mengen = mengen * (-1);
    }
    if(kilogramm < 0){
      kilogramm = kilogramm * (-1);
    }
    if(liter < 0){
      liter = liter * (-1);
    }

    //bezeichnungen ist string wenn nur ein Produkt, ein object wenn mehrere Produkte
    if(typeof bezeichnungen == "string"){
      let produkt = {bezeichnung:bezeichnungen, marke:marken, menge:mengen, kilogramm:kilogramm, liter:liter};
      produkte.push(produkt);
    }else{
    for(let i = 0; i < bezeichnungen.length; i++){
      let produkt = {bezeichnung:bezeichnungen[i], marke:marken[i], menge:mengen[i], kilogramm:kilogramm[i], liter:liter[i]};
      produkte.push(produkt);
    }}
    dbAdd.einkaufslisteAnlegen(req.session.idperson, produkte);
    res.render("menu.ejs");
    });

    
    app.post("/profil", async (req, res) => {
      if(!checkSession(req,res)){return;}
      if(req.body.anpassen){
      res.render("anpassung.ejs");
      }else if(req.body.ehrenhalle){
       let personen = await dbRead.getPersonen();
       res.render("ehrenhalle.ejs", {personen});
      }});

      app.post("/anpassen", (req, res) => {
        if(!checkSession(req,res)){return;}
      dbEdit.updatePerson( req.session.idperson, req.body.vorname, req.body.nachname, req.body.ortsname, req.body.plz, req.body.strasse, req.body.hausnr, req.body.telefon);  
      res.render("menu.ejs"); 
      });

      app.post("/fertigOderZuruck", (req, res) => {
      if(!checkSession(req,res)){return;} 
      if(req.body.fertig){
      dbEdit.updateHeldenpunkte(req.session.idperson);
      dbDelete.deleteEinkaufsliste(req.body.fertig);
      res.render("menu.ejs");
      }else if(req.body.zuruck){
       dbEdit.updateBearbeiterRemove(req.body.zuruck);
       res.render("menu.ejs");
        }});

    //Falsche POST Requests landen hier
    app.post("*", (req, res) => {
    if(!checkSession(req,res)){return;}
    res.render("menu.ejs");
    });