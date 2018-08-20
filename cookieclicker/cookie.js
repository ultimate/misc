var Cheat = {
clickInterval: null,
click: function() { document.getElementById("bigCookie").click(); },
clickStop: function() {clearInterval(Cheat.clickInterval);},
clickStart: function(interval) { Cheat.clickStop(); if(interval == undefined) interval = 10; Cheat.clickInterval= setInterval("Cheat.click()", interval); },

goldInterval: null,
gold: function() {Game.shimmerTypes.golden.time = Game.shimmerTypes.golden.maxTime; Game.goldenCookie.click();},
goldStop: function() {clearInterval(Cheat.goldInterval);},
goldStart: function() { Cheat.goldStop(); Cheat.goldInterval= setInterval("Cheat.gold()", 500); },

seasonInterval: null,
season: function() {Game.seasonPopup.spawn(); Game.seasonPopup.click();},
seasonStop: function() {clearInterval(Cheat.seasonInterval);},
seasonStart: function() { Cheat.seasonStop(); Cheat.seasonInterval= setInterval("Cheat.season()", 500); },

buy: function(id, amount) {for(i = 0; i< amount; i++){Game.ObjectsById[id].buy();}},

research: function() {Game.researchT = 0;}
}



// hand of Fate:
Game.Objects['Wizard tower'].minigame.spells["hand of fate"].win()