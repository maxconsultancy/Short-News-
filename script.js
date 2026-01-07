// Live news using NewsData.io API
// Sign up free at https://newsdata.io/ and replace "pub_d53b1cc21a51416ab6b4f20c0a9848cc" with your API key.

const API_KEY = " pub_d53b1cc21a51416ab6b4f20c0a9848cc ";
const BASE_URL = "https://newsdata.io/api/1/news";

async function fetchNews(params, container) {
  const url = `${BASE_URL}?apikey=${API_KEY}&${params}&language=en`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      container.innerHTML = "<p>No news found.</p>";
      return;
    }

    container.innerHTML = data.results.slice(0, 5).map(article => `
      <article>
        <h3>${article.title}</h3>
        <p>${article.description || "No description available."}</p>
        <a href="${article.link}" target="_blank">Read more</a>
      </article>
    `).join("");

  } catch (error) {
    console.error("Error fetching NewsData.io:", error);
    container.innerHTML = "<p>Failed to load news. Please try again later.</p>";
  }
}

function loadDefaultNews() {
  const sections = document.querySelectorAll(".news-list");
  sections.forEach(section => {
    const category = section.dataset.category;
    if (category === "search") return;

    let q = "news";
    if (category === "world") q = "world";
    if (category === "local") q = "local";
    if (category === "business") q = "business";
    if (category === "tech") q = "technology";

    fetchNews(`q=${q}`, section);
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

    searchResults.classList.remove("hidden");
    searchResults.scrollIntoView({ behavior: "smooth" });
    searchContainer.innerHTML = "<p>Loading results...</p>";

    await fetchNews(`q=${encodeURIComponent(term)}`, searchContainer);
  });
});