import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import ScriptUtility from '../../../src/nodes/html-script-element/ScriptUtility';
import IResponse from '../../../src/fetch/types/IResponse';
import HTMLScriptElement from '../../../src/nodes/html-script-element/HTMLScriptElement';
import ResourceFetch from '../../../src/fetch/ResourceFetch';

describe('ScriptUtility', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('loadExternalScript()', () => {
		it('Loads external script asynchronously.', async () => {
			let fetchedURL = null;
			let loadEvent = null;

			jest.spyOn(window, 'fetch').mockImplementation((url: string) => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('globalThis.test = "test";'),
					ok: true
				});
			});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.async = true;
			script.addEventListener('load', (event) => {
				loadEvent = event;
			});

			await ScriptUtility.loadExternalScript(script);

			expect(loadEvent.target).toBe(script);
			expect(fetchedURL).toBe('path/to/script/');
			expect(window['test']).toBe('test');
		});

		it('Triggers error event when loading external script asynchronously.', async () => {
			let errorEvent = null;

			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve(<IResponse>{
					text: () => null,
					ok: false,
					status: 404
				});
			});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.async = true;
			script.addEventListener('error', (event) => {
				errorEvent = event;
			});

			await ScriptUtility.loadExternalScript(script);

			expect(errorEvent.message).toBe(
				'Failed to perform request to "path/to/script/". Status code: 404'
			);
		});

		it('Loads external script synchronously with relative URL.', async () => {
			let fetchedDocument = null;
			let fetchedURL = null;
			let loadEvent = null;

			window.location.href = 'https://localhost:8080/base/';

			jest
				.spyOn(ResourceFetch, 'fetchSync')
				.mockImplementation((document: IDocument, url: string) => {
					fetchedDocument = document;
					fetchedURL = url;
					return 'globalThis.test = "test";';
				});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.addEventListener('load', (event) => {
				loadEvent = event;
			});

			await ScriptUtility.loadExternalScript(script);

			expect(loadEvent.target).toBe(script);
			expect(fetchedDocument).toBe(document);
			expect(fetchedURL).toBe('path/to/script/');
			expect(window['test']).toBe('test');
		});

		it('Triggers error event when loading external script synchronously with relative URL.', () => {
			const thrownError = new Error('error');
			let errorEvent = null;

			window.location.href = 'https://localhost:8080/base/';

			jest.spyOn(ResourceFetch, 'fetchSync').mockImplementation(() => {
				throw thrownError;
			});

			const script = <HTMLScriptElement>window.document.createElement('script');
			script.src = 'path/to/script/';
			script.addEventListener('error', (event) => {
				errorEvent = event;
			});

			ScriptUtility.loadExternalScript(script);

			expect(errorEvent.message).toBe('error');
			expect(errorEvent.error).toBe(thrownError);
		});
	});
});
