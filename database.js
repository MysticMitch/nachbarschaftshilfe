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
  getWohnsitzPrimary(function(ergebnis){console.log("FK geholt: " + ergebnis);addGemeinde(ergebnis, bezeichnung);});
}

    //--------------------------------------------------------

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
      console.log("Ergebnis: " + ergebnis);
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

exports.getWohnsitzPrimary = getWohnsitzPrimary;
exports.gemindeAnlegen = gemindeAnlegen;
exports.addPerson = addPerson;
exports.addWohnsitz = addWohnsitz;












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