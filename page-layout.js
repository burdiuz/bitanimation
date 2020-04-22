(() => {
  const STYLE = `
:host, .grid {
  width: 100vw;
  height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: 50px auto;
  grid-template-areas:
    'tools player'
    'editor editor';
}

.grid.normal {
  grid-template-rows: 50% auto;
}

.grid.collapsed {
  grid-template-rows: 66% auto;
}

.grid.expanded {
  grid-template-rows: 33% auto;
}

.tools {
  grid-area: tools;
  border-right: solid 1px #ccc;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow-y: auto;
  align-items: center;
  padding-top: 10px;
}

::slotted(button[slot="tools"]) {
  margin-bottom: 10px;
}

::slotted(bit-player) {
  grid-area: player;
}

::slotted(bit-editor) {
  grid-area: editor;
  border-top: solid 1px #ccc;
}
`;

  class PageLayoutElement extends HTMLElement {
    static get observedAttributes() {
      return ['type'];
    }

    constructor() {
      super();

      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `<style>
      ${STYLE}
    </style>
    <div class="grid normal">
      <div class="tools">
        <slot name="tools"></slot>
      </div>
      <slot name="player"></slot>
      <slot name="editor"></slot>
    </div>`;
    }

    attributeChangedCallback(name, _, value) {
      switch (name) {
        case 'type':
          this.root.querySelector('div.grid').className = `grid ${value}`;
          break;
      }
    }
  }

  window.customElements.define('page-layout', PageLayoutElement);
})();
