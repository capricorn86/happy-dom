import Blob from '../../src/file/Blob';
import FileReader from '../../src/file/FileReader';
import Window from '../../src/window/Window';

describe('FileReader', () => {
	let window: Window = null;
	let fileReader: FileReader = null;

	beforeEach(() => {
		window = new Window();
		FileReader._ownerDocument = window.document;
		fileReader = new FileReader();
	});

	describe('readAsDataURL()', () => {
		it('Reads Blob as data URL.', async () => {
			const blob = new Blob(['TEST'], {
				type: 'text/plain;charset=utf-8'
			});
			let result = null;
			fileReader.addEventListener('load', () => {
				result = fileReader.result;
			});
			fileReader.readAsDataURL(blob);
			await window.happyDOM.whenAsyncComplete();
			expect(result).toBe('data:text/plain;charset=utf-8;base64,VEVTVA==');
		});
	});
});
