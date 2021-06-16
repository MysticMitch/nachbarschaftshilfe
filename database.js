const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Dragonslayer385§IDEAL",
    database: "nachbarschaft"
  });

  //Falls Datenbank nicht erreichbar ist
  connection.on("error", function(err) {
    console.log("Verbindung zur Datenbank fehlgeschlagen.");
  });


  //--------------------------------------------------------

//Alles hier kann zu einer database Servie Schicht kommen

//Wohnsitz anlegen, dessen Primärschlüssel holen, Gemeinde anlegen mit fkWohnsitz
function gemindeAnlegen(bezeichnung, ortsname, postleitzahl, straße, hausnummer){
  addWohnsitz(ortsname, postleitzahl, straße, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Gemeinde geholt: " + fkWohnsitz);addGemeinde(fkWohnsitz, bezeichnung);});
}

function personAnlegen(nutzername, passwort, vorname, nachname, telefon, ortsname, postleitzahl, straße, hausnummer){
  addWohnsitz(ortsname, postleitzahl, straße, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Person geholt: " + fkWohnsitz);addPerson(fkWohnsitz, nutzername, passwort, vorname, nachname, telefon);});
}

//ProduktArray ist ein Array das alle Produkte enthält die mit der Einkaufsliste angelegt werden
function einkaufslisteAnlegen(idAusgeber, idGemeinde, produkte){
  addEinkaufsliste(idAusgeber, idGemeinde);
  getEinkaufslistePrimary(function(fkEinkaufsliste){for(let i = 0; i < produkte.length; i++){addProdukt(fkEinkaufsliste, produkte[i].bezeichnung, produkte[i].marke, produkte[i].menge, produkte[i].kilogramm, produkte[i].liter, produkte[i].preis);}})
}


    //--------------------------------------------------------

    function alterBearbeiter(){

    }











        //--------------------------------------------------------

function getEinkaufslistePrimary(callback){
  let ergebnis = null;
    connection.query("SELECT max(idEinkaufsliste) FROM einkaufsliste;", function (err, result) {
      if (err){console.log("SELECT Statement fehlgeschlagen.");return callback(ergebnis);}

      ergebnis = (Object.values(result[0])[0]);
      console.log("Max ID von Einkaufsliste ist: " + ergebnis);
      return callback(ergebnis);
      });
}

  function addBeitritt(idPerson, idGemeinde){
    let datum = new Date();

    //Prüfe ob Person bereits beigetreten ist. Wenn nein kann sie beitreten
    connection.query("SELECT * FROM beigetreten WHERE fkPerson = ? AND fkGemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
      if (err){console.log("Person konnte einer Gemeinde nicht beitreten. Prüfe Query.");return false;}
      if(result.length > 0){
        console.log("Person exisiert bereits in der Gemeinde.");
        return false;
      } else {
        connection.query("INSERT INTO beigetreten VALUES (?, ?, ?);", [idPerson, idGemeinde, datum], function (err, result) {
          if (err){console.log("Person konnte einer Gemeinde nicht beitreten. Prüfe Query.");return false;}
          console.log("Person ist einer Gemeinde beigetreten.");
          return true;
          });}
  });
}

  function addWohnsitz(ortsname, postleitzahl, straße, hausnummer){
    connection.query("INSERT INTO wohnsitz VALUES (default, ?, ?, ?, ?);", [ortsname, postleitzahl, straße, hausnummer], function (err, result) {
      if (err){console.log("Wohnsitz konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
      console.log("Wohnsitz wurde hinzugefügt");
      return true;
      });
  }


   function getWohnsitzPrimary(callback){
    let ergebnis = null;
    connection.query("SELECT max(idWohnsitz) FROM wohnsitz;", function (err, result) {
      if (err){console.log("SELECT Statement fehlgeschlagen.");return callback(ergebnis);}

      ergebnis = (Object.values(result[0])[0]);
      console.log("Max ID von Wohnsitz ist: " + ergebnis);
      return callback(ergebnis);
      });
  }


  function addGemeinde(fkWohnsitz, bezeichnung){
    if(fkWohnsitz === null){
      console.log("Fremdschlüssel ist unbekannt ${fkWohnsitz} Geminde wurde nicht hinzugefügt.");
      return false;
    }
    connection.query("INSERT INTO gemeinde VALUES (default, ?, ?, 1, 0);", [fkWohnsitz, bezeichnung], function (err, result) {
    if (err){console.log("Gemeinde konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
    console.log("Gemeinde wurde hinzugefügt");
    return true;
    });
  }

  function addPerson(fkWohnsitz, nutzername, passwort, vorname, nachname, telefon){
    connection.query("INSERT INTO person VALUES (default, ?, ?, ?, ?, ?, ?, 0);", [fkWohnsitz, nutzername, passwort, vorname, nachname, telefon], function (err, result) {
      if (err){console.log("Person konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
      console.log("Person wurde hinzugefügt");
      return true;
      });
  }

function addEinkaufsliste(idAusgeber, idGemeinde){
  let datum = new Date();
  let bearbeiter = null;

  connection.query("INSERT INTO einkaufsliste VALUES (default, ?, ?, ?, ?, 0, 0);", [idGemeinde, idAusgeber, bearbeiter, datum], function (err, result) {
    if (err){console.log("Einkaufsliste konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
    console.log("Einkaufsliste wurde hinzugefügt");
    return true;
    });
}

function addProdukt(idListe, bezeichnung, marke, menge, kilogramm, liter, preis){
  connection.query("INSERT INTO produkt VALUES (default, ?, ?, ?, ?, ?, ?, ?);", [idListe, bezeichnung, marke, menge, kilogramm, liter, preis], function (err, result) {
    if (err){console.log("Produkt konnte nicht hinzugefügt werden. Prüfe Query.");console.log(err);return false;}
    console.log("Produkt wurde hinzugefügt");
    return true;
    });

}


exports.addBeitritt = addBeitritt;
exports.gemindeAnlegen = gemindeAnlegen;
exports.einkaufslisteAnlegen = einkaufslisteAnlegen;
exports.addWohnsitz = addWohnsitz;
exports.personAnlegen = personAnlegen;
exports.addEinkaufsliste = addEinkaufsliste;
exports.addProdukt = addProdukt;


//Gemeinde erstellen
//Gemeinde editieren
//Gemeinde beitreten
//Gemeinde verlassen
//Gemeinde löschen
//Gemeinden ansehen

//Nutzer erstellen
//Nutzer löschen
//Nutzer editieren
//Alle Nutzer einer Gemeinde ansehen

//Einkaufsliste erstellen
//Einkaufslisten einer Gemeinde ansehen
//Einkaufliste löschen
//Einkaufsliste editieren
//Einkaufsliste aufnehmen
//Einkaufsliste abschließen
//Einkaufslisten einer Person ansehen

//Wohnsitz anlegen (durch Person oder Gemeinde)
//Wohnsitz ändern

    /*Im Frontend abfangen dass Eingabe nicht leer sein darf und keine Zahl im String
    Und wenn man zB Hausnummer auslassen will, soll ein NULL rein und die Daten nicht verrutschen
    Frage ist, was kommt von leeren Eingabe vom Frontend rein? Undefined?

    if(typeof bezeichnung !== "string"){
      console.log("Gemeinde konnte nicht hinzugefügt werden. Prüfe Parameter.");
      return false;
    }*/