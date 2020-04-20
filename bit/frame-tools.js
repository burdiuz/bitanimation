(() => {
  class FrameToolsElement extends HTMLElement {
    static get observedAttributes() {
      return ['isLast', 'isFirst'];
    }

    constructor() {
      super();

      this._src = '';
      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `<style>
      :host {
        display: flex;
        align-items: stretch;
      }

      ::slotted(*) {
        width: 100%;
        height: 100%;
      }

        .before, .after {
          display: flex;
          flex-direction: column;
        }
      </style>
        <div class="before">
          <div class="tools-first">
            <tool-button size="75" icon="./icons/create_new.png"></tool-button>
            <tool-button size="75" icon="./icons/copy_first_icon.png"></tool-button>
          </div>
          <div class="tools-between">
            <tool-button
              size="45"
              icon="./icons/insert_previous_icon.png"
            ></tool-button>
            <tool-button
              size="45"
              icon="./icons/insert_empty_icon.png"
            ></tool-button>
            <tool-button
              size="45"
              icon="./icons/insert_next_icon.png"
            ></tool-button>
          </div>
        </div>
        <slot></slot>
        <div class="after">
          <div slot="editor" class="frame-tools">
            <tool-button size="75" icon="./icons/create_new.png"></tool-button>
            <tool-button size="75" icon="./icons/copy_last_icon.png"></tool-button>
          </div>
        </div>`;
    }
  }

  window.customElements.define('frame-tools', FrameToolsElement);
})();
