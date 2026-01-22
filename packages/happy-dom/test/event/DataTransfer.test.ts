import DataTransfer from '../../src/event/DataTransfer.js';
import File from '../../src/file/File.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('DataTransfer', () => {
	let dataTransfer: DataTransfer;

	beforeEach(() => {
		dataTransfer = new DataTransfer();
	});

	describe('get items()', () => {
		it('Returns items.', () => {
			dataTransfer.items.add('test1', 'text/plain');
			dataTransfer.items.add('test2', 'text/plain');

			expect(dataTransfer.items.length).toBe(2);

			let data1;
			let data2;

			dataTransfer.items[0].getAsString((s) => (data1 = s));
			dataTransfer.items[1].getAsString((s) => (data2 = s));

			expect(data1).toBe('test1');
			expect(data2).toBe('test2');
			expect(dataTransfer.items[0].type).toBe('text/plain');
			expect(dataTransfer.items[0].kind).toBe('string');
			expect(dataTransfer.items[1].type).toBe('text/plain');
			expect(dataTransfer.items[1].kind).toBe('string');
		});
	});

	describe('get files()', () => {
		it('Returns files.', () => {
			const file1 = new File(['test1'], 'test1.txt');
			const file2 = new File(['test2'], 'test2.txt');

			dataTransfer.items.add('test1', 'text/plain');
			dataTransfer.items.add(file1);
			dataTransfer.items.add('test2', 'text/plain');
			dataTransfer.items.add(file2);

			expect(dataTransfer.files.length).toBe(2);
			expect(dataTransfer.files[0]).toBe(file1);
			expect(dataTransfer.files[1]).toBe(file2);
		});
	});

	describe('get types()', () => {
		it('Returns types.', () => {
			dataTransfer.items.add('test1', 'text/plain');
			dataTransfer.items.add('test2', 'text/html');

			expect(dataTransfer.types.length).toBe(2);
			expect(dataTransfer.types[0]).toBe('text/plain');
			expect(dataTransfer.types[1]).toBe('text/html');
		});
	});

	describe('clearData()', () => {
		it('Clears data.', () => {
			dataTransfer.items.add('test1', 'text/plain');
			dataTransfer.items.add('test2', 'text/html');

			expect(dataTransfer.items.length).toBe(2);

			dataTransfer.clearData();

			expect(dataTransfer.items.length).toBe(0);
		});
	});

	describe('setData()', () => {
		it('Sets data.', () => {
			dataTransfer.setData('text/plain', 'test1');
			dataTransfer.setData('text/plain', 'test2');
			dataTransfer.setData('text/html', 'test3');

			let data1;
			let data2;

			dataTransfer.items[0].getAsString((s) => (data1 = s));
			dataTransfer.items[1].getAsString((s) => (data2 = s));

			expect(data1).toBe('test2');
			expect(data2).toBe('test3');

			expect(dataTransfer.items.length).toBe(2);
			expect(dataTransfer.items[0].type).toBe('text/plain');
			expect(dataTransfer.items[0].kind).toBe('string');
			expect(dataTransfer.items[1].type).toBe('text/html');
			expect(dataTransfer.items[1].kind).toBe('string');
		});
	});

	describe('getData()', () => {
		it('Gets data.', () => {
			dataTransfer.setData('text/plain', 'test1');
			dataTransfer.setData('text/html', 'test2');

			expect(dataTransfer.getData('text/plain')).toBe('test1');
			expect(dataTransfer.getData('text/html')).toBe('test2');
			expect(dataTransfer.getData('text/xml')).toBe('');
		});

		it('Normalizes format "text" to "text/plain".', () => {
			dataTransfer.setData('text/plain', 'test1');

			expect(dataTransfer.getData('text')).toBe('test1');
			expect(dataTransfer.getData('TEXT')).toBe('test1');
		});

		it('Normalizes format "text" when set as item type.', () => {
			dataTransfer.items.add('test1', 'text');

			expect(dataTransfer.getData('text/plain')).toBe('test1');
			expect(dataTransfer.getData('text')).toBe('test1');
		});

		it('Normalizes format "url" to "text/uri-list".', () => {
			dataTransfer.setData('text/uri-list', 'https://example.com');

			expect(dataTransfer.getData('url')).toBe('https://example.com');
			expect(dataTransfer.getData('URL')).toBe('https://example.com');
		});
	});

	describe('setDragImage()', () => {
		it('Sets drag image.', () => {
			expect(() => {
				dataTransfer.setDragImage();
			}).toThrow('Not implemented.');
		});
	});
});
