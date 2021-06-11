const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Dragonslayer385§IDEAL",
    database: "nachbarschaft"
  });

  //Falls Datenbank ausgeschaltet ist
  connection.on("error", function(err) {
    console.log("Verbindung zur Datenbank fehlgeschlagen.");
  })

  function addGemeinde(bezeichnung, postleitzahl){
    //Im Frontend abfangen dass Eingabe nicht leer sein darf und keine Zahl im String
    if(typeof bezeichnung !== "string" || typeof postleitzahl !== "number"){
      console.log("Gemeinde konnte nicht hinzugefügt werden. Prüfe Parameter.");
      return false;
    }
    connection.query("INSERT INTO gemeinde VALUES (default, ?, ?, 1, 0);", [bezeichnung, postleitzahl], function (err, result) {
    if (err){console.log("Gemeinde konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
    console.log("Gemeinde wurde hinzugefügt");
    return true;
    });
  }


exports.addGemeinde = addGemeinde;

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