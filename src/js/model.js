import { async } from 'regenerator-runtime';
import { API_URL, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

import { RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  return {
    id: data.id,
    title: data.title,
    publisher: data.publisher,
    sourceUrl: data.source_url,
    image: data.image_url,
    servings: data.servings,
    cookingTime: data.cooking_time,
    ingredients: data.ingredients,
    ...(data.key && { key: data.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const { recipe } = await AJAX(`${API_URL}${id}??key=${API_KEY}`);
    state.recipe = createRecipeObject(recipe);
    if (state.bookmarks.some(bm => bm.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (e) {
    throw e;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&?key=${API_KEY}`);
    state.search.page = 1;
    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (e) {
    throw e;
  }
};

export const loadSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(el => {
    el.quantity = (newServing * el.quantity) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
      .map(ing => {
        const ingArr = ing[1].trim().split(',');
        if (ingArr.length !== 3) throw new Error('Wrong Ingredient Format !');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data.recipe);
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
};
