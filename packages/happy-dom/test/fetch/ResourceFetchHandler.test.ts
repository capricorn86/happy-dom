import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import ResourceFetch from '../../src/fetch/ResourceFetch';
import IResponse from '../../src/fetch/IResponse';
import XMLHttpRequestSyncRequestScriptBuilder from '../../src/xml-http-request/utilities/XMLHttpRequestSyncRequestScriptBuilder';
import XMLHttpRequestCertificate from '../../src/xml-http-request/XMLHttpRequestCertificate';

const URL = 'https://localhost:8080/base/';

describe('ResourceFetch', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window({ url: URL });
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

			const test = await ResourceFetch.fetch(document, 'path/to/script/');

			expect(fetchedURL).toBe('path/to/script/');
			expect(test).toBe('test');
		});
	});

	describe('fetchSync()', () => {
		it('Returns resource data synchrounously.', () => {
			const test = ResourceFetch.fetchSync(document, 'path/to/script/');

			expect(mockedModules.modules.child_process.execFileSync.parameters.command).toEqual(
				process.argv[0]
			);
			expect(mockedModules.modules.child_process.execFileSync.parameters.args[0]).toBe('-e');
			expect(mockedModules.modules.child_process.execFileSync.parameters.args[1]).toBe(
				XMLHttpRequestSyncRequestScriptBuilder.getScript(
					{
						host: 'localhost',
						port: 8080,
						path: '/base/path/to/script/',
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: 'https://localhost:8080/base/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: 'localhost:8080'
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					},
					true
				)
			);
			expect(mockedModules.modules.child_process.execFileSync.parameters.options).toEqual({
				encoding: 'buffer',
				maxBuffer: 1024 * 1024 * 1024
			});

			expect(test).toBe('child_process.execFileSync.returnValue.data.text');
		});

		it('Handles error when resource is fetched synchrounously.', () => {
			mockedModules.modules.child_process.execFileSync.returnValue.data.statusCode = 404;
			expect(() => {
				ResourceFetch.fetchSync(document, 'path/to/script/');
			}).toThrowError(`Failed to perform request to "${URL}path/to/script/". Status code: 404`);
		});
	});
});
