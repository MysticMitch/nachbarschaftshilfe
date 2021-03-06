const connection = require("./connection.js").connection;

function updateBearbeiter(idEinkaufsliste, idBearbeiter){
    connection.query("UPDATE einkaufsliste SET fk_bearbeiter = ?, bearbeitung = 1 WHERE id_einkaufsliste = ?;", [idBearbeiter, idEinkaufsliste], function (err, result) {
        if (err){console.log("Fehler beim Ändern des Bearbeiters einer Einkaufsliste aufgetreten.");return false;}
        console.log("Bearbeiter wurde angepasst.");
        return true;
    });
}

function updateHeldenpunkte(idPerson){
    connection.query("UPDATE person SET heldenpunkte = heldenpunkte + 1 WHERE id_person = ?;", [idPerson], function (err, result) {
        if (err){console.log("Fehler beim Inkrementieren der Heldenpunkte aufgetreten.");return false;}
        console.log("Heldenpunkte erhöht.");
        return true;
    });
}

function updateBearbeiterRemove(idEinkaufsliste){
    connection.query("UPDATE einkaufsliste SET fk_bearbeiter = ?, bearbeitung = 0 WHERE id_einkaufsliste = ?;", [null, idEinkaufsliste], function (err, result) {
        if (err){console.log("Fehler beim Ändern des Bearbeiters einer Einkaufsliste aufgetreten.");return false;}
        console.log("Bearbeiter wurde angepasst.");
        return true;
    });
}

//Unused
function finishEinkaufsliste(idEinkaufsliste){
    connection.query("UPDATE einkaufsliste SET fk_bearbeiter = ?, bearbeitung = 0, abgeschlossen = 1 WHERE id_einkaufsliste = ?;", [null, idEinkaufsliste], function (err, result) {
        if (err){console.log("Fehler beim Abschluss einer Einkaufsliste aufgetreten.");return false;}
        console.log("Einkaufsliste wurde abgeschlossen..");
        return true;
    });
}

function updatePerson(idPerson, vorname, nachname, ortsname, plz, strasse, hausnr, telefon){

    connection.query("SELECT vorname, nachname, ortsname, postleitzahl, strasse, hausnummer, telefonnummer, fk_wohnsitz FROM person, wohnsitz WHERE id_wohnsitz = fk_wohnsitz AND id_person = ?;", [idPerson], function (err, result) {
        if (err){console.log("Fehler beim Lesen von Personendaten aufgetreten.");return false;}
        if(vorname){result[0].vorname = vorname;}
        if(nachname){result[0].nachname = nachname;}
        if(ortsname){result[0].ortsname = ortsname;}
        if(plz){result[0].postleitzahl = plz;}
        if(strasse){result[0].strasse = strasse;}
        if(hausnr){result[0].hausnummer = hausnr;}
        if(telefon){result[0].telefonnummer = telefon;}

        connection.query("UPDATE person SET vorname = ?, nachname = ?, telefonnummer = ? WHERE id_person = ?;", [result[0].vorname, result[0].nachname, result[0].telefonnummer, idPerson], function (err, result) {
            if (err){console.log("Fehler beim Ändern der Personendaten (Person) aufgetreten.");return false;}
        });
        connection.query("UPDATE wohnsitz SET ortsname = ?, postleitzahl = ?, strasse = ?, hausnummer = ? WHERE id_wohnsitz = ?;", [result[0].ortsname, result[0].postleitzahl, result[0].strasse, result[0].hausnummer, result[0].fk_wohnsitz], function (err, result) {
            if (err){console.log("Fehler beim Ändern der Personendaten (Wohnsitz) aufgetreten.");return false;}
            console.log("Person und Wohnort wurden angepasst.");
        });
    
    });
}    

module.exports.updatePerson = updatePerson;
module.exports.updateBearbeiter = updateBearbeiter;
module.exports.updateHeldenpunkte = updateHeldenpunkte;
module.exports.updateBearbeiterRemove = updateBearbeiterRemove;
module.exports.finishEinkaufsliste = finishEinkaufsliste;
