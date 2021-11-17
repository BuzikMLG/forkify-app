import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _defError = 'No recipe found.';
  _message = 'Success';

  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
}

export default new ResultsView();
