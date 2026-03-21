let posts = [];
let timeout = null;

// Pobieranie danych z obsługą błędów
fetch("/search.json")
  .then((r) => {
    if (!r.ok) throw new Error("Błąd ładowania danych wyszukiwania");
    return r.json();
  })
  .then((data) => {
    posts = data;
  })
  .catch((err) => console.error(err));

const input = document.getElementById("search-input");
const results = document.getElementById("search-results");

input.addEventListener("input", function () {
  // Czyszczenie poprzedniego timeout (Debouncing)
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const query = this.value.toLowerCase().trim();
    results.innerHTML = "";

    if (query.length < 2) return;

    // Filtrowanie
    const matches = posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query),
      )
      .slice(0, 10);

    // Renderowanie wyników
    matches.forEach((post) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.href = post.url;
      a.textContent = post.title; // Bezpieczniejsze niż innerHTML

      li.appendChild(a);
      results.appendChild(li);
    });

    // Opcjonalnie: info o braku wyników
    if (matches.length === 0) {
      results.innerHTML = "<li>Brak wyników</li>";
    }
  }, 250); // Czekaj 250ms po zakończeniu pisania
});
