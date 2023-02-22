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
			const fileInput = <IHTMLInputElement>document.createElement('input');
			const radioInput1 = <IHTMLInputElement>document.createElement('input');
			const radioInput2 = <IHTMLInputElement>document.createElement('input');
			const checkboxInput1 = <IHTMLInputElement>document.createElement('input');
			const checkboxInput2 = <IHTMLInputElement>document.createElement('input');

			textInput.type = 'text';
			textInput.name = 'textInput';
			textInput.value = 'text value';

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
			form.appendChild(fileInput);
			form.appendChild(radioInput1);
			form.appendChild(radioInput2);
			form.appendChild(checkboxInput1);
			form.appendChild(checkboxInput2);

			const formData = new window.FormData(form);

			expect(formData.get('textInput')).toBe('text value');
			expect(formData.get('fileInput')).toBe(file);
			expect(formData.get('radioInput')).toBe('radio value 2');
			expect(formData.getAll('checkboxInput')).toEqual(['checkbox value 2']);
		});
	});
});
