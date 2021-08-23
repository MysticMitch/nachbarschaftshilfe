const mysql = require("mysql2");
const cred = require("./credentials.js");
const {exec} = require("child_process");
const daten = cred.daten; //Modul.Objekt

const  connection = mysql.createConnection({
    host: daten.host,
    user: daten.user,
    password: daten.password,
    database: daten.database
  });

  connection.on("error", function(err) {
    console.log("Datenbankverbindung fehlgeschlagen - " + new Date);
    exec("systemctl start 'mysql'");
    exec("systemctl restart 'mysql'");
    exec("pm2 restart 'server.js'");
  });

  module.exports.connection = connection;