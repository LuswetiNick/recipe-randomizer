const getRecipeBtn = document.getElementById('get-recipe');
const recipeContainer = document.getElementById('recipe-container');
const recipeTitle = document.getElementById('recipe-title');
const recipeImage = document.getElementById('recipe-image');
const ingredientsList = document.getElementById('ingredients-list');
const instructionsList = document.getElementById('instructions-list');

// MealDB API endpoint for random recipe
const RANDOM_RECIPE_API = 'https://www.themealdb.com/api/json/v1/1/random.php';

// Function to fetch random recipe
async function getRandomRecipe() {
    try {
        const response = await fetch(RANDOM_RECIPE_API);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}

// Function to get ingredients and measurements
function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    return ingredients;
}

// Function to format instructions into steps
function formatInstructions(instructions) {
    // Split by periods followed by a space or newline
    return instructions
        .split(/\.\s+|\.\n/)
        .filter(step => step.trim() !== '')
        .map(step => step.trim() + (step.endsWith('.') ? '' : '.'));
}

// Function to display recipe
function displayRecipe(meal) {
    if (!meal) {
        alert('Failed to fetch recipe. Please try again.');
        return;
    }

    recipeTitle.textContent = meal.strMeal;
    recipeImage.src = meal.strMealThumb;
    
    // Clear previous ingredients
    ingredientsList.innerHTML = '';
    
    // Add ingredients
    const ingredients = getIngredients(meal);
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    
    // Clear previous instructions
    instructionsList.innerHTML = '';
    
    // Add instructions as ordered list items
    const instructions = formatInstructions(meal.strInstructions);
    instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });
    
    // Show recipe container
    recipeContainer.classList.remove('hidden');
}

// Event listener for get recipe button
getRecipeBtn.addEventListener('click', async () => {
    getRecipeBtn.textContent = 'Loading...';
    getRecipeBtn.disabled = true;
    
    const recipe = await getRandomRecipe();
    displayRecipe(recipe);
    
    getRecipeBtn.textContent = 'Get Random Recipe';
    getRecipeBtn.disabled = false;
});
