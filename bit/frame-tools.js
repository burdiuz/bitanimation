(() => {
  class FrameToolsElement extends HTMLElement {
    static get observedAttributes() {
      return ['is-last', 'is-first', 'index'];
    }

    constructor() {
      super();

      this._src = '';
      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `
      <style>
      :host {
        display: flex;
        align-items: stretch;
      }

      ::slotted(*) {
        width: 100%;
        height: 100%;
      }

      .tools-first,
      .tools-between,
      .tools-last {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .tools-first,
      .tools-last {
        flex: 0 0 90px;
      }

      .tools-between {
        flex: 0 0 65px;
        align-items: flex-start;
      }

      .none {
        display: none;
      }
    </style>
    <div class="tools-first none">
      <tool-button
        id="first-empty"
        size="75"
        icon="./icons/create_new.png"
        title="Create empty Frame"
      ></tool-button>
      <tool-button
        id="first-next"
        size="75"
        icon="./icons/copy_first_icon.png"
        title="Insert copy of previous Frame"
      ></tool-button>
    </div>
    <div class="tools-between">
      <tool-button
        id="between-previous"
        size="45"
        icon="./icons/insert_previous_icon.png"
        title="Insert copy of previous Frame"
      ></tool-button>
      <tool-button
        id="between-empty"
        size="45"
        icon="./icons/insert_empty_icon.png"
        title="Insert empty Frame"
      ></tool-button>
      <tool-button
      id="between-next"
        size="45"
        icon="./icons/insert_next_icon.png"
        title="Insert copy of next Frame"
      ></tool-button>
    </div>
    <slot></slot>
    <div slot="editor" class="tools-last none">
      <tool-button
      id="last-empty"
        size="75"
        icon="./icons/create_new.png"
        title="Add empty Frame"
      ></tool-button>
      <tool-button
        id="last-previous"
        size="75"
        icon="./icons/copy_last_icon.png"
        title="Copy last Frame"
      ></tool-button>
    </div>
    `;
    }

    connectedCallback() {
      this.root
        .querySelector('#first-empty')
        .addEventListener('click', this.createEmptyBeforeHandler);
      this.root
        .querySelector('#first-next')
        .addEventListener('click', this.copyThisBeforeHandler);
      this.root
        .querySelector('#between-previous')
        .addEventListener('click', this.copyPreviousBeforeHandler);
      this.root
        .querySelector('#between-empty')
        .addEventListener('click', this.createEmptyBeforeHandler);
      this.root
        .querySelector('#between-next')
        .addEventListener('click', this.copyThisBeforeHandler);
      this.root
        .querySelector('#last-empty')
        .addEventListener('click', this.createEmptyAfterHandler);
      this.root
        .querySelector('#last-previous')
        .addEventListener('click', this.copyThisAfterHandler);
    }

    disconnectedCallback() {
      this.root
        .querySelector('#first-empty')
        .removeEventListener('click', this.createEmptyBeforeHandler);
      this.root
        .querySelector('#first-next')
        .removeEventListener('click', this.copyThisBeforeHandler);
      this.root
        .querySelector('#between-previous')
        .removeEventListener('click', this.copyPreviousBeforeHandler);
      this.root
        .querySelector('#between-empty')
        .removeEventListener('click', this.createEmptyBeforeHandler);
      this.root
        .querySelector('#between-next')
        .removeEventListener('click', this.copyThisBeforeHandler);
      this.root
        .querySelector('#last-empty')
        .removeEventListener('click', this.createEmptyAfterHandler);
      this.root
        .querySelector('#last-previous')
        .removeEventListener('click', this.copyThisAfterHandler);
    }

    createEmptyBeforeHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('insertEmptyBefore', { detail: { index } })
      );
    };

    copyThisBeforeHandler = () => {
      const { index } = this;

      this.dispatchEvent(new CustomEvent('copyBefore', { detail: { index } }));
    };

    copyPreviousBeforeHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('copyAfter', { detail: { index: index - 1 } })
      );
    };

    createEmptyAfterHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('insertEmptyAfter', { detail: { index } })
      );
    };

    copyThisAfterHandler = () => {
      const { index } = this;

      this.dispatchEvent(new CustomEvent('copyAfter', { detail: { index } }));
    };

    attributeChangedCallback(name, _, value) {
      switch (name) {
        case 'is-first':
          if (value) {
            this.root.querySelector('.tools-first').classList.remove('none');
            this.root.querySelector('.tools-between').classList.add('none');
          } else {
            this.root.querySelector('.tools-first').classList.add('none');
            this.root.querySelector('.tools-between').classList.remove('none');
          }
          break;
        case 'is-last':
          if (value) {
            this.root.querySelector('.tools-last').classList.remove('none');
          } else {
            this.root.querySelector('.tools-last').classList.add('none');
          }
          break;
        case 'index':
          this[name] = Number.parseInt(value);
          break;
      }
    }
  }

  window.customElements.define('frame-tools', FrameToolsElement);
})();
