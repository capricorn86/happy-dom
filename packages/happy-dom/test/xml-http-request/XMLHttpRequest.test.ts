import XMLHttpRequest from '../../src/xml-http-request/XMLHttpRequest';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import XMLHttpRequestReadyStateEnum from '../../src/xml-http-request/XMLHttpRequestReadyStateEnum';
import XMLHttpResponseTypeEnum from '../../src/xml-http-request/XMLHttpResponseTypeEnum';
import XMLHttpRequestSyncRequestScriptBuilder from '../../src/xml-http-request/utilities/XMLHttpRequestSyncRequestScriptBuilder';
import XMLHttpRequestCertificate from '../../src/xml-http-request/XMLHttpRequestCertificate';

const WINDOW_URL = 'https://localhost:8080';
const REQUEST_URL = '/path/to/resource/';
const FORBIDDEN_REQUEST_METHODS = ['TRACE', 'TRACK', 'CONNECT'];
const FORBIDDEN_REQUEST_HEADERS = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'content-transfer-encoding',
	'cookie',
	'cookie2',
	'date',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
];

describe('XMLHttpRequest', () => {
	let window: IWindow;
	let request: XMLHttpRequest;

	beforeEach(() => {
		window = new Window({
			url: WINDOW_URL
		});
		request = new window.XMLHttpRequest();
	});

	afterEach(() => {
		mockedModules.reset();
	});

	describe('get status()', () => {
		it('Returns status for synchrounous requests.', () => {
			expect(request.status).toBe(null);

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.status).toBe(200);
		});

		it('Returns status for asynchrounous requests.', (done) => {
			expect(request.status).toBe(null);

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(request.status).toBe(200);
				done();
			});

			request.send();
		});
	});

	describe('get statusText()', () => {
		it('Returns status text for synchrounous requests.', () => {
			expect(request.statusText).toBe(null);

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.statusText).toBe('child_process.execFileSync.returnValue.data.statusMessage');
		});

		it('Returns status text for asynchrounous requests.', (done) => {
			expect(request.statusText).toBe(null);

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(request.statusText).toBe('http.request.statusMessage');
				done();
			});

			request.send();
		});
	});

	describe('get responseURL()', () => {
		it('Returns response URL for synchrounous requests.', () => {
			expect(request.responseURL).toBe('');

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.responseURL).toBe(WINDOW_URL + REQUEST_URL);
		});

		it('Returns response URL for asynchrounous requests.', (done) => {
			expect(request.responseURL).toBe('');

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(request.responseURL).toBe(WINDOW_URL + REQUEST_URL);
				done();
			});

			request.send();
		});
	});

	describe('get readyState()', () => {
		it('Returns ready state for synchrounous requests.', () => {
			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
		});

		it('Returns ready state for asynchrounous requests.', (done) => {
			let isProgressTriggered = false;

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('progress', () => {
				isProgressTriggered = true;
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(isProgressTriggered).toBe(true);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				done();
			});

			request.send();
		});
	});

	describe('get responseText()', () => {
		it('Returns response text for synchrounous requests.', () => {
			request.open('GET', REQUEST_URL, false);
			request.send();
			expect(request.responseText).toBe('child_process.execFileSync.returnValue.data.text');
		});

		it('Returns response text for asynchrounous requests.', (done) => {
			request.open('GET', REQUEST_URL, true);
			request.addEventListener('load', () => {
				expect(request.responseText).toBe('http.request.body');
				done();
			});
			request.send();
		});

		it(`Throws an exception if responseType is not empty string or "${XMLHttpResponseTypeEnum.text}".`, () => {
			request.responseType = XMLHttpResponseTypeEnum.json;
			expect(() => request.responseText).toThrowError(
				`Failed to read the 'responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was '${XMLHttpResponseTypeEnum.json}').`
			);
		});
	});

	describe('set responseType()', () => {
		it('Sets response type.', () => {
			request.responseType = XMLHttpResponseTypeEnum.document;
			expect(request.responseType).toBe(XMLHttpResponseTypeEnum.document);
		});

		it(`Throws an exception if readyState is "loading".`, (done) => {
			request.open('GET', REQUEST_URL, true);
			request.addEventListener('progress', () => {
				expect(() => (request.responseType = XMLHttpResponseTypeEnum.json)).toThrowError(
					`Failed to set the 'responseType' property on 'XMLHttpRequest': The object's state must be OPENED or UNSENT.`
				);
			});
			request.addEventListener('load', () => done());
			request.send();
		});

		it(`Throws an exception if the request is synchrounous.`, () => {
			request.open('GET', REQUEST_URL, false);
			expect(() => (request.responseType = XMLHttpResponseTypeEnum.json)).toThrowError(
				`Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.`
			);
		});
	});

	describe('open()', () => {
		it('Opens a request.', () => {
			request.open('GET', REQUEST_URL, true);
			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.opened);
		});

		it('Throws an exception for forbidden request methods.', () => {
			for (const forbiddenMethod of FORBIDDEN_REQUEST_METHODS) {
				expect(() => request.open(forbiddenMethod, REQUEST_URL, true)).toThrowError(
					'Request method not allowed'
				);
			}
		});

		it(`Throws an exception if the request is set to be synchronous and responseType is not ${XMLHttpResponseTypeEnum.text}.`, () => {
			request.responseType = XMLHttpResponseTypeEnum.json;
			expect(() => request.open('GET', REQUEST_URL, false)).toThrowError(
				`Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests from a document must not set a response type.`
			);
		});
	});

	describe('setRequestHeader()', () => {
		it('Sets a request header on a synchronous request.', () => {
			request.open('GET', REQUEST_URL, false);
			expect(request.setRequestHeader('test-header', 'test')).toBe(true);
			request.send();

			expect(mockedModules.modules.child_process.execFileSync.parameters.args[1]).toBe(
				XMLHttpRequestSyncRequestScriptBuilder.getScript(
					{
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL,
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: WINDOW_URL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							'test-header': 'test',
							host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					},
					true
				)
			);
		});

		it('Sets a request header on an asynchrounous request.', (done) => {
			request.open('GET', REQUEST_URL, true);
			expect(request.setRequestHeader('test-header', 'test')).toBe(true);
			request.addEventListener('load', () => {
				expect(mockedModules.modules.http.request.parameters.options['headers']).toEqual({
					accept: '*/*',
					cookie: '',
					host: window.location.host,
					referer: WINDOW_URL + '/',
					'user-agent': window.navigator.userAgent,
					'test-header': 'test'
				});
				done();
			});
			request.send();
		});

		it('Does not set forbidden headers.', () => {
			request.open('GET', REQUEST_URL, true);
			for (const header of FORBIDDEN_REQUEST_HEADERS) {
				expect(request.setRequestHeader(header, 'test')).toBe(false);
			}
		});

		it(`Throws an exception if ready state is not "opened".`, () => {
			expect(() => request.setRequestHeader('key', 'value')).toThrowError(
				`Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`
			);
		});
	});

	describe('getResponseHeader()', () => {
		it('Returns response header for a synchrounous request.', () => {
			mockedModules.modules.child_process.execFileSync.returnValue.data.headers['set-cookie'] =
				'cookie';
			mockedModules.modules.child_process.execFileSync.returnValue.data.headers['set-cookie2'] =
				'cookie';

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.getResponseHeader('key1')).toBe('value1');
			expect(request.getResponseHeader('key2')).toBe('value2');
			expect(request.getResponseHeader('key3')).toBe(null);

			// These cookies should always be null for security reasons.
			expect(request.getResponseHeader('set-cookie')).toBe(null);
			expect(request.getResponseHeader('set-cookie2')).toBe(null);
		});

		it('Returns response header for an asynchrounous request.', (done) => {
			mockedModules.modules.http.request.returnValue.response.headers['set-cookie'] = 'cookie';
			mockedModules.modules.http.request.returnValue.response.headers['set-cookie2'] = 'cookie';

			request.open('GET', REQUEST_URL, false);

			request.addEventListener('load', () => {
				expect(request.getResponseHeader('key1')).toBe('value1');
				expect(request.getResponseHeader('key2')).toBe('value2');
				expect(request.getResponseHeader('key3')).toBe(null);

				// These cookies should always be null for security reasons.
				expect(request.getResponseHeader('set-cookie')).toBe(null);
				expect(request.getResponseHeader('set-cookie2')).toBe(null);

				done();
			});

			request.send();
		});

		it('Returns null when there is no response.', () => {
			expect(request.getResponseHeader('key1')).toBe(null);
		});
	});

	describe('getAllResponseHeaders()', () => {
		it('Returns all response headers for a synchrounous request.', () => {
			mockedModules.modules.child_process.execFileSync.returnValue.data.headers['set-cookie'] =
				'cookie';
			mockedModules.modules.child_process.execFileSync.returnValue.data.headers['set-cookie2'] =
				'cookie';

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.getAllResponseHeaders()).toBe('key1: value1\r\nkey2: value2');
		});

		it('Returns all response headers for an asynchrounous request.', (done) => {
			mockedModules.modules.http.request.returnValue.response.headers['set-cookie'] = 'cookie';
			mockedModules.modules.http.request.returnValue.response.headers['set-cookie2'] = 'cookie';

			request.open('GET', REQUEST_URL, false);

			request.addEventListener('load', () => {
				expect(request.getAllResponseHeaders()).toBe('key1: value1\r\nkey2: value2');
				done();
			});

			request.send();
		});

		it('Returns empty string when there is no response.', () => {
			expect(request.getAllResponseHeaders()).toBe('');
		});
	});

	describe('send()', () => {
		it('Throws an exception if the request has not been opened.', () => {
			expect(() => request.send()).toThrowError(
				`Failed to execute 'send' on 'XMLHttpRequest': Connection must be opened before send() is called.`
			);
		});

		it('Throws an exception if the request has already been sent.', () => {
			request.open('GET', REQUEST_URL, true);
			request.send();

			expect(() => request.send()).toThrowError(
				`Failed to execute 'send' on 'XMLHttpRequest': Send has already been called.`
			);
		});

		it('Throws an exception when the page is HTTPS and the request is HTTP.', () => {
			const unsecureURL = 'http://unsecure.happydom';
			request.open('GET', unsecureURL, false);

			expect(() => request.send()).toThrowError(
				`Mixed Content: The page at '${window.location.href}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${unsecureURL}/'. This request has been blocked; the content must be served over HTTPS.`
			);
		});

		it('Throws an exception when doing a synchronous request towards a local file if "window.happyDOM.settings.enableFileSystemHttpRequests" has not been enabled.', () => {
			request.open('GET', 'file://C:/path/to/file.txt', false);

			expect(() => request.send()).toThrowError(
				'File system is disabled by default for security reasons. To enable it, set the "window.happyDOM.settings.enableFileSystemHttpRequests" option to true.'
			);
		});

		it('Throws an exception when doing an asynchronous request towards a local file if "window.happyDOM.settings.enableFileSystemHttpRequests" has not been enabled.', () => {
			request.open('GET', 'file://C:/path/to/file.txt', true);

			expect(() => request.send()).toThrowError(
				'File system is disabled by default for security reasons. To enable it, set the "window.happyDOM.settings.enableFileSystemHttpRequests" option to true.'
			);
		});

		it('Throws an exception when doing a synchronous request towards a local file with another method than "GET".', () => {
			window.happyDOM.settings.enableFileSystemHttpRequests = true;

			request.open('POST', 'file://C:/path/to/file.txt', false);

			expect(() => request.send()).toThrowError(
				'Failed to send local file system request. Only "GET" method is supported for local file system requests.'
			);
		});

		it('Throws an exception when doing a asynchronous request towards a local file with another method than "GET".', () => {
			window.happyDOM.settings.enableFileSystemHttpRequests = true;

			request.open('POST', 'file://C:/path/to/file.txt', true);

			expect(() => request.send()).toThrowError(
				'Failed to send local file system request. Only "GET" method is supported for local file system requests.'
			);
		});
	});
});
