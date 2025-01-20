let animeData = [];
let loaded = false;
let loadButton, sortButton; // Tilføj sorteringsknap
let trailerIframe = null; // HTML-element til at vise traileren
let genreDropdown; // Dropdown-menu til filtrering
let filteredData = []; // Filtrerede data

function setup() {
  createCanvas(1920, 5500);
  background(30);

  // Opret dropdown til genre-filter - jeg elsker anime. createSelect() er en banger
  genreDropdown = createSelect().position(150, 20).changed(filterByGenre);
  genreDropdown.option('Alle'); // Standardvalg
  genreDropdown.hide(); // Skjult, indtil data er hentet

  // Opret knap til hentning af data
  loadButton = createButton('Hent anime-data').position(20, 20).mousePressed(loadData);

  // Opret knap til sortering efter popularitet
  sortButton = createButton('Sortér efter popularitet').position(20, 60).mousePressed(sortByPopularity);
  sortButton.hide(); // Skjul indtil data er hentet

  // Starttekst på canvas
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Klik på knappen for at hente data", width / 2, height / 2);
}

function draw() {
  if (loaded) {
    displayData(); // Vis data, når de er hentet
  }
}

function loadData() {
  let url = 'https://api.jikan.moe/v4/seasons/now?sfw';
  loadJSON(url, gotData); // Hent data fra API
}

function gotData(data) {
  animeData = data.data.map(anime => ({
    title: anime.title || anime.title_english || "Unknown Title",
    image_url: anime.images.jpg.image_url, // Billedets URL
    genre: anime.genres.map(genre => genre.name).join(', '), // Genre som en streng
    type: anime.type, // Type (f.eks. TV, OVA)
    source: anime.source, // Kilde (f.eks. Manga, Light Novel)
    status: anime.status, // Status (f.eks. Ongoing)
    popularity: anime.popularity, // Popularitet
    favorites: anime.favorites, // Antal favoritter
    releaseDate: anime.aired?.from || "Unknown", // Udgivelsesdato
    trailer_url: anime.trailer?.embed_url || null, // Trailer-URL
    img: loadImage(anime.images.jpg.image_url) // Hent billedet direkte
  }));

  filteredData = [...animeData]; // Kopiér data til filtrering

  // Ekstraher unikke genrer
  let allGenres = new Set();
  data.data.forEach(anime => anime.genres.forEach(genre => allGenres.add(genre.name)));
  genreDropdown.show(); // Vis dropdown
  allGenres.forEach(genre => genreDropdown.option(genre)); // Tilføj genrer til dropdown

  sortButton.show(); // Vis sorteringsknap
  loaded = true; // Marker data som hentet
  background(30); // Ryd canvas efter klik
}

function filterByGenre() {
  let selectedGenre = genreDropdown.value();

  if (selectedGenre === 'Alle') {
    filteredData = [...animeData]; // Vis alle, hvis 'Alle' er valgt
  } else {
    filteredData = animeData.filter(anime => anime.genre.includes(selectedGenre));
  }

  displayData(); // Opdater canvas
}

function sortByPopularity() {
  filteredData.sort((a, b) => b.popularity - a.popularity); // Sortér i faldende rækkefølge
  displayData(); // Opdater canvas efter sortering
}

function displayData() {
  background(30); // Ryd canvas før ny visualisering
  fill(255);
  textAlign(CENTER, TOP);
  textSize(12);

  let cols = 3; // Antal kolonner
  let colWidth = width / cols; // Bredden af hver kolonne
  let x = colWidth / 2; // Start x-position (midt i første kolonne)
  let y = 550; // Start y-position for første række

  for (let i = 0; i < filteredData.length; i++) {
    let anime = filteredData[i];

    // Vis billede, hvis det er hentet
    if (anime.img) {
      image(anime.img, x - 70, y - 200, 150, 225); // Billede (100x100 px) over teksten
    }

    // Vis anime-oplysninger
    text(anime.title, x, y + 30); // Titel
    text(`Genre: ${anime.genre}`, x, y + 50); // Genre
    text(`Type: ${anime.type}`, x, y + 70); // Type
    text(`Source: ${anime.source}`, x, y + 90); // Kilde
    text(`Status: ${anime.status}`, x, y + 110); // Status
    text(`Popularity: ${anime.popularity}`, x, y + 130); // Popularitet
    text(`Favorites: ${anime.favorites}`, x, y + 150); // Favoritter
    text(`Udgivelsesdato: ${anime.releaseDate}`, x, y + 170); // Udgivelsesdato

    // Gem billedets position og dimensioner
    anime.x = x - 50;
    anime.y = y - 80;
    anime.width = 100;
    anime.height = 100;

    // Flyt til næste kolonne
    x += colWidth;
    if (x > width) { // Hvis vi når slutningen af en række
      x = colWidth / 2; // Tilbage til første kolonne
      y += 400; // Flyt til næste række
    }
  }
}

function mousePressed() {
  // Fjern eksisterende trailer, hvis der klikkes et andet sted
  if (trailerIframe) {
    trailerIframe.remove();
    trailerIframe = null;
  }

  // Tjek, om der er klikket på et billede
  for (let anime of animeData) {
    if (
      mouseX > anime.x &&
      mouseX < anime.x + anime.width &&
      mouseY > anime.y &&
      mouseY < anime.y + anime.height
    ) {
      if (anime.trailer_url) {
        // Opret en iframe til traileren
        trailerIframe = createElement('iframe');
        trailerIframe.attribute('src', anime.trailer_url);
        trailerIframe.attribute('width', '560');
        trailerIframe.attribute('height', '315');
        trailerIframe.attribute('allow', 'autoplay; encrypted-media');
        trailerIframe.position(anime.x + 50, anime.y + 80); // Placér over billedet
      }
    }
  }
}
