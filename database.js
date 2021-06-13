const mysql = require('mysql2');

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

  function addWohnsitz(bezeichnung, postleitzahl, straße, hausnummer){
    connection.query("INSERT INTO wohnsitz VALUES (default, ?, ?, ?, ?);", [bezeichnung, postleitzahl, straße, hausnummer], function (err, result) {
      if (err){console.log("Wohnsitz konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
      console.log("Wohnsitz wurde hinzugefügt");
      return true;
      });
  }


  function holPrim(){
    let i = 0;
    connection.query("SELECT * FROM wohnsitz;", function (err, result) {
      if (err){console.log("FEHLER.");return;}
      /*i = result;
      console.log(result[0]);
      console.log(i);
      console.log(JSON.stringify(result));
      console.log("---");
      console.log(Object.values(JSON.parse(JSON.stringify(result))));
      console.log(result[0].TextRow.
    
        let i = 0;
        i = Object.values(JSON.parse(JSON.stringify(result))[0]);
        console.log(i);
        //Prints: [3]
        i = i[0];
        console.log(i);    */

        /*
        console.log(result);

        console.log(JSON.stringify(result)[0]);

        console.log(JSON.parse(JSON.stringify(result))[0]);

        console.log(Object.values(JSON.parse(JSON.stringify(result))[0]));

        console.log(Object.values(JSON.parse(JSON.stringify(result))[0])[0]);

        */

        console.log(result);
        console.log("-------------------");
        console.log((result[0]).idWohnsitz);

        console.log(Object.values(result[0]));

        //console.log(Object.values(result[0])[0]);

        //console.log((result[0])[0]); 

        //console.log(Object.values(result));

      });

 
  }

  function addGemeinde(bezeichnung, wohnort, postleitzahl, straße, hausnummer){




    connection.query("INSERT INTO gemeinde VALUES (default, default, ?, 1, 0);", [bezeichnung], function (err, result) {
    if (err){console.log("Gemeinde konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
    console.log("Gemeinde wurde hinzugefügt");
    return true;
    });
  }

  function addPerson(nutzername, passwort, vorname, nachname, telefon){
    connection.query("INSERT INTO person VALUES (default, default, ?, ?, ?, ?, ?, 0);", [nutzername, passwort, vorname, nachname, telefon], function (err, result) {
      if (err){console.log("Person konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
      console.log("Person wurde hinzugefügt");
      return true;
      });
  }

exports.holPrim = holPrim;
exports.addGemeinde = addGemeinde;
exports.addPerson = addPerson;

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