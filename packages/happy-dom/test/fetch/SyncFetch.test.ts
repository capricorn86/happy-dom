import BrowserWindow from '../../src/window/BrowserWindow.js';
import Headers from '../../src/fetch/Headers.js';
import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import { ReadableStream } from 'stream/web';
import Zlib from 'zlib';
import { TextEncoder } from 'util';
import Blob from '../../src/file/Blob.js';
import { URLSearchParams } from 'url';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import SyncFetchScriptBuilder from '../../src/fetch/utilities/SyncFetchScriptBuilder.js';
import SyncFetch from '../../src/fetch/SyncFetch.js';
import IBrowserFrame from '../../src/browser/types/IBrowserFrame.js';
import Browser from '../../src/browser/Browser.js';
import '../types.d.js';

const PLATFORM =
	'X11; ' +
	process.platform.charAt(0).toUpperCase() +
	process.platform.slice(1) +
	' ' +
	process.arch;

describe('SyncFetch', () => {
	let browserFrame: IBrowserFrame;
	let window: BrowserWindow;

	beforeEach(() => {
		const browser = new Browser();
		const page = browser.newPage();

		browserFrame = page.mainFrame;
		window = page.mainFrame.window;
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('send()', () => {
		it('Rejects with error if url is protocol relative.', () => {
			const url = '//example.com/';
			let error: Error | null = null;

			try {
				new SyncFetch({
					browserFrame,
					window,
					url,
					init: {
						method: 'GET'
					}
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request': Invalid URL "${url}" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Rejects with error if url is relative path and no location is set on the document.', () => {
			const url = '/some/path';
			let error: Error | null = null;

			try {
				new SyncFetch({
					browserFrame,
					window,
					url,
					init: {
						method: 'GET'
					}
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct 'Request': Invalid URL "${url}" on document location 'about:blank'. Relative URLs are not permitted on current document location.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Rejects with error if protocol is unsupported.', () => {
			const url = 'ftp://example.com/';
			let error: Error | null = null;

			try {
				new SyncFetch({
					browserFrame,
					window,
					url,
					init: {
						method: 'GET'
					}
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to fetch from "${url}": URL scheme "ftp" is not supported.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Performs a basic plain text HTTPS GET request.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';

			mockModule('child_process', {
				execFileSync: (
					command: string,
					args: string[],
					options: { encoding: string; maxBuffer: number }
				) => {
					expect(command).toEqual(process.argv[0]);
					expect(args[0]).toBe('-e');
					expect(args[1]).toBe(
						SyncFetchScriptBuilder.getScript({
							url: new URL(url),
							method: 'GET',
							headers: {
								Accept: '*/*',
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: null
						})
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText.length)
							],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					method: 'GET'
				}
			}).send();

			expect(response.url).toBe(url);
			expect(response.ok).toBe(true);
			expect(response.redirected).toBe(false);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe('OK');
			expect(response.body.toString()).toBe(responseText);
			expect(response.headers instanceof Headers).toBe(true);

			const headers = {};
			for (const [key, value] of response.headers) {
				headers[key] = value;
			}

			expect(headers).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length)
			});
		});

		it('Performs a request with a relative URL and adds the "Referer" header set to the window location.', () => {
			const baseUrl = 'https://localhost:8080/base/';

			browserFrame.url = baseUrl;

			const path = 'some/path';
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
						SyncFetchScriptBuilder.getScript({
							url: new URL(baseUrl + path),
							method: 'GET',
							headers: {
								Accept: '*/*',
								Connection: 'close',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br',
								Referer: baseUrl
							},
							body: null
						})
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: path,
				init: {
					method: 'GET'
				}
			}).send();

			expect(response.body.toString()).toBe(responseText);
		});

		it('Should not allow to inject code into scripts executed using child_process.execFileSync().', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = `https://localhost:8080/\`+require('child_process').execSync('id')+\`/'+require('child_process').execSync('id')+'/?key="+require('child_process').execSync('id')+"`;
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
						SyncFetchScriptBuilder.getScript({
							url: new URL(
								`https://localhost:8080/\`+require('child_process').execSync('id')+\`/'+require('child_process').execSync('id')+'/?key="+require('child_process').execSync('id')+"`
							),
							method: 'GET',
							headers: {
								Accept: '*/*',
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: null
						})
					);
					expect(
						args[1].includes(
							`"https://localhost:8080/%60+require('child_process').execSync('id')+%60/'+require('child_process').execSync('id')+'/?key=%22+require(%27child_process%27).execSync(%27id%27)+%22"`
						)
					).toBe(true);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					method: 'GET'
				}
			}).send();

			expect(response.body.toString()).toBe(responseText);
		});

		it('Should send custom key/value object request headers.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
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
						SyncFetchScriptBuilder.getScript({
							url: new URL(url),
							method: 'GET',
							headers: {
								key1: 'value1',
								KeY2: 'Value2',
								Accept: '*/*',
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: null
						})
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						key1: 'value1',
						KeY2: 'Value2'
					}
				}
			}).send();

			expect(response.body.toString()).toBe(responseText);
		});

		it('Should send custom "Headers" instance request headers.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
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
						SyncFetchScriptBuilder.getScript({
							url: new URL(url),
							method: 'GET',
							headers: {
								key1: 'value1',
								KeY2: 'Value2',
								key3: 'value3, value4',
								Accept: '*/*',
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: null
						})
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const headers = new Headers({
				key1: 'value1',
				KeY2: 'Value2'
			});

			headers.append('key3', 'value3');
			headers.append('key3', 'value4');

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers
				}
			}).send();

			expect(response.body.toString()).toBe(responseText);
		});

		it('Includes Origin + Access-Control headers on cross-origin requests.', async () => {
			const originURL = 'http://localhost:8080';
			browserFrame.url = originURL;
			const url = 'http://other.origin.com/some/path';
			const body = '{"foo": "bar"}';

			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Access-Control-Allow-Origin', '*'],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					method: 'POST',
					body,
					headers: {
						'X-Custom-Header': 'yes',
						'Content-Type': 'application/json'
					}
				}
			}).send();

			expect(requestArgs.length, 'preflight + post request').toBe(2);

			// Access-Control headers should only be on preflight request, so expect to find them once
			const [optionsRequestArgs, postRequestArgs] = requestArgs;

			expect(optionsRequestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'OPTIONS',
					headers: {
						Accept: '*/*',
						'Access-Control-Request-Method': 'POST',
						'Access-Control-Request-Headers': 'content-type,x-custom-header',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Origin: originURL,
						Referer: originURL + '/'
					}
				})
			);

			expect(postRequestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'Content-Length': `${body.length}`,
						'Content-Type': 'application/json',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Origin: originURL,
						Referer: originURL + '/',
						'X-Custom-Header': 'yes'
					},
					body: Buffer.from(body)
				})
			);
		});

		it('Allows cross-origin request if "Browser.settings.fetch.disableSameOriginPolicy" is set to "true".', async () => {
			const originURL = 'http://localhost:8080';

			browserFrame.url = originURL;
			browserFrame.page.context.browser.settings.fetch.disableSameOriginPolicy = true;

			const url = 'http://other.origin.com/some/path';
			const body = '{"foo": "bar"}';

			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Access-Control-Allow-Origin', '*'],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					method: 'POST',
					body,
					headers: {
						'X-Custom-Header': 'yes',
						'Content-Type': 'application/json'
					}
				}
			}).send();

			expect(requestArgs.length).toBe(1);

			expect(requestArgs[0]).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'Content-Length': `${body.length}`,
						'Content-Type': 'application/json',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Origin: originURL,
						Referer: originURL + '/',
						'X-Custom-Header': 'yes'
					},
					body: Buffer.from(body)
				})
			);
		});

		for (const httpCode of [301, 302, 303, 307, 308]) {
			for (const method of ['GET', 'POST', 'PATCH']) {
				it(`Should follow ${method} request redirect code ${httpCode}.`, () => {
					browserFrame.url = 'https://localhost:8080/';

					const redirectURL = 'https://localhost:8080/redirect';
					const redirectURL2 = 'https://localhost:8080/redirect2';
					const targetPath = '/some/path';
					const targetURL = 'https://localhost:8080' + targetPath;
					const body = method !== 'GET' ? 'a=1' : null;
					const responseText = '{ "key1": "value1" }';
					const requestArgs: string[] = [];

					mockModule('child_process', {
						execFileSync: (
							command: string,
							args: string[],
							options: { encoding: string; maxBuffer: number }
						) => {
							expect(command).toEqual(process.argv[0]);
							expect(args[0]).toBe('-e');
							expect(options).toEqual({
								encoding: 'buffer',
								maxBuffer: 1024 * 1024 * 1024
							});
							requestArgs.push(args[1]);

							let rawHeaders: string[] = [];
							if (requestArgs.length === 1) {
								rawHeaders = ['Location', redirectURL2];
							} else if (requestArgs.length === 2) {
								rawHeaders = ['Location', targetPath];
							}
							return JSON.stringify({
								error: null,
								incomingMessage: {
									statusCode: requestArgs.length > 2 ? 200 : httpCode,
									rawHeaders,
									data: requestArgs.length > 2 ? Buffer.from(responseText).toString('base64') : ''
								}
							});
						}
					});

					const response = new SyncFetch({
						browserFrame,
						window,
						url: redirectURL,
						init: {
							method,
							body,
							headers: {
								key1: 'value1',
								key2: 'value2'
							}
						}
					}).send();

					const shouldBecomeGetRequest =
						httpCode === 303 || ((httpCode === 301 || httpCode === 302) && method === 'POST');

					expect(requestArgs).toEqual([
						SyncFetchScriptBuilder.getScript({
							url: new URL(redirectURL),
							method,
							headers: {
								key1: 'value1',
								key2: 'value2',
								Accept: '*/*',
								'Content-Length': body ? String(body.length) : <string>(<unknown>undefined),
								'Content-Type': body ? 'text/plain;charset=UTF-8' : <string>(<unknown>undefined),
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: body ? Buffer.from(body) : null
						}),
						SyncFetchScriptBuilder.getScript({
							url: new URL(redirectURL2),
							method: shouldBecomeGetRequest ? 'GET' : method,
							headers: {
								key1: 'value1',
								key2: 'value2',
								Accept: '*/*',
								'Content-Length':
									body && !shouldBecomeGetRequest
										? String(body.length)
										: <string>(<unknown>undefined),
								'Content-Type':
									body && !shouldBecomeGetRequest
										? 'text/plain;charset=UTF-8'
										: <string>(<unknown>undefined),
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: body && !shouldBecomeGetRequest ? Buffer.from(body) : null
						}),
						SyncFetchScriptBuilder.getScript({
							url: new URL(targetURL),
							method: shouldBecomeGetRequest ? 'GET' : method,
							headers: {
								key1: 'value1',
								key2: 'value2',
								Accept: '*/*',
								'Content-Length':
									body && !shouldBecomeGetRequest
										? String(body.length)
										: <string>(<unknown>undefined),
								'Content-Type':
									body && !shouldBecomeGetRequest
										? 'text/plain;charset=UTF-8'
										: <string>(<unknown>undefined),
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: body && !shouldBecomeGetRequest ? Buffer.from(body) : null
						})
					]);

					expect(response.status).toBe(200);
					expect(response.redirected).toBe(true);
					expect(response.body.toString()).toBe(responseText);
				});
			}
		}

		it('Should cancel a redirect loop after 20 tries.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url1 = 'https://localhost:8080/test/';
			const url2 = 'https://localhost:8080/test2/';
			let error: Error | null = null;
			let tryCount = 0;

			mockModule('child_process', {
				execFileSync: (
					command: string,
					args: string[],
					options: { encoding: string; maxBuffer: number }
				) => {
					tryCount++;
					const isEvenTry = tryCount % 2 == 0;
					expect(command).toEqual(process.argv[0]);
					expect(args[0]).toBe('-e');
					expect(args[1]).toBe(
						SyncFetchScriptBuilder.getScript({
							url: new URL(isEvenTry ? url2 : url1),
							method: 'GET',
							headers: {
								Accept: '*/*',
								Connection: 'close',
								Referer: 'https://localhost:8080/',
								'User-Agent': window.navigator.userAgent,
								'Accept-Encoding': 'gzip, deflate, br'
							},
							body: null
						})
					);
					expect(options).toEqual({
						encoding: 'buffer',
						maxBuffer: 1024 * 1024 * 1024
					});
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							statusMessage: 'OK',
							rawHeaders: isEvenTry ? ['Location', url1] : ['Location', url2],
							data: ''
						}
					});
				}
			});

			try {
				new SyncFetch({
					browserFrame,
					window,
					url: url1
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(`Maximum redirects reached at: ${url1}`, DOMExceptionNameEnum.networkError)
			);

			// One more as the request is completed before it reaches the 20th try.
			expect(tryCount).toBe(20 + 1);
		});

		it('Should support "manual" redirect mode.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://localhost:8080/redirect/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							rawHeaders: ['Location', redirectURL],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					redirect: 'manual'
				}
			}).send();

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should support "manual" redirect mode with broken location header.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const redirectURL = '<>';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							rawHeaders: ['Location', redirectURL],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					redirect: 'manual'
				}
			}).send();

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should support "manual" redirect mode to other host.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://example.com/redirect/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							rawHeaders: ['Location', redirectURL],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					redirect: 'manual'
				}
			}).send();

			expect(response.status).toBe(301);
			expect(response.headers.get('location')).toBe(redirectURL);
		});

		it('Should treat missing location header as a normal response (manual).', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					redirect: 'manual'
				}
			}).send();

			expect(response.status).toBe(301);
		});

		it('Should support "error" redirect.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const redirectURL = 'https://localhost:8080/redirect/';
			let error: Error | null = null;

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							rawHeaders: ['Location', redirectURL],
							data: ''
						}
					});
				}
			});

			try {
				new SyncFetch({
					browserFrame,
					window,
					url,
					init: {
						redirect: 'error'
					}
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`URI requested responds with a redirect, redirect mode is set to "error": ${url}`,
					DOMExceptionNameEnum.abortError
				)
			);
		});

		it('Should throw an error on invalid redirect URLs.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const redirectURL = '//super:invalid:url%/';
			let error: Error | null = null;

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 301,
							rawHeaders: ['Location', redirectURL],
							data: ''
						}
					});
				}
			});

			try {
				new SyncFetch({
					browserFrame,
					window,
					url
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`URI requested responds with an invalid redirect URL: ${redirectURL}`,
					DOMExceptionNameEnum.uriMismatchError
				)
			);
		});

		it("Does'nt forward unsafe headers.", () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						'accept-charset': 'unsafe',
						'accept-encoding': 'unsafe',
						'access-control-request-headers': 'unsafe',
						'access-control-request-method': 'unsafe',
						connection: 'unsafe',
						'content-length': 'unsafe',
						cookie: 'unsafe',
						cookie2: 'unsafe',
						date: 'unsafe',
						dnt: 'unsafe',
						expect: 'unsafe',
						host: 'unsafe',
						'keep-alive': 'unsafe',
						origin: 'unsafe',
						referer: 'unsafe',
						te: 'unsafe',
						trailer: 'unsafe',
						'transfer-encoding': 'unsafe',
						upgrade: 'unsafe',
						via: 'unsafe',
						'proxy-unsafe': 'unsafe',
						'sec-unsafe': 'unsafe',
						'safe-header': 'safe'
					}
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'safe-header': 'safe'
					},
					body: null
				})
			);
		});

		it('Does\'nt forward the headers "cookie", "authorization" or "www-authenticate" if request credentials are set to "omit".', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			let requestArgs: string | null = null;

			window.document.cookie = 'test=cookie';

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						authorization: 'authorization',
						'www-authenticate': 'www-authenticate'
					},
					credentials: 'omit'
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br'
					},
					body: null
				})
			);
		});

		it('Does\'nt forward the headers "cookie", "authorization" or "www-authenticate" if request credentials are set to "same-origin" and the request goes do a different origin than the document.', () => {
			const originURL = 'https://localhost:8080';

			browserFrame.url = originURL;

			const url = 'https://other.origin.com/some/path';
			let requestArgs: string | null = null;

			window.document.cookie = 'test=cookie';

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: args[1].includes('"method": "OPTIONS"')
								? ['Access-Control-Allow-Origin', '*']
								: [],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						authorization: 'authorization',
						'www-authenticate': 'www-authenticate'
					},
					credentials: 'same-origin'
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Origin: originURL,
						Referer: originURL + '/'
					},
					body: null
				})
			);
		});

		it("Does'nt allow requests to HTTP from HTTPS (mixed content).", () => {
			const originURL = 'https://localhost:8080/';

			browserFrame.url = originURL;

			const url = 'http://localhost:8080/some/path';
			let error: Error | null = null;

			try {
				new SyncFetch({
					browserFrame,
					window,
					url
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Mixed Content: The page at '${originURL}' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint '${url}'. This request has been blocked; the content must be served over HTTPS.`,
					DOMExceptionNameEnum.securityError
				)
			);
		});

		it('Forwards "cookie", "authorization" or "www-authenticate" if request credentials are set to "same-origin" and the request goes to the same origin as the document.', () => {
			const originURL = 'https://localhost:8080';

			browserFrame.url = originURL;

			const url = 'https://localhost:8080/some/path';
			const cookies = 'key1=value1; key2=value2';
			let requestArgs: string | null = null;

			for (const cookie of cookies.split(';')) {
				window.document.cookie = cookie.trim();
			}

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						authorization: 'authorization',
						'www-authenticate': 'www-authenticate'
					},
					credentials: 'same-origin'
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Referer: originURL + '/',
						Cookie: cookies,
						authorization: 'authorization',
						'www-authenticate': 'www-authenticate'
					},
					body: null
				})
			);
		});

		it('Forwards "cookie", "authorization" or "www-authenticate" if request credentials are set to "include".', () => {
			const originURL = 'https://localhost:8080';

			browserFrame.url = originURL;

			const url = 'https://other.origin.com/some/path';
			const cookies = 'key1=value1; key2=value2';
			let requestArgs: string | null = null;

			for (const cookie of cookies.split(';')) {
				window.document.cookie = cookie.trim();
			}

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: args[1].includes('"method": "OPTIONS"')
								? ['Access-Control-Allow-Origin', '*']
								: [],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						authorization: 'authorization',
						'www-authenticate': 'www-authenticate'
					},
					credentials: 'include'
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'GET',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						Origin: originURL,
						Referer: originURL + '/',
						Cookie: cookies,
						authorization: 'authorization',
						'www-authenticate': 'www-authenticate'
					},
					body: null
				})
			);
		});

		it('Sets document cookie string if the response contains a "Set-Cookie" header if request cridentials are set to "include".', () => {
			browserFrame.url = 'https://localhost:8080/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Set-Cookie', 'key1=value1', 'Set-Cookie', 'key2=value2'],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/some/path',
				init: {
					credentials: 'include'
				}
			}).send();

			expect(response.headers.get('Set-Cookie')).toBe(null);
			expect(window.document.cookie).toBe('key1=value1; key2=value2');
		});

		it('Allows setting the headers "User-Agent" and "Accept".', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						'User-Agent': 'user-agent',
						Accept: 'accept'
					}
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'GET',
					headers: {
						'Accept-Encoding': 'gzip, deflate, br',
						'User-Agent': 'user-agent',
						Accept: 'accept',
						Connection: 'close',
						Referer: 'https://localhost:8080/'
					},
					body: null
				})
			);
		});

		for (const errorCode of [400, 401, 403, 404, 500]) {
			it(`Handles error response with status ${errorCode}.`, () => {
				browserFrame.url = 'https://localhost:8080/';

				const responseText = 'some response text';

				mockModule('child_process', {
					execFileSync: () => {
						return JSON.stringify({
							error: null,
							incomingMessage: {
								statusCode: errorCode,
								statusMessage: 'Bad Request',
								rawHeaders: ['Content-Type', 'text/plain'],
								data: Buffer.from(responseText).toString('base64')
							}
						});
					}
				});

				const response = new SyncFetch({
					browserFrame,
					window,
					url: 'https://localhost:8080/some/path'
				}).send();

				expect(response.status).toBe(errorCode);
				expect(response.statusText).toBe('Bad Request');
				expect(response.headers.get('Content-Type')).toBe('text/plain');
				expect(response.ok).toBe(false);
				expect(response.body.toString()).toBe(responseText);
			});
		}

		it(`Handles network error response.`, () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			let error: Error | null = null;

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: 'connect ECONNREFUSED ::1:8080',
						data: null
					});
				}
			});

			try {
				new SyncFetch({
					browserFrame,
					window,
					url
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Synchronous fetch to "${url}" failed. Error: connect ECONNREFUSED ::1:8080`,
					DOMExceptionNameEnum.networkError
				)
			);
		});

		it('Should handle no content response with "gzip" encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'gzip'],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();

			expect(response.body.toString()).toBe('');
		});

		it('Handles unzipping content with "gzip" encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'gzip'],
							data: Zlib.gzipSync(Buffer.from(responseText)).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.body.toString()).toBe(responseText);
		});

		it('Should unzip content with slightly invalid "gzip" encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'gzip'],
							data: Zlib.gzipSync(Buffer.from(responseText)).slice(0, -8).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.body.toString()).toBe(responseText);
		});

		it('Handles 204 no content response with "gzip" encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 204,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'gzip'],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.status).toBe(204);
		});

		it('Should decompress content with "deflate" encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'deflate'],
							data: Zlib.deflateSync(Buffer.from(responseText)).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.body.toString()).toBe(responseText);
		});

		it('Handles 204 no content response with "deflate" encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 204,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'deflate'],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.status).toBe(204);
		});

		it('Handles unzipping content with "br" (brotli) encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'br'],
							data: Zlib.brotliCompressSync(Buffer.from(responseText)).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.body.toString()).toBe(responseText);
		});

		it('Handles 204 no content response with "br" (brotli) encoding.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 204,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'br'],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.status).toBe(204);
		});

		it('Skips decompression for unsupported encodings.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const responseText = 'some response text';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'unsupported-encoding'],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url
			}).send();
			expect(response.body.toString()).toBe(responseText);
		});

		it('Rejects with an error if decompression for "gzip" encoding is invalid.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			mockModule('child_process', {
				execFileSync: () => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: ['Content-Encoding', 'gzip'],
							data: Buffer.from('invalid').toString('base64')
						}
					});
				}
			});

			let error: Error | null = null;

			try {
				new SyncFetch({
					browserFrame,
					window,
					url
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					'Failed to read response body. Error: incorrect header check.',
					DOMExceptionNameEnum.encodingError
				)
			);
		});

		it('Rejects immediately if signal has already been aborted.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';

			const abortController = new window.AbortController();
			const abortSignal = abortController.signal;

			abortController.abort();

			let error: Error | null = null;
			try {
				new SyncFetch({
					browserFrame,
					window,
					url,
					init: {
						signal: abortSignal
					}
				}).send();
			} catch (e) {
				error = e;
			}
			expect(error).toEqual(
				new DOMException('The operation was aborted.', DOMExceptionNameEnum.abortError)
			);
		});

		it('Supports POST request with body as string.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/test/';
			const body = 'Hello, world!\n';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body
				}
			}).send();

			expect(requestArgs).toBe(
				SyncFetchScriptBuilder.getScript({
					url: new URL(url),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type': 'text/plain;charset=UTF-8',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as object (by stringifying to [object Object]).', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = { key: 'value' };
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: <string>(<unknown>body)
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type': 'text/plain;charset=UTF-8',
						'Content-Length': String(String(body).length)
					},
					body: Buffer.from(String(body))
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBuffer.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'Hello, world!\n';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: new TextEncoder().encode(body).buffer
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBufferView (Uint8Array).', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'Hello, world!\n';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: new TextEncoder().encode(body)
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBufferView (DataView).', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'Hello, world!\n';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: new DataView(new TextEncoder().encode(body).buffer)
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as ArrayBufferView (Uint8Array, offset, length).', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'Hello, world!\n';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: new TextEncoder().encode(body).subarray(7, 13)
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': '6'
					},
					body: Buffer.from('world!')
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as Blob without type.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'key1=value1&key2=value2';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: new Blob([body])
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Length': String(body.length)
					},
					body: Buffer.from('key1=value1&key2=value2')
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as Blob with type.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'key1=value1&key2=value2';
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: new Blob([body], {
						type: 'text/plain;charset=UTF-8'
					})
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						// Blob converts type to lowercase according to spec
						'Content-Type': 'text/plain;charset=utf-8',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Rejects with error if body is Stream.Readable.', () => {
			browserFrame.url = 'https://localhost:8080/';

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			let error: Error | null = null;

			try {
				new SyncFetch({
					browserFrame,
					window,
					url: 'https://localhost:8080/test/',
					init: {
						method: 'POST',
						body: new ReadableStream({
							start(controller) {
								controller.enqueue('chunk1');
								controller.close();
							}
						})
					}
				}).send();
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Streams are not supported as request body for synchrounous requests.`,
					DOMExceptionNameEnum.notSupportedError
				)
			);
		});

		it('Supports POST request with body as FormData.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body =
				'------HappyDOMFormDataBoundary0.ssssssssst\r\nContent-Disposition: form-data; name="key1"\r\n\r\nvalue1\r\n------HappyDOMFormDataBoundary0.ssssssssst\r\nContent-Disposition: form-data; name="key2"\r\n\r\nvalue2\r\n';
			const formData = new window.FormData();
			let requestArgs: string | null = null;

			vi.spyOn(Math, 'random').mockImplementation(() => 0.8);

			formData.set('key1', 'value1');
			formData.set('key2', 'value2');

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: formData
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type':
							'multipart/form-data; boundary=----HappyDOMFormDataBoundary0.ssssssssst',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports POST request with body as URLSearchParams.', () => {
			browserFrame.url = 'https://localhost:8080/';

			const body = 'key1=value1&key2=value2';
			const urlSearchParams = new URLSearchParams(body);
			let requestArgs: string | null = null;

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs = args[1];
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [],
							data: ''
						}
					});
				}
			});

			const response = new SyncFetch({
				browserFrame,
				window,
				url: 'https://localhost:8080/test/',
				init: {
					method: 'POST',
					body: urlSearchParams
				}
			}).send();

			expect(requestArgs).toEqual(
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/test/'),
					method: 'POST',
					headers: {
						Accept: '*/*',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': window.navigator.userAgent,
						'Accept-Encoding': 'gzip, deflate, br',
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
						'Content-Length': String(body.length)
					},
					body: Buffer.from(body)
				})
			);

			expect(response.status).toBe(200);
		});

		it('Supports cache for GET response with "Cache-Control" set to "max-age=60".', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			let requestCount = 0;

			mockModule('child_process', {
				execFileSync: () => {
					requestCount++;
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText.length),
								'cache-control',
								`max-age=60`
							],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response1 = new SyncFetch({ browserFrame, window, url }).send();
			const text1 = response1.body.toString();

			const response2 = new SyncFetch({ browserFrame, window, url }).send();
			const text2 = response2.body.toString();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=60`
			});

			expect(response2.url).toBe(response1.url);
			expect(response2.ok).toBe(response1.ok);
			expect(response2.redirected).toBe(response1.redirected);
			expect(response2.status).toBe(response1.status);
			expect(response2.statusText).toBe(response1.statusText);
			expect(text2).toBe(text1);
			expect(headers2).toEqual(headers1);

			expect(requestCount).toBe(1);
		});

		it('Revalidates cache with a "If-Modified-Since" request for a GET response with "Cache-Control" set to a "max-age".', async () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const responseText = 'some text';
			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);

					if (args[1].includes('If-Modified-Since')) {
						return JSON.stringify({
							error: null,
							incomingMessage: {
								statusCode: 304,
								statusMessage: 'Not Modified',
								rawHeaders: [
									'last-modified',
									'Mon, 11 Dec 2023 02:00:00 GMT',
									'cache-control',
									'max-age=1'
								],
								data: ''
							}
						});
					}
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText.length),
								'cache-control',
								'max-age=0.01',
								'last-modified',
								'Mon, 11 Dec 2023 01:00:00 GMT'
							],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response1 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						key1: 'value1'
					}
				}
			}).send();
			const text1 = response1.body.toString();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = new SyncFetch({ browserFrame, window, url }).send();
			const text2 = response2.body.toString();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=0.01`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
			});

			expect(response2.url).toBe(response1.url);
			expect(response2.ok).toBe(response1.ok);
			expect(response2.redirected).toBe(response1.redirected);
			expect(response2.status).toBe(response1.status);
			expect(response2.statusText).toBe(response1.statusText);
			expect(text2).toBe(text1);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'Cache-Control': 'max-age=1',
				'Last-Modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
			});

			expect(requestArgs).toEqual([
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				}),
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				})
			]);
		});

		it('Updates cache after a failed revalidation with a "If-Modified-Since" request for a GET response with "Cache-Control" set to a "max-age".', async () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);

					if (args[1].includes('If-Modified-Since')) {
						return JSON.stringify({
							error: null,
							incomingMessage: {
								statusCode: 200,
								statusMessage: 'OK',
								rawHeaders: [
									'content-type',
									'text/html',
									'content-length',
									String(responseText2.length),
									'cache-control',
									'max-age=1',
									'last-modified',
									'Mon, 11 Dec 2023 02:00:00 GMT'
								],
								data: Buffer.from(responseText2).toString('base64')
							}
						});
					}
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText1.length),
								'cache-control',
								'max-age=0.01',
								'last-modified',
								'Mon, 11 Dec 2023 01:00:00 GMT'
							],
							data: Buffer.from(responseText1).toString('base64')
						}
					});
				}
			});

			const response1 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						key1: 'value1'
					}
				}
			}).send();
			const text1 = response1.body.toString();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = new SyncFetch({ browserFrame, window, url }).send();
			const text2 = response2.body.toString();

			const response3 = new SyncFetch({ browserFrame, window, url }).send();
			const text3 = response3.body.toString();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			const headers3 = {};
			for (const [key, value] of response3.headers) {
				headers3[key] = value;
			}

			expect(response1.url).toBe('https://localhost:8080/some/path');
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText1);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText1.length),
				'cache-control': `max-age=0.01`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT'
			});

			expect(response2.url).toBe('https://localhost:8080/some/path');
			expect(response2.ok).toBe(true);
			expect(response2.redirected).toBe(false);
			expect(response2.status).toBe(200);
			expect(response2.statusText).toBe('OK');
			expect(text2).toBe(responseText2);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText2.length),
				'cache-control': 'max-age=1',
				'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT'
			});

			expect(response3.url).toBe(response2.url);
			expect(response3.ok).toBe(response2.ok);
			expect(response3.redirected).toBe(response2.redirected);
			expect(response3.status).toBe(response2.status);
			expect(response3.statusText).toBe(response2.statusText);
			expect(text3).toBe(text2);
			expect(headers3).toEqual(headers2);

			expect(requestArgs).toEqual([
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				}),
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'If-Modified-Since': 'Mon, 11 Dec 2023 01:00:00 GMT',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				})
			]);
		});

		it('Revalidates cache with a "If-None-Match" request for a HEAD response with an "Etag" header.', async () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const etag1 = '"etag1"';
			const etag2 = '"etag2"';
			const responseText = 'some text';
			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);

					if (args[1].includes('If-None-Match')) {
						return JSON.stringify({
							error: null,
							incomingMessage: {
								statusCode: 304,
								statusMessage: 'Not Modified',
								rawHeaders: ['etag', etag2, 'last-modified', 'Mon, 11 Dec 2023 02:00:00 GMT'],
								data: ''
							}
						});
					}
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText.length),
								'cache-control',
								'max-age=0.01',
								'last-modified',
								'Mon, 11 Dec 2023 01:00:00 GMT',
								'etag',
								etag1
							],
							data: Buffer.from(responseText).toString('base64')
						}
					});
				}
			});

			const response1 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					method: 'HEAD',
					headers: {
						key1: 'value1'
					}
				}
			}).send();
			const text1 = response1.body.toString();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					method: 'HEAD'
				}
			}).send();
			const text2 = response2.body.toString();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=0.01`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
				etag: etag1
			});

			expect(response2.url).toBe(response1.url);
			expect(response2.ok).toBe(response1.ok);
			expect(response2.redirected).toBe(response1.redirected);
			expect(response2.status).toBe(response1.status);
			expect(response2.statusText).toBe(response1.statusText);
			expect(text2).toBe(text1);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText.length),
				'cache-control': `max-age=0.01`,
				'Last-Modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
				ETag: etag2
			});

			expect(requestArgs).toEqual([
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'HEAD',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				}),
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'HEAD',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'If-None-Match': etag1,
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				})
			]);
		});

		it('Updates cache after a failed revalidation with a "If-None-Match" request for a GET response with an "Etag" header.', async () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const etag1 = '"etag1"';
			const etag2 = '"etag2"';
			const responseText1 = 'some text';
			const responseText2 = 'some new text';
			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);

					if (args[1].includes('If-None-Match')) {
						return JSON.stringify({
							error: null,
							incomingMessage: {
								statusCode: 200,
								statusMessage: 'OK',
								rawHeaders: [
									'content-type',
									'text/html',
									'content-length',
									String(responseText2.length),
									'cache-control',
									'max-age=1',
									'last-modified',
									'Mon, 11 Dec 2023 02:00:00 GMT',
									'etag',
									etag2
								],
								data: Buffer.from(responseText2).toString('base64')
							}
						});
					}
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText1.length),
								'cache-control',
								'max-age=0.01',
								'last-modified',
								'Mon, 11 Dec 2023 01:00:00 GMT',
								'etag',
								etag1
							],
							data: Buffer.from(responseText1).toString('base64')
						}
					});
				}
			});

			const response1 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						key1: 'value1'
					}
				}
			}).send();
			const text1 = response1.body.toString();

			await new Promise((resolve) => setTimeout(resolve, 100));

			const response2 = new SyncFetch({ browserFrame, window, url }).send();
			const text2 = response2.body.toString();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText1);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText1.length),
				'cache-control': `max-age=0.01`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
				etag: etag1
			});

			expect(response2.url).toBe(url);
			expect(response2.ok).toBe(true);
			expect(response2.redirected).toBe(false);
			expect(response2.status).toBe(200);
			expect(response2.statusText).toBe('OK');
			expect(text2).toBe(responseText2);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText2.length),
				'cache-control': `max-age=1`,
				'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
				etag: etag2
			});

			expect(requestArgs).toEqual([
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				}),
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'If-None-Match': etag1,
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						key1: 'value1'
					},
					body: null
				})
			]);
		});

		it('Supports cache for GET response with "Cache-Control" set to "max-age=60" and "Vary" set to "vary-header".', () => {
			browserFrame.url = 'https://localhost:8080/';

			const url = 'https://localhost:8080/some/path';
			const responseText1 = 'vary 1';
			const responseText2 = 'vary 2';
			const requestArgs: string[] = [];

			mockModule('child_process', {
				execFileSync: (_command: string, args: string[]) => {
					requestArgs.push(args[1]);

					if (args[1].includes('"vary-header": "vary1"')) {
						return JSON.stringify({
							error: null,
							incomingMessage: {
								statusCode: 200,
								statusMessage: 'OK',
								rawHeaders: [
									'content-type',
									'text/html',
									'content-length',
									String(responseText1.length),
									'cache-control',
									'max-age=60',
									'last-modified',
									'Mon, 11 Dec 2023 01:00:00 GMT',
									'vary',
									'vary-header'
								],
								data: Buffer.from(responseText1).toString('base64')
							}
						});
					}
					return JSON.stringify({
						error: null,
						incomingMessage: {
							statusCode: 200,
							statusMessage: 'OK',
							rawHeaders: [
								'content-type',
								'text/html',
								'content-length',
								String(responseText2.length),
								'cache-control',
								'max-age=60',
								'last-modified',
								'Mon, 11 Dec 2023 02:00:00 GMT',
								'vary',
								'vary-header'
							],
							data: Buffer.from(responseText2).toString('base64')
						}
					});
				}
			});

			const response1 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						'vary-header': 'vary1'
					}
				}
			}).send();
			const text1 = response1.body.toString();

			const response2 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						'vary-header': 'vary2'
					}
				}
			}).send();
			const text2 = response2.body.toString();

			const cachedResponse1 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						'vary-header': 'vary1'
					}
				}
			}).send();
			const cachedText1 = cachedResponse1.body.toString();

			const cachedResponse2 = new SyncFetch({
				browserFrame,
				window,
				url,
				init: {
					headers: {
						'vary-header': 'vary2'
					}
				}
			}).send();
			const cachedText2 = cachedResponse2.body.toString();

			const headers1 = {};
			for (const [key, value] of response1.headers) {
				headers1[key] = value;
			}

			const headers2 = {};
			for (const [key, value] of response2.headers) {
				headers2[key] = value;
			}

			const cachedHeaders1 = {};
			for (const [key, value] of cachedResponse1.headers) {
				cachedHeaders1[key] = value;
			}

			const cachedHeaders2 = {};
			for (const [key, value] of cachedResponse2.headers) {
				cachedHeaders2[key] = value;
			}

			expect(response1.url).toBe(url);
			expect(response1.ok).toBe(true);
			expect(response1.redirected).toBe(false);
			expect(response1.status).toBe(200);
			expect(response1.statusText).toBe('OK');
			expect(text1).toBe(responseText1);
			expect(headers1).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText1.length),
				'cache-control': `max-age=60`,
				'last-modified': 'Mon, 11 Dec 2023 01:00:00 GMT',
				vary: 'vary-header'
			});

			expect(response2.url).toBe(url);
			expect(response2.ok).toBe(true);
			expect(response2.redirected).toBe(false);
			expect(response2.status).toBe(200);
			expect(response2.statusText).toBe('OK');
			expect(text2).toBe(responseText2);
			expect(headers2).toEqual({
				'content-type': 'text/html',
				'content-length': String(responseText2.length),
				'cache-control': `max-age=60`,
				'last-modified': 'Mon, 11 Dec 2023 02:00:00 GMT',
				vary: 'vary-header'
			});

			expect(cachedResponse1.url).toBe(response1.url);
			expect(cachedResponse1.ok).toBe(response1.ok);
			expect(cachedResponse1.redirected).toBe(response1.redirected);
			expect(cachedResponse1.status).toBe(response1.status);
			expect(cachedResponse1.statusText).toBe(response1.statusText);
			expect(cachedText1).toBe(text1);
			expect(cachedHeaders1).toEqual(headers1);

			expect(cachedResponse2.url).toBe(response2.url);
			expect(cachedResponse2.ok).toBe(response2.ok);
			expect(cachedResponse2.redirected).toBe(response2.redirected);
			expect(cachedResponse2.status).toBe(response2.status);
			expect(cachedResponse2.statusText).toBe(response2.statusText);
			expect(cachedText2).toBe(text2);
			expect(cachedHeaders2).toEqual(headers2);

			expect(requestArgs).toEqual([
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						'vary-header': 'vary1'
					},
					body: null
				}),
				SyncFetchScriptBuilder.getScript({
					url: new URL('https://localhost:8080/some/path'),
					method: 'GET',
					headers: {
						Accept: '*/*',
						'Accept-Encoding': 'gzip, deflate, br',
						Connection: 'close',
						Referer: 'https://localhost:8080/',
						'User-Agent': `Mozilla/5.0 (${PLATFORM}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0`,
						'vary-header': 'vary2'
					},
					body: null
				})
			]);
		});
	});
});
