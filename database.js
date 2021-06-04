const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Dragonslayer385§IDEAL",
    database: "nachbarschaft"
  });


  function addGemeinde(bezeichnung, postleitzahl){
	
    if(bezeichnung === null || postleitzahl === null || bezeichnung === "" || postleitzahl === ""){
      console.log("Leere Eingabe, Gemeinde konnte nicht hinzugefügt werden.");
      return;
    }

    let statement = `INSERT INTO gemeinde VALUES (default, '${bezeichnung}', ${postleitzahl}, 1, 0);`;
    connection.query(statement, function (err, result) {
    if (err){
      console.log("Gemeinde konnte nicht angelegt werden.");
      throw(err);
    }
    console.log("Gemeinde wurde hinzugefügt.");
    });
  };

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