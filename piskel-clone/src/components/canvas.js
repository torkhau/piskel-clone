import HTMLElem from '../abstract/HTML_elem';

export default class Canvas extends HTMLElem {
  constructor(DOMElem, toolPalette, colorSelect, framesManagement) {
    super(DOMElem);
    this.toolPalette = toolPalette;
    this.colorSelect = colorSelect;
    this.framesManagement = framesManagement;
    this.currentColor = this.colorSelect.getColor();
    this._isDrowing = false;
    this._size = 32;
    this._startPoint = { x: 0, y: 0 };
    this._calculateDimensions();
    this.canvas = new HTMLElem(DOMElem.firstElementChild);
    this.context = this.canvas.DOMElem.getContext('2d');
    this.canvas.events.addEvent('mousedown', event => this._startDrowing(event));
    this.canvas.events.addEvent('mouseup', () => this._stopDrowing());
    this.canvas.events.addEvent('mouseout', () => this._stopDrowing());
    this.canvas.events.addEvent('mousemove', event => this._drowing(event));
    this.reload();
  }

  get offsetLeft() {
    return this.DOMElem.offsetLeft;
  }

  get offsetTop() {
    return this.DOMElem.offsetTop;
  }

  get size() {
    return this._size;
  }

  set size(value) {
    switch (value) {
      case 32:
      case 64:
      case 128:
        this._size = value;
        this._calculateDimensions();
        break;
      default:
        break;
    }
  }

  reload() {
    this.currentFrame = this.framesManagement.currentFrame;
    this.context.clearRect(0, 0, 768, 768);
    if (this.currentFrame.layers[0]) {
      this.context.drawImage(this.currentFrame.layers[0], 0, 0);
    }
  }

  _rewriteFrameLayer() {
    const contextLayerCanvas = this.currentFrame.canvas.getContext('2d');
    contextLayerCanvas.clearRect(0, 0, 128, 128);
    contextLayerCanvas.drawImage(this.canvas.DOMElem, 0, 0, 128, 128);
    const ctx = this.currentFrame.layers[0].getContext('2d');
    ctx.clearRect(0, 0, 768, 768);
    ctx.drawImage(this.canvas.DOMElem, 0, 0);
  }

  _calculateDimensions() {
    this.stepX = Math.round(768 / this._size);
    this.stepY = Math.round(768 / this._size);
    this.currentColor = this.colorSelect.getColor();
  }

  _createImageData(alpha, color = this.currentColor) {
    this.imageData = this.context.createImageData(Math.round(this.stepX),
      Math.round(this.stepY));
    const [R, G, B] = color;
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = R;
      this.imageData.data[i + 1] = G;
      this.imageData.data[i + 2] = B;
      this.imageData.data[i + 3] = alpha;
    }
  }

  _drowPoint(x, y) {
    this.context.putImageData(this.imageData, x, y);
  }

  _calcCoordinate(x, y) {
    let x0;
    let y0;
    if (x) {
      x0 = (Math.ceil((x - this.offsetLeft) / this.stepX) - 1) * Math.round(this.stepX);
    }
    if (y) {
      y0 = (Math.ceil((y - this.offsetTop) / this.stepY) - 1) * Math.round(this.stepY);
    }
    if (x0 >= 0 && y0 >= 0) {
      return { x0, y0 };
    }
    if (x0 >= 0) {
      return x0;
    }
    return y0;
  }

  _ditheringChangeColor(x, y) {
    const evenX = (x / this.stepX) % 2;
    const evenY = (y / this.stepY) % 2;
    if (((evenX === 1) && (evenY === 0)) || ((evenX === 0) && (evenY === 1))) {
      this.currentColor = this.colorSelect.getColor(true, false);
    } else {
      this.currentColor = this.colorSelect.getColor();
    }
  }

  _startDrowing(event) {
    this._calculateDimensions();
    const { x0, y0 } = this._calcCoordinate(event.x, event.y);
    this._startPoint.x = x0;
    this._startPoint.y = y0;
    switch (this.toolPalette.currentTool) {
      case 1:
        this._createImageData(255);
        this._isDrowing = true;
        this._drowPoint(x0, y0);
        break;
      case 2:
        this._createImageData(255);
        this._isDrowing = true;
        this._drowPoint(x0, y0);
        this._drowPoint(this._calcCoordinate(2 * this.offsetLeft + 768 - event.x), y0);
        break;
      case 5:
        this._createImageData(0);
        this._isDrowing = true;
        this._drowPoint(x0, y0);
        break;
      case 7:
        this._isDrowing = true;
        break;
      case 14:
        this._ditheringChangeColor(x0, y0);
        this._createImageData(255);
        this._isDrowing = true;
        this._drowPoint(x0, y0);
        break;
      case 15:
        this.colorSelect.setColor(this.context.getImageData(x0, y0, 1, 1).data);
        break;
      default:
        break;
    }
  }

  _stopDrowing() {
    if (this._isDrowing) {
      this._rewriteFrameLayer();
    }
    this._isDrowing = false;
  }

  _drowing(event) {
    if (!this._isDrowing) {
      return;
    }
    const { x0, y0 } = this._calcCoordinate(event.x, event.y);
    switch (this.toolPalette.currentTool) {
      case 1:
      case 5:
        this._drowPoint(x0, y0);
        break;
      case 2:
        this._drowPoint(x0, y0);
        this._drowPoint(this._calcCoordinate(2 * this.offsetLeft + 768 - event.x), y0);
        break;
      case 7:
        break;
      case 14:
        this._ditheringChangeColor(x0, y0);
        this._createImageData(255);
        this._isDrowing = true;
        this._drowPoint(x0, y0);
        break;
      default:
        break;
    }
  }
}
