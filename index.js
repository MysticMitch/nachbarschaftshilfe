const express = require("express");
const logger = require("./logger");
const PORT = process.env.PORT || 5000;
const app = express();
const db = require("./database");

app.get("/", function(req,res){res.send("<h1>Hi</h1>");});
app.listen(PORT, () => console.log("Server läuft auf Port "+PORT));
app.use(logger);    

db.addGemeinde("", 123);