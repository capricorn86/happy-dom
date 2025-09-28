import Http2 from 'http2';
import IOptionalServerRendererConfiguration from './types/IOptionalServerRendererConfiguration.js';
import IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import ServerRendererConfigurationFactory from './utilities/ServerRendererConfigurationFactory.js';
import ServerRenderer from './ServerRenderer.js';
import FetchHTTPSCertificate from 'happy-dom/lib/fetch/certificate/FetchHTTPSCertificate.js';
import ZLib from 'node:zlib';
import Stream from 'node:stream/promises';
import OS from 'node:os';
import IServerRendererResult from './types/IServerRendererResult.js';
// eslint-disable-next-line import/no-named-as-default
import Chalk from 'chalk';
import ServerRendererLogLevelEnum from './enums/ServerRendererLogLevelEnum.js';
import PackageVersion from './utilities/PackageVersion.js';

/**
 * Server renderer proxy HTTP2 server.
 */
export default class ServerRendererServer {
	#configuration: IServerRendererConfiguration;
	#serverRenderer: ServerRenderer;
	#server: Http2.Http2Server | null = null;
	#cache: Map<
		string,
		{
			timestamp: number;
			result: IServerRendererResult;
		}
	> = new Map();
	#cacheQueue: Map<
		string,
		Array<{ resolve: (result: IServerRendererResult) => void; reject: (error: Error) => void }>
	> = new Map();

	/**
	 * Constructor.
	 *
	 * @param configuration Configuration.
	 */
	constructor(configuration?: IOptionalServerRendererConfiguration) {
		this.#configuration = ServerRendererConfigurationFactory.createConfiguration(configuration);
		this.#serverRenderer = new ServerRenderer(this.#configuration);
	}

