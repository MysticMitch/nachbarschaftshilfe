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
        connection.query("SELECT g.id_gemeinde, g.bezeichnung, g.mitglieder, g.heldenpunkte, w.ortsname, w.postleitzahl, w.strasse, w.hausnummer FROM gemeinde g, wohnsitz w;", function (err, result) {
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

  function getPerson(idPerson){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT nutzername, vorname, nachname, telefonnummer, heldenpunkte, ortsname, postleitzahl, strasse, hausnummer FROM person, wohnsitz WHERE person.id_person = ? AND wohnsitz.id_wohnsitz = person.fk_wohnsitz;", [idPerson], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Nutzer nicht in der Datenbank vorhanden.");
            return resolve("");
          }
          return resolve(Object.values(result[0]));
        });
    });
  }


  function getEinkaufslisten(idPerson){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT DISTINCT p.bezeichnung, b.fk_ausgeber, p.fk_einkaufsliste, p.bezeichnung,  p.kilogramm, p.liter, p.marke, p.menge FROM gemeinde g, produkt p, besitzt b WHERE  b.fk_ausgeber != ? AND p.fk_einkaufsliste IN (SELECT DISTINCT id_einkaufsliste FROM besitzt, einkaufsliste WHERE einkaufsliste.fk_ausgeber != ?  AND einkaufsliste.bearbeitung < 1 AND fk_gemeinde IN (SELECT fk_gemeinde FROM beigetreten WHERE fk_person = ?));", [idPerson, idPerson, idPerson], function (err, result) {
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

    for(let i = 0; i < input.length; i++){
      let person = await getName(input[i].fk_ausgeber);

      person = "" + person.vorname + " " + person.nachname;

      let singleValue = {name:person, bezeichnung:input[i].bezeichnung, kilogramm:input[i].kilogramm, liter:input[i].liter, marke:input[i].marke, menge:input[i].menge};
      
      let values = [];
      let key = input[i].fk_einkaufsliste;
      
      if(zuordnung.has(input[i].fk_einkaufsliste)){
        zuordnung.get(input[i].fk_einkaufsliste).push(singleValue);
      } else {
        values = [];
        values.push(singleValue);
        zuordnung.set(key, values);
      }
    }

    return zuordnung;

  }


  module.exports.getID = getID;
  module.exports.getPerson = getPerson;
  module.exports.getPassword = getPassword;
  module.exports.getGemeinden = getGemeinden;
  module.exports.getEinkaufslisten = getEinkaufslisten;