/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

let animeByTitle = {}; //Hash table for search
let animeByGenre = {}; //Genre index
let fullData = []

function showCards(){
  //  Importing data from external JSON file (an array of anime objects) 
  fetch("data_with_images.json") 
    .then(response => response.json())
    .then(data => {
      fullData = data;

      data.forEach(anime => {
        // Title filtering
        const titleKey = anime.title.text.toLowerCase();
        animeByTitle[titleKey] = anime;

        // Genre filtering
        anime.genres.forEach(genre => {
          if (!animeByGenre[genre]){
            animeByGenre[genre] = [];
          }
          animeByGenre[genre].push(anime);
        });
      });

      renderCards(data); //Display all cards initially
      populateGenreFilter(); // Add genre dropdown
    })
    .catch(err => console.error("Error loading data:", err))
  }

function renderCards(animeList){
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const template = document.querySelector(".card");

  animeList.forEach(anime => {
    const card = template.cloneNode(true);
    editCardContent(card, anime);
    cardContainer.appendChild(card);
  });
}

function searchAnime(){
  const input = document.getElementById("search-box").value.trim().toLowerCase();
  const selectedGenre = document.getElementById("genre-filter").value;

  //Check has table (fast exactMatch)
  const exactMatch = animeByTitle[input];
  if (exactMatch && (!selectedGenre || exactMatch.genres.includes(selectedGenre))){
    renderCards([exactMatch]);
    return;
  }

  let filteredList = selectedGenre ? animeByGenre[selectedGenre] : fullData;
  const result = filteredList.filter(anime => 
    anime.title.text.toLowerCase().includes(input));
  
  
  if (result.length > 0){
    renderCards(result);
  }
  else{
    alert("No anime found.");
  }
}

function filterByGenre(){
  const selected = document.getElementById("genre-filter").value;
  if (!selected) {
    renderCards(fullData); //Show all
  }
  else{
    renderCards(animeByGenre[selected]);
  }
}

function populateGenreFilter(){
  const dropdown = document.getElementById("genre-filter");
  const genres = Object.keys(animeByGenre).sort();
  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    dropdown.appendChild(option);
  })
}

function resetCatalog() {
  document.getElementById("search-box").value = "";
  document.getElementById("genre-filter").value = "";
  document.getElementById("sort-hype").value = "";
  renderCards(fullData); //Show all anime again
}

function sortByHype() {
  const direction = document.getElementById("sort-hype").value;

  let currentList = [...fullData]; //copy of full list

  //Genre filter takes precedence
  const genre = document.getElementById("genre-filter").value;
  if (genre) {
    currentList = [...animeByGenre[genre]];
  }

  //Search input also takes precedence
  const input = document.getElementById("search-box").value.trim().toLowerCase();
  if (input) {
    currentList = currentList.filter(anime =>
      anime.title.text.toLowerCase().includes(input)
    );
  }

  //Sort
  if (direction === "desc") {
    currentList.sort((a, b) => b.hype - a.hype); //highest to lowest
  }
  else if (direction === "asc") {
    currentList.sort((a, b) => a.hype - b.hype);  //lowest to highest
  }

  renderCards(currentList);
}

function editCardContent(card, anime) {
  card.style.display = "block";

  //Set the title with a clickable link
  const header = card.querySelector("h2");
  header.innerHTML = `<a href="${anime.title.link}" target="_blank">${anime.title.text}</a>`;


  //Sets image of each card
  const cardImage = card.querySelector("img");
  cardImage.src = anime.image || `https://via.placeholder.com/200x300?text=${encodeURIComponent(anime.title.text)}`;
  cardImage.alt = anime.title.text;

  //Fill in the bullet points
  const ul = card.querySelector("ul");
  ul.innerHTML = "";
  anime.genres.forEach(genre => {
    const li = document.createElement("li");
    li.textContent = genre;
    ul.appendChild(li);
  });

  //Hype Score
  const hypeLi = document.createElement("li");
  hypeLi.textContent = 'Hype: ${anime.hype}';
  ul.appendChild(hypeLi);

  //Description
  const desc = document.createElement("p");
  desc.textContent = anime.description;
  card.querySelector(".card-content").appendChild(desc);

  console.log("New card created:", anime.title.text, "- HTML: ", card);
}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);

function quoteAlert() {
  console.log("Button Clicked!");
  alert(
    "I guess I can kiss heaven goodbye, because it got to be a sin to look this good!"
  );
}

function removeLastCard() {
  titles.pop(); // Remove last item in titles array
  showCards(); // Call showCards again to refresh
}
