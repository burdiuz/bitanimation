(() => {
  const STYLE = {
    webkitAppearance: 'none',
    border: 'solid #aaaaaa 1px',
    borderRadius: '5px',
    fontFamily: 'inherit',
    fontSize: '1em',
    padding: '5px 10px',
    margin: '5px',
    cursor: 'pointer',
  };

  class TextButtonElement extends HTMLButtonElement {
    connectedCallback() {
      Object.assign(this.style, STYLE);
    }
  }

  window.customElements.define('text-button', TextButtonElement, {
    extends: 'button',
  });
})();
