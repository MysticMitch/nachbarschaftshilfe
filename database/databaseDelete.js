//Gemeinde verlassen
//Gemeinde löschen (+Wohnsitz)
//Nutzer löschen (+Wohnsitz)
//Einkaufliste löschen (+Produkte?)
//Einkaufsliste abschließen

let connection = require("./connection.js");
connection = connection.connection; //Modul.Methode


function deleteBeitritt(idPerson, idGemeinde){

    //Prüfe ob Person bereits beigetreten ist
    connection.query("SELECT * FROM beigetreten WHERE fkPerson = ? AND fkGemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
      if (err){console.log("Fehler beim Vergleich aufgetreten, ob Person bereits in der Gemeinde ist.");return false;}
      if(result.length <= 0){
        console.log("Person ist gar nicht in der Gemeinde. Nichts wurde gelöscht.");
        return false;
      } else {
        connection.query("DELETE FROM beigetreten WHERE fkPerson = ? AND fkGemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
          if (err){console.log("Fehler beim Löschen einer Person aus einer Gemeinde aufgetreten.");return false;}
          console.log("Person wurde aus Gemeinschaft entfernt.");
          return true;
          });}
  });
}



module.exports.deleteBeitritt = deleteBeitritt;