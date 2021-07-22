//Gemeinde editieren
//Nutzer editieren
//Einkaufsliste editieren
//Einkaufsliste bearbeiten
//Wohnsitz editieren

let connection = require("./connection.js");
connection = connection.connection; //Modul.Methode

function updateBearbeiter(idEinkaufsliste, idBearbeiter){
    connection.query("UPDATE einkaufsliste SET fk_bearbeiter = ?, bearbeitung = 1 WHERE id_einkaufsliste = ?;", [idBearbeiter, idEinkaufsliste], function (err, result) {
        if (err){console.log("Fehler beim Ändern des Bearbeiters einer Einkaufsliste aufgetreten.");return false;}
        console.log("Bearbeiter wurde angepasst.");
        return true;
    });
}

module.exports.updateBearbeiter = updateBearbeiter;