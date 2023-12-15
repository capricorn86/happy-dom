import XMLHttpRequest from '../../src/xml-http-request/XMLHttpRequest.js';
import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import XMLHttpRequestReadyStateEnum from '../../src/xml-http-request/XMLHttpRequestReadyStateEnum.js';
import XMLHttpResponseTypeEnum from '../../src/xml-http-request/XMLHttpResponseTypeEnum.js';
import XMLHttpRequestSyncRequestScriptBuilder from '../../src/xml-http-request/utilities/XMLHttpRequestSyncRequestScriptBuilder.js';
import XMLHttpRequestCertificate from '../../src/xml-http-request/XMLHttpRequestCertificate.js';
import ProgressEvent from '../../src/event/events/ProgressEvent.js';
import HTTP from 'http';
import { TextDecoder } from 'util';
import Blob from '../../src/file/Blob.js';
import IDocument from '../../src/nodes/document/IDocument.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import '../types.d.js';
import { Stream } from 'stream';
import HTTPS from 'https';

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
		vi.restoreAllMocks();
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

		it('Returns status for asynchrounous requests.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});

				request.send();
			});
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

		it('Returns status text for asynchrounous requests.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});

				request.send();
			});
		});
	});

	describe('get response()', () => {
		it('Returns ArrayBuffer when "responseType" is set to "arrayBuffer".', async () => {
			await new Promise((resolve) => {
				const expectedResponse = 'Test';

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
											callback(Buffer.from(expectedResponse));
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

				request.responseType = XMLHttpResponseTypeEnum.arraybuffer;
				request.open('GET', REQUEST_URL, true);

				request.addEventListener('load', () => {
					expect(new TextDecoder().decode(<ArrayBuffer>request.response)).toBe(expectedResponse);
					resolve(null);
				});

				request.send();
			});
		});

		it('Returns Blob when "responseType" is set to "blob".', async () => {
			await new Promise((resolve) => {
				const expectedResponse = 'Test';

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
											callback(Buffer.from(expectedResponse));
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

				request.responseType = XMLHttpResponseTypeEnum.blob;
				request.open('GET', REQUEST_URL, true);

				request.addEventListener('load', () => {
					expect((<Blob>request.response).__buffer__.toString()).toBe(expectedResponse);
					resolve(null);
				});

				request.send();
			});
		});

		it('Returns Document when "responseType" is set to "document".', async () => {
			await new Promise((resolve) => {
				const expectedResponse = 'Test';

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
											callback(Buffer.from(expectedResponse));
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

				request.responseType = XMLHttpResponseTypeEnum.document;
				request.open('GET', REQUEST_URL, true);

				request.addEventListener('load', () => {
					expect((<IDocument>request.response).documentElement.outerHTML).toBe(
						'<html><head></head><body>Test</body></html>'
					);
					resolve(null);
				});

				request.send();
			});
		});

		it('Returns JSON when "responseType" is set to "json".', async () => {
			await new Promise((resolve) => {
				const expectedResponse = '{ "key1": "value1", "key2": "value2" }';

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
											callback(Buffer.from(expectedResponse));
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

				request.responseType = XMLHttpResponseTypeEnum.json;
				request.open('GET', REQUEST_URL, true);

				request.addEventListener('load', () => {
					expect(<object>request.response).toEqual({ key1: 'value1', key2: 'value2' });
					resolve(null);
				});

				request.send();
			});
		});

		it('Defaults to text.', async () => {
			await new Promise((resolve) => {
				const expectedResponse = 'Test';

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
											callback(Buffer.from(expectedResponse));
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
					expect(<string>request.response).toEqual('Test');
					resolve(null);
				});

				request.send();
			});
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

		it('Returns response URL for asynchrounous requests.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});

				request.send();
			});
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

		it('Returns ready state for asynchrounous requests.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});

				request.send();
			});
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

		it('Returns response text for asynchrounous requests.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});
				request.send();
			});
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

		it(`Throws an exception if readyState is "loading".`, async () => {
			await new Promise((resolve) => {
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
				request.addEventListener('load', () => resolve(null));
				request.send();
			});
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
									Accept: '*/*',
									Referer: WINDOW_URL + '/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br',
									Connection: 'close',
									'test-header': 'test',
									Host: window.location.host
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

		it('Sets a request header on an asynchrounous request.', async () => {
			await new Promise((resolve) => {
				const responseText = 'test';

				mockModule('https', {
					request: (
						options: { headers: { [k: string]: string } },
						callback: (response: HTTP.IncomingMessage) => void
					) => {
						expect(options.headers).toEqual({
							Accept: '*/*',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							Host: window.location.host,
							Referer: WINDOW_URL + '/',
							'User-Agent': window.navigator.userAgent,
							'test-header': 'test'
						});
						return {
							end: () => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: '',
									headers: {
										'Content-Length': responseText.length
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
				request.addEventListener('load', () => resolve(null));
				request.send();
			});
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
				execFileSync: (_command: string, args: string[]) => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {
								key1: 'value1',
								key2: 'value2',
								'Set-Cookie': 'key1=value1',
								'Set-Cookie2': 'key1=value1'
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

		it('Returns response header for an asynchrounous request.', async () => {
			await new Promise((resolve) => {
				const responseText = 'test';

				mockModule('https', {
					request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
						return {
							end: () => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: '',
									headers: {
										'Content-Length': responseText.length,
										key1: 'value1',
										key2: 'value2',
										'Set-Cookie': 'key1=value1',
										'Set-Cookie2': 'key1=value1'
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

					resolve(null);
				});

				request.send();
			});
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
								'Set-Cookie': 'key1=value1',
								'Set-Cookie2': 'key1=value1'
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

		it('Returns all response headers for an asynchrounous request.', async () => {
			await new Promise((resolve) => {
				const responseText = 'test';

				mockModule('https', {
					request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
						return {
							end: () => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: '',
									headers: {
										'Content-Length': responseText.length,
										key1: 'value1',
										key2: 'value2',
										'Set-Cookie': 'key1=value1',
										'Set-Cookie2': 'key1=value1'
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
						'Content-Length: 4\r\nkey1: value1\r\nkey2: value2'
					);
					resolve(null);
				});

				request.send();
			});
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

		it('Throws an exception when doing a synchronous request towards a local file if the Happy DOM setting "enableFileSystemHttpRequests" has not been enabled.', () => {
			request.open('GET', 'file://C:/path/to/file.txt', false);

			expect(() => request.send()).toThrowError(
				'File system is disabled by default for security reasons. To enable it, set the Happy DOM setting "enableFileSystemHttpRequests" option to true.'
			);
		});

		it('Throws an exception when doing an asynchronous request towards a local file if the Happy DOM setting "enableFileSystemHttpRequests" has not been enabled.', () => {
			request.open('GET', 'file://C:/path/to/file.txt', true);

			expect(() => request.send()).toThrowError(
				'File system is disabled by default for security reasons. To enable it, set the Happy DOM setting "enableFileSystemHttpRequests" option to true.'
			);
		});

		it('Throws an exception when doing a synchronous request towards a local file with another method than "GET".', () => {
			window = new Window({
				settings: {
					enableFileSystemHttpRequests: true
				}
			});
			request = new window.XMLHttpRequest();

			request.open('POST', 'file://C:/path/to/file.txt', false);

			expect(() => request.send()).toThrowError(
				'Failed to send local file system request. Only "GET" method is supported for local file system requests.'
			);
		});

		it('Throws an exception when doing a asynchronous request towards a local file with another method than "GET".', () => {
			window = new Window({
				settings: {
					enableFileSystemHttpRequests: true
				}
			});
			request = new window.XMLHttpRequest();

			request.open('POST', 'file://C:/path/to/file.txt', true);

			expect(() => request.send()).toThrowError(
				'Failed to send local file system request. Only "GET" method is supported for local file system requests.'
			);
		});

		it('Performs a synchronous request towards a local file.', () => {
			window = new Window({
				settings: {
					enableFileSystemHttpRequests: true
				}
			});
			request = new window.XMLHttpRequest();

			const filepath = 'C:/path/to/file.txt';
			const fileContent = 'test';

			mockModule('fs', {
				readFileSync: (path: string) => {
					expect(path).toBe(filepath);
					return Buffer.from(fileContent);
				}
			});

			request.open('GET', `file://${filepath}`, false);

			request.send();

			expect(request.responseText).toBe(fileContent);
			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
			expect(request.getAllResponseHeaders()).toBe('Content-Length: 4\r\nContent-Type: text/plain');
		});

		it('Performs an asynchronous request towards a local file.', async () => {
			window = new Window({
				settings: {
					enableFileSystemHttpRequests: true
				}
			});
			request = new window.XMLHttpRequest();

			await new Promise((resolve) => {
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

				request.open('GET', `file://${filepath}`, true);

				let isProgressTriggered = false;

				request.addEventListener('progress', (event) => {
					isProgressTriggered = true;
					expect((<ProgressEvent>event).lengthComputable).toBe(true);
					expect((<ProgressEvent>event).loaded).toBe(fileContent.length);
					expect((<ProgressEvent>event).total).toBe(fileContent.length);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
				});

				request.addEventListener('load', () => {
					expect(request.responseText).toBe(fileContent);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
					expect(isProgressTriggered).toBe(true);
					resolve(null);
				});

				request.send();
			});
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
									Accept: '*/*',
									Referer: windowURL + '/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br',
									Connection: 'close',
									Host: window.location.host
								},
								agent: false,
								rejectUnauthorized: true
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

			window.happyDOM?.setURL(windowURL);

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
									Accept: '*/*',
									Referer: WINDOW_URL + '/',
									'User-Agent': window.navigator.userAgent,
									'Accept-Encoding': 'gzip, deflate, br',
									Connection: 'close',
									Host: window.location.host
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

		it('Performs an asynchronous GET request with the HTTP protocol listening to the "loadend" event.', async () => {
			await new Promise((resolve) => {
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
								Accept: '*/*',
								Referer: windowURL + '/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'close',
								Host: window.location.host
							},
							agent: false,
							rejectUnauthorized: true
						});
						return {
							end: () => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: '',
									headers: {
										'Content-Length': responseText.length
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

				request.addEventListener('progress', (event) => {
					isProgressTriggered = true;
					expect((<ProgressEvent>event).lengthComputable).toBe(true);
					expect((<ProgressEvent>event).loaded).toBe(responseText.length);
					expect((<ProgressEvent>event).total).toBe(responseText.length);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
				});

				request.addEventListener('loadend', () => {
					expect(body).toBe('');
					expect(request.responseText).toBe(responseText);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
					expect(isProgressTriggered).toBe(true);
					resolve(null);
				});

				request.send();
			});
		});

		it('Performs an asynchronous GET request with the HTTPS protocol and query string.', async () => {
			await new Promise((resolve) => {
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
								Accept: '*/*',
								Referer: WINDOW_URL + '/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'close',
								Host: window.location.host
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
										'Content-Length': responseText.length
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

				request.addEventListener('progress', (event) => {
					isProgressTriggered = true;
					expect((<ProgressEvent>event).lengthComputable).toBe(true);
					expect((<ProgressEvent>event).loaded).toBe(responseText.length);
					expect((<ProgressEvent>event).total).toBe(responseText.length);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
				});

				request.addEventListener('load', () => {
					expect(body).toBe('');
					expect(request.responseText).toBe(responseText);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
					expect(isProgressTriggered).toBe(true);
					resolve(null);
				});

				request.send();
			});
		});

		it('Handles responses without content length.', async () => {
			await new Promise((resolve) => {
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

				request.addEventListener('progress', (event) => {
					expect((<ProgressEvent>event).lengthComputable).toBe(false);
					expect((<ProgressEvent>event).loaded).toBe(responseText.length);
					expect((<ProgressEvent>event).total).toBe(0);
					resolve(null);
				});

				request.send();
			});
		});

		it('Performs an asynchronous GET request with the HTTPS protocol.', async () => {
			await new Promise((resolve) => {
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
								Accept: '*/*',
								Referer: WINDOW_URL + '/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'close',
								Host: window.location.host
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
										'Content-Length': responseText.length
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

				request.addEventListener('progress', (event) => {
					isProgressTriggered = true;
					expect((<ProgressEvent>event).lengthComputable).toBe(true);
					expect((<ProgressEvent>event).loaded).toBe(responseText.length);
					expect((<ProgressEvent>event).total).toBe(responseText.length);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
				});

				request.addEventListener('load', () => {
					expect(body).toBe('');
					expect(request.responseText).toBe(responseText);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
					expect(isProgressTriggered).toBe(true);
					resolve(null);
				});

				request.send();
			});
		});

		it('Performs an asynchronous basic auth request with username and password.', async () => {
			await new Promise((resolve) => {
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
								Accept: '*/*',
								Referer: WINDOW_URL + '/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'close',
								Host: window.location.host,
								Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
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
										'Content-Length': responseText.length
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

				request.addEventListener('progress', (event) => {
					isProgressTriggered = true;
					expect((<ProgressEvent>event).lengthComputable).toBe(true);
					expect((<ProgressEvent>event).loaded).toBe(responseText.length);
					expect((<ProgressEvent>event).total).toBe(responseText.length);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
				});

				request.addEventListener('load', () => {
					expect(body).toBe('');
					expect(request.responseText).toBe(responseText);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
					expect(isProgressTriggered).toBe(true);
					resolve(null);
				});

				request.send();
			});
		});

		it('Performs an asynchronous basic auth request with only username.', async () => {
			await new Promise((resolve) => {
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
								Accept: '*/*',
								Referer: WINDOW_URL + '/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'close',
								Host: window.location.host,
								Authorization: `Basic ${Buffer.from(`${username}:`).toString('base64')}`
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
										'Content-Length': responseText.length
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
					resolve(null);
				});

				request.send();
			});
		});

		it('Performs an asynchronous POST request.', async () => {
			await new Promise((resolve) => {
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
								Accept: '*/*',
								'Content-Length': String(postData.length),
								'Content-Type': 'text/plain;charset=UTF-8',
								Referer: WINDOW_URL + '/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Connection: 'close',
								Host: window.location.host
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
										'Content-Length': responseText.length
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

				request.addEventListener('progress', (event) => {
					isProgressTriggered = true;
					expect((<ProgressEvent>event).lengthComputable).toBe(true);
					expect((<ProgressEvent>event).loaded).toBe(responseText.length);
					expect((<ProgressEvent>event).total).toBe(responseText.length);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.loading);
				});

				request.addEventListener('load', () => {
					expect(body).toBe(postData);
					expect(request.responseText).toBe(responseText);
					expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.done);
					expect(isProgressTriggered).toBe(true);
					resolve(null);
				});

				request.send(postData);
			});
		});

		it('Writes cookies to document.cookie for synchrounous requests when the header "Set-Cookie" is returned in the response.', () => {
			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: '',
							headers: {
								'Set-Cookie': ['key1=value1', 'key2=value2']
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

		it('Returns response header for an asynchrounous request.', async () => {
			await new Promise((resolve) => {
				mockModule('https', {
					request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
						return {
							end: () => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: '',
									headers: {
										'Set-Cookie': ['key1=value1', 'key2=value2']
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
					resolve(null);
				});

				request.send();
			});
		});

		it('Handles error in request when performing an asynchronous request.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});

				request.send();
			});
		});

		it('Handles error in response when performing a synchronous request.', async () => {
			await new Promise((resolve) => {
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
					resolve(null);
				});

				request.send();
			});
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

			await window.happyDOM?.whenComplete();

			expect(request.responseText).toBe(responseText);
		});

		it('Supports cache for asynchrounous GET response with "Cache-Control" set to "max-age=60".', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			let requestCount = 0;

			mockModule('https', {
				request: (_options: unknown, callback: (response: HTTP.IncomingMessage) => void) => {
					requestCount++;

					return {
						end: () => {
							setTimeout(() => {
								callback(<HTTP.IncomingMessage>(<unknown>{
									statusCode: 200,
									statusMessage: 'OK',
									headers: {
										'content-type': 'text/html',
										'content-length': String(responseText.length),
										'cache-control': `max-age=60`
									},
									on: (event, callback) => {
										if (event === 'data') {
											callback(Buffer.from(responseText));
										} else if (event === 'end') {
											callback();
										}
									}
								}));
							});
						},
						on: () => {}
					};
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, true);
			request1.send();

			await new Promise((resolve) => request1.addEventListener('load', resolve));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, true);
			request2.send();

			await new Promise((resolve) => request2.addEventListener('load', resolve));

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=60`);

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=60`);

			expect(requestCount).toBe(1);
		});

		it('Supports cache for synchrounous GET response with "Cache-Control" set to "max-age=60".', () => {
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			let requestCount = 0;

			mockModule('child_process', {
				execFileSync: () => {
					requestCount++;

					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: 'OK',
							headers: {
								'content-type': 'text/html',
								'content-length': String(responseText.length),
								'cache-control': `max-age=60`
							},
							text: responseText,
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, false);
			request1.send();

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, false);
			request2.send();

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=60`);

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=60`);

			expect(requestCount).toBe(1);
		});

		it('Revalidates cache with a "If-Modified-Since" request for an asynchrounous GET response with "Cache-Control" set to "max-age=0.01".', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			const requestOptions: Array<HTTPS.RequestOptions> = [];

			mockModule('https', {
				request: (options: HTTPS.RequestOptions, callback) => {
					requestOptions.push(options);

					return {
						end: () => {
							setTimeout(() => {
								if (options.headers?.['If-Modified-Since']) {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 304,
										statusMessage: 'Not Modified',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText.length),
											'cache-control': `max-age=0.01`
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from([]));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								} else {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText.length),
											'cache-control': `max-age=0.01`,
											'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								}
							});
						},
						on: () => {}
					};
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, true);
			request1.setRequestHeader('key1', 'value1');
			request1.send();

			await new Promise((resolve) => request1.addEventListener('load', resolve));
			await new Promise((resolve) => setTimeout(resolve, 20));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, true);
			request2.send();

			await new Promise((resolve) => request2.addEventListener('load', resolve));

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');

			expect(requestOptions).toEqual([
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						key1: 'value1',
						Host: window.location.host
					}
				},
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						key1: 'value1',
						'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
						Host: window.location.host
					}
				}
			]);
		});

		it('Revalidates cache with a "If-Modified-Since" request for a synchrounous GET response with "Cache-Control" set to "max-age=0.01".', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			const childProcessArguments: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					childProcessArguments.push(args[1]);

					if (args[1].includes('If-Modified-Since')) {
						return JSON.stringify({
							error: null,
							data: {
								statusCode: 304,
								statusMessage: 'Not Modified',
								headers: {
									'content-type': 'text/html',
									'content-length': String(responseText.length),
									'cache-control': `max-age=0.01`
								},
								text: '',
								data: Buffer.from('').toString('base64')
							}
						});
					}

					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: 'OK',
							headers: {
								'content-type': 'text/html',
								'content-length': String(responseText.length),
								'cache-control': `max-age=0.01`,
								'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
							},
							text: responseText,
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, false);
			request1.setRequestHeader('key1', 'value1');
			request1.send();

			await new Promise((resolve) => setTimeout(resolve, 50));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, false);
			request2.send();

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');

			expect(childProcessArguments).toEqual([
				XMLHttpRequestSyncRequestScriptBuilder.getScript(
					{
						host: 'localhost',
						port: 8080,
						path: '/some/path',
						method: 'GET',
						headers: {
							Accept: '*/*',
							Referer: WINDOW_URL + '/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							key1: 'value1',
							Host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					},
					true
				),
				XMLHttpRequestSyncRequestScriptBuilder.getScript(
					{
						host: 'localhost',
						port: 8080,
						path: '/some/path',
						method: 'GET',
						headers: {
							Accept: '*/*',
							Referer: WINDOW_URL + '/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							key1: 'value1',
							'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
							Host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					},
					true
				)
			]);
		});

		it('Updates cache after a failed revalidation with a "If-Modified-Since" request for an asynchrounous GET response with "Cache-Control" set to "max-age=0.01".', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const requestOptions: Array<HTTPS.RequestOptions> = [];

			mockModule('https', {
				request: (options: HTTPS.RequestOptions, callback) => {
					requestOptions.push(options);

					return {
						end: () => {
							setTimeout(() => {
								if (options.headers?.['If-Modified-Since']) {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText2.length),
											'cache-control': `max-age=1`,
											'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText2));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								} else {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText1.length),
											'cache-control': `max-age=0.01`,
											'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText1));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								}
							});
						},
						on: () => {}
					};
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, true);
			request1.setRequestHeader('key1', 'value1');
			request1.send();

			await new Promise((resolve) => request1.addEventListener('load', resolve));
			await new Promise((resolve) => setTimeout(resolve, 15));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, true);
			request2.setRequestHeader('key1', 'value1');
			request2.send();

			await new Promise((resolve) => request2.addEventListener('load', resolve));

			const request3 = new window.XMLHttpRequest();

			request3.open('GET', url, true);
			request3.setRequestHeader('key1', 'value1');
			request3.send();

			await new Promise((resolve) => request3.addEventListener('load', resolve));

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText1);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText1.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText2);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=1`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');

			expect(request3.responseURL).toBe(url);
			expect(request3.status).toBe(200);
			expect(request3.statusText).toBe('OK');
			expect(request3.responseText).toBe(responseText2);
			expect(request3.getResponseHeader('content-type')).toBe('text/html');
			expect(request3.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(request3.getResponseHeader('cache-control')).toBe(`max-age=1`);
			expect(request3.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');

			expect(requestOptions).toEqual([
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						key1: 'value1'
					}
				},
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
						'User-Agent': window.navigator.userAgent,
						key1: 'value1'
					}
				}
			]);
		});

		it('Updates cache after a failed revalidation with a "If-Modified-Since" request for a synchrounous GET response with "Cache-Control" set to "max-age=0.01".', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const childProcessArguments: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					childProcessArguments.push(args[1]);

					if (args[1].includes('If-Modified-Since')) {
						return JSON.stringify({
							error: null,
							data: {
								statusCode: 200,
								statusMessage: 'OK',
								headers: {
									'content-type': 'text/html',
									'content-length': String(responseText2.length),
									'cache-control': `max-age=0.01`,
									'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
								},
								text: responseText2,
								data: Buffer.from(responseText2).toString('base64')
							}
						});
					}

					return JSON.stringify({
						error: null,
						data: {
							statusCode: 200,
							statusMessage: 'OK',
							headers: {
								'content-type': 'text/html',
								'content-length': String(responseText1.length),
								'cache-control': `max-age=0.01`,
								'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
							},
							text: responseText1,
							data: Buffer.from(responseText1).toString('base64')
						}
					});
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, false);
			request1.setRequestHeader('key1', 'value1');
			request1.send();

			await new Promise((resolve) => setTimeout(resolve, 50));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, false);
			request2.setRequestHeader('key1', 'value1');
			request2.send();

			const request3 = new window.XMLHttpRequest();

			request3.open('GET', url, false);
			request3.setRequestHeader('key1', 'value1');
			request3.send();

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText1);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText1.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText2);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');

			expect(request3.responseURL).toBe(url);
			expect(request3.status).toBe(200);
			expect(request3.statusText).toBe('OK');
			expect(request3.responseText).toBe(responseText2);
			expect(request3.getResponseHeader('content-type')).toBe('text/html');
			expect(request3.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(request3.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request3.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');

			expect(childProcessArguments).toEqual([
				XMLHttpRequestSyncRequestScriptBuilder.getScript(
					{
						host: 'localhost',
						port: 8080,
						path: '/some/path',
						method: 'GET',
						headers: {
							Accept: '*/*',
							Referer: WINDOW_URL + '/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							key1: 'value1',
							Host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					},
					true
				),
				XMLHttpRequestSyncRequestScriptBuilder.getScript(
					{
						host: 'localhost',
						port: 8080,
						path: '/some/path',
						method: 'GET',
						headers: {
							Accept: '*/*',
							Referer: WINDOW_URL + '/',
							'User-Agent': window.navigator.userAgent,
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'close',
							key1: 'value1',
							'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
							Host: window.location.host
						},
						agent: false,
						rejectUnauthorized: true,
						key: XMLHttpRequestCertificate.key,
						cert: XMLHttpRequestCertificate.cert
					},
					true
				)
			]);
		});

		it('Revalidates cache with a "If-None-Match" request for an asynchrounous HEAD response with an "Etag" header.', async () => {
			const url = 'https://localhost:8080/some/path';
			const etag1 = '"etag1"';
			const etag2 = '"etag2"';
			const responseText = 'some text';
			const requestOptions: Array<HTTPS.RequestOptions> = [];

			mockModule('https', {
				request: (options: HTTPS.RequestOptions, callback) => {
					requestOptions.push(options);

					return {
						end: () => {
							setTimeout(() => {
								if (options.headers?.['If-None-Match']) {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 304,
										statusMessage: 'Not Modified',
										headers: {
											etag: etag2,
											'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from([]));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								} else {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText.length),
											'cache-control': `max-age=0.01`,
											'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
											etag: etag1
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								}
							});
						},
						on: () => {}
					};
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('HEAD', url, true);
			request1.setRequestHeader('key1', 'value1');
			request1.send();

			await new Promise((resolve) => request1.addEventListener('load', resolve));
			await new Promise((resolve) => setTimeout(resolve, 20));

			const request2 = new window.XMLHttpRequest();

			request2.open('HEAD', url, true);
			request2.send();

			await new Promise((resolve) => request2.addEventListener('load', resolve));

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');
			expect(request1.getResponseHeader('etag')).toBe(etag1);

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');
			expect(request2.getResponseHeader('etag')).toBe(etag2);

			expect(requestOptions).toEqual([
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'HEAD',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						key1: 'value1'
					}
				},
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'HEAD',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'If-None-Match': etag1,
						'User-Agent': window.navigator.userAgent,
						key1: 'value1'
					}
				}
			]);
		});

		it('Updates cache after a failed revalidation with a "If-None-Match" request for an asynchrounous GET response with an "Etag" header.', async () => {
			const url = 'https://localhost:8080/some/path';
			const etag1 = '"etag1"';
			const etag2 = '"etag2"';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const requestOptions: Array<HTTPS.RequestOptions> = [];

			mockModule('https', {
				request: (options: HTTPS.RequestOptions, callback) => {
					requestOptions.push(options);

					return {
						end: () => {
							setTimeout(() => {
								if (options.headers?.['If-None-Match']) {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText2.length),
											'cache-control': `max-age=0.01`,
											'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
											etag: etag2
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText2));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								} else {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText1.length),
											'cache-control': `max-age=0.01`,
											'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
											etag: etag1
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText1));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								}
							});
						},
						on: () => {}
					};
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, true);
			request1.setRequestHeader('key1', 'value1');
			request1.send();

			await new Promise((resolve) => request1.addEventListener('load', resolve));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, true);
			request2.send();

			await new Promise((resolve) => request2.addEventListener('load', resolve));

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText1);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText1.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');
			expect(request1.getResponseHeader('etag')).toBe(etag1);

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText2);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=0.01`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');
			expect(request2.getResponseHeader('etag')).toBe(etag2);

			expect(requestOptions).toEqual([
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						key1: 'value1'
					}
				},
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'If-None-Match': etag1,
						'User-Agent': window.navigator.userAgent,
						key1: 'value1'
					}
				}
			]);
		});

		it('Supports cache for an asynchrounous GET response with "Cache-Control" set to "max-age=60" and "Vary" set to "vary-header".', async () => {
			const url = 'https://localhost:8080/some/path';
			const responseText1 = 'vary 1';
			const responseText2 = 'vary 2';
			const requestOptions: Array<HTTPS.RequestOptions> = [];

			mockModule('https', {
				request: (options: HTTPS.RequestOptions, callback) => {
					requestOptions.push(options);

					return {
						end: () => {
							setTimeout(() => {
								if (options.headers?.['vary-header'] === 'vary1') {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText1.length),
											'cache-control': `max-age=60`,
											'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
											vary: 'vary-header'
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText1));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								} else if (options.headers?.['vary-header'] === 'vary2') {
									callback(<HTTP.IncomingMessage>(<unknown>{
										statusCode: 200,
										statusMessage: 'OK',
										headers: {
											'content-type': 'text/html',
											'content-length': String(responseText2.length),
											'cache-control': `max-age=60`,
											'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
											vary: 'vary-header'
										},
										on: (event, callback) => {
											if (event === 'data') {
												callback(Buffer.from(responseText2));
											} else if (event === 'end') {
												callback();
											}
										}
									}));
								}
							});
						},
						on: () => {}
					};
				}
			});

			const request1 = new window.XMLHttpRequest();

			request1.open('GET', url, true);
			request1.setRequestHeader('vary-header', 'vary1');
			request1.send();

			await new Promise((resolve) => request1.addEventListener('load', resolve));

			const request2 = new window.XMLHttpRequest();

			request2.open('GET', url, true);
			request2.setRequestHeader('vary-header', 'vary2');
			request2.send();

			await new Promise((resolve) => request2.addEventListener('load', resolve));

			const cachedRequest1 = new window.XMLHttpRequest();

			cachedRequest1.open('GET', url, true);
			cachedRequest1.setRequestHeader('vary-header', 'vary1');
			cachedRequest1.send();

			await new Promise((resolve) => cachedRequest1.addEventListener('load', resolve));

			const cachedRequest2 = new window.XMLHttpRequest();

			cachedRequest2.open('GET', url, true);
			cachedRequest2.setRequestHeader('vary-header', 'vary2');
			cachedRequest2.send();

			await new Promise((resolve) => cachedRequest2.addEventListener('load', resolve));

			expect(request1.responseURL).toBe(url);
			expect(request1.status).toBe(200);
			expect(request1.statusText).toBe('OK');
			expect(request1.responseText).toBe(responseText1);
			expect(request1.getResponseHeader('content-type')).toBe('text/html');
			expect(request1.getResponseHeader('content-length')).toBe(String(responseText1.length));
			expect(request1.getResponseHeader('cache-control')).toBe(`max-age=60`);
			expect(request1.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 01:00:00 GMT');
			expect(request1.getResponseHeader('vary')).toBe('vary-header');

			expect(request2.responseURL).toBe(url);
			expect(request2.status).toBe(200);
			expect(request2.statusText).toBe('OK');
			expect(request2.responseText).toBe(responseText2);
			expect(request2.getResponseHeader('content-type')).toBe('text/html');
			expect(request2.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(request2.getResponseHeader('cache-control')).toBe(`max-age=60`);
			expect(request2.getResponseHeader('last-modified')).toBe('Mon, 11 Dec 2023 02:00:00 GMT');
			expect(request2.getResponseHeader('vary')).toBe('vary-header');

			expect(cachedRequest1.responseURL).toBe(url);
			expect(cachedRequest1.status).toBe(200);
			expect(cachedRequest1.statusText).toBe('OK');
			expect(cachedRequest1.responseText).toBe(responseText1);
			expect(cachedRequest1.getResponseHeader('content-type')).toBe('text/html');
			expect(cachedRequest1.getResponseHeader('content-length')).toBe(String(responseText1.length));
			expect(cachedRequest1.getResponseHeader('cache-control')).toBe(`max-age=60`);
			expect(cachedRequest1.getResponseHeader('last-modified')).toBe(
				'Mon, 11 Dec 2023 01:00:00 GMT'
			);
			expect(cachedRequest1.getResponseHeader('vary')).toBe('vary-header');

			expect(cachedRequest2.responseURL).toBe(url);
			expect(cachedRequest2.status).toBe(200);
			expect(cachedRequest2.statusText).toBe('OK');
			expect(cachedRequest2.responseText).toBe(responseText2);
			expect(cachedRequest2.getResponseHeader('content-type')).toBe('text/html');
			expect(cachedRequest2.getResponseHeader('content-length')).toBe(String(responseText2.length));
			expect(cachedRequest2.getResponseHeader('cache-control')).toBe(`max-age=60`);
			expect(cachedRequest2.getResponseHeader('last-modified')).toBe(
				'Mon, 11 Dec 2023 02:00:00 GMT'
			);
			expect(cachedRequest2.getResponseHeader('vary')).toBe('vary-header');

			expect(requestOptions).toEqual([
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						'vary-header': 'vary1'
					}
				},
				{
					host: 'localhost',
					port: 8080,
					path: '/some/path',
					method: 'GET',
					agent: false,
					rejectUnauthorized: true,
					key: XMLHttpRequestCertificate.key,
					cert: XMLHttpRequestCertificate.cert,
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Host: window.location.host,
						Referer: WINDOW_URL + '/',
						'User-Agent': window.navigator.userAgent,
						'vary-header': 'vary2'
					}
				}
			]);
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

			await window.happyDOM?.whenComplete();

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

			window.happyDOM?.abort();

			expect(request.readyState).toBe(XMLHttpRequestReadyStateEnum.unsent);
			expect(isDestroyed).toBe(true);
		});
	});
});
