//Gemeinden ansehen
//Alle Nutzer einer Gemeinde ansehen
//Einkaufslisten einer Gemeinde ansehen
//Einkaufslisten einer Person ansehen

let connection = require("./connection.js");
connection = connection.connection; //Modul.Methode

  function getPassword(nutzername){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT passwort FROM person WHERE nutzername= ?;", [nutzername], function (err, result) {
          if (err){return null;}

          if(result == ""){
            console.log("Kein DB Treffer.");
            return resolve("");
          }
          return resolve(Object.values(result[0])[0]);
        });
    });
  }




  module.exports.getPassword = getPassword;