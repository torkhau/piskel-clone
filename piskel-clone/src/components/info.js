import HTMLElem from '../abstract/HTML_elem';

export default class Info {
  constructor() {
    this._currentTool = new HTMLElem(document.querySelector('.info_current-tool'));
    this._size = new HTMLElem(document.querySelector('.info_size'));
    this._coordinates = new HTMLElem(document.querySelector('.info_coordinates'));
  }

  set size(value) {
    this._size.text = `[${value}x${value}]`;
  }

  coordinates(xPoint, yPoint) {
    let res = `${xPoint} : ${yPoint}`;
    if (xPoint === 0 && yPoint === 0) {
      res = '';
    }
    this._coordinates.text = res;
  }

  set currentTool(value) {
    this._currentTool.text = value;
  }
}
