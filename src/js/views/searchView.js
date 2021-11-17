import icons from 'url:../../img/icons.svg';

class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  addHandler(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
