window.customElements.define(
  'tool-button',
  class ToolButtonElement extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'icon'];
    }

    constructor() {
      super();

      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `<style>
        :host {
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          border: solid #eeeeee 1px;
          margin-bottom: 10px;
          cursor: pointer;

        }
        :host(:hover) {
          filter: brightness(0.75) contrast(150%);
        }
      </style>`;
    }

    attributeChangedCallback(name, _, value) {
      switch (name) {
        case 'size':
          const px = `${value}px`;

          this.style.width = px;
          this.style.height = px;
          this.style.borderRadius = px;
          break;
        case 'icon':
          this.style.backgroundImage = `url("${value}")`;
          break;
      }
    }
  }
);
