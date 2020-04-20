const generateEmptyFrame = (width, height) => {
  const row = new Array(width);
  row.fill(0);

  return new Array(height)
    .fill(null)
    .map((_, index) => (index ? [...row] : row));
};

const copyFrameAt = (frames, index) => frames[index].map((row) => [...row]);

class BitFrames {
  constructor(callback = undefined) {
    this.frames = [];
    this.images = [];
    this.width = 8;
    this.height = 8;

    (async () => {
      const { BitRenderer } = await import('./renderer.js');
      this.renderer = new BitRenderer();
      this.renderer.setSize(this.width, this.height);

      if (callback) {
        callback(this);
      }
    })();
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
  }

  insertNewAt(index) {
    const frame = generateEmptyFrame(this.width, this.height);

    this.frames.splice(index, 0, frame);
    this.images.splice(index, 0, '');
    this.render(index);
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
  }

  copyAndAppend(index) {
    const frame = copyFrameAt(this.frames, index);

    this.frames.splice(index + 1, 0, frame);
    this.images.splice(index + 1, 0, '');

    this.render(index + 1);
  }

  render(index) {
    const source = this.renderer.drawToImageSrc(this.frames[index]);

    this.images[index] = source;

    return source;
  }

  drawBit(index, row, column) {
    this.frames[index][row][column] = Number(!this.frames[index][row][column]);

    return this.render(index);
  }

  drawBitByEvent({ detail: { index, column, row } }) {
    return this.drawBit(index, row, column);
  }

  slideToTop(index) {
    const frame = this.frames[index];
    const row = new Array(this.width);
    row.fill(0);

    frame.shift();
    frame.push(row);

    return this.render(index);
  }

  slideToLeft(index) {
    this.frames[index].forEach((row) => {
      row.shift();
      row.push(0);
    });

    return this.render(index);
  }

  slideToRight(index) {
    this.frames[index].forEach((row) => {
      row.pop();
      row.unshift(0);
    });

    return this.render(index);
  }

  slideToBottom(index) {
    const frame = this.frames[index];
    const row = new Array(this.width);
    row.fill(0);

    frame.pop();
    frame.unshift(row);

    return this.render(index);
  }

  slideByEvent({ detail: { index, direction } }) {
    switch (direction) {
      case 'top':
        this.slideTop(index);
        break;
      case 'right':
        this.slideToRight(index);
        break;
      case 'bottom':
        this.slideToBottom(index);
        break;
      case 'left':
        this.slideToLeft(index);
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
