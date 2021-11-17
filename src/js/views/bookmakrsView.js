import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _defError = 'No Bookmarks Yet.';
  _message = 'Success';

  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
