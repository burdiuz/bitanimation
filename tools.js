import { BitRenderer } from './bit-renderer.js';
import { debounce, createToolButton } from './utils.js';
import { saveStateToURL } from './url.js';

import './components/color-select.js';
import './components/text-button.js';
import { COMPONENT_NAME as MODAL_COMPONENT_NAME } from './components/bit-modal.js';
import { COMPONENT_NAME as EDITOR_COMPONENT_NAME } from './components/bit-editor.js';
import { COMPONENT_NAME as PLAYER_COMPONENT_NAME } from './components/bit-player.js';
import { COMPONENT_NAME as LAYOUT_COMPONENT_NAME } from './components/page-layout.js';

const setLayoutType = (type) => {
  document.querySelector(LAYOUT_COMPONENT_NAME).setAttribute('type', type);
};

const navigateToPlay = () => {
  const state = new URLSearchParams(window.location.search).get('a');

  window.location.href = `./play/?a=${encodeURIComponent(state)}`;
};

const renderGIFFrames = async (frames, pixelate = false) => {
  let renderer;

  if (pixelate) {
    renderer = new BitRenderer(1, 1);
  } else {
    renderer = new BitRenderer();
  }

  renderer.setColors(...frames.getHTMLColors());
  await renderer.setSize(frames.width, frames.height);

  return Promise.all(
    frames.getAll().map((frame) => renderer.drawToImage(frame))
  );
};

const generateGIF = (frames, pixelate = false) =>
  renderGIFFrames(frames, pixelate).then((images) => {
    const { speed: delay } = document.querySelector(PLAYER_COMPONENT_NAME);
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: './libs/gif.worker.js',
    });

    images.forEach((image) => {
      gif.addFrame(image, { delay });
    });

    return new Promise((resolve) => {
      gif.on('finished', (blob) => {
        resolve(URL.createObjectURL(blob));
      });

      gif.render();
    });
  });

const openDownloadModal = (frames) => {
  const modal = document.createElement(MODAL_COMPONENT_NAME);
  const content = document.head
    .querySelector('#modal-download-tpl')
    .content.cloneNode(true);

  const displayGIF = (() => {
    const image = content.querySelector('.gif-animation');
    const link = content.querySelector('.download-link');

    return async (pixelated) => {
      const gifURL = await generateGIF(frames, pixelated);
      image.src = gifURL;
      link.href = gifURL;
    };
  })();

  content
    .querySelector('#pixelate')
    .addEventListener('change', ({ target: { checked } }) =>
      displayGIF(checked)
    );

  content
    .querySelector('.close-button')
    .addEventListener('click', () => modal.close());

  modal.appendChild(content);
  displayGIF();

  document.body.appendChild(modal);
};

const openColorsModal = (frames) => {
  let [color, backgroundColor] = frames.getHTMLColors();
  const modal = document.createElement(MODAL_COMPONENT_NAME);
  const content = document.head
    .querySelector('#modal-colors-tpl')
    .content.cloneNode(true);

  const select = content.querySelector('.color-select');
  select.setAttribute('value', color);
  select.addEventListener('change', ({ detail: { value } }) => {
    color = value;
  });

  const bgselect = content.querySelector('.bgcolor-select');
  bgselect.setAttribute('value', backgroundColor);
  bgselect.addEventListener('change', ({ detail: { value } }) => {
    backgroundColor = value;
  });

  content.querySelector('.save-button').addEventListener('click', () => {
    frames.setHTMLColors(color, backgroundColor);
    document.querySelector(EDITOR_COMPONENT_NAME).validateChildren();
    modal.close();
  });

  content
    .querySelector('.cancel-button')
    .addEventListener('click', () => modal.close());

  modal.appendChild(content);

  document.body.appendChild(modal);
};

const openSpeedModal = (frames) => {
  const player = document.querySelector(PLAYER_COMPONENT_NAME);
  const modal = document.createElement(MODAL_COMPONENT_NAME);
  const content = document.head
    .querySelector('#modal-speed-tpl')
    .content.cloneNode(true);

  document.querySelector(PLAYER_COMPONENT_NAME);

  content
    .querySelector('.close-button')
    .addEventListener('click', () => modal.close());

  const range = content.querySelector('input[type="range"]');
  range.value = 1000 - player.speed;

  range.addEventListener(
    'change',
    debounce(({ target: { value } }) => {
      player.speed = 1000 - value;
      saveStateToURL(frames);
    }, 200)
  );

  modal.appendChild(content);

  document.body.appendChild(modal);
};

export const openSizeModal = (frames) => {
  let { width, height } = frames;

  const modal = document.createElement(MODAL_COMPONENT_NAME);
  const content = document.head
    .querySelector('#modal-size-tpl')
    .content.cloneNode(true);

  const wslider = content.querySelector('.width > input');
  const wlabel = content.querySelector('.width > div');
  const changeWidth = ({ target: { value } }) => {
    width = value;
    wlabel.innerText = value;
  };

  wslider.value = width;
  wslider.addEventListener('input', changeWidth);
  wslider.addEventListener('change', changeWidth);
  changeWidth({ target: { value: width } });

  const hslider = content.querySelector('.height > input');
  const hlabel = content.querySelector('.height > div');
  const changeHeight = ({ target: { value } }) => {
    height = value;
    hlabel.innerText = value;
  };

  hslider.value = height;
  hslider.addEventListener('input', changeHeight);
  hslider.addEventListener('change', changeHeight);
  changeHeight({ target: { value: height } });

  content.querySelector('.save-button').addEventListener('click', () => {
    frames.setSize(width, height);
    document.querySelector(EDITOR_COMPONENT_NAME).validateChildren();
    modal.close();
  });

  content
    .querySelector('.cancel-button')
    .addEventListener('click', () => modal.close());

  modal.appendChild(content);

  document.body.appendChild(modal);
};

const initializeTool = (target) => (icon, title, handler) =>
  target.appendChild(createToolButton(icon, title, handler, 'tools', 30));

export const initializeTools = (target, frames) => {
  const add = initializeTool(target);

  add('play_icon.png', 'Open Animation in new Player', navigateToPlay);

  add('export_gif_icon.png', 'Export Animation as GIF file', () =>
    openDownloadModal(frames)
  );

  add('frame_colors_icon.png', 'Change Animation Colors', () =>
    openColorsModal(frames)
  );

  add('animation_speed_icon.png', 'Change Animation Speed', () =>
    openSpeedModal(frames)
  );

  add('frame_size_icon.png', 'Change Animation Size', () =>
    openSizeModal(frames)
  );

  const spacer = document.createElement('div');

  spacer.setAttribute('slot', 'tools');
  spacer.style.flex = '1';

  target.appendChild(spacer);

  add(
    'editor_collapse_icon.png',
    'Collapse Editor to give more space for Player',
    () => setLayoutType('collapsed')
  );

  add('editor_normal_icon.png', 'Make Editor and Player size even', () =>
    setLayoutType('normal')
  );

  add('editor_expand_icon.png', 'Expand Editor to give more space for it', () =>
    setLayoutType('expanded')
  );
};
