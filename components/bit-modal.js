const STYLE = `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #00000099;
      z-index: 10;
    }

    :host, .modal, .header, .content, .footer {
      display: flex;
    }

    .modal, .content {
      flex-direction: column;
    }

    .header, .footer {
      align-items: center;
      padding: 0 10px;
      flex-basis: 40px;
    }

    .modal {
      min-width: 320px;
      background-color: #ffffff;
      margin: auto;
      border: solid #666666 1px;
      border-radius: 10px;
    }

    .header {
      border-bottom: solid #eeeeee 1px;
    }

    .content {
      align-items: stretch;
      flex: 1 0 40px;
      padding: 10px;
    }

    .footer {
      justify-content: flex-end;
      border-top: solid #eeeeee 1px;
    }`;

export const COMPONENT_NAME = 'bit-modal';

export class ModalElement extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'closed' });
    this.root.innerHTML = `<style>
            ${STYLE}
          </style>
          <div class="modal">
            <div class="header">
              <slot name="header"></slot>
            </div>
            <div class="content">
              <slot name="content"></slot>
            </div>
            <div class="footer">
              <slot name="footer"></slot>
            </div>
          </div>`;
  }

  close() {
    this.remove();
  }

  connectedCallback() {
    this.root
      .querySelector('.modal')
      .addEventListener('click', this.modalClickHandle);

    this.addEventListener('click', this.backdropClickHandle);
  }

  modalClickHandle = (event) => {
    event.stopPropagation();
  };

  backdropClickHandle = () => this.close();
}

window.customElements.define(COMPONENT_NAME, ModalElement);
