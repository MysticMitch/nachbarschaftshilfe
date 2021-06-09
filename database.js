const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Dragonslayer385§IDEAL",
    database: "nachbarschaft"
  });


  function addGemeinde(bezeichnung, postleitzahl){
	
    //Im Frontend abfangen dass Eingabe nicht leer sein darf und keine Zahl im String
    if(typeof bezeichnung !== 'string' || typeof postleitzahl !== 'number'){
      return false;
    }

    connection.query("INSERT INTO gemeinde VALUES (default, ?, ?, 1, 0);", [bezeichnung, postleitzahl], function (err, result) {
    if (err){throw(err);}
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