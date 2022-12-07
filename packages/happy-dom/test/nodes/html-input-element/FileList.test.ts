import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/Window';
import IDocument from '../../../src/nodes/document/IDocument';
import File from '../../../src/file/File';
import IHTMLInputElement from '../../../src/nodes/html-input-element/IHTMLInputElement';

describe('FileList', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('item()', () => {
		it('Returns file at index.', () => {
			const element = <IHTMLInputElement>document.createElement('input');
			const file1 = new File([''], 'file.txt');
			const file2 = new File([''], 'file2.txt');

			element.files.push(file1);
			element.files.push(file2);

			expect(element.files.item(0)).toBe(file1);
			expect(element.files.item(1)).toBe(file2);
		});
	});
});
