//Gemeinden ansehen
//Alle Nutzer einer Gemeinde ansehen
//Einkaufslisten einer Gemeinde ansehen
//Einkaufslisten einer Person ansehen

let connection = require("./connection.js");
connection = connection.connection; //Modul.Methode


/*function getPassword(nutzername, callback){
    
    connection.query("SELECT passwort FROM person WHERE nutzername = ?;", [nutzername], function (err, result) {
      if (err){console.log("Fehler beim Lesen der Datenbank aufgetreten.");return callback(null);}
      console.log("DB: " + (Object.values(result[0])[0]));
      let erg = (Object.values(result[0])[0]);
      return callback(erg);
    });
    return callback(null);
  }
  
  function getPersonByID(idPerson){
  }*/

  function getPassword(nutzername){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT passwort FROM person WHERE nutzername= ?;", [nutzername], function (err, result) {
          if (err){reject();}
          return resolve(Object.values(result[0])[0]);
        });
    });
  }



  module.exports.getPassword = getPassword;