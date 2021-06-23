const mysql = require("mysql2");
let cred = require("./credentials.js");
cred = cred.daten; //Modul.Objekt

const  connection = mysql.createConnection({
    host: cred.host,
    user: cred.user,
    password: cred.password,
    database: cred.database
  });

  //Falls Datenbank nicht erreichbar ist
  connection.on("error", function(err) {
    console.log("Verbindung zur Datenbank fehlgeschlagen.");
  });

  module.exports.connection = connection;