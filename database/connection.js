const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Dragonslayer385§IDEAL",
    database: "nachbarschaft"
  });

  //Falls Datenbank nicht erreichbar ist
  connection.on("error", function(err) {
    console.log("Verbindung zur Datenbank fehlgeschlagen.");
  });