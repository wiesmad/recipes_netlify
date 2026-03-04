module.exports = {
  eleventyComputed: {
    // Tworzymy nowy klucz "recipeSchema", który będzie dostępny w szablonach
    recipeSchema: (data) => {
      // Jeśli plik nie ma instrukcji lub składników, nie generuj schematu
      if (!data.instructions || !data.ingredients) {
        return null;
      }

      const schema = {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        name: data.title,
        description: data.seo_description || "",
        recipeIngredient: data.ingredients,
        recipeInstructions: data.instructions.map((step) => ({
          "@type": "HowToStep",
          text: step,
        })),
        cookTime: data.schemaTime,
        recipeYield: data.porcje,
        nutrition: {
          "@type": "NutritionInformation",
          calories: data.kalorie,
        },
        author: {
          "@type": "Person",
          name: "Wiesław Mazurak",
        },
      };

      if (data.image) {
        schema.image = {
          "@type": "ImageObject",
          url: `https://farfalle.pl/public/img/${data.image}`,
          name: data.imageAlt || data.title, // Używa imageAlt z MD lub tytułu przepisu
          description: data.imageAlt || `Zdjęcie potrawy: ${data.title}`,
          height: data.imageHeight || 800, // Opcjonalne, Google lubi znać wymiary
          width: data.imageWidth || 800,
        };
      }
      // Zwracamy gotowy obiekt jako ciąg znaków JSON
      return JSON.stringify(schema);
    },
  },
};