	/**
	 * Starts the server.
	 */
	public async start(): Promise<void> {
		let url: URL;
		try {
			url = new URL(this.#configuration.server.serverURL);
		} catch (error) {
			throw new Error('Failed to start server. The setting "server.serverURL" is not a valid URL.');
		}

		if (!this.#configuration.server.targetOrigin) {
			throw new Error('Failed to start server. The setting "server.targetOrigin" is not set.');
		}

		let targetOrigin: URL;
		try {
			targetOrigin = new URL(this.#configuration.server.targetOrigin);
		} catch (error) {
			throw new Error(
				'Failed to start server. The setting "server.targetOrigin" is not a valid URL.'
			);
		}

		switch (url.protocol) {
			case 'http:':
				this.#server = Http2.createServer(
					(request: Http2.Http2ServerRequest, response: Http2.Http2ServerResponse) =>
						this.#onIncomingRequest(request, response)
				);
				break;
			case 'https:':
				this.#server = Http2.createSecureServer(
					{
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					(request: Http2.Http2ServerRequest, response: Http2.Http2ServerResponse) =>
						this.#onIncomingRequest(request, response)
				);
				break;
			default:
				throw new Error(
					`Unsupported protocol "${url.protocol}". Only "http:" and "https:" are supported.`
				);
		}

		this.#server.listen(url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80);

		// eslint-disable-next-line no-console
		console.log(Chalk.green(`\nHappy DOM Proxy Server ${await PackageVersion.getVersion()}\n`));

		// eslint-disable-next-line no-console
		console.log(
			`  ${Chalk.green('➜')}  ${Chalk.bold('Local:')}   ${Chalk.cyan(
				`${url.protocol}//localhost:${url.port}/`
			)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Network:')} ${Chalk.cyan(
				`${url.protocol}//${this.#getNetworkIP()}:${url.port}/`
			)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Target:')}  ${Chalk.cyan(
				`${targetOrigin.protocol}//${targetOrigin.host}/`
			)}\n\n  ${Chalk.green('➜')}  ${Chalk.bold('URL:')}     ${Chalk.cyan(
				`${url.protocol}//localhost:${url.port}${url.pathname}${url.search}${url.hash}`
			)}\n`
		);
	}

	/**
	 * Stops the server.
	 */
	public async stop(): Promise<void> {
		if (this.#server) {
			this.#server.close();
		}
		if (this.#serverRenderer) {
			await this.#serverRenderer.close();
		}
	}

	/**
	 * Triggered on incoming request.
	 *
	 * @param request Request.
	 * @param response Response.
	 * @returns Promise.
	 */
	async #onIncomingRequest(
		request: Http2.Http2ServerRequest,
		response: Http2.Http2ServerResponse
	): Promise<void> {
		const url = new URL(request.url, this.#configuration.server.targetOrigin!);
		const headers: { [name: string]: string } = {};

		for (const name of Object.keys(request.headers)) {
			if (name[0] !== ':' && name.toLowerCase() !== 'transfer-encoding') {
				headers[name] = Array.isArray(request.headers[name])
					? request.headers[name].join(', ')
					: request.headers[name]!;
			}
		}

		const fetchResponse = await fetch(url.href, { headers });
		const isCacheEnabled =
			!this.#configuration.server.disableCache && this.#configuration.server.cacheTime > 0;
		const isCacheQueueEnabled = isCacheEnabled && !this.#configuration.server.disableCacheQueue;
		const cacheKey = this.#getCacheKey(url, headers, fetchResponse.status);
		let result: IServerRendererResult | null = null;

		response.statusCode = fetchResponse.status;

		// HTML files should be served from the server renderer.
		if (
			fetchResponse.headers.get('content-type')?.startsWith('text/html') &&
			fetchResponse.status === 200
		) {
			if (isCacheEnabled) {
				const cached = this.#cache.get(cacheKey);
				if (cached) {
					if (Date.now() - cached.timestamp < this.#configuration.server.cacheTime) {
						if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
							// eslint-disable-next-line no-console
							console.log(Chalk.bold(`• Using cached response for ${url.href}`));
						}

						result = cached.result;
					} else {
						this.#cache.delete(cacheKey);
					}
				}
			}

			if (!result && isCacheQueueEnabled) {
				const cacheQueue = this.#cacheQueue.get(cacheKey);
				if (cacheQueue) {
					if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
						// eslint-disable-next-line no-console
						console.log(Chalk.bold(`• Waiting for ongoing rendering of ${url.href}`));
					}

					result = await new Promise((resolve, reject) => {
						cacheQueue.push({ resolve, reject });
					});

					if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
						// eslint-disable-next-line no-console
						console.log(Chalk.bold(`• Using cached response for ${url.href}`));
					}
				} else {
					this.#cacheQueue.set(cacheKey, []);
				}
			}

			if (!result) {
				result = (
					await this.#serverRenderer.render([{ url: url.href, headers }], { keepAlive: true })
				)[0];

				if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
					// eslint-disable-next-line no-console
					console.log(Chalk.bold(`• Rendered ${url.href}`));
				}
			}

			if (isCacheQueueEnabled) {
				const cacheQueue = this.#cacheQueue.get(cacheKey);

				if (cacheQueue) {
					this.#cacheQueue.delete(cacheKey);
					for (const { resolve } of cacheQueue) {
						resolve(result);
					}
				}
			}

			for (const key of Object.keys(result.headers)) {
				const lowerKey = key.toLowerCase();
				if (
					lowerKey !== 'transfer-encoding' &&
					lowerKey !== 'content-length' &&
					lowerKey !== 'content-encoding'
				) {
					response.setHeader(key, result.headers[key]);
				}
			}

			response.statusCode = result.error ? 500 : result.status;

			if (result.error) {
				if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.error) {
					// eslint-disable-next-line no-console
					console.log(Chalk.red(`\n✖ Failed to render ${url.href}:\n${result.error}\n`));
				}
				response.setHeader('Content-Type', 'text/html; charset=utf-8');
				response.end(
					`<h1>Internal Server Error</h1><br><p>${result.error.replace(/\n/gm, '<br>')}</p>`
				);
				return;
			}

			if (isCacheEnabled) {
				this.#cache.set(cacheKey, {
					timestamp: Date.now(),
					result
				});
			}

			response.setHeader('Content-Encoding', 'gzip');
			response.setHeader('Content-Type', 'text/html; charset=utf-8');

			try {
				await Stream.pipeline(result.content!, ZLib.createGzip(), response);
			} catch (error) {
				if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.error) {
					// eslint-disable-next-line no-console
					console.log(Chalk.red(`\n✖ Failed to send response: ${error}\n`));
				}
				response.statusCode = 500;
				response.setHeader('Content-Type', 'text/plain; charset=utf-8');
				response.write('Internal Server Error');
			}

			response.end();

			return;
		}

		for (const [key, value] of fetchResponse.headers.entries()) {
			if (key.toLowerCase() !== 'transfer-encoding') {
				response.setHeader(key, value);
			}
		}

		response.statusCode = fetchResponse.status;

		if (fetchResponse.headers.get('Content-Encoding')) {
			response.setHeader('Content-Encoding', 'gzip');
			response.removeHeader('Content-Length');
			try {
				await Stream.pipeline(fetchResponse.body!, ZLib.createGzip(), response);
			} catch (error) {
				if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.error) {
					// eslint-disable-next-line no-console
					console.log(Chalk.red(`\n✖ Failed to send response: ${error}\n`));
				}
				response.statusCode = 500;
				response.setHeader('Content-Type', 'text/plain; charset=utf-8');
				response.write('Internal Server Error');
			}
		} else if (fetchResponse.body) {
			const reader = fetchResponse.body.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				response.write(value);
			}
		}

		response.end();
	}

	/**
	 * Returns the network IP address of the server.
	 *
	 * @returns The network IP address.
	 */
	#getNetworkIP(): string {
		const interfaces = OS.networkInterfaces();
		for (const interfaceName in interfaces) {
			const networkInterface = interfaces[interfaceName];
			if (networkInterface) {
				for (const address of networkInterface) {
					if (address.family === 'IPv4' && !address.internal) {
						return address.address;
					}
				}
			}
		}
		return '';
	}

	/**
	 * Returns the cache key for the given request.
	 *
	 * @param url Request URL.
	 * @param headers Request headers.
	 * @param statusCode Response status code.
	 * @returns The cache key.§
	 */
	#getCacheKey(url: URL, headers: { [key: string]: string }, statusCode: number): string {
		return `${url.href}|${JSON.stringify(headers)}|${statusCode}`;
	}
}
