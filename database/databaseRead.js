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


  function getName(idPerson){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT vorname, nachname FROM person WHERE id_person = ?;", [idPerson], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Nutzer nicht in der Datenbank vorhanden.");
            return resolve("");
          }

          return resolve({vorname:Object.values(result[0])[0], nachname:Object.values(result[0])[1]});
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
        connection.query("SELECT DISTINCT b.fk_ausgeber, p.fk_einkaufsliste, p.bezeichnung,  p.kilogramm, p.liter, p.marke, p.menge  FROM produkt p, besitzt b WHERE p.fk_einkaufsliste IN (SELECT DISTINCT fk_einkaufsliste FROM besitzt, einkaufsliste WHERE fk_gemeinde IN (SELECT fk_gemeinde FROM beigetreten WHERE fk_person = ?));", [idPerson], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine Einkaufslisten gefunden.");
            return resolve("");
          }

          let map = verarbeiteEinkaufslisten(result);

          return resolve(map);
        });
    });
  }

  async function verarbeiteEinkaufslisten(input){
    
    let zuordnung = new Map();
    let daten = [];

    console.log("Länge: " + input.length);

    for(let i = 0; i < input.length; i++){
      let person = await getName(input[i].fk_ausgeber);

      person = "" + person.vorname + " " + person.nachname;

      let singleValue = {name:person, bezeichnung:input[i].bezeichnung, kilogramm:input[i].kilogramm, liter:input[i].liter, marke:input[i].marke, menge:input[i].menge};
      
      let values = [];
      let key = input[i].fk_einkaufsliste;
      
      if(zuordnung.has(input[i].fk_einkaufsliste)){
        zuordnung.get(input[i].fk_einkaufsliste).push(singleValue);
      } else {
        console.log("NEU ANLEGEN");
        values = [];
        values.push(singleValue);
        zuordnung.set(key, values);
      }
    }

    return zuordnung;

  }

    /*function getGemeinden(){
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
  }*/



  module.exports.getID = getID;
  module.exports.getPassword = getPassword;
  module.exports.getGemeinden = getGemeinden;
  module.exports.getEinkaufslisten = getEinkaufslisten;