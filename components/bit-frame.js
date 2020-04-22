import { observe } from '../utils.js';

export const COMPONENT_NAME = 'bit-frame';

export class BitFrameElement extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();

    this._src = '';
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.innerHTML = `
<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>
<slot></slot>
`;
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;
    this.style.backgroundImage = `url("${value}")`;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    this._aspectRatio = this._width / this._height;
    this.updateSize();
  }

  get height() {
    return this._width;
  }

  set height(value) {
    this._height = value;
    this._aspectRatio = this._width / this._height;
  }

  async connectedCallback() {
    this._boundingRect = this.getBoundingClientRect();
    this._unobserve = observe(this);
  }

  disconnectedCallback() {
    if (this._unobserve) {
      this._unobserve();
    }
  }

  resizeCallback(rect) {
    this._boundingRect = rect;
    this.updateSize();
  }

  updateSize() {
    if (!this._boundingRect || !this._aspectRatio) {
      return;
    }
    const { height } = this._boundingRect;

    this.style.width = `${(height * this._aspectRatio) | 0}px`;
    this.style.flexBasis = `${(height * this._aspectRatio) | 0}px`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      this.src = newValue;
    }
  }
}

window.customElements.define(COMPONENT_NAME, BitFrameElement);
