import DataTransferItemList from '../../src/event/DataTransferItemList.js';
import File from '../../src/file/File.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('DataTransferItemList', () => {
	let dataTransferItemList: DataTransferItemList;

	beforeEach(() => {
		dataTransferItemList = new DataTransferItemList();
	});

	describe('get length()', () => {
		it('Returns length.', () => {
			dataTransferItemList.add('test1', 'text/plain');
			dataTransferItemList.add('test2', 'text/plain');

			expect(dataTransferItemList.length).toBe(2);
		});
	});

	describe('add()', () => {
		it('Adds an item.', () => {
			const file = new File(['test3'], 'test3.txt', { type: 'text/html' });
			dataTransferItemList.add('test1', 'text/plain');
			dataTransferItemList.add('test2', 'text/plain');
			dataTransferItemList.add(file);

			expect(dataTransferItemList.length).toBe(3);

			let data1;
			let data2;

			dataTransferItemList[0].getAsString((s) => (data1 = s));
			dataTransferItemList[1].getAsString((s) => (data2 = s));

			expect(data1).toBe('test1');
			expect(data2).toBe('test2');
			expect(dataTransferItemList[0].type).toBe('text/plain');
			expect(dataTransferItemList[0].kind).toBe('string');
			expect(dataTransferItemList[1].type).toBe('text/plain');
			expect(dataTransferItemList[1].kind).toBe('string');
			expect(dataTransferItemList[2].type).toBe('text/html');
			expect(dataTransferItemList[2].kind).toBe('file');
			expect(dataTransferItemList[2].getAsFile()).toBe(file);
		});

		it('Throws an error if the first parameter is not a File and the second parameter is not a string.', () => {
			expect(() => dataTransferItemList.add('test1')).toThrowError(
				"Failed to execute 'add' on 'DataTransferItemList': parameter 1 is not of type 'File'."
			);
		});
	});

	describe('remove()', () => {
		it('Removes an item.', () => {
			dataTransferItemList.add('test1', 'text/plain');
			dataTransferItemList.add('test2', 'text/plain');

			expect(dataTransferItemList.length).toBe(2);

			dataTransferItemList.remove(0);

			let data;
			dataTransferItemList[0].getAsString((s) => (data = s));
			expect(dataTransferItemList.length).toBe(1);
			expect(data).toBe('test2');
			expect(dataTransferItemList[0].type).toBe('text/plain');
			expect(dataTransferItemList[0].kind).toBe('string');
		});
	});

	describe('clear()', () => {
		it('Clears the list.', () => {
			dataTransferItemList.add('test1', 'text/plain');
			dataTransferItemList.add('test2', 'text/plain');

			expect(dataTransferItemList.length).toBe(2);

			dataTransferItemList.clear();

			expect(dataTransferItemList.length).toBe(0);
		});
	});
});
