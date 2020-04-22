const generateEmptyFrame = (width, height) => {
  const row = new Array(width);
  row.fill(0);

  return new Array(height)
    .fill(null)
    .map((_, index) => (index ? [...row] : row));
};

const copyFrameAt = (frames, index) => frames[index].map((row) => [...row]);

const colorToHTML = (value) => `#${value.toString(16).padStart(6, '0')}`;

class BitFrames {
  constructor(
    initCallback = () => null,
    frameChangeCallback = () => null,
    timelineChangeCallback = () => null
  ) {
    this.frames = [];
    this.images = [];
    this.width = 8;
    this.height = 8;
    this.frameChangeCallback = frameChangeCallback;
    this.timelineChangeCallback = timelineChangeCallback;

    (async () => {
      const { BitRenderer } = await import('./renderer.js');
      this.renderer = new BitRenderer();
      this.renderer.setSize(this.width, this.height);

      initCallback(this);
    })();
  }

  setSize(width, height) {
    if (this.width === width && this.height === height) {
      return;
    }

    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);

    this.frames.forEach((frame, index) => {
      const { length: rowsCount } = frame;

      frame.length = height;
      frame.fill(null, rowsCount);

      frame.forEach((row, index) => {
        if (row) {
          const { length: colsCount } = row;
          row.length = width;
          row.fill(0, colsCount);
        } else {
          row = new Array(width);
          row.fill(0);
          frame[index] = row;
        }
      });

      this.render(index);
    });
  }

  setHTMLColors(color, backgroundColor = undefined) {
    this.renderer.setColors(color, backgroundColor);

    this.frames.forEach((_, index) => this.render(index));
  }

  getHTMLColors() {
    const { color, backgroundColor } = this.renderer;

    return [color, backgroundColor];
  }

  setColors(color, backgroundColor) {
    this.setHTMLColors(colorToHTML(color), colorToHTML(backgroundColor));
  }

  getColors() {
    const { color, backgroundColor } = this.renderer;

    return [
      Number.parseInt(`0x${color.substr(1)}`, 16),
      Number.parseInt(`0x${backgroundColor.substr(1)}`, 16),
    ];
  }

  setFrames(frames = []) {
    this.frames = frames;
    this.images.length = frames.length;

    this.frames.forEach((_, index) => this.render(index));
  }

  insertNewAt(index) {
    const frame = generateEmptyFrame(this.width, this.height);

    this.frames.splice(index, 0, frame);
    this.images.splice(index, 0, '');
    this.render(index);
    this.timelineChangeCallback(this, index);
  }

  insertNewFirst() {
    this.insertNewAt(0);
  }

  insertNewLast() {
    this.insertNewAt(this.frames.length);
  }

  copyAndPrepend(index) {
    const frame = copyFrameAt(this.frames, index);

    this.frames.splice(index, 0, frame);
    this.images.splice(index, 0, '');

    this.render(index);
    this.timelineChangeCallback(this, index);
  }

  copyAndAppend(index) {
    const frame = copyFrameAt(this.frames, index);
    const next = index + 1;

    this.frames.splice(next, 0, frame);
    this.images.splice(next, 0, '');

    this.render(next);
    this.timelineChangeCallback(this, index);
  }

  removeAt(index) {
    this.frames.splice(index, 1);
    this.images.splice(index, 1);
    this.timelineChangeCallback(this, index);
  }

  render(index) {
    const source = this.renderer.drawToImageSrc(this.frames[index]);

    this.images[index] = source;

    this.frameChangeCallback(this, index);

    return source;
  }

  drawBit(index, row, column) {
    this.frames[index][row][column] = Number(!this.frames[index][row][column]);

    return this.render(index);
  }

  drawBitByEvent({ detail: { index, column, row } }) {
    return this.drawBit(index, row, column);
  }

  shiftUp(index) {
    const frame = this.frames[index];
    const row = new Array(this.width);
    row.fill(0);

    frame.shift();
    frame.push(row);

    return this.render(index);
  }

  shiftLeft(index) {
    this.frames[index].forEach((row) => {
      row.shift();
      row.push(0);
    });

    return this.render(index);
  }

  shiftRight(index) {
    this.frames[index].forEach((row) => {
      row.pop();
      row.unshift(0);
    });

    return this.render(index);
  }

  shiftDown(index) {
    const frame = this.frames[index];
    const row = new Array(this.width);
    row.fill(0);

    frame.pop();
    frame.unshift(row);

    return this.render(index);
  }

  shiftByEvent({ detail: { index, direction } }) {
    switch (direction) {
      case 'up':
        this.shiftUp(index);
        break;
      case 'right':
        this.shiftRight(index);
        break;
      case 'down':
        this.shiftDown(index);
        break;
      case 'left':
        this.shiftLeft(index);
        break;
    }

    return this.getRendered(index);
  }

  length() {
    return this.frames.length;
  }

  get(index) {
    return this.frames[index];
  }

  getAll() {
    return [...this.frames];
  }

  getRendered(index) {
    return this.images[index];
  }

  getRenderedAll() {
    return [...this.images];
  }
}
