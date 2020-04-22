import { createToolButton } from '../utils.js';

const STYLE = `
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
}`;

export const FRAME_SHIFT_EVENT = 'frameShift';
export const INSERT_EMPTY_BEFORE_EVENT = 'insertEmptyBefore';
export const INSERT_EMPTY_AFTER_EVENT = 'insertEmptyAfter';
export const COPY_BEFORE_EVENT = 'copyBefore';
export const COPY_AFTER_EVENT = 'copyAfter';
export const REMOVE_EVENT = 'remove';

export const COMPONENT_NAME = 'frame-tools';

export class FrameToolsElement extends HTMLElement {
  static get observedAttributes() {
    return ['is-last', 'is-first', 'index'];
  }

  constructor() {
    super();

    this._src = '';
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.innerHTML = `
      <style>
      ${STYLE}
    </style>
    <div class="tools-first none"></div>
    <div class="tools-between"></div>
    <div class="frame">
      <slot></slot>
      <div class="frame-tools"></div>
    </div>
    <div slot="editor" class="tools-last none">
    </div>
    `;
  }

  createBigButton = (target, icon, title, handler) =>
    this.root
      .querySelector(target)
      .appendChild(createToolButton(icon, title, handler, '', 75));

  createNormalButton = (target, icon, title, handler) =>
    this.root
      .querySelector(target)
      .appendChild(createToolButton(icon, title, handler, '', 45));

  createSmallButton = (target, icon, title, handler) =>
    this.root
      .querySelector(target)
      .appendChild(createToolButton(icon, title, handler, '', 25));

  connectedCallback() {
    this.createBigButton(
      '.tools-first',
      'create_new.png',
      'Create empty Frame',
      this.createEmptyBeforeHandler
    );
    this.createBigButton(
      '.tools-first',
      'copy_first_icon.png',
      'Duplicate first Frame',
      this.copyThisBeforeHandler
    );

    this.createNormalButton(
      '.tools-between',
      'insert_previous_icon.png',
      'Insert copy of previous Frame',
      this.copyPreviousBeforeHandler
    );
    this.createNormalButton(
      '.tools-between',
      'insert_empty_icon.png',
      'Insert empty Frame',
      this.createEmptyBeforeHandler
    );
    this.createNormalButton(
      '.tools-between',
      'insert_next_icon.png',
      'Insert copy of next Frame',
      this.copyThisBeforeHandler
    );

    this.createBigButton(
      '.tools-last',
      'create_new.png',
      'Create empty Frame',
      this.createEmptyAfterHandler
    );
    this.createBigButton(
      '.tools-last',
      'copy_last_icon.png',
      'Duplicate last Frame',
      this.copyThisAfterHandler
    );

    const removeBtn = this.createSmallButton(
      '.frame-tools',
      'frame_remove_icon.png',
      'Remove this Frame',
      this.removeHandler
    );
    removeBtn.style.marginRight = 'auto';

    this.createSmallButton(
      '.frame-tools',
      'frame_shiftup_icon.png',
      'Shift one Row Up',
      this.shiftUpHandler
    );
    this.createSmallButton(
      '.frame-tools',
      'frame_shiftdown_icon.png',
      'Shift one Row Down',
      this.shiftDownHandler
    );
    this.createSmallButton(
      '.frame-tools',
      'frame_shiftleft_icon.png',
      'Shift one Column Left',
      this.shiftLeftHandler
    );
    this.createSmallButton(
      '.frame-tools',
      'frame_shiftright_icon.png',
      'Shift one Column Right',
      this.shiftRightHandler
    );
  }

  createEmptyBeforeHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(INSERT_EMPTY_BEFORE_EVENT, { detail: { index } })
    );
  };

  copyThisBeforeHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(COPY_BEFORE_EVENT, { detail: { index } })
    );
  };

  copyPreviousBeforeHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(COPY_AFTER_EVENT, { detail: { index: index - 1 } })
    );
  };

  createEmptyAfterHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(INSERT_EMPTY_AFTER_EVENT, { detail: { index } })
    );
  };

  copyThisAfterHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(COPY_AFTER_EVENT, { detail: { index } })
    );
  };

  removeHandler = () => {
    const { index } = this;

    this.dispatchEvent(new CustomEvent(REMOVE_EVENT, { detail: { index } }));
  };

  shiftUpHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(FRAME_SHIFT_EVENT, { detail: { index, direction: 'up' } })
    );
  };

  shiftDownHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(FRAME_SHIFT_EVENT, {
        detail: { index, direction: 'down' },
      })
    );
  };

  shiftLeftHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(FRAME_SHIFT_EVENT, {
        detail: { index, direction: 'left' },
      })
    );
  };

  shiftRightHandler = () => {
    const { index } = this;

    this.dispatchEvent(
      new CustomEvent(FRAME_SHIFT_EVENT, {
        detail: { index, direction: 'right' },
      })
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

window.customElements.define(COMPONENT_NAME, FrameToolsElement);
