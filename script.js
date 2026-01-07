// Live headlines + keyword search using GNews.io API
// Sign up at 
https://gnews.io/apikey="68742387446930499fa5eecb83728eb8";

const API_KEY =
"68742387446930499fa5eecb83728eb8";
const BASE_URL = "https://gnews.io/api/v4/apikey ="68742387446930499fa5eecb83728eb8";

async function fetchNews(endpoint, query, container) {
  const url = `${BASE_URL}/${endpoint}?q=${encodeURIComponent(query)}&lang=en&max=5&apikey=${"68742387446930499fa5eecb83728eb8"}';
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>No news found.</p>";
      return;
    }

    container.innerHTML = data.articles.map(article => `
      <article>
        <h3>${article.title}</h3>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      </article>
    `).join("");
  } catch (error) {
    console.error("Error fetching GNews data:", error);
    container.innerHTML = "<p>Failed to load news. Please try again later.</p>";
  }
}

function loadDefaultNews() {
  const sections = document.querySelectorAll(".news-list");
  sections.forEach(section => {
    const category = section.dataset.category;
    if (category === "search") return; // skip search section

    let query = "general";
    if (category === "world") query = "world";
    if (category === "local") query = "nation";
    if (category === "business") query = "business";
    if (category === "tech") query = "technology";

    fetchNews("top-headlines", query, section);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadDefaultNews();

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const searchResults = document.querySelector("#search-results");
  const searchContainer = searchResults.querySelector(".news-list");

  searchBtn.addEventListener("click", async () => {
    const term = searchInput.value.trim();
    if (!term) return;

    // Show search results
    searchResults.classList.remove("hidden");
    searchResults.scrollIntoView({ behavior: "smooth" });

    searchContainer.innerHTML = "<p>Loading results...</p>";
    await fetchNews("search", term, searchContainer);
  });
});