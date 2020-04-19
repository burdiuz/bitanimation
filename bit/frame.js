window.customElements.define(
  'bit-frame',
  class BitFrameElement extends HTMLElement {
    static get observedAttributes() {
      return ['src'];
    }

    constructor() {
      super();

      this._src = '';
      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `<style>
      div {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
      }
      </style>
      <div>
      <slot></slot>
      </div>`;

      console.log('Bit Frame initialized');
    }

    get src() {
      return this._src;
    }

    set src(value) {
      this._src = value;
      this.root.querySelector('div').style.backgroundImage = `url("${value}")`;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'src':
          this.src = newValue;
          break;
      }
    }
  }
);
