import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(recipeData, render = true) {
    if (!recipeData || (Array.isArray(recipeData) && recipeData.length == 0))
      return this.renderError();
    this._data = recipeData;
    const generatedHTML = this._generateMarkup();
    if (render === false) return generatedHTML;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', generatedHTML);
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
     <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
     </div> 
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._defError) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `      <div class="recipe">
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));
    newElements.forEach((el, i) => {
      const curEl = currElements[i];
      if (!el.isEqualNode(curEl) && el?.firstChild?.nodeValue.trim() != '') {
        curEl.textContent = el.textContent;
      }
      if (!el.isEqualNode(curEl)) {
        Array.from(el.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
