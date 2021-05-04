export class MouseController {
  host;
  pos = {x: 0, y: 0};

  _onMouseMove = ({clientX, clientY}) => {
    this.pos = {x: clientX, y: clientY};
    this.host.requestUpdate();
  };

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener('mousemove', this._onMouseMove);
  }

  hostDisconnected() {
    window.removeEventListener('mousemove', this._onMouseMove);
  }
}
