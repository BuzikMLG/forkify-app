import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _defError = 'Incorrect Format !';
  _message = 'Recipe Uploaded!';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHide();
  }

  toggleState() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleState.bind(this));
  }

  _addHandlerHide() {
    this._btnClose.addEventListener('click', this.toggleState.bind(this));
    this._overlay.addEventListener('click', this.toggleState.bind(this));
  }

  _addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
