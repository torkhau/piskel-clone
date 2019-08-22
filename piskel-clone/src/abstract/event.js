export default class Event {
  constructor(DOMElem) {
    this.DOMElem = DOMElem;
    this.events = {};
  }

  numberAction(event, actionFind, phaseFind) {
    if (this.events.keys().length === 0) {
      return -1;
    }
    const eventTarget = this.events[event];
    if (eventTarget) {
      return eventTarget.findIndex((elem) => {
        const { action, phase } = elem;
        if ((action === actionFind) && (phase === phaseFind)) {
          return true;
        }
        return false;
      });
    }
    return -1;
  }

  isEventExist(event, action, phase) {
    if (this.events[event]) {
      if (this.numberAction(event, action, phase) + 1) {
        return true;
      }
    }
    return false;
  }

  addEvent(event, action, phase) {
    if (!this.isEventExist(event, action, phase)) {
      if (Array.isArray(this.events[event])) {
        this.events[event].push({ action, phase });
      } else {
        this.events[event] = [{ action, phase }];
      }
      this.DOMElem.addEventListener(event, action, phase);
    }
  }

  remEvent(event, action, phase) {
    const numArrAction = this.events[event].find({ action, phase });
    if (numArrAction) {
      this.DOMElem.removeEventListener(event, action, phase);
      this.events[event].splice(numArrAction, 1);
      if (this.events[event].length === 0) {
        delete this.events[event];
      }
    }
  }
}
