import Storage from '../../src/storage/Storage.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('Storage', () => {
	let storage: Storage;

	beforeEach(() => {
		storage = new Storage();
	});

	describe('get length()', () => {
		it('Returns length.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.length).toBe(2);
			storage.setItem('key3', 'value3');
			expect(storage.length).toBe(3);
			storage['key4'] = 'value4';
			expect(storage.length).toBe(4);
		});
	});

	describe('key()', () => {
		it('Returns name of the nth name.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.key(0)).toBe('key1');
			expect(storage.key(1)).toBe('key2');
			expect(storage.key(2)).toBe(null);
		});
	});

	describe('getItem()', () => {
		it('Returns item.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
			storage['key3'] = 'value3';
			expect(storage.getItem('key3')).toBe('value3');
		});

		it('Handles keys already taken by Javascript.', () => {
			expect(storage.getItem('length')).toBe(null);
			expect(storage.getItem('key')).toBe(null);
			expect(storage.getItem('setItem')).toBe(null);
			expect(storage.getItem('getItem')).toBe(null);
			expect(storage.getItem('removeItem')).toBe(null);
			expect(storage.getItem('clear')).toBe(null);

			storage.setItem('length', 'value');
			storage.setItem('key', 'value');
			storage.setItem('setItem', 'value');
			storage.setItem('getItem', 'value');
			storage.setItem('removeItem', 'value');
			storage.setItem('clear', 'value');

			expect(storage.getItem('length')).toBe('value');
			expect(storage.getItem('key')).toBe('value');
			expect(storage.getItem('setItem')).toBe('value');
			expect(storage.getItem('getItem')).toBe('value');
			expect(storage.getItem('removeItem')).toBe('value');
			expect(storage.getItem('clear')).toBe('value');

			const storage2 = new Storage();

			// @ts-expect-error
			storage2.length = 'value';
			// @ts-expect-error
			storage2.key = 'value';
			// @ts-expect-error
			storage2.setItem = 'value';
			// @ts-expect-error
			storage2.getItem = 'value';
			// @ts-expect-error
			storage2.removeItem = 'value';
			// @ts-expect-error
			storage2.clear = 'value';

			expect(storage2.length).toBe(0);
			expect(storage2.key).toBeTypeOf('function');
			expect(storage2.setItem).toBeTypeOf('function');
			expect(storage2.getItem).toBeTypeOf('function');
			expect(storage2.removeItem).toBeTypeOf('function');
			expect(storage2.clear).toBeTypeOf('function');
		});
	});

	describe('setItem()', () => {
		it('Returns item.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
			expect(storage['key1']).toBe('value1');
			expect(storage['key2']).toBe('value2');
			storage['key1'] = 'value3';
			expect(storage.getItem('key1')).toBe('value3');

			// @ts-expect-error
			storage.setItem('key1', 1);
			expect(storage.getItem('key1')).toBe('1');
			expect(storage['key1']).toBe('1');

			// @ts-expect-error
			storage.setItem('key1', {});
			expect(storage.getItem('key1')).toBe('[object Object]');
			expect(storage['key1']).toBe('[object Object]');
		});

		it('Handles keys already taken by Javascript.', () => {
			storage.setItem('key', 'value');
			expect(storage.getItem('key')).toBe('value');
		});
	});

	describe('removeItem()', () => {
		it('Removes an item.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			storage.removeItem('key2');
			expect(storage.length).toBe(1);
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe(null);
			expect(storage['key1']).toBe('value1');
			expect(storage['key2']).toBe(undefined);
		});
	});

	describe('clear()', () => {
		it('Clears storage.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			storage.clear();
			expect(storage.length).toBe(0);
			expect(storage.getItem('key1')).toBe(null);
			expect(storage.getItem('key2')).toBe(null);
			expect(storage['key1']).toBe(undefined);
			expect(storage['key2']).toBe(undefined);
		});
	});

	describe('Object.keys()', () => {
		it(`Returns an array of storage's own enumerable string-keyed property names.`, () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');

			expect(storage.length).toBe(2);
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
			expect(storage['key1']).toBe('value1');
			expect(storage['key2']).toBe('value2');
			expect(Object.keys(storage)).toEqual(['key1', 'key2']);
		});
	});

	describe('Object.values()', () => {
		it(`Returns an array of storage's own enumerable string-keyed property values.`, () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');

			expect(storage.length).toBe(2);
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
			expect(storage['key1']).toBe('value1');
			expect(storage['key2']).toBe('value2');
			expect(Object.values(storage)).toEqual(['value1', 'value2']);
		});
	});

	describe('Object.entries()', () => {
		it(`Returns an array of storage's own enumerable string-keyed property key-value pairs.`, () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');

			expect(storage.length).toBe(2);
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
			expect(storage['key1']).toBe('value1');
			expect(storage['key2']).toBe('value2');
			expect(Object.entries(storage)).toEqual([
				['key1', 'value1'],
				['key2', 'value2']
			]);
		});
	});

	describe('vi.spyOn()', () => {
		it('Should spy on a method.', () => {
			const spy = vi.spyOn(storage, 'getItem');
			storage.getItem('key1');
			expect(spy).toHaveBeenCalled();
		});

		it('Should be able to mock implementation once.', () => {
			vi.spyOn(storage, 'getItem').mockImplementationOnce(() => 'mocked');
			expect(storage.getItem('key1')).toBe('mocked');
			expect(storage.getItem('key1')).toBe(null);

			vi.spyOn(storage, 'setItem').mockImplementationOnce(() => {
				throw new Error('error');
			});

			expect(() => storage.setItem('key1', 'value1')).toThrow('error');
		});

		it('Should be able to spy on prototype methods.', () => {
			vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'mocked');

			expect(storage.getItem('key1')).toBe('mocked');
		});
	});
});
