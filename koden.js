let animeData = [];
let loaded = false;
let loadButton; // laver det bare sådan her for global-scope yezzir

function setup() {
  createCanvas(1920, 5500);
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
  animeData = data.data.map(anime => ({
    title: anime.title_english,
    genre: anime.genres.map(genre => genre.name).join(', '), // Genre som en kombineret streng
    type: anime.type, // Type af anime (f.eks. TV, OVA, Movie fr)
    source: anime.source, // Oprindelse (f.eks. Manga, Light Novel) yeziar
    status: anime.status, // Status (f.eks. ongoing, completed, not released fr)
    popularity: anime.popularity, // Popularitet (ratings)
    favorites: anime.favorites, // Antal favoritter
    releaseDate: anime.aired.from // Udgivelsesdato
  })); // Gem listen over anime
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
    text(`${i + 1}. ${anime.title}`, 20, y); // Titel
    text(`Genre: ${anime.genre}`, 20, y + 20); // Genre
    text(`Type: ${anime.type}`, 20, y + 40); // Type
    text(`Source: ${anime.source}`, 20, y + 60); // Source
    text(`Status: ${anime.status}`, 20, y + 80); // Status
    text(`Popularity: ${anime.popularity}`, 20, y + 100); // Popularitet
    text(`Favorites: ${anime.favorites}`, 20, y + 120); // Favoritter
    text(`Udgivelsesdato: ${anime.releaseDate}`, 20, y + 140); // Udgivelsesdato
    y += 200; // Flytter position ned

    // Stop, hvis teksten når bunden af canvas
    if (y > height - 20) {
      text("...and more!", 20, y);
      break;
    }
  }
}

