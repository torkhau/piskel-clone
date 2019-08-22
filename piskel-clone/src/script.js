import '../assets/font-awesome/css/font-awesome.min.css';
import './reset.css';
import './style.css';
import FramesManagement from './components/frame_manajement';
import ColorSelect from './components/color_select';
import Canvas from './components/canvas';
import HTMLElem from './abstract/HTML_elem';
import Info from './components/info';
import ToolPalette from './components/tool_palette';
import GIF from './gif_library/gif';

let timerId;
let count;
const info = new Info();
const toolPalette = new ToolPalette(document.querySelector('.tool'));
const colorSelect = new ColorSelect(document.querySelector('#color_select'));
const menuSize = new HTMLElem(document.querySelector('.subsubmenu'));
const menuSave = new HTMLElem(document.querySelector('#save'));
const framesManagement = new FramesManagement(document.querySelector('.list_of_frames'));
const canvas = new Canvas(document.querySelector('.canvas'), toolPalette, colorSelect, framesManagement);
const textFPS = new HTMLElem(document.querySelector('#out_fps'));
const rangeFPS = new HTMLElem(document.querySelector('#fps'));
const canvasPrev = new HTMLElem(document.querySelector('.canvas_prew'));

const clearRect = (context) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

toolPalette.events.addEvent('click', (event) => {
  const node = HTMLElem.getDomElem(event.target, 'TD');
  if (node) {
    toolPalette.currentTool = Number.parseInt(node.dataset.tool, 10) || toolPalette.currentTool;
    info.currentTool = toolPalette.nameTool;
  }
});

colorSelect.events.addEvent('click', (event) => {
  const node = event.target;
  if (node.nodeName === 'I') {
    colorSelect.swapColors();
  }
});

framesManagement.events.addEvent('click', (event) => {
  let currFrame = 1;
  let isBtnClick = false;
  let reload = true;
  let nameBtn = '';
  let node = HTMLElem.getDomElem(event.target, 'BUTTON');
  if (node) {
    isBtnClick = true;
    nameBtn = node.name;
  } else {
    node = event.target;
  }
  const liNode = HTMLElem.getDomElem(node, 'LI');
  if (liNode) {
    currFrame = Number.parseInt(liNode.dataset.numberframe, 10) || currFrame;
  }
  if (isBtnClick) {
    switch (nameBtn) {
      case 'btnDel':
        framesManagement.deleteFrame(currFrame);
        break;
      case 'btnCopy':
        framesManagement.copyFrame(currFrame);
        break;
      default:
        reload = false;
        break;
    }
  } else {
    framesManagement.currentFrame = currFrame;
  }
  if (reload) {
    canvas.reload();
  }
});

canvas.events.addEvent('mousemove', (event) => {
  const xPoint = Math.ceil((event.x - canvas.offsetLeft) / canvas.stepX);
  const yPoint = Math.ceil((event.y - canvas.offsetTop) / canvas.stepY);
  info.coordinates(xPoint, yPoint);
});
canvas.events.addEvent('mouseout', () => info.coordinates(0, 0));

menuSize.events.addEvent('click', (event) => {
  event.preventDefault();
  const node = HTMLElem.getDomElem(event.target, 'A');
  const newSize = Number.parseInt(node.innerText, 10);
  if (newSize === canvas.size) {
    return;
  }
  const dWidthHeight = 768 / newSize * canvas.size;
  const dXY = (768 - dWidthHeight) / 2;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 768;
  tempCanvas.height = 768;
  const ctxTempCanvas = tempCanvas.getContext('2d');
  for (let i = 1; i <= framesManagement.length; i += 1) {
    const frame = framesManagement.frames[i];
    const ctx = frame.layers[0].getContext('2d');
    ctxTempCanvas.putImageData(ctx.getImageData(0, 0, 768, 768), 0, 0);
    clearRect(ctx);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, dXY, dXY, dWidthHeight, dWidthHeight);
    const ctxFrame = frame.canvas.getContext('2d');
    clearRect(ctxFrame);
    ctxFrame.drawImage(frame.layers[0], 0, 0, 128, 128);
    clearRect(ctxTempCanvas);
  }
  canvas.size = newSize;
  canvas.reload();
  info.size = canvas.size;
});

menuSave.events.addEvent('click', (event) => {
  event.preventDefault();
  const { size } = canvas;
  const gif = new GIF({
    workers: 1,
    quality: 10,
    width: size,
    height: size,
  });
  const delay = 1000 / rangeFPS.DOMElem.valueAsNumber;
  const canvases = {};
  for (let i = 1; i <= framesManagement.length; i += 1) {
    canvases[i] = document.createElement('canvas');
    canvases[i].width = size;
    canvases[i].height = size;
    canvases[i].getContext('2d').drawImage(framesManagement.frames[i].layers[0], 0, 0, size, size);
    gif.addFrame(canvases[i], { delay });
  }
  gif.on('finished', (blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'piskel.gif';
    link.click();
  });
  gif.render();
});

rangeFPS.events.addEvent('change', () => {
  textFPS.text = `${rangeFPS.DOMElem.value} FPS`;
  const contextCanvasPrev = canvasPrev.DOMElem.getContext('2d');
  const canvasWidth = canvasPrev.DOMElem.width;
  const canvasHeight = canvasPrev.DOMElem.height;
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (count > framesManagement.length) {
      count = 1;
    }
    clearRect(contextCanvasPrev);
    contextCanvasPrev.drawImage(framesManagement.frames[count].layers[0],
      0, 0, canvasWidth, canvasHeight);
    count += 1;
  }, 1000 / rangeFPS.DOMElem.valueAsNumber);
});

document.addEventListener('DOMContentLoaded', () => {
  const contextCanvasPrev = canvasPrev.DOMElem.getContext('2d');
  const canvasWidth = canvasPrev.DOMElem.width;
  const canvasHeight = canvasPrev.DOMElem.height;
  count = 1;
  timerId = setInterval(() => {
    if (count > framesManagement.length) {
      count = 1;
    }
    contextCanvasPrev.clearRect(0, 0, canvasWidth, canvasHeight);
    contextCanvasPrev.drawImage(framesManagement.frames[count].layers[0],
      0, 0, canvasWidth, canvasHeight);
    count += 1;
  }, 1000 / rangeFPS.DOMElem.valueAsNumber);
});

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyP':
      toolPalette.currentTool = 1;
      break;
    case 'KeyV':
      toolPalette.currentTool = 2;
      break;
    case 'KeyE':
      toolPalette.currentTool = 5;
      break;
    case 'KeyD':
      toolPalette.currentTool = 14;
      break;
    case 'KeyO':
      toolPalette.currentTool = 15;
      break;
    case 'KeyI':
      document.querySelector('.fa-info').click();
      break;
    default:
      return;
  }
  info.currentTool = toolPalette.nameTool;
});
