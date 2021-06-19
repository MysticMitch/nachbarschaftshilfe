//Gemeinde erstellen (+Wohnsitz)
//Nutzer erstellen (+Wohnsitz)
//Einkaufsliste erstellen (+Produkte)

//Wohnsitz anlegen, dessen Primärschlüssel holen, Gemeinde anlegen mit fkWohnsitz
function gemeindeAnlegen(bezeichnung, ortsname, postleitzahl, straße, hausnummer){
  addWohnsitz(ortsname, postleitzahl, straße, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Gemeinde geholt: " + fkWohnsitz);addGemeinde(fkWohnsitz, bezeichnung);});
}

function personAnlegen(nutzername, passwort, vorname, nachname, telefon, ortsname, postleitzahl, straße, hausnummer){
  addWohnsitz(ortsname, postleitzahl, straße, hausnummer);
  getWohnsitzPrimary(function(fkWohnsitz){console.log("FK für Person geholt: " + fkWohnsitz);addPerson(fkWohnsitz, nutzername, passwort, vorname, nachname, telefon);});
}

//ProduktArray ist ein Array das alle Produkte enthält die mit der Einkaufsliste angelegt werden
function einkaufslisteAnlegen(idAusgeber, idGemeinde, produkte){
  addEinkaufsliste(idAusgeber, idGemeinde);
  getEinkaufslistePrimary(function(fkEinkaufsliste){for(let i = 0; i < produkte.length; i++){addProdukt(fkEinkaufsliste, produkte[i].bezeichnung, produkte[i].marke, produkte[i].menge, produkte[i].kilogramm, produkte[i].liter, produkte[i].preis);}})
}