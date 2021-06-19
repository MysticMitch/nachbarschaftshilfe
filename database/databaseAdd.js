//Gemeinde einfügen
//Nutzer einfügen
//Wohnsitz einfügen
//Einkaufsliste einfügen
//Gemeinde beitreten
//Einkaufsliste bearbeiten


//Frontend leere Eingaben abfangen:
//Im Frontend versuchen abzufangen
//Backend Methode: Nimmt Para, falls undefined oder "" wird zu null
//Weil wenn nur 2 Para reinkommen und 3 erwartet, verrutscht es
  
  function getEinkaufslistePrimary(callback){
    let ergebnis = null;
      connection.query("SELECT max(idEinkaufsliste) FROM einkaufsliste;", function (err, result) {
        if (err){console.log("SELECT Statement fehlgeschlagen.");return callback(ergebnis);}
  
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Einkaufsliste ist: " + ergebnis);
        return callback(ergebnis);
        });
  }
  
    function addBeitritt(idPerson, idGemeinde){
      let datum = new Date();
  
      //Prüfe ob Person bereits beigetreten ist. Wenn nein kann sie beitreten
      connection.query("SELECT * FROM beigetreten WHERE fkPerson = ? AND fkGemeinde = ?;", [idPerson, idGemeinde], function (err, result) {
        if (err){console.log("Person konnte einer Gemeinde nicht beitreten. Prüfe Query.");return false;}
        if(result.length > 0){
          console.log("Person exisiert bereits in der Gemeinde.");
          return false;
        } else {
          connection.query("INSERT INTO beigetreten VALUES (?, ?, ?);", [idPerson, idGemeinde, datum], function (err, result) {
            if (err){console.log("Person konnte einer Gemeinde nicht beitreten. Prüfe Query.");return false;}
            console.log("Person ist einer Gemeinde beigetreten.");
            return true;
            });}
    });
  }
  
    function addWohnsitz(ortsname, postleitzahl, straße, hausnummer){
      connection.query("INSERT INTO wohnsitz VALUES (default, ?, ?, ?, ?);", [ortsname, postleitzahl, straße, hausnummer], function (err, result) {
        if (err){console.log("Wohnsitz konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
        console.log("Wohnsitz wurde hinzugefügt");
        return true;
        });
    }
  
  
     function getWohnsitzPrimary(callback){
      let ergebnis = null;
      connection.query("SELECT max(idWohnsitz) FROM wohnsitz;", function (err, result) {
        if (err){console.log("SELECT Statement fehlgeschlagen.");return callback(ergebnis);}
  
        ergebnis = (Object.values(result[0])[0]);
        console.log("Max ID von Wohnsitz ist: " + ergebnis);
        return callback(ergebnis);
        });
    }
  
  
    function addGemeinde(fkWohnsitz, bezeichnung){
      if(fkWohnsitz === null){
        console.log("Fremdschlüssel ist unbekannt ${fkWohnsitz} Gemeinde wurde nicht hinzugefügt.");
        return false;
      }
      connection.query("INSERT INTO gemeinde VALUES (default, ?, ?, 1, 0);", [fkWohnsitz, bezeichnung], function (err, result) {
      if (err){console.log("Gemeinde konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
      console.log("Gemeinde wurde hinzugefügt");
      return true;
      });
    }
  
    function addPerson(fkWohnsitz, nutzername, passwort, vorname, nachname, telefon){
      connection.query("INSERT INTO person VALUES (default, ?, ?, ?, ?, ?, ?, 0);", [fkWohnsitz, nutzername, passwort, vorname, nachname, telefon], function (err, result) {
        if (err){console.log("Person konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
        console.log("Person wurde hinzugefügt");
        return true;
        });
    }
  
  function addEinkaufsliste(idAusgeber, idGemeinde){
    let datum = new Date();
    let bearbeiter = null;
  
    connection.query("INSERT INTO einkaufsliste VALUES (default, ?, ?, ?, ?, 0, 0);", [idGemeinde, idAusgeber, bearbeiter, datum], function (err, result) {
      if (err){console.log("Einkaufsliste konnte nicht hinzugefügt werden. Prüfe Query.");return false;}
      console.log("Einkaufsliste wurde hinzugefügt");
      return true;
      });
  }
  
  function addProdukt(idListe, bezeichnung, marke, menge, kilogramm, liter, preis){
    connection.query("INSERT INTO produkt VALUES (default, ?, ?, ?, ?, ?, ?, ?);", [idListe, bezeichnung, marke, menge, kilogramm, liter, preis], function (err, result) {
      if (err){console.log("Produkt konnte nicht hinzugefügt werden. Prüfe Query.");console.log(err);return false;}
      console.log("Produkt wurde hinzugefügt");
      return true;
      });
  }
  
  
  
  
  
  