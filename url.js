import { COMPONENT_NAME as PLAYER_COMPONENT_NAME } from './components/bit-player.js';

const {
  Schema,
  types: { ObjectType, ArrayType, IntType },
} = MultibyteStream;

let currentStateStr = '';

const stateSchema = new Schema(
  ObjectType.getInstance({
    // force version to be first value in stream
    $version: new IntType(false, 4),
    width: new IntType(false, 6),
    height: new IntType(false, 6),
    color: new IntType(false),
    backgroundColor: new IntType(false),
    speed: new IntType(false, 10),
    sourceList: new ArrayType(
      new ArrayType(new ArrayType(new IntType(false, 1)))
    ),
  })
);

export const saveStateToURL = (frames) => {
  const [color, backgroundColor] = frames.getColors();
  const speed = document.querySelector(PLAYER_COMPONENT_NAME).speed;

  const state = {
    $version: 0,
    width: frames.width,
    height: frames.height,
    color,
    backgroundColor,
    speed,
    sourceList: frames.getAll(),
  };

  const stateStr = stateSchema.saveBase64From(state);

  if (stateStr === currentStateStr) {
    return;
  }

  currentStateStr = stateStr;

  window.history.pushState(
    Date.now(),
    '',
    `${window.location.pathname}?a=${encodeURIComponent(currentStateStr)}`
  );
};

export const loadStateFromURL = (frames) => {
  const state = new URLSearchParams(window.location.search).get('a');

  if (!state || state === currentStateStr) {
    return;
  }

  currentStateStr = state;

  const {
    width,
    height,
    color,
    backgroundColor,
    speed,
    sourceList,
  } = stateSchema.loadBase64To(state);

  frames.setFrames([]);
  frames.setSize(width, height);
  frames.setColors(color, backgroundColor);
  frames.setFrames(sourceList);
  document.querySelector(PLAYER_COMPONENT_NAME).speed = speed;
};
