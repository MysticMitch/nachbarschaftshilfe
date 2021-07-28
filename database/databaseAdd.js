const connection = require("./connection.js").connection;

/*Frontend leere Eingaben abfangen:
Im Frontend versuchen abzufangen
Backend Methode: Nimmt Para, falls undefined oder "" wird zu null
Weil wenn nur 2 Para reinkommen und 3 erwartet, verrutscht es*/
  
  function getEinkaufslistePrimary(callback){
    let ergebnis = null;
      connection.query("SELECT max(id_einkaufsliste) FROM einkaufsliste;", function (err, result) {
        if (err){console.log("Fehler beim Auslesen von Primärschlüssel von Einkaufsliste aufgetreten.");return callback(ergebnis);}
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Einkaufsliste ist: " + ergebnis);
        return callback(ergebnis);
        });
  }
  
    function addBeitritt(idPerson, idGemeinde){
      let datum = new Date();
  
      //Prüfe ob Person bereits beigetreten ist. Wenn nein kann sie beitreten
      connection.query("SELECT * FROM beigetreten WHERE fk_person = ? AND fk_gemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
        if (err){console.log("Fehler beim Vergleich aufgetreten, ob Person bereits in der Gemeinde ist.");return false;}
        if(result.length > 0){
          console.log("Person exisiert bereits in der Gemeinde. Konnte nicht beitreten.");
          return false;
        } else {
          connection.query("INSERT INTO beigetreten VALUES (?, ?, ?);", [idPerson, idGemeinde, datum], function (err, result) {
            if (err){console.log("Fehler beim Einfügen einer Person zu einer Gemeinde aufgetreten.");return false;}
            console.log("Person ist einer Gemeinde beigetreten.");
            });
          
            //Fülle Tabelle beitreten mit den Einkaufslisten der Person zugehörig zur beigetretenen Gemeinde
            getEinkaufslisten(idPerson, function(idEinkaufslisten){for(let i = 0; i < idEinkaufslisten.length; i++){addBesitzt(idGemeinde, idEinkaufslisten[i], idPerson)}});
            return true;
          }
    });
  }
  
    function addWohnsitz(ortsname, postleitzahl, strasse, hausnummer){
      connection.query("INSERT INTO wohnsitz VALUES (default, ?, ?, ?, ?);", [ortsname, makeNull(postleitzahl), makeNull(strasse), makeNull(hausnummer)], function (err, result) {
        if (err){console.log("Fehler beim Einfügen eines Wohnsitzes aufgetreten.");return false;}
        console.log("Wohnsitz wurde hinzugefügt.");
        return true;
        });
    }

    //Holt alle (ID) Gemeinden in der die Person ist
    function getGemeinden(idPerson, callback){
      connection.query("SELECT fk_gemeinde FROM beigetreten WHERE fk_person = ?;", [idPerson], function (err, result) {
        if (err){console.log("Fehler beim Auslesen der idGemeinden aufgetreten.");return false;}
        let ergebnis = [];
        for(let i = 0; i < result.length; i++){
          ergebnis.push((Object.values(result[i])[0]));
        }  
      return callback(ergebnis);
      });
    }

    //Holt alle (ID) Einkaufslisten die eine Person hat
    function getEinkaufslisten(idPerson, callback){
          connection.query("SELECT id_einkaufsliste FROM einkaufsliste WHERE fk_ausgeber = ?;", [idPerson], function (err, result) {
            if (err){console.log("Fehler beim Auslesen der Einkaufslisten aufgetreten.");return false;}
            let ergebnis = [];
            for(let i = 0; i < result.length; i++){
              ergebnis.push((Object.values(result[i])[0]));
            }  
          return callback(ergebnis);
          });
        }
  
    function addBesitzt(idGemeinde, idEinkaufsliste, idAusgeber){
      connection.query("INSERT INTO besitzt VALUES (?, ?, ?);", [idGemeinde, idEinkaufsliste, idAusgeber], function (err, result) {
        if (err){console.log("Fehler beim Füllen der besitzt Tabelle aufgetreten.");return false;}
        return true;
      });
    }
  
     function getWohnsitzPrimary(callback){
      let ergebnis = null;
      connection.query("SELECT max(id_wohnsitz) FROM wohnsitz;", function (err, result) {
        if (err){console.log("Fehler beim Auslesen von Primärschlüssel von Wohnsitz aufgetreten.");return callback(ergebnis);}
  
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Wohnsitz ist: " + ergebnis);
        return callback(ergebnis);
        });
    }

    function getGemeindePrimary(callback){
      let ergebnis = null;
      connection.query("SELECT max(id_gemeinde) FROM gemeinde;", function (err, result) {
        if (err){console.log("Fehler beim Auslesen von Primärschlüssel von Gemeinde aufgetreten.");return callback(ergebnis);}
  
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Gemeinde ist: " + ergebnis);
        return callback(ergebnis);
        });
    }
  

    function addGemeinde(idWohnsitz, bezeichnung){
      connection.query("INSERT INTO gemeinde VALUES (default, ?, ?, 1, 0);", [idWohnsitz, bezeichnung], function (err, result) {
      if (err){console.log("Fehler beim Einfügen der Gemeinde aufgetreten.");return false;}
      console.log("Gemeinde wurde hinzugefügt.");
      return true;
      });
    }

    function addPerson(idWohnsitz, nutzername, passwort, vorname, nachname, telefon){
    connection.query("INSERT INTO person VALUES (default, ?, ?, ?, ?, ?, ?, 0);", [idWohnsitz, nutzername, passwort, vorname, nachname, makeNull(telefon)], function (err, result) {
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
  
  function addEinkaufsliste(idAusgeber){
    let datum = new Date();
    let bearbeiter = null;
  
    connection.query("INSERT INTO einkaufsliste VALUES (default, ?, ?, ?, 0, 0, 0);", [idAusgeber, bearbeiter, datum], function (err, result) {
      if (err){console.log("Fehler beim Einfügen einer Einkaufsliste aufgetreten.");return false;}
      console.log("Einkaufsliste wurde hinzugefügt.");
      return true;
      });
  }
  
function addProdukt(idEinkaufsliste, bezeichnung, marke, menge, kilogramm, liter){
    connection.query("INSERT INTO produkt VALUES (default, ?, ?, ?, ?, ?, ?);", [idEinkaufsliste, bezeichnung, makeNull(marke), makeNull(menge), makeNull(kilogramm), makeNull(liter)], function (err, result) {
      if (err){console.log("Fehler beim Einfügen von Produkten aufgetreten.");return false;}
      console.log("Produkt wurde hinzugefügt");
      return true;
      });
  }

//Wohnsitz anlegen, dessen Primärschlüssel holen, Gemeinde anlegen mit fkWohnsitz
function gemeindeAnlegen(idPerson, bezeichnung, ortsname, postleitzahl, strasse, hausnummer){
  existGemeinde(bezeichnung, function(ergebnis){
  if(ergebnis === false){return;}
  addWohnsitz(ortsname, postleitzahl, strasse, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Gemeinde geholt: " + fkWohnsitz);addGemeinde(fkWohnsitz, bezeichnung);
  getGemeindePrimary(function(idGemeinde){addBeitritt(idPerson, idGemeinde);
  });});});
}

//Produkte ist ein Array das alle Produkte enthält die mit der Einkaufsliste angelegt werden
//Achtung, Callback Funktion geht weiter als erste Zeile
function einkaufslisteAnlegen(idAusgeber, produkte){
  addEinkaufsliste(idAusgeber);
  getEinkaufslistePrimary(function(idEinkaufsliste){for(let i = 0; i < produkte.length; i++){addProdukt(idEinkaufsliste, produkte[i].bezeichnung, produkte[i].marke, produkte[i].menge, produkte[i].kilogramm, produkte[i].liter);}
  getGemeinden(idAusgeber, function(arrayGemeinden){for(let j = 0; j < arrayGemeinden.length; j++){addBesitzt(arrayGemeinden[j], idEinkaufsliste, idAusgeber);}});
  console.log("Einkaufsliste wurde angelegt.");
  });
  }

//Achtung, Callback Funktion geht weiter als erste Zeile
function personAnlegen(nutzername, passwort, vorname, nachname, telefon, ortsname, postleitzahl, strasse, hausnummer){
  existNutzername(nutzername, function(ergebnis){if(ergebnis === false){return;};addWohnsitz(ortsname, postleitzahl, strasse, hausnummer);
  getWohnsitzPrimary(function(idWohnsitz){console.log("FK für Person geholt: " + idWohnsitz);addPerson(idWohnsitz, nutzername, passwort, vorname, nachname, telefon);});
  });
}

//Leere Eingabe gibte ein "" oder undefined
function makeNull(input){
  if(input === "" || input === undefined){input = null;}
  return input;
}

module.exports.gemeindeAnlegen = gemeindeAnlegen;
module.exports.personAnlegen = personAnlegen;
module.exports.einkaufslisteAnlegen = einkaufslisteAnlegen;
module.exports.addBeitritt = addBeitritt;



  
  