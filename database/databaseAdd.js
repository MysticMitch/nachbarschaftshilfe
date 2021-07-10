//Gemeinde einfügen
//Nutzer einfügen
//Wohnsitz einfügen
//Einkaufsliste einfügen
//Gemeinde beitreten

let connection = require("./connection.js");
connection = connection.connection; //Modul.Methode

/*Frontend leere Eingaben abfangen:
Im Frontend versuchen abzufangen
Backend Methode: Nimmt Para, falls undefined oder "" wird zu null
Weil wenn nur 2 Para reinkommen und 3 erwartet, verrutscht es*/
  
  function getEinkaufslistePrimary(callback){
    let ergebnis = null;
      connection.query("SELECT max(idEinkaufsliste) FROM einkaufsliste;", function (err, result) {
        //Schlägt eig nie fehl, falls aber, dann wird nur Liste ohne Produkte angelegt
        //callback(ergebnis) wenn null ist nicht gut, wie in anderen Methoden, zumindest sieht man in der DB die Fehler
        if (err){console.log("Fehler beim Auslesen von Primärschlüssel von Einkaufsliste aufgetreten.");return callback(ergebnis);}
  
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Einkaufsliste ist: " + ergebnis);
        return callback(ergebnis);
        });
  }
  
    function addBeitritt(idPerson, idGemeinde){
      let datum = new Date();
  
      //Prüfe ob Person bereits beigetreten ist. Wenn nein kann sie beitreten
      connection.query("SELECT * FROM beigetreten WHERE fkPerson = ? AND fkGemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
        if (err){console.log("Fehler beim Vergleich aufgetreten, ob Person bereits in der Gemeinde ist.");return false;}
        if(result.length > 0){
          console.log("Person exisiert bereits in der Gemeinde. Konnte nicht beitreten.");
          return false;
        } else {
          connection.query("INSERT INTO beigetreten VALUES (?, ?, ?);", [idPerson, idGemeinde, datum], function (err, result) {
            if (err){console.log("Fehler beim Einfügen einer Person zu einer Gemeinde aufgetreten.");return false;}
            console.log("Person ist einer Gemeinde beigetreten.");
            return true;
            });}
    });
  }
  
    function addWohnsitz(ortsname, postleitzahl, straße, hausnummer){

      connection.query("INSERT INTO wohnsitz VALUES (default, ?, ?, ?, ?);", [ortsname, makeNull(postleitzahl), makeNull(straße), makeNull(hausnummer)], function (err, result) {
        if (err){console.log("Fehler beim Einfügen eines Wohnsitzes aufgetreten.");return false;}
        console.log("Wohnsitz wurde hinzugefügt.");
        return true;
        });
    }
  
  
     function getWohnsitzPrimary(callback){
      let ergebnis = null;
      connection.query("SELECT max(idWohnsitz) FROM wohnsitz;", function (err, result) {
        if (err){console.log("Fehler beim Auslesen von Primärschlüssel von Wohnsitz aufgetreten.");return callback(ergebnis);}
  
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Wohnsitz ist: " + ergebnis);
        return callback(ergebnis);
        });
    }
  

    function addGemeinde(fkWohnsitz, bezeichnung){

      connection.query("INSERT INTO gemeinde VALUES (default, ?, ?, 1, 0);", [fkWohnsitz, bezeichnung], function (err, result) {
      if (err){console.log("Fehler beim Einfügen der Gemeinde aufgetreten.");return false;}
      console.log("Gemeinde wurde hinzugefügt.");
      return true;
      });
    }
  
    function addPerson(fkWohnsitz, nutzername, passwort, vorname, nachname, telefon){
      
    connection.query("INSERT INTO person VALUES (default, ?, ?, ?, ?, ?, ?, 0);", [fkWohnsitz, nutzername, passwort, vorname, nachname, makeNull(telefon)], function (err, result) {
        if (err){console.log("Fehler beim Einfügen einer Person aufgetreten.");return false;}
        console.log("Person wurde hinzugefügt.");
        return true;
    });
  }

  function existNutzername(nutzername, callback){
    connection.query("SELECT * FROM person WHERE nutzername = ?;", [nutzername], function (err, result) {
      if (err){console.log("Fehler beim Vergleich aufgetreten, ob gleicher Nutzername bereits existiert.");return false;}
      if(result.length > 0){
        console.log("Nutzername existiert bereits. Person wurde nicht angelegt.");
        return callback(false);
      }
      return callback(true);
    });
  }

  function existGemeinde(bezeichnung, callback){
    connection.query("SELECT * FROM gemeinde WHERE bezeichnung = ?;", [bezeichnung], function (err, result) {
      if (err){console.log("Fehler beim Vergleich aufgetreten, ob Gemeinde bereits existiert.");return false;}
      if(result.length > 0){
        console.log("Gemeinde existiert bereits. Gemeinde wurde nicht angelegt.");
        return callback(false);
      }
      return callback(true);
    });
  }
  
  function addEinkaufsliste(idAusgeber, idGemeinde){
    let datum = new Date();
    let bearbeiter = null;
  
    connection.query("INSERT INTO einkaufsliste VALUES (default, ?, ?, ?, ?, 0, 0);", [idGemeinde, idAusgeber, bearbeiter, datum], function (err, result) {
      if (err){console.log("Fehler beim Einfügen einer Einkaufsliste aufgetreten.");return false;}
      console.log("Einkaufsliste wurde hinzugefügt.");
      return true;
      });
  }
  
