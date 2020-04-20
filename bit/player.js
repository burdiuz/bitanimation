(() => {
  class BitPlayerElement extends HTMLElement {
    static get observedAttributes() {
      return ['speed'];
    }

    constructor() {
      super();

      this._sources = [];
      this._speed = 100;
      this._currentFrame = 0;
      this._intervalId = 0;
      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `
      <style>
      :host {
        display: flex;
        padding: 15%;
        align-items: center;
        justify-content: center;
        padding: 5%;
      }

      img {
        height: 100%;
      }
      </style>`;
    }

    get sources() {
      return this._sources;
    }

    set sources(value) {
      this._sources = value;
      this.validateImages();
    }

    get speed() {
      return this._speed;
    }

    set speed(value) {
      this._speed = value;
      this.animate();
    }

    validateImages() {
      const images = this.root.querySelectorAll('img');

      this._sources.forEach((src, index) => {
        let image = images[index];

        if (image && image.src !== src) {
          image.src = src;
        } else if (!image) {
          image = new Image();
          image.src = src;
          image.style.display = 'none';
          this.root.appendChild(image);
        }

        image.id = `image-${index}`;
      });
    }

    connectedCallback() {
      this.animate();
    }

    disconnectedCallback() {
      this.stop();
    }

    animate() {
      this.stop();

      this._intervalId = setInterval(() => this.nextFrame(), this._speed);
    }

    nextFrame() {
      let image = this.root.querySelector(`#image-${this._currentFrame}`);

      if (image) {
        image.style.display = 'none';
      }

      this._currentFrame = this._currentFrame + 1;

      if (this._currentFrame >= this._sources.length) {
        this._currentFrame = 0;
      }

      window.requestAnimationFrame(() => {
        image = this.root.querySelector(`#image-${this._currentFrame}`);

        if (image) {
          image.style.display = 'block';
        }
      });

      this.dispatchEvent(
        new CustomEvent('frame', { detail: { index: this._currentFrame } })
      );
    }

    stop() {
      if (this._intervalId) {
        clearInterval(this._intervalId);
      }

      this._intervalId = 0;
    }
  }

  window.customElements.define('bit-player', BitPlayerElement);
})();
