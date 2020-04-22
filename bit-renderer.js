export const BIT_WIDTH = 25;
export const BIT_HEIGHT = 25;

export class BitRenderer {
  constructor(bitWidth = BIT_WIDTH, bitHeight = BIT_HEIGHT) {
    this.width = 0;
    this.height = 0;
    this.bitWidth = bitWidth;
    this.bitHeight = bitHeight;
    this.backgroundColor = '#ffffff';
    this.color = '#000000';

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  async setSize(width, height) {
    if (this.width === width && this.height === height) {
      return;
    }

    this.width = width;
    this.height = height;

    this.canvas.width = width * this.bitWidth;
    this.canvas.height = height * this.bitHeight;

    await Promise.resolve();
  }

  setColors(foreground, background = '#ffffff') {
    this.color = foreground;
    this.backgroundColor = background;
  }

  clear() {
    const { context } = this;

    context.fillStyle = this.backgroundColor;
    context.fillRect(
      0,
      0,
      this.width * this.bitWidth,
      this.height * this.bitHeight
    );
  }

  draw(rows) {
    this.clear();

    if (!rows) {
      return;
    }

    const { context, bitWidth, bitHeight } = this;

    context.fillStyle = this.color;

    rows.forEach((row, rowIndex) =>
      row.forEach((value, colIndex) => {
        if (!value) {
          return;
        }

        context.fillRect(
          colIndex * bitHeight,
          rowIndex * bitWidth,
          bitWidth,
          bitHeight
        );
      })
    );
  }

  drawToImageSrc(rows, imageType = 'image/png') {
    this.draw(rows);

    return this.canvas.toDataURL(imageType);
  }

  drawToImage(rows, imageType = undefined) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = this.drawToImageSrc(rows, imageType);
    });
  }
}
