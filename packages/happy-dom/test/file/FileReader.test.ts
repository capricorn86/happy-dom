import Blob from '../../src/file/Blob';
import FileReader from '../../src/file/FileReader';
import AsyncWindow from '../../src/window/AsyncWindow';

describe('FileReader', () => {
	let window: AsyncWindow = null;
	let fileReader: FileReader = null;

	beforeEach(() => {
		window = new AsyncWindow();
		FileReader._ownerDocument = window.document;
		fileReader = new FileReader();
	});

	describe('readAsDataURL()', () => {
		test('Reads Blob as data URL.', async () => {
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
