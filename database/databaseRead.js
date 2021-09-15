const connection = require("./connection.js").connection;

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
        connection.query("SELECT g.id_gemeinde, g.bezeichnung, g.mitglieder, w.ortsname, w.postleitzahl, w.strasse, w.hausnummer FROM gemeinde g, wohnsitz w WHERE g.fk_wohnsitz = w.id_wohnsitz;", function (err, result) {
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



   function getEinkaufslistenSelf(idPerson){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT DISTINCT p.bezeichnung, b.fk_ausgeber, p.fk_einkaufsliste, p.bezeichnung,  p.kilogramm, p.liter, p.marke, p.menge FROM produkt p, besitzt b WHERE  b.fk_ausgeber = ? AND p.fk_einkaufsliste = b.fk_einkaufsliste;", [idPerson], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine aufgegebenen Einkaufslisten gefunden.");
            return resolve("");
          }

          let map = verarbeiteEinkaufslisten(result);

          return resolve(map);
        });
    });
  }

  function getEinkaufslistenBearbeitung(idPerson){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT DISTINCT p.bezeichnung, b.fk_ausgeber, p.fk_einkaufsliste, p.bezeichnung,  p.kilogramm, p.liter, p.marke, p.menge FROM gemeinde g, produkt p, besitzt b WHERE p.fk_einkaufsliste IN (SELECT id_einkaufsliste FROM einkaufsliste WHERE fk_bearbeiter = ?) AND b.fk_einkaufsliste IN (SELECT id_einkaufsliste FROM einkaufsliste WHERE fk_bearbeiter = ?);", [idPerson, idPerson], function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine aufgegebenen Einkaufslisten gefunden.");
            return resolve("");
          }

          let map = verarbeiteEinkaufslisten(result);

          return resolve(map);
        });
    });
  }

  function getPersonen(){
    
    return new Promise((resolve, reject) => {
        connection.query("SELECT heldenpunkte, nachname, vorname, ortsname FROM person, wohnsitz WHERE fk_wohnsitz = id_wohnsitz ORDER BY heldenpunkte DESC;", function (err, result) {
          if (err){return resolve("");}

          if(result == ""){
            console.log("Keine Personen mit Punkten gefunden.");
            return resolve("");
          }

          return resolve(result);
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
  module.exports.getPersonen = getPersonen;
  module.exports.getPassword = getPassword;
  module.exports.getGemeinden = getGemeinden;
  module.exports.getEinkaufslisten = getEinkaufslisten;
  module.exports.getEinkaufslistenSelf = getEinkaufslistenSelf;
  module.exports.getEinkaufslistenBearbeitung = getEinkaufslistenBearbeitung;








  //Ungenutzt
 /*function checkBearbeitung(input){

  let idEinkaufslisten = Array.from(input.keys());
  let ergebnis = new Map();
  let map = new Map();

  connection.query("SELECT id_einkaufsliste, bearbeitung FROM einkaufsliste", function (err, result) {
  
  //Alle Einkaufslisten in eine Map
  for(let i = 0; i < result.length; i++){
  map.set(Object.values(result[i])[0], Object.values(result[i])[1]);
  }  

  //Setzt relevante Einkaufsliste mit Bearbeitungstatus in eine Map
  for(let j = 0; j < idEinkaufslisten.length; j++){
    ergebnis.set(idEinkaufslisten[j], map.get(idEinkaufslisten[j]));
  }

  for (let [key, value] of input) {
    value[0].status = ergebnis.get(key);
  }
  
  
  return input;

 });
}*/
