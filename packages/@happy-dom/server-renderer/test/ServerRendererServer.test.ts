import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import Http2, { Http2ServerRequest, Http2ServerResponse } from 'http2';
import ServerRendererServer from '../src/ServerRendererServer.js';
import ServerRendererConfigurationFactory from '../src/utilities/ServerRendererConfigurationFactory.js';
import OS from 'node:os';
import FetchHTTPSCertificate from 'happy-dom/lib/fetch/certificate/FetchHTTPSCertificate.js';
import Headers from 'happy-dom/lib/fetch/Headers.js';
import Response from 'happy-dom/lib/fetch/Response.js';
import ServerRenderer from '../src/ServerRenderer.js';
import IServerRendererItem from '../src/types/IServerRendererItem.js';
import IServerRendererResult from '../src/types/IServerRendererResult.js';
import ZLib from 'node:zlib';
import IOptionalServerRendererConfiguration from '../src/types/IOptionalServerRendererConfiguration.js';
// eslint-disable-next-line import/no-named-as-default
import Chalk from 'chalk';

const GZIP_TO_STRING = (chunks: Buffer[]): Promise<string> => {
	return new Promise((resolve, reject) => {
		const unzip = ZLib.createUnzip();
		let unzippedBody = '';
		unzip.on('data', (chunk) => {
			unzippedBody += chunk;
		});
		unzip.on('end', () => resolve(unzippedBody));
		unzip.on('error', (error) => reject(error));
		for (const chunk of chunks) {
			unzip.write(chunk);
		}
		unzip.end();
	});
};

