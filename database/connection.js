const mysql = require("mysql2");
const cred = require("./credentials.js");
const daten = cred.daten; //Modul.Objekt

const  connection = mysql.createConnection({
    host: daten.host,
    user: daten.user,
    password: daten.password,
    database: daten.database
  });

  connection.on("error", function(err) {
    console.log("Verbindung zur Datenbank fehlgeschlagen.");
  });

  module.exports.connection = connection;