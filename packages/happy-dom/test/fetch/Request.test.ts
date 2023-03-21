import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import IDocument from '../../src/nodes/document/IDocument';
import Request from '../../src/fetch/Request';

describe('Request', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		Request._ownerDocument = document;
	});

	describe('constructor()', () => {
		it('Supports sending in an instance of Headers as argument.', async () => {
			const headers1 = new Headers();

			headers1.append('Content-Type', 'application/json');
			headers1.append('Content-Encoding', 'gzip');

			const headers2 = new Headers(headers1);

			const entries = {};

			for (const [key, value] of headers2) {
				entries[key] = value;
			}

			expect(entries).toEqual({
				'Content-Type': 'application/json',
				'Content-Encoding': 'gzip'
			});
		});
	});
});
