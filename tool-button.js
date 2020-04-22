(() => {
  const STYLE = {
    webkitAppearance: 'none',
    backgroundSize: 'contain',
    backgroundColor: 'transparent',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: 'solid #eeeeee 1px',
    cursor: 'pointer',
  };
  class ToolButtonElement extends HTMLButtonElement {
    static get observedAttributes() {
      return ['size', 'icon'];
    }

    connectedCallback() {
      Object.assign(this.style, STYLE);

      this.addEventListener('mouseover', this.mouseOverHandle);
      this.addEventListener('mouseout', this.mouseOutHandle);
    }

    mouseOverHandle = () => {
      this.style.filter = 'brightness(0.75) contrast(150%)';
    };

    mouseOutHandle = () => {
      this.style.removeProperty('filter');
    };

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

  window.customElements.define('tool-button', ToolButtonElement, {
    extends: 'button',
  });
})();
