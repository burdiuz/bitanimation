(() => {
  const BIT_SWITCH_EVENT = 'bitSwitch';

  const STYLE = `
  bit-frame, .grid {
    width: 100%;
    height: 100%;
  }

  .grid {
  display: grid;
  border: solid #aaaaaa 1px;
}

.hover, .column, .row {
  pointer-events: none;
}

.hover {
  display: none;
  border: dashed #0f0 3px;
}

.column {
  border-right: solid #aaaaaa 1px;
}

.row {
  border-bottom: solid #aaaaaa 1px;
}`;

  class BitFrameEditorElement extends HTMLElement {
    static get observedAttributes() {
      return ['src', 'width', 'height', 'index'];
    }

    constructor() {
      super();

      this._width = 1;
      this._height = 1;
      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `<style>
    ${STYLE}
    </style>
    <bit-frame>
      <div class="grid">
        <div class="hover"></div>
      </div>
    </bit-frame>`;
    }

    get frameElement() {
      return this.root.querySelector('bit-frame');
    }

    get gridElement() {
      return this.root.querySelector('.grid');
    }

    get hoverElement() {
      return this.root.querySelector('.hover');
    }

    get width() {
      return this._width;
    }

    set width(value) {
      this._width = value;
      this.frameElement.width = value;
      this.gridElement.style.gridTemplateColumns = `repeat(${value}, 1fr)`;

      this.generateGridElements('column', value, (column, index) => {
        column.style.gridColumn = index;
        column.style.gridRowStart = 1;
        column.style.gridRowEnd = -1;
      });
    }

    get height() {
      return this._height;
    }

    set height(value) {
      this._height = value;
      this.frameElement.height = value;
      this.gridElement.style.gridTemplateRows = `repeat(${value}, 1fr)`;

      this.generateGridElements('row', value, (column, index) => {
        column.style.gridRow = index;
        column.style.gridColumnStart = 1;
        column.style.gridColumnEnd = -1;
      });
    }

    get src() {
      return this.frameElement.src;
    }

    set src(value) {
      this.frameElement.src = value;
    }

    connectedCallback() {
      this.addEventListener('mouseenter', this.mouseEnterHandler);
      this.addEventListener('mouseleave', this.mouseLeaveHandler);
      this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
      this.removeEventListener('mouseenter', this.mouseEnterHandler);
      this.removeEventListener('mouseleave', this.mouseLeaveHandler);
      this.removeEventListener('mousemove', this.mouseMoveHandler);
      this.removeEventListener('click', this.clickHandler);
    }

    attributeChangedCallback(name, _, newValue) {
      switch (name) {
        case 'src':
        case 'index':
          this[name] = newValue;
          break;
        case 'width':
        case 'height':
          this[name] = Number.parseInt(newValue);
          break;
      }
    }

    generateGridElements(className, count, callback) {
      this.gridElement
        .querySelectorAll(`.${className}`)
        .forEach((node) => node.remove());

      for (let index = 1; index < count; index++) {
        const node = document.createElement('div');
        node.className = className;
        callback(node, index);
        this.gridElement.prepend(node);
      }
    }

    getEventPosition({ offsetX, offsetY }) {
      const { gridElement } = this;
      const { width, height } = gridElement.getBoundingClientRect();

      return {
        column: (this._width * (offsetX / width)) | 0,
        row: (this._height * (offsetY / height)) | 0,
      };
    }

    mouseEnterHandler = () => {
      this.root.querySelector('.hover').style.display = 'block';
      this.addEventListener('mousemove', this.mouseMoveHandler);
    };
    mouseLeaveHandler = () => {
      this.root.querySelector('.hover').style.display = 'none';
      this.removeEventListener('mousemove', this.mouseMoveHandler);
    };

    mouseMoveHandler = (event) => {
      const { hoverElement } = this;
      const { column, row } = this.getEventPosition(event);

      hoverElement.style.gridColumn = column + 1;
      hoverElement.style.gridRow = row + 1;
    };

    clickHandler = (event) => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent(BIT_SWITCH_EVENT, {
          detail: { index, ...this.getEventPosition(event) },
        })
      );
    };
  }

  window.customElements.define('bit-frame-editor', BitFrameEditorElement);
})();
