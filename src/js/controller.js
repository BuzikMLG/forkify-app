import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import { DEF_SERV, MODAL_SEC } from './config.js';
import bookmakrsView from './views/bookmakrsView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) throw new Error('No Hash ID');
    recipeView.renderSpinner();
    resultsView.update(model.loadSearchResultsPage());
    bookmakrsView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    const { recipe } = model.state;
    recipeView.render(recipe);
    controlServings();
  } catch (e) {
    recipeView.renderError(e);
  }
};

const showSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.loadSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (e) {
    recipeView.renderError(e);
  }
};
const controlPagination = function (goToPage) {
  resultsView.render(model.loadSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (servAmount = DEF_SERV) {
  model.updateServings(servAmount);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe?.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookmakrsView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmakrsView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmakrsView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (e) {
    addRecipeView.renderError(e);
  }
};

// publisher - subscriber
const init = function () {
  bookmakrsView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addHandler(showSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();

//debug only !
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
