import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import File from '../../src/file/File.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Blob from '../../src/file/Blob.js';

describe('FormData', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('Supports sending in an HTMLFormElement to the contructor.', () => {
			const form = document.createElement('form');
			const file = new File([Buffer.from('fileContent')], 'file.txt', { type: 'text/plain' });
			const textInput = document.createElement('input');
			const hiddenInput = document.createElement('input');
			const hiddenInput2 = document.createElement('input');
			const fileInput = document.createElement('input');
			const radioInput1 = document.createElement('input');
			const radioInput2 = document.createElement('input');
			const checkboxInput1 = document.createElement('input');
			const checkboxInput2 = document.createElement('input');
			const button1 = document.createElement('button');
			const button2 = document.createElement('input');
			const button3 = document.createElement('button');
			const button4 = document.createElement('input');

			textInput.type = 'text';
			textInput.name = 'textInput';
			textInput.value = 'text value';

			hiddenInput.type = 'hidden';
			hiddenInput.name = 'hiddenInput';
			hiddenInput.value = 'hidden value 1';

			hiddenInput2.type = 'hidden';
			hiddenInput2.name = 'hiddenInput';
			hiddenInput2.value = 'hidden value 2';

			fileInput.type = 'file';
			fileInput.name = 'fileInput';
			fileInput.files.push(file);

			radioInput1.type = 'radio';
			radioInput1.name = 'radioInput';
			radioInput1.value = 'radio value 1';
			radioInput1.checked = false;

			radioInput2.type = 'radio';
			radioInput2.name = 'radioInput';
			radioInput2.value = 'radio value 2';
			radioInput2.checked = true;

			checkboxInput1.type = 'checkbox';
			checkboxInput1.name = 'checkboxInput';
			checkboxInput1.value = 'checkbox value 1';

			checkboxInput2.type = 'checkbox';
			checkboxInput2.name = 'checkboxInput';
			checkboxInput2.value = 'checkbox value 2';
			checkboxInput2.checked = true;

			button1.name = 'button1';

			button2.type = 'submit';
			button2.name = 'button2';

			button3.name = 'button3';
			button3.value = 'button3';

			button4.type = 'submit';
			button4.name = 'button4';
			button4.value = 'button4';

			form.appendChild(textInput);
			form.appendChild(hiddenInput);
			form.appendChild(hiddenInput2);
			form.appendChild(fileInput);
			form.appendChild(radioInput1);
			form.appendChild(radioInput2);
			form.appendChild(checkboxInput1);
			form.appendChild(checkboxInput2);
			form.appendChild(button1);
			form.appendChild(button2);
			form.appendChild(button3);
			form.appendChild(button4);

			const formData = new window.FormData(form);

			expect(formData.get('textInput')).toBe('text value');
			expect(formData.get('hiddenInput')).toBe('hidden value 1');
			expect(formData.get('fileInput')).toBe(file);
			expect(formData.get('radioInput')).toBe('radio value 2');
			expect(formData.get('checkboxInput')).toBe('checkbox value 2');
			expect(formData.getAll('hiddenInput')).toEqual(['hidden value 1', 'hidden value 2']);
			expect(formData.getAll('radioInput')).toEqual(['radio value 2']);
			expect(formData.getAll('checkboxInput')).toEqual(['checkbox value 2']);
			expect(formData.get('button1')).toBe(null);
			expect(formData.get('button2')).toBe(null);
			expect(formData.get('button3')).toBe('button3');
			expect(formData.get('button4')).toBe('button4');
		});

		it('Supports input elements with empty values.', () => {
			const form = document.createElement('form');
			const textInput = document.createElement('input');

			textInput.type = 'text';
			textInput.name = 'textInput';
			textInput.value = '';

			form.appendChild(textInput);

			const formData = new window.FormData(form);

			expect(formData.get('textInput')).toBe('');
		});
	});

	describe('forEach()', () => {
		it('Calls callback for each entity.', () => {
			const formData = new window.FormData();
			formData.set('key1', 'value1');
			formData.set('key2', 'value2');
			const values: Array<{ key: string; value: string | File }> = [];

			formData.forEach((value, key) => values.push({ key, value }));

			expect(values).toEqual([
				{ key: 'key1', value: 'value1' },
				{ key: 'key2', value: 'value2' }
			]);
		});
	});

	describe('append()', () => {
		it('Appends a value.', () => {
			vi.spyOn(Date, 'now').mockImplementation(() => 1000);

			const formData = new window.FormData();
			const blob = new Blob();
			const file = new File([], 'filename');

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', blob);
			formData.append('key3', file);

			expect(formData.getAll('key1')).toEqual(['value1', 'value2']);
			expect(formData.getAll('key2')).toEqual([new File([], 'blob')]);
			expect(formData.getAll('key3')).toEqual([file]);
		});

		it('Throws an error if a filename is provided and the value is not an instance of a Blob.', () => {
			const formData = new window.FormData();
			expect(() => formData.append('key1', 'value1', 'filename')).toThrow(
				'Failed to execute "append" on "FormData": parameter 2 is not of type "Blob".'
			);
		});
	});

	describe('delete()', () => {
		it('Removes all keys matching name.', () => {
			const formData = new window.FormData();

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			formData.delete('key1');

			expect(formData.getAll('key1')).toEqual([]);
			expect(formData.getAll('key2')).toEqual(['value3']);
			expect(formData.getAll('key3')).toEqual(['value4']);
		});
	});

	describe('get()', () => {
		it('Returns value of first matching entity.', () => {
			const formData = new window.FormData();

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');

			expect(formData.get('key1')).toBe('value1');
			expect(formData.get('key2')).toBe('value3');
		});
	});

	describe('getAll()', () => {
		it('Returns the value of all entities matching a key.', () => {
			const formData = new window.FormData();

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			expect(formData.getAll('key1')).toEqual(['value1', 'value2']);
			expect(formData.getAll('key2')).toEqual(['value3']);
			expect(formData.getAll('key3')).toEqual(['value4']);
		});
	});

	describe('has()', () => {
		it('Returns "true" if an entity matching given key exists.', () => {
			const formData = new window.FormData();

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			expect(formData.has('key1')).toBe(true);
			expect(formData.has('key2')).toBe(true);
			expect(formData.has('key3')).toBe(true);
		});
	});

	describe('has()', () => {
		it('Sets a key and value overwriting any existing entity with the same key.', () => {
			const formData = new window.FormData();

			formData.set('key1', 'value1');
			formData.set('key1', 'value2');
			formData.set('key2', 'value3');

			expect(formData.getAll('key1')).toEqual(['value2']);
			expect(formData.getAll('key2')).toEqual(['value3']);
		});
	});

	describe('keys()', () => {
		it('Returns iterator for keys.', () => {
			const formData = new window.FormData();
			const keys: string[] = [];

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			for (const key of formData.keys()) {
				keys.push(key);
			}

			expect(keys).toEqual(['key1', 'key1', 'key2', 'key3']);
		});
	});

	describe('values()', () => {
		it('Returns iterator for values.', () => {
			const formData = new window.FormData();
			const values: Array<string | File> = [];

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			for (const value of formData.values()) {
				values.push(value);
			}

			expect(values).toEqual(['value1', 'value2', 'value3', 'value4']);
		});
	});

	describe('entries()', () => {
		it('Returns iterator for entries.', () => {
			const formData = new window.FormData();
			const entries: Array<{ key: string; value: string | File }> = [];

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			for (const [key, value] of formData.entries()) {
				entries.push({ key, value });
			}

			expect(entries).toEqual([
				{ key: 'key1', value: 'value1' },
				{ key: 'key1', value: 'value2' },
				{ key: 'key2', value: 'value3' },
				{ key: 'key3', value: 'value4' }
			]);
		});
	});

	describe('*[Symbol.iterator]()', () => {
		it('Returns iterator for entries.', () => {
			const formData = new window.FormData();
			const entries: Array<{ key: string; value: string | File }> = [];

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');
			formData.append('key2', 'value3');
			formData.append('key3', 'value4');

			for (const [key, value] of formData) {
				entries.push({ key, value });
			}

			expect(entries).toEqual([
				{ key: 'key1', value: 'value1' },
				{ key: 'key1', value: 'value2' },
				{ key: 'key2', value: 'value3' },
				{ key: 'key3', value: 'value4' }
			]);
		});
	});
});
