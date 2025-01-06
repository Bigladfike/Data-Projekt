let animeData = [];
let loaded = false;
let loadButton; // laver det bare sådan her for global-scope yezzir

function setup() {
  createCanvas(800, 600);
  background(30);

  // Opret knap
  loadButton = createButton('Hent anime-data').position(20, 20).mousePressed(loadData); // Knyt en funktion til knappen

  // Starttekst på canvas yeziiiir
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Klik på knappen for at hente data", width / 2, height / 2);
}

function draw() {
  if (loaded) {
    // Hvis data er hentet, vis det
    displayData();
  }
}

function loadData() {
  let url = 'https://api.jikan.moe/v4/seasons/now?sfw';
  loadJSON(url, gotData); // Hent data fra API
}

function gotData(data) {
  animeData = data.data; // Gem listen over anime
  loaded = true; // Sæt loaded-flag til true
  background(30); // Ryd canvas efter klik
}

function displayData() {
  background(30); // Ryd canvas før ny visualisering
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);

  // Loop igennem anime-data og vis titler
  let y = 60; // Startposition under knappen
  for (let i = 0; i < animeData.length; i++) {
    let anime = animeData[i];
    text(`${i + 1}. ${anime.title}`, 20, y); // Vis anime-titel
    y += 25;

    // Stop, hvis teksten når bunden af canvas
    if (y > height - 20) {
      text("...and more!", 20, y);
      break;
    }
  }
}

