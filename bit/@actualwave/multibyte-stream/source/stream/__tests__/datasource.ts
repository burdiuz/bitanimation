import { TypedArray } from './../../types';
import { DataSource } from '../datasource';

describe('DataSource', () => {
  let data: TypedArray;
  let source: DataSource;

  beforeEach(() => {
    data = Uint8Array.from([0b10111011, 0b00100010]);
    source = new DataSource(data);
  });

  describe('#getPosition()', () => {
    it('should return current position', () => {
      expect(source.getPosition()).toBe(0);
    });
  });

  describe('#setPosition()', () => {
    it('should set current position', () => {
      source.setPosition(1);
      expect(source.getPosition()).toBe(1);
      expect(source.getCurrentFrame()).toBe(0b00100010);
      source.setPosition(0);
      expect(source.getPosition()).toBe(0);
      expect(source.getCurrentFrame()).toBe(0b10111011);
    });
  });

  describe('#getFrameSize()', () => {
    it('should return frame size', () => {
      expect(source.getFrameSize()).toBe(8);
    });
  });

  describe('#getCurrentFrame()', () => {
    it('should return current frame value', () => {
      expect(source.getCurrentFrame()).toBe(0b10111011);
    });
  });

  describe('#setCurrentFrame()', () => {
    it('should setvalue for current position', () => {
      source.setCurrentFrame(0b11000011);

      expect(source.getCurrentFrame()).toBe(0b11000011);
    });
  });

  describe('#nextFrame()', () => {
    it('should change position to next frame', () => {
      source.nextFrame();
      expect(source.getPosition()).toBe(1);
      expect(source.getCurrentFrame()).toBe(0b00100010);
    });
  });

  describe('#previousFrame()', () => {
    beforeEach(() => {
      source.setPosition(1);
      expect(source.getPosition()).toBe(1);
    });

    it('should change position to previous frame', () => {
      source.previousFrame();

      expect(source.getPosition()).toBe(0);
      expect(source.getCurrentFrame()).toBe(0b10111011);
    });
  });

  describe('#isLastFrame()', () => {
    it('should return false', () => {
      expect(source.isLastFrame()).toBe(false);
      source.nextFrame();
      expect(source.isLastFrame()).toBe(true);
    });
  });

  describe('#getFrame()', () => {
    it('should return frame value by index', () => {
      expect(source.getFrame(0)).toBe(0b10111011);
      expect(source.getFrame(1)).toBe(0b00100010);
    });
  });

  describe('#setFrame()', () => {
    it('should set frame value by index', () => {
      source.setFrame(3, 0);
      expect(source.getFrame(0)).toBe(3);
      source.setFrame(127, 1);
      expect(source.getFrame(1)).toBe(0b01111111);
      expect(source.toString()).toBe('00000011 01111111');
    });
  });

  describe('#getLength()', () => {
    it('should return data length', () => {
      expect(source.getLength()).toBe(2);
    });
  });

  describe('#setLength()', () => {
    it('should set data length', () => {
      source.setLength(4);
      expect(source.getLength()).toBe(4);
      expect(source.getSource()).toBeInstanceOf(Uint8Array);
      expect(source.toString()).toBe('10111011 00100010 00000000 00000000');
    });
  });

  describe('#getSource()', () => {
    it('should return current data source', () => {
      expect(source.getSource()).toBe(data);
    });
  });

  describe('#toString()', () => {
    it('should return string representation of source data', () => {
      expect(source.toString()).toBe('10111011 00100010');
    });
  });
});
