const express = require("express");
//const path = require("path");
const logger = require("./logger");
const mysql = require('mysql2');
const PORT = process.env.PORT || 5000;
const app = express();

app.get("/", function(req,res){res.send("<h1>Hi</h1>");});
app.listen(PORT, function(){console.log("Server läuft auf Port "+PORT)});
app.use(logger);    