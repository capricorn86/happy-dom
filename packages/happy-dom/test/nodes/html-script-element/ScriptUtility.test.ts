import Window from '../../../src/window/Window';
import ScriptUtility from '../../../src/nodes/html-script-element/ScriptUtility';
import IResponse from '../../../src/window/IResponse';

describe('ScriptUtility', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('loadExternalScript()', () => {
		test('Loads external script asynchronously.', async () => {
			let fetchedURL = null;

			jest.spyOn(window, 'fetch').mockImplementation(url => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('global.test = "test";')
				});
			});

			ScriptUtility.loadExternalScript({ window, url: 'path/to/script/', async: true });

			expect(fetchedURL).toBe('path/to/script/');

			await window.happyDOM.whenAsyncComplete();

			expect(global['test']).toBe('test');

			delete global['test'];
		});

		test('Loads external script synchronously with relative URL.', () => {
			let fetchedMethod = null;
			let fetchedURL = null;
			window.location.href = 'https://localhost:8080/base/';

			jest.mock('sync-request', () => {
				return (method: string, url: string) => {
					fetchedMethod = method;
					fetchedURL = url;
					return {
						getBody: () => 'global.test = "test";'
					};
				};
			});

			ScriptUtility.loadExternalScript({ window, url: 'path/to/script/', async: false });

			expect(fetchedMethod).toBe('GET');
			expect(fetchedURL).toBe('https://localhost:8080/base/path/to/script/');
			expect(global['test']).toBe('test');

			delete global['test'];
		});
	});
});
