import HTMLElem from '../abstract/HTML_elem';

export default class ColorSelect extends HTMLElem {
  constructor(DOMElem) {
    super(DOMElem);
    [this.secondatyColor, this.primaryColor] = DOMElem.children;
  }

  getColor(parse = true, primary = true) {
    if (parse) {
      const colorX16 = primary ? this.primaryColor.value.substr(1)
        : this.secondatyColor.value.substr(1);
      return [parseInt(colorX16.substr(0, 2), 16),
        parseInt(colorX16.substr(2, 2), 16),
        parseInt(colorX16.substr(4, 2), 16)];
    }
    return primary ? this.primaryColor.value : this.secondatyColor.value;
  }

  setColor(arr) {
    const parse = (num) => {
      const res = num.toString(16);
      return res.length === 2 ? `${res}` : `0${res}`;
    };

    this.primaryColor.value = `#${parse(arr[0])}${parse(arr[1])}${parse(arr[2])}`;
  }

  swapColors() {
    const primaryColor = this.getColor(false);
    this.primaryColor.value = this.secondatyColor.value;
    this.secondatyColor.value = primaryColor;
  }
}
