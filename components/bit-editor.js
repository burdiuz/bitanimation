import {
  COMPONENT_NAME as FRAMEEDITOR_COMPONENT_NAME,
  BIT_SWITCH_EVENT,
} from './bit-frame-editor.js';
import {
  COMPONENT_NAME as FRAMETOOLS_COMPONENT_NAME,
  FRAME_SHIFT_EVENT,
  INSERT_EMPTY_BEFORE_EVENT,
  INSERT_EMPTY_AFTER_EVENT,
  COPY_BEFORE_EVENT,
  COPY_AFTER_EVENT,
  REMOVE_EVENT,
} from './frame-tools.js';

const STYLE = `
:host {
  overflow-x: auto;
  overflow-y: hidden;
}

.frames {
  height: 100%;
  display: flex;
  align-items: stretch;
  flex-wrap: no-wrap;
}

.frames::after {
  width: 50px;
}

.spacer {
  flex: 0 0 100vw;
}

frame-tools {
  flex-grow: 0;
  flex-shrink: 0;
  margin: 20px;
}
`;

export const COMPONENT_NAME = 'bit-editor';

export class BitEditorElement extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'icon'];
  }

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'closed' });
    const style = document.createElement('style');
    style.textContent = STYLE;

    this.containerNode = document.createElement('div');
    this.spacerNode = document.createElement('div');
    this.containerNode.className = 'frames';
    this.spacerNode.className = 'spacer';

    this.root.appendChild(style);
    this.root.appendChild(this.containerNode);
    this.containerNode.appendChild(this.spacerNode);
  }

  get frames() {
    return this._frames;
  }

  set frames(value) {
    this._frames = value;

    if (this.isConnected) {
      this.validateChildren();
    }
  }

  validateChildren() {
    const children = this.containerNode.querySelectorAll(
      FRAMETOOLS_COMPONENT_NAME
    );
    const length = Math.max(this._frames.length(), children.length);

    for (let index = 0; index < length; index++) {
      if (children.length > index) {
        const toolsNode = children[index];
        const frameNode = toolsNode.querySelector(FRAMEEDITOR_COMPONENT_NAME);

        if (this._frames.length() > index) {
          this.configureTools(toolsNode, index);
          this.configureFrame(frameNode, index);
        } else {
          this.destroyChild(toolsNode, frameNode);
        }
      } else {
        const [toolsNode, frameNode] = this.createChild();

        this.configureTools(toolsNode, index);
        this.configureFrame(frameNode, index);
      }
    }

    this.containerNode.appendChild(this.spacerNode);
  }

  createChild() {
    const frameNode = document.createElement(FRAMEEDITOR_COMPONENT_NAME);
    const toolsNode = document.createElement(FRAMETOOLS_COMPONENT_NAME);

    toolsNode.appendChild(frameNode);
    this.containerNode.appendChild(toolsNode);

    frameNode.addEventListener(BIT_SWITCH_EVENT, this.bitSwitchHandle);
    toolsNode.addEventListener(FRAME_SHIFT_EVENT, this.frameShiftHandle);
    toolsNode.addEventListener(
      INSERT_EMPTY_BEFORE_EVENT,
      this.insertEmptyBeforeHandle
    );

    toolsNode.addEventListener(INSERT_EMPTY_AFTER_EVENT, this.insertEmptyAfterHandle);
    toolsNode.addEventListener(COPY_BEFORE_EVENT, this.copyBeforeHandle);
    toolsNode.addEventListener(COPY_AFTER_EVENT, this.copyAfterHandle);
    toolsNode.addEventListener(REMOVE_EVENT, this.frameRemoveHandle);

    return [toolsNode, frameNode];
  }

  destroyChild(toolsNode, frameNode) {
    frameNode.removeEventListener(BIT_SWITCH_EVENT, this.bitSwitchHandle);
    toolsNode.removeEventListener(FRAME_SHIFT_EVENT, this.frameShiftHandle);
    toolsNode.removeEventListener(
      INSERT_EMPTY_BEFORE_EVENT,
      this.insertEmptyBeforeHandle
    );
    toolsNode.removeEventListener(
      INSERT_EMPTY_AFTER_EVENT,
      this.insertEmptyAfterHandle
    );
    toolsNode.removeEventListener(COPY_BEFORE_EVENT, this.copyBeforeHandle);
    toolsNode.removeEventListener(COPY_AFTER_EVENT, this.copyAfterHandle);
    toolsNode.removeEventListener(REMOVE_EVENT, this.frameRemoveHandle);

    toolsNode.remove();
  }

  configureFrame(frameNode, index) {
    const { width, height } = this._frames;

    frameNode.setAttribute('width', width);
    frameNode.setAttribute('height', height);
    frameNode.setAttribute('index', index);
    frameNode.setAttribute('src', this._frames.getRendered(index));
  }

  configureTools(toolsNode, index) {
    toolsNode.setAttribute('index', index);
    if (index === 0) {
      toolsNode.setAttribute('is-first', true);
    } else {
      toolsNode.removeAttribute('is-first');
    }

    if (index === this._frames.length() - 1) {
      toolsNode.setAttribute('is-last', true);
    } else {
      toolsNode.removeAttribute('is-last');
    }
  }

  async connectedCallback() {
    if (this._frames) {
      this.validateChildren();
    }

    this.containerNode.focus();
  }

  disconnectedCallback() {}

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

  bitSwitchHandle = (event) => {
    event.target.src = this.frames.drawBitByEvent(event);
  };

  frameShiftHandle = (event) => {
    event.target.querySelector(
      FRAMEEDITOR_COMPONENT_NAME
    ).src = this.frames.shiftByEvent(event);
  };

  insertEmptyBeforeHandle = ({ detail: { index } }) => {
    this.frames.insertNewAt(index);
    this.validateChildren();
  };

  insertEmptyAfterHandle = ({ detail: { index } }) => {
    this.frames.insertNewAt(index + 1);
    this.validateChildren();
  };

  copyBeforeHandle = ({ detail: { index } }) => {
    this.frames.copyAndPrepend(index);
    this.validateChildren();
  };

  copyAfterHandle = ({ detail: { index } }) => {
    this.frames.copyAndAppend(index);
    this.validateChildren();
  };

  frameRemoveHandle = ({ detail: { index } }) => {
    this.frames.removeAt(index);

    if (!this.frames.length()) {
      this.frames.insertNewFirst();
    }

    this.validateChildren();
  };
}

window.customElements.define(COMPONENT_NAME, BitEditorElement);