describe('ServerRendererServer', () => {
	const consoleLog: string[] = [];
	const consoleError: string[] = [];
	let requestOptions: Http2.SecureServerOptions | Http2.ServerOptions | null = null;
	let requestHandler:
		| ((request: Http2ServerRequest, response: Http2ServerResponse) => void)
		| null = null;
	let serverPort: number | null = null;
	let isServerClosed = false;

	beforeEach(() => {
		consoleLog.length = 0;
		consoleError.length = 0;
		requestOptions = null;
		requestHandler = null;
		serverPort = null;
		isServerClosed = false;

		vi.spyOn(Http2, 'createSecureServer').mockImplementation(
			(options: any, onRequestHandler: any): any => {
				requestOptions = options;
				requestHandler = <(request: Http2ServerRequest, response: Http2ServerResponse) => void>(
					onRequestHandler
				);
				return <Http2.Http2Server>{
					listen: (port: number): any => (serverPort = port),
					close: (): any => (isServerClosed = true)
				};
			}
		);

		vi.spyOn(Http2, 'createServer').mockImplementation((onRequestHandler: any): any => {
			requestHandler = <(request: Http2ServerRequest, response: Http2ServerResponse) => void>(
				onRequestHandler
			);
			return <Http2.Http2Server>{
				listen: (port: number): any => (serverPort = port)
			};
		});

		vi.spyOn(OS, 'networkInterfaces').mockImplementation((): any => {
			return {
				a: [],
				b: [
					{
						family: 'IPv4',
						address: '192.168.0.1'
					}
				]
			};
		});

		vi.spyOn(console, 'log').mockImplementation((...args: any[]): void => {
			consoleLog.push(args.join(' '));
		});

		vi.spyOn(console, 'error').mockImplementation((...args: any[]): void => {
			consoleError.push(args.join(' '));
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('start()', () => {
		it('Throws error on invalid "serverURL" configuration.', async () => {
			const server = new ServerRendererServer(
				ServerRendererConfigurationFactory.createConfiguration({
					server: {
						serverURL: 'invalid'
					}
				})
			);
			await expect(() => server.start()).rejects.toThrowError(
				'Failed to start server. The setting "server.serverURL" is not a valid URL.'
			);
		});

		it('Throws error on unset "targetOrigin" configuration.', async () => {
			const server = new ServerRendererServer(
				ServerRendererConfigurationFactory.createConfiguration({})
			);
			await expect(() => server.start()).rejects.toThrowError(
				'Failed to start server. The setting "server.targetOrigin" is not set.'
			);
		});

		it('Throws error on invalid "targetOrigin" configuration.', async () => {
			const server = new ServerRendererServer(
				ServerRendererConfigurationFactory.createConfiguration({
					server: {
						targetOrigin: 'invalid'
					}
				})
			);
			await expect(() => server.start()).rejects.toThrowError(
				'Failed to start server. The setting "server.targetOrigin" is not a valid URL.'
			);
		});

		it('Throws error on invalid protocol', async () => {
			const server = new ServerRendererServer(
				ServerRendererConfigurationFactory.createConfiguration({
					server: {
						serverURL: 'ftp://example.com',
						targetOrigin: 'https://example.com'
					}
				})
			);
			await expect(() => server.start()).rejects.toThrowError(
				'Unsupported protocol "ftp:". Only "http:" and "https:" are supported.'
			);
		});

		for (const protocol of ['http:', 'https:']) {
			it(`Starts server and handles incoming request for HTML page (${protocol}).`, async () => {
				vi.spyOn(global, 'fetch').mockImplementation((url: any, options?: any): any => {
					if (url === `${protocol}//example.com/path/`) {
						expect(options).toEqual({
							headers: {
								Host: 'localhost:3000',
								'X-Test-Request': 'true'
							}
						});
						return Promise.resolve(<Response>{
							headers: new Headers({ 'Content-Type': 'text/html' }),
							status: 200
						});
					}
					return Promise.resolve(<Response>{
						headers: new Headers({ 'Content-Type': 'text/html' }),
						status: 404
					});
				});

				vi.spyOn(ServerRenderer.prototype, 'render').mockImplementation(function (
					urls?: (string | IServerRendererItem)[] | null
				): Promise<IServerRendererResult[]> {
					return Promise.resolve([
						<IServerRendererResult>{
							url: (<IServerRendererItem[]>urls)?.[0].url || '',
							headers: { 'Content-Type': 'text/html', 'X-Happy-DOM': 'true' },
							status: 200,
							statusText: 'OK',
							content: '<h1>Server side rendered</h1>',
							outputFile: null,
							error: null,
							pageErrors: [],
							pageConsole: ''
						}
					]);
				});

				const options: IOptionalServerRendererConfiguration = {
					server: {
						targetOrigin: `${protocol}//example.com`
					}
				};
				if (protocol === 'http:') {
					options.server!.serverURL = 'http://localhost:3000';
				}
				const server = new ServerRendererServer(
					ServerRendererConfigurationFactory.createConfiguration(options)
				);

				await server.start();

				expect(serverPort).toBe(3000);

				if (protocol === 'https:') {
					expect(requestOptions).toEqual({
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					});
				}

				const responseHeaders: { [name: string]: string } = {};
				const responseBody: Buffer[] = [];
				let responseStatusCode = 0;

				await new Promise((resolve) => {
					requestHandler!(
						<any>{
							url: '/path/',
							headers: {
								':path': '/',
								':method': 'GET',
								'Transfer-Encoding': 'chunked',
								Host: 'localhost:3000',
								'X-Test-Request': 'true'
							}
						},
						<Http2.Http2ServerResponse>(<unknown>{
							set statusCode(value: number) {
								responseStatusCode = value;
							},
							get statusCode() {
								return responseStatusCode;
							},
							on: () => {},
							emit: () => {},
							once: () => {},
							destroy: () => {},
							setHeader: (name: string, value: string): void => {
								responseHeaders[name] = value;
							},
							removeHeader: (name: string): void => {
								delete responseHeaders[name];
							},
							write: (chunk: Buffer): void => {
								responseBody.push(chunk);
							},
							end: (chunk?: Buffer): void => {
								if (chunk) {
									responseBody.push(chunk);
								}
								resolve(null);
							}
						})
					);
				});

				expect(responseStatusCode).toBe(200);

				expect(responseHeaders).toEqual({
					'Content-Encoding': 'gzip',
					'Content-Type': 'text/html; charset=utf-8',
					'X-Happy-DOM': 'true'
				});

				expect(await GZIP_TO_STRING(responseBody)).toBe('<h1>Server side rendered</h1>');

				expect(consoleLog).toEqual([
					Chalk.green(`\nHappy DOM Proxy Server 0.0.0\n`),
					`  ${Chalk.green('➜')}  ${Chalk.bold('Local:')}   ${Chalk.cyan(
						`${protocol}//localhost:3000/`
					)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Network:')} ${Chalk.cyan(
						`${protocol}//192.168.0.1:3000/`
					)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Target:')}  ${Chalk.cyan(
						`${protocol}//example.com/`
					)}\n\n  ${Chalk.green('➜')}  ${Chalk.bold('URL:')}     ${Chalk.cyan(
						`${protocol}//localhost:3000/`
					)}\n`,
					Chalk.bold(`• Rendered ${protocol}//example.com/path/`)
				]);
				expect(consoleError).toEqual([]);
			});

			for (const cacheMode of ['enabled', 'disabled']) {
				it(`Handles multiple concurrent requests for the same URL with cache queue ${cacheMode} (${protocol}).`, async () => {
					vi.spyOn(global, 'fetch').mockImplementation((url: any, options?: any): any => {
						if (url === `${protocol}//example.com/path/`) {
							expect(options).toEqual({
								headers: {
									Host: 'localhost:8080',
									'X-Test-Request': 'true'
								}
							});
							return Promise.resolve(<Response>{
								headers: new Headers({ 'Content-Type': 'text/html' }),
								status: 200
							});
						}
						return Promise.resolve(<Response>{
							headers: new Headers({ 'Content-Type': 'text/html' }),
							status: 404
						});
					});

					let renderCount = 0;

					vi.spyOn(ServerRenderer.prototype, 'render').mockImplementation(function (
						urls?: (string | IServerRendererItem)[] | null
					): Promise<IServerRendererResult[]> {
						renderCount++;
						return Promise.resolve([
							<IServerRendererResult>{
								url: (<IServerRendererItem[]>urls)?.[0].url || '',
								headers: { 'Content-Type': 'text/html', 'X-Happy-DOM': 'true' },
								status: 200,
								statusText: 'OK',
								content: '<h1>Server side rendered</h1>',
								outputFile: null,
								error: null,
								pageErrors: [],
								pageConsole: ''
							}
						]);
					});

					const server = new ServerRendererServer(
						ServerRendererConfigurationFactory.createConfiguration({
							server: {
								serverURL: `${protocol}//localhost:8080`,
								targetOrigin: `${protocol}//example.com`,
								disableCacheQueue: cacheMode === 'disabled'
							}
						})
					);

					await server.start();

					const responses: Array<{
						statusCode: number;
						headers: { [name: string]: string };
						body: Buffer[];
					}> = [];
					const promises: Promise<void>[] = [];

					for (let i = 0; i < 5; i++) {
						const index = i;
						responses.push({ statusCode: 0, headers: {}, body: [] });
						promises.push(
							new Promise((resolve) => {
								requestHandler!(
									<any>{
										url: '/path/',
										headers: {
											':path': '/',
											':method': 'GET',
											'Transfer-Encoding': 'chunked',
											Host: 'localhost:8080',
											'X-Test-Request': 'true'
										}
									},
									<Http2.Http2ServerResponse>(<unknown>{
										set statusCode(value: number) {
											responses[index].statusCode = value;
										},
										get statusCode() {
											return responses[index].statusCode;
										},
										on: () => {},
										emit: () => {},
										once: () => {},
										destroy: () => {},
										setHeader: (name: string, value: string): void => {
											responses[index].headers[name] = value;
										},
										removeHeader: (name: string): void => {
											delete responses[index].headers[name];
										},
										write: (chunk: Buffer): void => {
											responses[index].body.push(chunk);
										},
										end: (chunk?: Buffer): void => {
											if (chunk) {
												responses[index].body.push(chunk);
											}
											resolve();
										}
									})
								);
							})
						);
					}

					await Promise.all(promises);

					for (let i = 0; i < 5; i++) {
						expect(responses[i].statusCode).toBe(200);

						expect(responses[i].headers).toEqual({
							'Content-Encoding': 'gzip',
							'Content-Type': 'text/html; charset=utf-8',
							'X-Happy-DOM': 'true'
						});

						expect(await GZIP_TO_STRING(responses[i].body)).toBe('<h1>Server side rendered</h1>');
					}

					expect(renderCount).toBe(cacheMode === 'enabled' ? 1 : 5);

					expect(consoleLog).toEqual([
						Chalk.green(`\nHappy DOM Proxy Server 0.0.0\n`),
						`  ${Chalk.green('➜')}  ${Chalk.bold('Local:')}   ${Chalk.cyan(
							`${protocol}//localhost:8080/`
						)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Network:')} ${Chalk.cyan(
							`${protocol}//192.168.0.1:8080/`
						)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Target:')}  ${Chalk.cyan(
							`${protocol}//example.com/`
						)}\n\n  ${Chalk.green('➜')}  ${Chalk.bold('URL:')}     ${Chalk.cyan(
							`${protocol}//localhost:8080/`
						)}\n`,
						...(cacheMode === 'enabled'
							? Array(4).fill(
									Chalk.bold(`• Waiting for ongoing rendering of ${protocol}//example.com/path/`)
								)
							: []),
						Chalk.bold(`• Rendered ${protocol}//example.com/path/`),
						...(cacheMode === 'enabled'
							? Array(4).fill(
									Chalk.bold(`• Using cached response for ${protocol}//example.com/path/`)
								)
							: Array(4).fill(Chalk.bold(`• Rendered ${protocol}//example.com/path/`)))
					]);
					expect(consoleError).toEqual([]);
				});
			}

			for (const cacheMode of ['enabled', 'disabled']) {
				it(`Starts server and handles incoming request for HTML page with cache ${cacheMode} (${protocol}).`, async () => {
					vi.spyOn(global, 'fetch').mockImplementation((url: any): any => {
						if (url === `${protocol}//example.com/path/`) {
							return Promise.resolve(<Response>{
								headers: new Headers({ 'Content-Type': 'text/html' }),
								status: 200
							});
						}
						return Promise.resolve(<Response>{
							headers: new Headers({ 'Content-Type': 'text/html' }),
							status: 404
						});
					});

					let renderCount = 0;

					vi.spyOn(ServerRenderer.prototype, 'render').mockImplementation(function (
						urls?: (string | IServerRendererItem)[] | null
					): Promise<IServerRendererResult[]> {
						renderCount++;
						return Promise.resolve([
							<IServerRendererResult>{
								url: (<IServerRendererItem[]>urls)?.[0].url || '',
								headers: { 'Content-Type': 'text/html', 'X-Happy-DOM': 'true' },
								status: 200,
								statusText: 'OK',
								content: '<h1>Server side rendered</h1>',
								outputFile: null,
								error: null,
								pageErrors: [],
								pageConsole: ''
							}
						]);
					});

					const server = new ServerRendererServer(
						ServerRendererConfigurationFactory.createConfiguration({
							server: {
								serverURL: `${protocol}//localhost:3000`,
								targetOrigin: `${protocol}//example.com`,
								disableCache: cacheMode === 'disabled'
							}
						})
					);

					await server.start();

					const request = (): Promise<{
						statusCode: number;
						headers: { [name: string]: string };
						body: Buffer[];
					}> => {
						return new Promise((resolve) => {
							const response: {
								statusCode: number;
								headers: { [name: string]: string };
								body: Buffer[];
							} = {
								statusCode: 0,
								headers: {},
								body: []
							};
							requestHandler!(
								<any>{
									url: '/path/',
									headers: {
										':path': '/',
										':method': 'GET',
										'Transfer-Encoding': 'chunked',
										Host: 'localhost:3000',
										'X-Test-Request': 'true'
									}
								},
								<Http2.Http2ServerResponse>(<unknown>{
									set statusCode(value: number) {
										response.statusCode = value;
									},
									get statusCode() {
										return response.statusCode;
									},
									on: () => {},
									emit: () => {},
									once: () => {},
									destroy: () => {},
									setHeader: (name: string, value: string): void => {
										response.headers[name] = value;
									},
									removeHeader: (name: string): void => {
										delete response.headers[name];
									},
									write: (chunk: Buffer): void => {
										response.body.push(chunk);
									},
									end: (chunk?: Buffer): void => {
										if (chunk) {
											response.body.push(chunk);
										}
										resolve(response);
									}
								})
							);
						});
					};

					const response1 = await request();

					expect(response1.statusCode).toBe(200);
					expect(response1.headers).toEqual({
						'Content-Encoding': 'gzip',
						'Content-Type': 'text/html; charset=utf-8',
						'X-Happy-DOM': 'true'
					});
					expect(await GZIP_TO_STRING(response1.body)).toBe('<h1>Server side rendered</h1>');

					const response2 = await request();

					expect(response2.statusCode).toBe(200);
					expect(response2.headers).toEqual({
						'Content-Encoding': 'gzip',
						'Content-Type': 'text/html; charset=utf-8',
						'X-Happy-DOM': 'true'
					});
					expect(await GZIP_TO_STRING(response2.body)).toBe('<h1>Server side rendered</h1>');

					expect(renderCount).toBe(cacheMode === 'enabled' ? 1 : 2);

					expect(consoleLog).toEqual([
						Chalk.green(`\nHappy DOM Proxy Server 0.0.0\n`),
						`  ${Chalk.green('➜')}  ${Chalk.bold('Local:')}   ${Chalk.cyan(
							`${protocol}//localhost:3000/`
						)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Network:')} ${Chalk.cyan(
							`${protocol}//192.168.0.1:3000/`
						)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Target:')}  ${Chalk.cyan(
							`${protocol}//example.com/`
						)}\n\n  ${Chalk.green('➜')}  ${Chalk.bold('URL:')}     ${Chalk.cyan(
							`${protocol}//localhost:3000/`
						)}\n`,
						Chalk.bold(`• Rendered ${protocol}//example.com/path/`),
						...(cacheMode === 'enabled'
							? [Chalk.bold(`• Using cached response for ${protocol}//example.com/path/`)]
							: [Chalk.bold(`• Rendered ${protocol}//example.com/path/`)])
					]);
					expect(consoleError).toEqual([]);
				});
			}

			it(`Starts server and handles incoming request for HTML page with error (${protocol}).`, async () => {
				vi.spyOn(global, 'fetch').mockImplementation((url: any, options?: any): any => {
					if (url === `${protocol}//example.com/path/`) {
						expect(options).toEqual({
							headers: {
								Host: 'localhost:3000',
								'X-Test-Request': 'true'
							}
						});
						return Promise.resolve(<Response>{
							headers: new Headers({ 'Content-Type': 'text/html' }),
							status: 200
						});
					}
					return Promise.resolve(<Response>{
						headers: new Headers({ 'Content-Type': 'text/html' }),
						status: 404
					});
				});

				vi.spyOn(ServerRenderer.prototype, 'render').mockImplementation(function (
					urls?: (string | IServerRendererItem)[] | null
				): Promise<IServerRendererResult[]> {
					return Promise.resolve([
						<IServerRendererResult>{
							url: (<IServerRendererItem[]>urls)?.[0].url || '',
							headers: { 'Content-Type': 'text/html', 'X-Happy-DOM': 'true' },
							status: 200,
							statusText: 'OK',
							content: null,
							outputFile: null,
							error: 'Error: Failure',
							pageErrors: [],
							pageConsole: ''
						}
					]);
				});

				const server = new ServerRendererServer(
					ServerRendererConfigurationFactory.createConfiguration({
						server: {
							serverURL: `${protocol}//localhost:3000`,
							targetOrigin: `${protocol}//example.com`
						}
					})
				);

				await server.start();

				const responseHeaders: { [name: string]: string } = {};
				const responseBody: Buffer[] = [];
				let responseStatusCode = 0;

				await new Promise((resolve) => {
					requestHandler!(
						<any>{
							url: '/path/',
							headers: {
								':path': '/',
								':method': 'GET',
								'Transfer-Encoding': 'chunked',
								Host: 'localhost:3000',
								'X-Test-Request': 'true'
							}
						},
						<Http2.Http2ServerResponse>(<unknown>{
							set statusCode(value: number) {
								responseStatusCode = value;
							},
							get statusCode() {
								return responseStatusCode;
							},
							on: () => {},
							emit: () => {},
							once: () => {},
							destroy: () => {},
							setHeader: (name: string, value: string): void => {
								responseHeaders[name] = value;
							},
							removeHeader: (name: string): void => {
								delete responseHeaders[name];
							},
							write: (chunk: Buffer): void => {
								responseBody.push(chunk);
							},
							end: (chunk?: Buffer): void => {
								if (chunk) {
									responseBody.push(chunk);
								}
								resolve(null);
							}
						})
					);
				});

				expect(responseStatusCode).toBe(500);

				expect(responseHeaders).toEqual({
					'Content-Type': 'text/html; charset=utf-8',
					'X-Happy-DOM': 'true'
				});

				expect(responseBody.join('')).toBe(
					'<h1>Internal Server Error</h1><br><p>Error: Failure</p>'
				);

				expect(consoleLog).toEqual([
					Chalk.green(`\nHappy DOM Proxy Server 0.0.0\n`),
					`  ${Chalk.green('➜')}  ${Chalk.bold('Local:')}   ${Chalk.cyan(
						`${protocol}//localhost:3000/`
					)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Network:')} ${Chalk.cyan(
						`${protocol}//192.168.0.1:3000/`
					)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Target:')}  ${Chalk.cyan(
						`${protocol}//example.com/`
					)}\n\n  ${Chalk.green('➜')}  ${Chalk.bold('URL:')}     ${Chalk.cyan(
						`${protocol}//localhost:3000/`
					)}\n`,
					Chalk.bold(`• Rendered ${protocol}//example.com/path/`),
					Chalk.red(`\n✖ Failed to render ${protocol}//example.com/path/:\nError: Failure\n`)
				]);
				expect(consoleError).toEqual([]);
			});

			it(`Starts server and handles incoming request for resource with content-encoding (${protocol}).`, async () => {
				vi.spyOn(global, 'fetch').mockImplementation((url: any): any => {
					if (url === `${protocol}//example.com/static/image.png`) {
						const chunks = ['chunk1', 'chunk2', 'chunk3'];
						const body = new ReadableStream({
							start(controller) {
								setTimeout(() => {
									controller.enqueue(chunks[0]);
								}, 10);
								setTimeout(() => {
									controller.enqueue(chunks[1]);
								}, 20);
								setTimeout(() => {
									controller.enqueue(chunks[2]);
									controller.close();
								}, 30);
							}
						});
						return Promise.resolve(<any>{
							headers: new Headers({
								'Content-Type': 'image/png',
								'Content-Encoding': 'gzip',
								'X-Happy-DOM': 'true'
							}),
							status: 200,
							body
						});
					}
					return Promise.resolve(<Response>{
						headers: new Headers({ 'Content-Type': 'text/html' }),
						status: 404
					});
				});

				const server = new ServerRendererServer(
					ServerRendererConfigurationFactory.createConfiguration({
						server: {
							serverURL: `${protocol}//localhost:3000`,
							targetOrigin: `${protocol}//example.com`
						}
					})
				);

				await server.start();

				const responseHeaders: { [name: string]: string } = {};
				const responseBody: Buffer[] = [];
				let responseStatusCode = 0;

				await new Promise((resolve) => {
					requestHandler!(
						<any>{
							url: '/static/image.png',
							headers: {
								':path': '/',
								':method': 'GET',
								'Transfer-Encoding': 'chunked',
								Host: 'localhost:3000'
							}
						},
						<Http2.Http2ServerResponse>(<unknown>{
							set statusCode(value: number) {
								responseStatusCode = value;
							},
							get statusCode() {
								return responseStatusCode;
							},
							on: () => {},
							emit: () => {},
							once: () => {},
							destroy: () => {},
							setHeader: (name: string, value: string): void => {
								responseHeaders[name] = value;
							},
							removeHeader: (name: string): void => {
								delete responseHeaders[name];
							},
							write: (chunk: Buffer): void => {
								responseBody.push(chunk);
							},
							end: (chunk?: Buffer): void => {
								if (chunk) {
									responseBody.push(chunk);
								}
								resolve(null);
							}
						})
					);
				});

				expect(responseStatusCode).toBe(200);

				expect(responseHeaders).toEqual({
					'Content-Encoding': 'gzip',
					'Content-Type': 'image/png',
					'X-Happy-DOM': 'true'
				});

				expect(await GZIP_TO_STRING(responseBody)).toBe('chunk1chunk2chunk3');
			});

			it(`Starts server and handles incoming request for resource without content-encoding (${protocol}).`, async () => {
				vi.spyOn(global, 'fetch').mockImplementation((url: any): any => {
					if (url === `${protocol}//example.com/static/image.png`) {
						const chunks = ['chunk1', 'chunk2', 'chunk3'];
						const body = new ReadableStream({
							start(controller) {
								setTimeout(() => {
									controller.enqueue(chunks[0]);
								}, 10);
								setTimeout(() => {
									controller.enqueue(chunks[1]);
								}, 20);
								setTimeout(() => {
									controller.enqueue(chunks[2]);
									controller.close();
								}, 30);
							}
						});
						return Promise.resolve(<any>{
							headers: new Headers({
								'Content-Type': 'image/png',
								'X-Happy-DOM': 'true'
							}),
							status: 200,
							body
						});
					}
					return Promise.resolve(<Response>{
						headers: new Headers({ 'Content-Type': 'text/html' }),
						status: 404
					});
				});

				const server = new ServerRendererServer(
					ServerRendererConfigurationFactory.createConfiguration({
						server: {
							serverURL: `${protocol}//localhost:3000`,
							targetOrigin: `${protocol}//example.com`
						}
					})
				);

				await server.start();

				const responseHeaders: { [name: string]: string } = {};
				const responseBody: Buffer[] = [];
				let responseStatusCode = 0;

				await new Promise((resolve) => {
					requestHandler!(
						<any>{
							url: '/static/image.png',
							headers: {
								':path': '/',
								':method': 'GET',
								'Transfer-Encoding': 'chunked',
								Host: 'localhost:3000'
							}
						},
						<Http2.Http2ServerResponse>(<unknown>{
							set statusCode(value: number) {
								responseStatusCode = value;
							},
							get statusCode() {
								return responseStatusCode;
							},
							on: () => {},
							emit: () => {},
							once: () => {},
							destroy: () => {},
							setHeader: (name: string, value: string): void => {
								responseHeaders[name] = value;
							},
							removeHeader: (name: string): void => {
								delete responseHeaders[name];
							},
							write: (chunk: Buffer): void => {
								responseBody.push(chunk);
							},
							end: (chunk?: Buffer): void => {
								if (chunk) {
									responseBody.push(chunk);
								}
								resolve(null);
							}
						})
					);
				});

				expect(responseStatusCode).toBe(200);

				expect(responseHeaders).toEqual({
					'Content-Type': 'image/png',
					'X-Happy-DOM': 'true'
				});

				let string = '';
				for (const chunk of responseBody) {
					string += chunk.toString();
				}

				expect(string).toBe('chunk1chunk2chunk3');
			});
		}
	});

	describe('stop()', () => {
		it('Stops the server.', async () => {
			let isServerRendererClosed = false;
			vi.spyOn(ServerRenderer.prototype, 'close').mockImplementation(async (): Promise<void> => {
				isServerRendererClosed = true;
			});
			const server = new ServerRendererServer(
				ServerRendererConfigurationFactory.createConfiguration({
					server: {
						targetOrigin: `http://example.com`
					}
				})
			);
			expect(isServerClosed).toBe(false);
			expect(isServerRendererClosed).toBe(false);
			await server.start();
			await server.stop();
			expect(isServerClosed).toBe(true);
			expect(isServerRendererClosed).toBe(true);
		});
	});
});
