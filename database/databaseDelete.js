const connection = require("./connection.js").connection;


function deleteBeitritt(idPerson, idGemeinde, callback){

    //Prüfe ob Person bereits beigetreten ist
    connection.query("SELECT * FROM beigetreten WHERE fk_person = ? AND fk_gemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
      if (err){console.log("Fehler beim Vergleich aufgetreten, ob Person bereits in der Gemeinde ist.");return callback(false);}
      if(result.length <= 0){
        console.log("Person ist gar nicht in der Gemeinde. Nichts wurde gelöscht.");
        return callback(false);
      } else {
        connection.query("DELETE FROM beigetreten WHERE fk_person = ? AND fk_gemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
          if (err){console.log("Fehler beim Löschen einer Person aus einer Gemeinde aufgetreten.");return callback(false);}
          console.log("Person wurde aus Gemeinschaft entfernt.");
          return callback(true);
          });}
  });
}

//Löscht eine Relation zwischen Einkaufsliste & Gemeinde, bzw Daten aus besitzt Tabelle
function deleteBesitzt(idAusgeber, idGemeinde){
  connection.query("DELETE FROM besitzt WHERE fk_ausgeber = ? AND fk_gemeinde = ?;", [idAusgeber, idGemeinde], function (err, result) {
    if (err){console.log("Fehler beim Löschen von Einkaufslisten aus besitzt Tabelle.");return false;}
    });
    return true;
}


module.exports.deleteBeitritt = deleteBeitritt;
module.exports.deleteBesitzt = deleteBesitzt;