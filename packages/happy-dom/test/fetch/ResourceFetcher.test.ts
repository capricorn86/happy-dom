import Window from '../../src/window/Window';
import ResourceFetcher from '../../src/fetch/ResourceFetcher';
import IResponse from '../../src/window/IResponse';

describe('ResourceFetcher', () => {
	let window: Window, syncRequestStatusCode, syncRequestBody, syncRequestOptions;

	beforeAll(() => {
		jest.mock('sync-request', () => (method: string, url: string) => {
			syncRequestOptions = {
				method,
				url
			};
			return {
				getBody: () => syncRequestBody,
				isError: () => syncRequestStatusCode !== 200,
				statusCode: syncRequestStatusCode
			};
		});
	});

	beforeEach(() => {
		syncRequestOptions = null;
		syncRequestStatusCode = 200;
		syncRequestBody = 'test';
		window = new Window();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('fetch()', () => {
		test('Returns resource data asynchrounously.', async () => {
			let fetchedURL = null;

			jest.spyOn(window, 'fetch').mockImplementation(url => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('test'),
					ok: true
				});
			});

			const test = await ResourceFetcher.fetch({
				window,
				url: 'path/to/script/'
			});

			expect(fetchedURL).toBe('path/to/script/');
			expect(test).toBe('test');
		});
	});

	describe('fetchSync()', () => {
		test('Returns resource data synchrounously.', () => {
			window.location.href = 'https://localhost:8080/base/';

			const test = ResourceFetcher.fetchSync({
				window,
				url: 'path/to/script/'
			});

			expect(syncRequestOptions).toEqual({
				method: 'GET',
				url: 'https://localhost:8080/base/path/to/script/'
			});
			expect(test).toBe('test');
		});

		test('Handles error when resource is fetched synchrounously.', () => {
			window.location.href = 'https://localhost:8080/base/';

			syncRequestStatusCode = 404;

			expect(() => {
				ResourceFetcher.fetchSync({
					window,
					url: 'path/to/script/'
				});
			}).toThrowError(
				'Failed to perform request to "https://localhost:8080/base/path/to/script/". Status code: 404'
			);
		});
	});
});
