import { Endian } from './../../endian';
import { BaseBitRW } from '../basebitrw';
import { DataSource } from '../datasource';

jest.mock('../datasource', () => {
  return {
    DataSource: jest.fn(function (value = 'data-source-mock') {
      this.value = value;

      this.getSource = jest.fn(() => ({ value: this.value }));
      this.getFrameSize = jest.fn(() => 8);
      this.setPosition = jest.fn();
      this.getPosition = jest.fn(() => 4);
    }),
  };
});

describe('BaseBitRW', () => {
  let bitrw: BaseBitRW;

  beforeEach(() => {
    (DataSource as jest.Mock).mockClear();

    bitrw = new BaseBitRW();
  });

  describe('#getData()', () => {
    beforeEach(() => {
      bitrw.setData();
    });

    it('should return current data source', () => {
      expect(bitrw.getData()).toEqual({ value: 'data-source-mock' });
    });
  });

  describe('#setData()', () => {
    describe('When data is undefined', () => {
      beforeEach(() => {
        bitrw.setData();
      });

      it('should create data source', () => {
        expect(DataSource).toHaveBeenCalledTimes(1);
        expect(DataSource).toHaveBeenCalledWith(undefined);
        expect(bitrw.getData()).toEqual({ value: 'data-source-mock' });
      });
    });

    describe('When setting a value', () => {
      beforeEach(() => {
        bitrw.setData('new-data-source' as any);
      });

      it('should create data source', () => {
        expect(DataSource).toHaveBeenCalledTimes(1);
        expect(DataSource).toHaveBeenCalledWith('new-data-source');
        expect(bitrw.getData()).toEqual({ value: 'new-data-source' });
      });
    });
  });

  describe('#getSource()', () => {
    beforeEach(() => {
      bitrw.setData();
    });

    it('should return current data source wrapper', () => {
      expect(bitrw.getSource()).toEqual(
        expect.objectContaining({ value: 'data-source-mock' })
      );
    });
  });

  describe('#setSource()', () => {

    beforeEach(() => {
      bitrw.setSource(new DataSource('another-mock' as any));
    });

    it('should reset data source', () => {
      expect(bitrw.getSource()).toEqual(
        expect.objectContaining({ value: 'another-mock' })
      );
    });
  });

  describe('#getBitOrder()', () => {
    it('should return currently used bit order', () => {
      expect(bitrw.getBitOrder()).toBe(Endian.BIG);
    });
  });

  describe('#setBitOrder()', () => {
    it('should set bit order', () => {
      bitrw.setBitOrder(Endian.LITTLE);
      expect(bitrw.getBitOrder()).toBe(Endian.LITTLE);
    });
  });

  describe('#getPosition()', () => {
    beforeEach(() => {
      bitrw.setData();
    });

    it('should return position in bits', () => {
      expect(bitrw.getPosition()).toBe(32);
      expect(bitrw.getSource().getPosition).toHaveBeenCalledTimes(1);
    });
  });

  describe('#setPosition()', () => {
    beforeEach(() => {
      bitrw.setData();
    });

    it('should set position in bits', () => {
      bitrw.setPosition(20);
      expect(bitrw.getSource().setPosition).toHaveBeenCalledTimes(1);
      expect(bitrw.getSource().setPosition).toHaveBeenCalledWith(2);
    });
  });

  describe('#getBytePosition()', () => {
    beforeEach(() => {
      bitrw.setData();
    });

    it('should return position in bits', () => {
      expect(bitrw.getBytePosition()).toBe(4);
    });
  });

  describe('#getFrameSize()', () => {
    beforeEach(() => {
      bitrw.setData();
    });


    it('should return item size in bits', () => {
      expect(bitrw.getFrameSize()).toBe(8);
    });
  });
});
