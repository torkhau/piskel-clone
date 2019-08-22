import HTMLElem from '../abstract/HTML_elem';

export default class ToolPalette extends HTMLElem {
  constructor(HTMLDom) {
    super(HTMLDom);
    this._currentTool = 1;
  }

  get currentTool() {
    return this._currentTool;
  }

  set currentTool(value) {
    this._currentTool = value || 1;
  }

  get nameTool() {
    switch (this._currentTool) {
      case 1:
        return 'Pen tool';
      case 2:
        return 'Vertical mirror pen';
      case 3:
        return 'Paint bucket tool';
      case 4:
        return 'Paint all pixels of the same color';
      case 5:
        return 'Eraser tool';
      case 6:
        return 'Stroke tool';
      case 7:
        return 'Rectangle tool';
      case 8:
        return 'Cercle tool';
      case 9:
        return 'Move tool';
      case 10:
        return 'Shape selection';
      case 11:
        return 'Rectangle selection';
      case 12:
        return 'Lasso selection';
      case 13:
        return 'Lighten';
      case 14:
        return 'Dithering tool';
      case 15:
        return 'Color picker';
      default:
        return '';
    }
  }
}
