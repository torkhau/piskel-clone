import HTMLElem from '../abstract/HTML_elem';

export default class Frame {
  constructor(numberFrame) {
    const li = document.createElement('li');
    const liDiv = document.createElement('div');
    li.dataset.numberframe = numberFrame;
    liDiv.classList.add('dev_frames');
    const canvas = document.createElement('canvas');
    canvas.height = 128;
    canvas.width = 128;
    const btnNumber = document.createElement('button');
    const btnDel = document.createElement('button');
    btnDel.name = 'btnDel';
    const btnDelInnerText = document.createElement('i');
    btnDelInnerText.classList.add('fa');
    btnDelInnerText.classList.add('fa-trash-o');
    btnDelInnerText.setAttribute('aria-hidden', true);
    btnDel.appendChild(btnDelInnerText);
    const btnCopy = document.createElement('button');
    btnCopy.name = 'btnCopy';
    const btnCopyInnerText = document.createElement('i');
    btnCopyInnerText.classList.add('fa');
    btnCopyInnerText.classList.add('fa-files-o');
    btnCopyInnerText.setAttribute('aria-hidden', true);
    btnCopy.appendChild(btnCopyInnerText);
    liDiv.appendChild(canvas);
    liDiv.appendChild(btnNumber);
    liDiv.appendChild(btnDel);
    liDiv.appendChild(btnCopy);
    li.appendChild(liDiv);
    this.canvas = canvas;
    this.li = new HTMLElem(li);
    this.btnNumber = new HTMLElem(btnNumber);
    this.btnNumber.text = numberFrame;
    this.btnDel = new HTMLElem(btnDel);
    this.btnCopy = new HTMLElem(btnCopy);
    this.layers = {};
    this.layers[0] = document.createElement('canvas');
    this.layers[0].height = 768;
    this.layers[0].width = 768;
  }

  setNumberFrame(numberFrame) {
    this.li.setDataAttr('numberframe', numberFrame);
    this.btnNumber.text = numberFrame;
  }
}
