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
			request.setRequestHeader('test-header', 'test');
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
			request.setRequestHeader('test-header', 'test');
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

		it(`Throws an exception if ready state is not "opened".`, () => {
			expect(() => request.setRequestHeader('key', 'value')).toThrowError(
				`Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`
			);
		});
	});
});
