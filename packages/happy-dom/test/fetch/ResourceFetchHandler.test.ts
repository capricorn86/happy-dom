import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import ResourceFetchHandler from '../../src/fetch/ResourceFetchHandler';
import IResponse from '../../src/fetch/IResponse';

const MOCKED_SYNC_REQUEST = global['mockedModules']['sync-request'];

describe('ResourceFetchHandler', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		MOCKED_SYNC_REQUEST.options = null;
		MOCKED_SYNC_REQUEST.statusCode = 200;
		MOCKED_SYNC_REQUEST.body = 'test';
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('fetch()', () => {
		it('Returns resource data asynchrounously.', async () => {
			let fetchedURL = null;

			jest.spyOn(window, 'fetch').mockImplementation((url: string) => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('test'),
					ok: true
				});
			});

			const test = await ResourceFetchHandler.fetch(document, 'path/to/script/');

			expect(fetchedURL).toBe('path/to/script/');
			expect(test).toBe('test');
		});
	});

	describe('fetchSync()', () => {
		it('Returns resource data synchrounously.', () => {
			window.location.href = 'https://localhost:8080/base/';

			const test = ResourceFetchHandler.fetchSync(document, 'path/to/script/');

			expect(MOCKED_SYNC_REQUEST.options).toEqual({
				method: 'GET',
				url: 'https://localhost:8080/base/path/to/script/'
			});
			expect(test).toBe('test');
		});

		it('Handles error when resource is fetched synchrounously.', () => {
			window.location.href = 'https://localhost:8080/base/';

			MOCKED_SYNC_REQUEST.statusCode = 404;

			expect(() => {
				ResourceFetchHandler.fetchSync(document, 'path/to/script/');
			}).toThrowError(
				'Failed to perform request to "https://localhost:8080/base/path/to/script/". Status code: 404'
			);
		});
	});
});
