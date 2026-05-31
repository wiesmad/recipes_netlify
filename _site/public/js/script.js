// ==========================================
// 1. SCROLL BUTTON HANDLING
// ==========================================
const scrollBtn = document.getElementById("scrollTopBtn");

// Używamy Passive Event Listener dla lepszej płynności przewijania na mobile
window.addEventListener(
  "scroll",
  () => {
    if (scrollBtn) {
      scrollBtn.classList.toggle("visible", window.scrollY > 300);
    }
  },
  { passive: true },
);

// Kliknięcie -> płynny scroll do góry
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ==========================================
// 2. SEARCH BOX HANDLING
// ==========================================
let posts = [];
let debounceTimeout = null;

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Pobieranie danych (Async/Await)
const loadSearchData = async () => {
  try {
    const response = await fetch("/search.json");
    if (!response.ok) throw new Error("Błąd ładowania danych wyszukiwania");
    posts = await response.json();
  } catch (err) {
    console.error("Search init error:", err);
  }
};

// Uruchamiamy wyszukiwarkę tylko jeśli elementy istnieją w DOM
if (searchInput && searchResults) {
  loadSearchData();

  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimeout);

    const query = this.value.toLowerCase().trim();

    // UX: Jeśli pole jest puste lub za krótkie, czyścimy wyniki natychmiast
    if (query.length < 2) {
      searchResults.innerHTML = "";
      return;
    }

    debounceTimeout = setTimeout(() => {
      // Filtrowanie z zabezpieczeniem przed brakującymi polami
      const matches = posts
        .filter((post) => {
          const titleMatch = post.title?.toLowerCase().includes(query);
          const contentMatch = post.content?.toLowerCase().includes(query);
          return titleMatch || contentMatch;
        })
        .slice(0, 10);

      // Wydajne renderowanie za pomocą DocumentFragment
      const fragment = document.createDocumentFragment();

      if (matches.length > 0) {
        matches.forEach((post) => {
          const li = document.createElement("li");
          const a = document.createElement("a");

          a.href = post.url;
          a.textContent = post.title;

          li.appendChild(a);
          fragment.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "Brak wyników";
        li.style.color = "#666";
        fragment.appendChild(li);
      }

      searchResults.innerHTML = "";
      searchResults.appendChild(fragment);
    }, 250);
  });

  // UX: Zamknij wyniki wyszukiwania, gdy użytkownik kliknie poza obszar wyszukiwarki
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.innerHTML = "";
    }
  });
}
