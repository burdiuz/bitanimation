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
      .tools-first > button,
      .tools-between > button,
      .tools-last > button {
        margin-bottom: 10px;
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

      .frame {
        display: flex;
        flex-direction: column;
      }

      .frame-tools {
        margin-top: 5px;
        flex: 0 0 25px;
        display: flex;
        align-items: center;
      }

      .frame-tools > button:not(:first-child) {
        margin-left: 10px;
      }
    </style>
    <div class="tools-first none">
      <button is="tool-button"
        id="first-empty"
        size="75"
        icon="./icons/create_new.png"
        title="Create empty Frame"
      ></button>
      <button is="tool-button"
        id="first-next"
        size="75"
        icon="./icons/copy_first_icon.png"
        title="Insert copy of previous Frame"
      ></button>
    </div>
    <div class="tools-between">
      <button is="tool-button"
        id="between-previous"
        size="45"
        icon="./icons/insert_previous_icon.png"
        title="Insert copy of previous Frame"
      ></button>
      <button is="tool-button"
        id="between-empty"
        size="45"
        icon="./icons/insert_empty_icon.png"
        title="Insert empty Frame"
      ></button>
      <button is="tool-button"
      id="between-next"
        size="45"
        icon="./icons/insert_next_icon.png"
        title="Insert copy of next Frame"
      ></button>
    </div>
    <div class="frame">
      <slot></slot>
      <div class="frame-tools">
        <button is="tool-button"
          id="remove"
          size="25"
          icon="./icons/frame_remove_icon.png"
          title="Remove this Frame"
          style="margin-right: auto;"
        ></button>
        <button is="tool-button"
          id="shift-up"
          size="25"
          icon="./icons/frame_shiftup_icon.png"
          title="Shift one Row Up"
        ></button>
        <button is="tool-button"
          id="shift-down"
          size="25"
          icon="./icons/frame_shiftdown_icon.png"
          title="Shift one Row Down"
        ></button>
        <button is="tool-button"
          id="shift-left"
          size="25"
          icon="./icons/frame_shiftleft_icon.png"
          title="Shift one Column Left"
        ></button>
        <button is="tool-button"
          id="shift-right"
          size="25"
          icon="./icons/frame_shiftright_icon.png"
          title="Shift one Column Right"
        ></button>
      </div>
    </div>
    <div slot="editor" class="tools-last none">
      <button is="tool-button"
      id="last-empty"
        size="75"
        icon="./icons/create_new.png"
        title="Add empty Frame"
      ></button>
      <button is="tool-button"
        id="last-previous"
        size="75"
        icon="./icons/copy_last_icon.png"
        title="Copy last Frame"
      ></button>
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

        this.root
          .querySelector('#remove')
          .addEventListener('click', this.removeHandler);

        this.root
          .querySelector('#shift-up')
          .addEventListener('click', this.shiftUpHandler);
        this.root
          .querySelector('#shift-down')
          .addEventListener('click', this.shiftDownHandler);
        this.root
          .querySelector('#shift-left')
          .addEventListener('click', this.shiftLeftHandler);
        this.root
          .querySelector('#shift-right')
          .addEventListener('click', this.shiftRightHandler);
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

      this.root
        .querySelector('#remove')
        .removeEventListener('click', this.removeHandler);

      this.root
        .querySelector('#shift-up')
        .removeEventListener('click', this.shiftUpHandler);
      this.root
        .querySelector('#shift-down')
        .removeEventListener('click', this.shiftDownHandler);
      this.root
        .querySelector('#shift-left')
        .removeEventListener('click', this.shiftLeftHandler);
      this.root
        .querySelector('#shift-right')
        .removeEventListener('click', this.shiftRightHandler);
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

    removeHandler = () => {
      const { index } = this;

      this.dispatchEvent(new CustomEvent('remove', { detail: { index } }));
    };

    shiftUpHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('frameShift', { detail: { index, direction: 'up' } })
      );
    };

    shiftDownHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('frameShift', { detail: { index, direction: 'down' } })
      );
    };

    shiftLeftHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('frameShift', { detail: { index, direction: 'left' } })
      );
    };

    shiftRightHandler = () => {
      const { index } = this;

      this.dispatchEvent(
        new CustomEvent('frameShift', { detail: { index, direction: 'right' } })
      );
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