function addProdukt(idListe, bezeichnung, marke, menge, kilogramm, liter, preis){
    connection.query("INSERT INTO produkt VALUES (default, ?, ?, ?, ?, ?, ?, ?);", [idListe, bezeichnung, marke, menge, kilogramm, liter, preis], function (err, result) {
      if (err){console.log("Fehler beim Einfügen von Produkten aufgetreten.");console.log(err);return false;}
      console.log("Produkt wurde hinzugefügt");
      return true;
      });
  }

//Gemeinde erstellen (+Wohnsitz)
//Nutzer erstellen (+Wohnsitz)
//Einkaufsliste erstellen (+Produkte)

//Wohnsitz anlegen, dessen Primärschlüssel holen, Gemeinde anlegen mit fkWohnsitz
function gemeindeAnlegen(bezeichnung, ortsname, postleitzahl, straße, hausnummer){
  existGemeinde(bezeichnung, function(ergebnis){if(ergebnis === false){return;}addWohnsitz(ortsname, postleitzahl, straße, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Gemeinde geholt: " + fkWohnsitz);addGemeinde(fkWohnsitz, bezeichnung);});
});
}

//Produkte ist ein Array das alle Produkte enthält die mit der Einkaufsliste angelegt werden
function einkaufslisteAnlegen(idAusgeber, idGemeinde, produkte){
  addEinkaufsliste(idAusgeber, idGemeinde);
  getEinkaufslistePrimary(function(fkEinkaufsliste){for(let i = 0; i < produkte.length; i++){addProdukt(fkEinkaufsliste, produkte[i].bezeichnung, produkte[i].marke, produkte[i].menge, produkte[i].kilogramm, produkte[i].liter, produkte[i].preis);}})
}

//Achtung, Callback Funktion geht weiter als erste Zeile
function personAnlegen(nutzername, passwort, vorname, nachname, telefon, ortsname, postleitzahl, straße, hausnummer){
  existNutzername(nutzername, function(ergebnis){if(ergebnis === false){return;};addWohnsitz(ortsname, postleitzahl, straße, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Person geholt: " + fkWohnsitz);addPerson(fkWohnsitz, nutzername, passwort, vorname, nachname, telefon);});
  });
}

//Leere Eingabe gibte ein "" oder undefined
function makeNull(input){

  if(input === "" || input === undefined){
    input = null;
  }
  return input;
}

module.exports.gemeindeAnlegen = gemeindeAnlegen;
module.exports.personAnlegen = personAnlegen;
module.exports.einkaufslisteAnlegen = einkaufslisteAnlegen;
module.exports.addBeitritt = addBeitritt;



  
  