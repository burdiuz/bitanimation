import './components/tool-button.js';

import { BitFrames } from './bit-frames.js';
import { loadStateFromURL, saveStateToURL } from './url.js';
import { nextTick } from './utils.js';
import { initializeTools } from './tools.js';

import { COMPONENT_NAME as EDITOR_COMPONENT_NAME } from './components/bit-editor.js';
import { COMPONENT_NAME as PLAYER_COMPONENT_NAME } from './components/bit-player.js';
import { COMPONENT_NAME as LAYOUT_COMPONENT_NAME } from './components/page-layout.js';

document.body.appendChild(
  document.querySelector('#page-layout-tpl').content.cloneNode(true)
);

window.addEventListener('popstate', () => {
  loadStateFromURL(frames);

  document.querySelector(EDITOR_COMPONENT_NAME).validateChildren();
});

const renderFrames = nextTick(() => {
  saveStateToURL(frames);

  document.querySelector(PLAYER_COMPONENT_NAME).sources = frames.getRenderedAll();
});

const frames = new BitFrames(
  (frames) => {
    frames.insertNewFirst();
    loadStateFromURL(frames);

    document.querySelector(EDITOR_COMPONENT_NAME).frames = frames;
  },
  renderFrames,
  renderFrames
);

initializeTools(document.querySelector(LAYOUT_COMPONENT_NAME), frames);
