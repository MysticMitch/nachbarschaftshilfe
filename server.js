const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const logger = require("./logger");
const PORT = process.env.PORT || 5000;
const app = express();

const dbRead = require("./database/databaseRead.js");
const dbAdd = require("./database/databaseAdd.js");
const dbDelete = require("./database/databaseDelete.js");

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

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("login.ejs");
});

app.get("/profil", (req, res) => {
  res.render("profil.ejs");
});

app.get("/test", (req, res) => {
  res.render("test.ejs");
  });

/*app.get("/index", (req, res) => {
req.session.success = false;
res.render("login.ejs");
});*/

app.get("/einkaufen", (req, res) => {
if(!checkSession(req,res)){return;}
  res.render("einkaufen.ejs");
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

//Falsche GET Requests führen zu Login
app.get("*", (req, res) => {
  if(!checkSession(req,res)){return;}
  res.render("menu.ejs");
});

//-------------------------------------------------------------------------

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

app.post("/grunden", async (req, res) =>{
  if(!checkSession(req,res)){return;}
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

app.post("/beitretenoderverlassen", (req, res) => {
  if(req.body.beitreten){
  dbAdd.addBeitritt(req.session.idperson, req.body.beitreten);
  }else if(req.body.verlassen){
  dbDelete.deleteBeitritt(req.session.idperson, req.body.verlassen);
  }
  res.render("menu.ejs");
  });

//---------------------------------------------------------------


function checkSession(req, res){
if(req.session.success !== true){
  res.render("login.ejs");
  return false;
}
return true;
}