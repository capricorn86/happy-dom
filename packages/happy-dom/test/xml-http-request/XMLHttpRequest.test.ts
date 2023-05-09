import XMLHttpRequest from '../../src/xml-http-request/XMLHttpRequest';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import XMLHttpRequestReadyStateEnum from '../../src/xml-http-request/XMLHttpRequestReadyStateEnum';
import XMLHttpResponseTypeEnum from '../../src/xml-http-request/XMLHttpResponseTypeEnum';
import XMLHttpRequestSyncRequestScriptBuilder from '../../src/xml-http-request/utilities/XMLHttpRequestSyncRequestScriptBuilder';
import XMLHttpRequestCertificate from '../../src/xml-http-request/XMLHttpRequestCertificate';
import ProgressEvent from '../../src/event/events/ProgressEvent';
import HTTP from 'http';

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
		resetMockedModules();
	});

	describe('get status()', () => {
		it('Returns status for synchrounous requests.', () => {
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 201,
							statusMessage: 'OK',
							headers: {},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			expect(request.status).toBe(null);

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.status).toBe(201);
		});

		it('Returns status for asynchrounous requests.', (done) => {
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 201,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			expect(request.status).toBe(null);

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(request.status).toBe(201);
				done();
			});

			request.send();
		});
	});

	describe('get statusText()', () => {
		it('Returns status text for synchrounous requests.', () => {
			const expectedStatusText = 'Test';

			expect(request.statusText).toBe(null);

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: expectedStatusText,
							headers: {},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.statusText).toBe(expectedStatusText);
		});

		it('Returns status text for asynchrounous requests.', (done) => {
			const expectedStatusText = 'Test';

			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: expectedStatusText,
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			expect(request.statusText).toBe(null);

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(request.statusText).toBe(expectedStatusText);
				done();
			});

			request.send();
		});
	});

	describe('get responseURL()', () => {
		it('Returns response URL for synchrounous requests.', () => {
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			expect(request.responseURL).toBe('');

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.responseURL).toBe(WINDOW_URL + REQUEST_URL);
		});

		it('Returns response URL for asynchrounous requests.', (done) => {
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

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
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
		});

		it('Returns ready state for asynchrounous requests.', (done) => {
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

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
			const responseText = 'test';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: responseText,
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			request.open('GET', REQUEST_URL, false);
			request.send();
			expect(request.responseText).toBe(responseText);
		});

		it('Returns response text for asynchrounous requests.', (done) => {
			const responseText = 'test';
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);
			request.addEventListener('load', () => {
				expect(request.responseText).toBe(responseText);
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
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

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
			let isExecuted = false;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					expect(args[1]).toBe(
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

					isExecuted = true;

					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			request.open('GET', REQUEST_URL, false);
			expect(request.setRequestHeader('test-header', 'test')).toBe(true);
			request.send();
			expect(isExecuted).toBe(true);
		});

		it('Sets a request header on an asynchrounous request.', (done) => {
			const responseText = 'test';

			mockModule('https', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options.headers).toEqual({
						accept: '*/*',
						cookie: '',
						host: window.location.host,
						referer: WINDOW_URL + '/',
						'user-agent': window.navigator.userAgent,
						'test-header': 'test'
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});
			request.open('GET', REQUEST_URL, true);
			expect(request.setRequestHeader('test-header', 'test')).toBe(true);
			request.addEventListener('load', () => done());
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
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {
								key1: 'value1',
								key2: 'value2',
								'set-cookie': 'key1=value1',
								'set-cookie2': 'key1=value1'
							},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

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
			const responseText = 'test';

			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length,
									key1: 'value1',
									key2: 'value2',
									'set-cookie': 'key1=value1',
									'set-cookie2': 'key1=value1'
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);

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
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {
								key1: 'value1',
								key2: 'value2',
								'set-cookie': 'key1=value1',
								'set-cookie2': 'key1=value1'
							},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(request.getAllResponseHeaders()).toBe('key1: value1\r\nkey2: value2');
		});

		it('Returns all response headers for an asynchrounous request.', (done) => {
			const responseText = 'test';

			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length,
									key1: 'value1',
									key2: 'value2',
									'set-cookie': 'key1=value1',
									'set-cookie2': 'key1=value1'
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(request.getAllResponseHeaders()).toBe(
					'content-length: 4\r\nkey1: value1\r\nkey2: value2'
				);
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
			mockModule('https', {
				request: (_options: unknown) => {
					return {
						end: () => {},
						on: () => {}
					};
				}
			});

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

		it('Performs a synchronous request towards a local file.', () => {
			const filepath = 'C:/path/to/file.txt';
			const fileContent = 'test';

			mockModule('fs', {
				readFileSync: (path: string) => {
					expect(path).toBe(filepath);
					return Buffer.from(fileContent);
				}
			});

			window.happyDOM.settings.enableFileSystemHttpRequests = true;

			request.open('GET', `file://${filepath}`, false);

			request.send();

			expect(request.responseText).toBe(fileContent);
			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
		});

		it('Performs an asynchronous request towards a local file.', (done) => {
			const filepath = 'C:/path/to/file.txt';
			const fileContent = 'test';

			mockModule('fs', {
				promises: {
					readFile: (path: string) => {
						expect(path).toBe(filepath);
						return Promise.resolve(Buffer.from(fileContent));
					}
				}
			});

			window.happyDOM.settings.enableFileSystemHttpRequests = true;

			request.open('GET', `file://${filepath}`, true);

			let isProgressTriggered = false;

			request.addEventListener('progress', (event: ProgressEvent) => {
				isProgressTriggered = true;
				expect(event.lengthComputable).toBe(true);
				expect(event.loaded).toBe(fileContent.length);
				expect(event.total).toBe(fileContent.length);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(request.responseText).toBe(fileContent);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				expect(isProgressTriggered).toBe(true);
				done();
			});

			request.send();
		});

		it('Performs a synchronous GET request with the HTTP protocol.', () => {
			const windowURL = 'http://localhost:8080';
			const responseText = 'test';

			mockModule('child_process', {
				execFileSync: (
					command: string,
					args: string[],
					options: { encoding: string; maxBuffer: number }
				) => {
					expect(command).toEqual(process.argv[0]);
					expect(args[0]).toBe('-e');
					expect(args[1]).toBe(
						XMLHttpRequestSyncRequestScriptBuilder.getScript(
							{
								host: 'localhost',
								port: 8080,
								path: REQUEST_URL,
								method: 'GET',
								headers: {
									accept: '*/*',
									referer: windowURL + '/',
									'user-agent': window.navigator.userAgent,
									cookie: '',
									host: window.location.host
								},
								agent: false,
								rejectUnauthorized: true,
								key: null,
								cert: null
							},
							false
						)
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});

					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: responseText,
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			window.happyDOM.setURL(windowURL);

			request.open('GET', REQUEST_URL, false);

			request.send();

			expect(request.responseText).toBe(responseText);
		});

		it('Performs a synchronous GET request with the HTTPS protocol.', () => {
			const responseText = 'test';

			mockModule('child_process', {
				execFileSync: (
					command: string,
					args: string[],
					options: { encoding: string; maxBuffer: number }
				) => {
					expect(command).toEqual(process.argv[0]);
					expect(args[0]).toBe('-e');
					expect(args[1]).toBe(
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
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});

					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {},
							text: responseText,
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});
			request.open('GET', REQUEST_URL, false);

			request.send();

			expect(request.responseText).toBe(responseText);
		});

		it('Performs an asynchronous GET request with the HTTP protocol listening to the "loadend" event.', (done) => {
			const responseText = 'test';
			const windowURL = 'http://localhost:8080';
			let body = '';

			mockModule('http', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options).toEqual({
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL,
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: windowURL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: null,
						cert: null
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			window.location.href = windowURL;

			request.open('GET', REQUEST_URL, true);

			let isProgressTriggered = false;

			request.addEventListener('progress', (event: ProgressEvent) => {
				isProgressTriggered = true;
				expect(event.lengthComputable).toBe(true);
				expect(event.loaded).toBe(responseText.length);
				expect(event.total).toBe(responseText.length);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('loadend', () => {
				expect(body).toBe('');
				expect(request.responseText).toBe(responseText);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				expect(isProgressTriggered).toBe(true);
				done();
			});

			request.send();
		});

		it('Performs an asynchronous GET request with the HTTPS protocol and query string.', (done) => {
			const responseText = 'http.request.body';
			const queryString = '?query=string';
			let body = '';

			mockModule('https', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options).toEqual({
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL + queryString,
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: WINDOW_URL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL + queryString, true);

			let isProgressTriggered = false;

			request.addEventListener('progress', (event: ProgressEvent) => {
				isProgressTriggered = true;
				expect(event.lengthComputable).toBe(true);
				expect(event.loaded).toBe(responseText.length);
				expect(event.total).toBe(responseText.length);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(body).toBe('');
				expect(request.responseText).toBe(responseText);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				expect(isProgressTriggered).toBe(true);
				done();
			});

			request.send();
		});

		it('Handles responses without content length.', (done) => {
			const responseText = 'http.request.body';
			let body = '';

			mockModule('https', {
				request: (
					_options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('progress', (event: ProgressEvent) => {
				expect(event.lengthComputable).toBe(false);
				expect(event.loaded).toBe(responseText.length);
				expect(event.total).toBe(0);
				done();
			});

			request.send();
		});

		it('Performs an asynchronous GET request with the HTTPS protocol.', (done) => {
			const responseText = 'http.request.body';
			let body = '';

			mockModule('https', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options).toEqual({
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL,
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: WINDOW_URL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);

			let isProgressTriggered = false;

			request.addEventListener('progress', (event: ProgressEvent) => {
				isProgressTriggered = true;
				expect(event.lengthComputable).toBe(true);
				expect(event.loaded).toBe(responseText.length);
				expect(event.total).toBe(responseText.length);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(body).toBe('');
				expect(request.responseText).toBe(responseText);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				expect(isProgressTriggered).toBe(true);
				done();
			});

			request.send();
		});

		it('Performs an asynchronous basic auth request with username and password.', (done) => {
			const username = 'username';
			const password = 'password';
			const responseText = 'http.request.body';
			let body = '';

			mockModule('https', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options).toEqual({
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL,
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: WINDOW_URL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: window.location.host,
							authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true, username, password);

			let isProgressTriggered = false;

			request.addEventListener('progress', (event: ProgressEvent) => {
				isProgressTriggered = true;
				expect(event.lengthComputable).toBe(true);
				expect(event.loaded).toBe(responseText.length);
				expect(event.total).toBe(responseText.length);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(body).toBe('');
				expect(request.responseText).toBe(responseText);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				expect(isProgressTriggered).toBe(true);
				done();
			});

			request.send();
		});

		it('Performs an asynchronous basic auth request with only username.', (done) => {
			const username = 'username';
			const responseText = 'http.request.body';
			let body = '';

			mockModule('https', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options).toEqual({
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL,
						method: 'GET',
						headers: {
							accept: '*/*',
							referer: WINDOW_URL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: window.location.host,
							authorization: `Basic ${Buffer.from(`${username}:`).toString('base64')}`
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true, username);

			request.addEventListener('load', () => {
				expect(body).toBe('');
				expect(request.responseText).toBe(responseText);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				done();
			});

			request.send();
		});

		it('Performs an asynchronous POST request.', (done) => {
			const postData = 'post.data';
			const responseText = 'http.request.body';
			let body = '';

			mockModule('https', {
				request: (
					options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					expect(options).toEqual({
						host: 'localhost',
						port: 8080,
						path: REQUEST_URL,
						method: 'POST',
						headers: {
							accept: '*/*',
							'content-length': postData.length,
							'content-type': 'text/plain;charset=UTF-8',
							referer: WINDOW_URL + '/',
							'user-agent': window.navigator.userAgent,
							cookie: '',
							host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					});
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'content-length': responseText.length
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						write: (data) => (body += data),
						on: () => {}
					};
				}
			});

			request.open('POST', REQUEST_URL, true);

			let isProgressTriggered = false;

			request.addEventListener('progress', (event: ProgressEvent) => {
				isProgressTriggered = true;
				expect(event.lengthComputable).toBe(true);
				expect(event.loaded).toBe(responseText.length);
				expect(event.total).toBe(responseText.length);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
			});

			request.addEventListener('load', () => {
				expect(body).toBe(postData);
				expect(request.responseText).toBe(responseText);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				expect(isProgressTriggered).toBe(true);
				done();
			});

			request.send(postData);
		});

		it('Writes cookies to document.cookie for synchrounous requests when the header "set-cookie" is returned in the response.', () => {
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {
								'set-cookie': ['key1=value1', 'key2=value2']
							},
							text: '',
							data: Buffer.from('').toString('base64')
						}
					});
				}
			});

			request.open('GET', REQUEST_URL, false);
			request.send();

			expect(window.document.cookie).toBe('key1=value1; key2=value2');
		});

		it('Returns response header for an asynchrounous request.', (done) => {
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {
									'set-cookie': ['key1=value1', 'key2=value2']
								},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				expect(window.document.cookie).toBe('key1=value1; key2=value2');
				done();
			});

			request.send();
		});

		it('Handles error in request when performing an asynchronous request.', (done) => {
			mockModule('https', {
				request: (
					_options: { headers: { [k: string]: string } },
					callback: (response: HTTP.IncomingMessage) => void
				) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'error') {
										setTimeout(() => callback(new Error('error')));
									}
								}
							}));
						},
						write: () => {},
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);

			request.addEventListener('load', () => {
				throw new Error('Load event should not be triggered.');
			});

			request.addEventListener('error', () => {
				expect(request.status).toBe(0);
				expect(request.statusText).toBe('Error: error');
				expect(
					request.responseText.startsWith('Error: error') && request.responseText.includes(' at ')
				).toBe(true);
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				done();
			});

			request.send();
		});

		it('Handles error in response when performing a synchronous request.', (done) => {
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: 'Error',
						data: {}
					});
				}
			});

			request.open('GET', REQUEST_URL, false);

			request.addEventListener('error', () => {
				expect(request.status).toBe(0);
				expect(request.statusText).toBe('Error');
				expect(request.responseText).toBe('');
				expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
				done();
			});

			request.send();
		});

		it('Handles Happy DOM asynchrounous tasks.', async () => {
			const responseText = 'responseText';
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(responseText));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {}
					};
				}
			});

			request.open('GET', REQUEST_URL, true);
			request.send();

			await window.happyDOM.whenAsyncComplete();

			expect(request.responseText).toBe(responseText);
		});
	});

	describe('abort()', () => {
		it('Aborts an asynchrounous request.', () => {
			let isDestroyed = false;
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							setTimeout(() => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: '',
									headers: {},
									on: (event, callback) => {
										if (event === 'data') {
											callback(Buffer.from(''));
										} else if (event === 'end') {
											callback();
										}
									}
								}));
							});
						},
						on: () => {},
						destroy: () => (isDestroyed = true)
					};
				}
			});

			let isAbortTriggered = false;
			let isLoadEndTriggered = false;
			request.open('GET', REQUEST_URL, true);
			request.send();
			request.addEventListener('abort', () => {
				isAbortTriggered = true;
			});
			request.addEventListener('loadend', () => {
				isLoadEndTriggered = true;
			});
			request.abort();
			expect(isAbortTriggered).toBe(true);
			expect(isLoadEndTriggered).toBe(true);
			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);
			expect(isDestroyed).toBe(true);
		});

		it('Ends an ongoing Happy DOM asynchrounous task.', async () => {
			let isDestroyed = false;
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {},
						destroy: () => (isDestroyed = true)
					};
				}
			});

			request.open('GET', REQUEST_URL, true);
			request.send();
			request.abort();

			await window.happyDOM.whenAsyncComplete();

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);
			expect(isDestroyed).toBe(true);
		});

		it('Aborts an ongoing request when cancelling all Happy DOM asynchrounous tasks.', async () => {
			let isDestroyed = false;
			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					return {
						end: () => {
							callback(<HTTP.IncomingMessage>(<unknown>{
								statusCode: 200,
								statusMessage: '',
								headers: {},
								on: (event, callback) => {
									if (event === 'data') {
										callback(Buffer.from(''));
									} else if (event === 'end') {
										callback();
									}
								}
							}));
						},
						on: () => {},
						destroy: () => (isDestroyed = true)
					};
				}
			});

			request.open('GET', REQUEST_URL, true);
			request.send();

			window.happyDOM.cancelAsync();

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);
			expect(isDestroyed).toBe(true);
		});
	});
});
