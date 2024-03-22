import Storage from '../../src/storage/Storage.js';
import { beforeEach, describe, it, expect } from 'vitest';

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
});
