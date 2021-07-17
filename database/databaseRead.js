//Gemeinden ansehen
//Alle Nutzer einer Gemeinde ansehen
//Einkaufslisten einer Gemeinde ansehen
//Einkaufslisten einer Person ansehen

let connection = require("./connection.js");
connection = connection.connection; //Modul.Methode

  function getPassword(nutzername){
    return new Promise((resolve, reject) => {
        connection.query("SELECT passwort FROM person WHERE nutzername= ?;", [nutzername], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Nutzer nicht in der Datenbank vorhanden.");
            return resolve("");
          }
          return resolve(Object.values(result[0])[0]);
        });
    });
  }

  function getGemeinden(){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM gemeinde;", function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine Gemeinden vorhanden.");
            return resolve("");
          }
          //return resolve(Object.values(result));
          return resolve(result);
        });
    });
  }

  function getGemeinden(){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * from gemeinde, wohnsitz WHERE gemeinde.fk_wohnsitz = wohnsitz.id_wohnsitz;", function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine Gemeinden vorhanden.");
            return resolve("");
          }
          //return resolve(Object.values(result));
          return resolve(result);
        });
    });
  }



  function getID(nutzername){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT id_person FROM person WHERE nutzername = ?;", [nutzername], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Nutzer nicht in der Datenbank vorhanden.");
            return resolve("");
          }
          return resolve(Object.values(result[0])[0]);
        });
    });
  }

  function getEinkaufslisten(idPerson){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * from gemeinde, wohnsitz WHERE gemeinde.fk_wohnsitz = wohnsitz.id_wohnsitz;", function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine Gemeinden vorhanden.");
            return resolve("");
          }
          //return resolve(Object.values(result));
          return resolve(result);
        });
    });
  }



  module.exports.getID = getID;
  module.exports.getPassword = getPassword;
  module.exports.getGemeinden = getGemeinden;