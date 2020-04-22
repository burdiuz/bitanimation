import '../components/tool-button.js';

import { BitFrames } from '../bit-frames.js';
import { loadStateFromURL } from '../url.js';
import { nextTick, createToolButton } from '../utils.js';

import { COMPONENT_NAME as PLAYER_COMPONENT_NAME } from '../components/bit-player.js';

const navigateToEditor = () => {
  const state = new URLSearchParams(window.location.search).get('a');

  window.location.href = `../?a=${encodeURIComponent(state)}`;
};

document
  .querySelector('.container')
  .appendChild(document.createElement(PLAYER_COMPONENT_NAME));

document.body.appendChild(
  createToolButton(
    '../icons/edit_timeline_icon.png',
    'Open Editor to customize Animation',
    navigateToEditor,
    '',
    30
  )
);

const renderFrames = nextTick(() => {
  document.querySelector(
    PLAYER_COMPONENT_NAME
  ).sources = frames.getRenderedAll();
});

const frames = new BitFrames(
  loadStateFromURL,
  renderFrames,
  renderFrames
);
