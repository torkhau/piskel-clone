import Frame from './frame';
import HTMLElem from '../abstract/HTML_elem';

export default class FramesManagement extends HTMLElem {
  constructor(DOMElem) {
    super(DOMElem);
    this.buttonAddFrame = new HTMLElem(this.DOMElem.firstElementChild.firstElementChild);
    this.buttonAddFrame.events.addEvent('click', () => this.pushFrame());
    this.length = 0;
    this.frames = {};
    this._currentFrame = 0;
    this.pushFrame();
  }

  // protected methods
  _refactorFrames(firstFrame) {
    for (let i = firstFrame; i <= this.length - 1; i += 1) {
      this.frames[i] = this.frames[i + 1];
      this.frames[i].setNumberFrame(i);
      const actualFrame = this._getDOMFrame(i);
      actualFrame.firstChild.classList.remove('dev_frames_pick');
    }
  }

  _showFrame() {
    this.DOMElem.insertBefore(this.frames[this.length].li.DOMElem,
      this.buttonAddFrame.DOMElem.parentNode);
  }

  _getDOMFrame(numberFrame) {
    return this.frames[numberFrame || this._currentFrame].li.DOMElem;
  }

  // public methods

  get currentFrame() {
    return this.frames[this._currentFrame];
  }

  set currentFrame(value) {
    let actualFrame = this._getDOMFrame(Math.min(this._currentFrame, this.length) || 1);
    actualFrame.firstChild.classList.remove('dev_frames_pick');
    this._currentFrame = value;
    actualFrame = this._getDOMFrame(this._currentFrame);
    actualFrame.firstChild.classList.add('dev_frames_pick');
  }

  pushFrame() {
    this.length += 1;
    this.frames[this.length] = new Frame(this.length);
    this.currentFrame = 1;
    this._showFrame();
  }

  deleteFrame(currFrame) {
    if (this.length === 1) {
      return;
    }
    this.DOMElem.removeChild(this._getDOMFrame(currFrame));
    this._refactorFrames(currFrame);
    let nextCurrFrame = this._currentFrame;
    if (currFrame === this._currentFrame) {
      nextCurrFrame = currFrame - 1;
    }
    delete this.frames[this.length];
    this.length -= 1;
    this.currentFrame = nextCurrFrame === 0 ? 1 : Math.min(nextCurrFrame, this.length);
  }

  copyFrame(currFrame) {
    this.pushFrame();
    const newFrame = this.frames[this.length];
    newFrame.canvas.getContext('2d').drawImage(this.frames[currFrame].canvas, 0, 0);
    newFrame.layers[0].getContext('2d').drawImage(this.frames[currFrame].layers[0], 0, 0);
  }
}
