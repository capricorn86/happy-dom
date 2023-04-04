import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import IHTMLFormElement from '../../src/nodes/html-form-element/IHTMLFormElement';
import IHTMLInputElement from '../../src/nodes/html-input-element/IHTMLInputElement';
import File from '../../src/file/File';

describe('FormData', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('constructor', () => {
		it('Supports sending in an HTMLFormElement to the contructor.', () => {
			const form = <IHTMLFormElement>document.createElement('form');
			const file = new File([Buffer.from('fileContent')], 'file.txt', { type: 'text/plain' });
			const textInput = <IHTMLInputElement>document.createElement('input');
			const hiddenInput = <IHTMLInputElement>document.createElement('input');
			const hiddenInput2 = <IHTMLInputElement>document.createElement('input');
			const fileInput = <IHTMLInputElement>document.createElement('input');
			const radioInput1 = <IHTMLInputElement>document.createElement('input');
			const radioInput2 = <IHTMLInputElement>document.createElement('input');
			const checkboxInput1 = <IHTMLInputElement>document.createElement('input');
			const checkboxInput2 = <IHTMLInputElement>document.createElement('input');

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

			form.appendChild(textInput);
			form.appendChild(hiddenInput);
			form.appendChild(hiddenInput2);
			form.appendChild(fileInput);
			form.appendChild(radioInput1);
			form.appendChild(radioInput2);
			form.appendChild(checkboxInput1);
			form.appendChild(checkboxInput2);

			const formData = new window.FormData(form);

			expect(formData.get('textInput')).toBe('text value');
			expect(formData.get('hiddenInput')).toBe('hidden value 1');
			expect(formData.get('fileInput')).toBe(file);
			expect(formData.get('radioInput')).toBe('radio value 2');
			expect(formData.get('checkboxInput')).toBe('checkbox value 2');
			expect(formData.getAll('hiddenInput')).toEqual(['hidden value 1', 'hidden value 2']);
			expect(formData.getAll('radioInput')).toEqual(['radio value 2']);
			expect(formData.getAll('checkboxInput')).toEqual(['checkbox value 2']);
		});
	});

	describe('forEach()', () => {
		it('Calls callback for each entity.', () => {
			const formData = new window.FormData();
			formData.set('key1', 'value1');
			formData.set('key2', 'value2');
			const values = [];

			formData.forEach((key, value) => values.push({ key, value }));

			expect(values).toEqual([
				{ key: 'key1', value: 'value1' },
				{ key: 'key2', value: 'value2' }
			]);
		});
	});

	describe('append()', () => {
		it('Appends a value.', () => {
			const formData = new window.FormData();

			formData.append('key1', 'value1');
			formData.append('key1', 'value2');

			expect(formData.getAll('key1')).toEqual(['value1', 'value2']);
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
			const keys = [];

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
			const values = [];

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
			const entries = [];

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
			const entries = [];

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
