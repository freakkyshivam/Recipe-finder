const searchButton = document.getElementById("searchBtn");
const recipeList = document.getElementById("recipeList");
const loader = document.getElementsByClassName("loader");

const recipeImg = document.getElementById("recipeImg");
const recipeTitle = document.getElementById("recipeTitle");
const recipeDescription = document.getElementById("recipeDescription");
const ingredient = document.getElementById("ingredient");
const recipeLink = document.getElementById("recipeLink");
 

async function fetchRecipes() {
    try {
        let searchInput = document.getElementById("search").value.trim();
        if (!searchInput) return null;

        console.log("Searching for:", searchInput);

        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=fc108f1aeb5f40a4b33b5faf9add022f&query=${searchInput}&number=20&addRecipeInformation=true`);
        
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error("Error fetching recipes:", error);
        return null;
    }
}

function displayRecipes(recipes) {
    loader[0].style.display = "none";
    recipeList.innerHTML = ""; // Clear previous results

    recipes.results.forEach(recipe => {
         

   recipeList.innerHTML += `
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="${recipe.image}" alt="${recipe.title}" />
        <h3>${recipe.title}</h3>
      </div>
      <div class="flip-card-back">
        <h4>${recipe.title}</h4>
        <p>${recipe.summary || "No description available."}</p>
        <p><strong>Ingredients:</strong> ${recipe.extendedIngredients?.map(ing => ing.original).join(", ") || "N/A"}</p>
        <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">View Full Recipe</a>
      </div>
    </div>
  </div>
`;

        
    });
}

searchButton.addEventListener("click", async () => {
    loader[0].style.display = "block";
    const recipes = await fetchRecipes();

    if (recipes && recipes.results.length > 0) {
        displayRecipes(recipes);
        document.getElementById("search").value = "";
    } else {
        loader[0].style.display = "none";
        recipeList.innerHTML = `<p style="color: red;">No recipes found.</p>`;
    }
});

// Allow pressing "Enter" in input field to trigger search
document.getElementById("search").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});
