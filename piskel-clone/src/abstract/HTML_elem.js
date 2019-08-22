import Event from './event';

export default class HTMLElem {
  constructor(DOMElem) {
    this.DOMElem = DOMElem;
    this.events = new Event(this.DOMElem);
  }

  static getDomElem(elem, nameDOMElem) {
    if (elem === null) {
      return elem;
    }
    if (elem.nodeName === nameDOMElem) {
      return elem;
    }

    return this.getDomElem(elem.parentNode, nameDOMElem);
  }

  set text(value) {
    this.DOMElem.innerText = value;
  }

  setDataAttr(nameDataAttr, value) {
    this.DOMElem.dataset[nameDataAttr] = value;
  }
}
