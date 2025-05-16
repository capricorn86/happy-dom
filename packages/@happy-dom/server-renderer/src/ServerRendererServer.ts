import Chalk from 'chalk';
import Http2 from 'http2';
import IOptionalServerRendererConfiguration from './types/IOptionalServerRendererConfiguration.js';
import IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import ServerRendererConfigurationFactory from './utilities/ServerRendererConfigurationFactory.js';
import ServerRenderer from './ServerRenderer.js';
import FetchHTTPSCertificate from 'happy-dom/lib/fetch/certificate/FetchHTTPSCertificate.js';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import OS from 'node:os';
import IServerRendererResult from './types/IServerRendererResult.js';

/**
 * Server renderer proxy HTTP2 server.
 */
export default class ServerRendererServer {
	#configuration: IServerRendererConfiguration;
	#serverRenderer: ServerRenderer;
	#server: Http2.Http2Server = null;
	#cache: Map<
		string,
		{
			timestamp: number;
			content: string;
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
	 * Start it the server.
	 */
	public async start(): Promise<void> {
		let url: URL;
		try {
			url = new URL(this.#configuration.server.serverURL);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(
				Chalk.red(
					Chalk.bold(
						'\nFailed to start server. The setting "server.serverURL" is not a valid URL.\n'
					)
				)
			);
			return;
		}

		if (!this.#configuration.server.targetOrigin) {
			// eslint-disable-next-line no-console
			console.error(
				Chalk.red(
					Chalk.bold('\nFailed to start server. The setting "server.targetOrigin" is not set.\n')
				)
			);
			return;
		}

		let targetOrigin: URL;
		try {
			targetOrigin = new URL(this.#configuration.server.targetOrigin);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(
				Chalk.red(
					Chalk.bold(
						'\nFailed to start server. The setting "server.targetOrigin" is not a valid URL.\n'
					)
				)
			);
			return;
		}

		switch (url.protocol) {
			case 'http:':
				this.#server = Http2.createServer(
					(request: Http2.Http2ServerRequest, response: Http2.Http2ServerResponse) =>
						this.onIncomingRequest(request, response)
				);
				break;
			case 'https:':
				this.#server = Http2.createSecureServer(
					{
						key: FetchHTTPSCertificate.key,
						cert: FetchHTTPSCertificate.cert
					},
					(request: Http2.Http2ServerRequest, response: Http2.Http2ServerResponse) =>
						this.onIncomingRequest(request, response)
				);
				break;
		}

		this.#server.listen(url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80);

		// eslint-disable-next-line no-console
		console.log(Chalk.green(`\nHappy DOM Proxy Server ${await this.getVersion()}\n`));

		// eslint-disable-next-line no-console
		console.log(
			`  ${Chalk.green('➜')}  ${Chalk.bold('Local:')}   ${Chalk.cyan(
				`${url.protocol}//localhost:${url.port}/`
			)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Network:')} ${Chalk.cyan(
				`${url.protocol}//${this.getNetworkIP()}:${url.port}/`
			)}\n  ${Chalk.green('➜')}  ${Chalk.bold('Target:')}  ${Chalk.cyan(
				`${targetOrigin}`
			)}\n\n  ${Chalk.green('➜')}  ${Chalk.bold('URL:')}     ${Chalk.cyan(
				`${url.protocol}//localhost:${url.port}${url.pathname}${url.search}${url.hash}`
			)}\n`
		);
	}

	/**
	 * Stop the server.
	 */
	public stop(): void {
		if (this.#server) {
			this.#server.close();
		}
	}

	/**
	 * Triggered on incoming request.
	 *
	 * @param request Request.
	 * @param response Response.
	 * @returns Promise.
	 */
	private async onIncomingRequest(
		request: Http2.Http2ServerRequest,
		response: Http2.Http2ServerResponse
	): Promise<void> {
		const url = new URL(request.url, this.#configuration.server.targetOrigin);
		const headers = {};

		for (const name of Object.keys(request.headers)) {
			if (name[0] !== ':' && name !== 'transfer-encoding') {
				headers[name] = request.headers[name];
			}
		}

		const fetchResponse = await fetch(url.href, { headers });

		response.statusCode = fetchResponse.status;

		// HTML files should be served from the server renderer.
		if (
			fetchResponse.headers.get('content-type')?.startsWith('text/html') &&
			fetchResponse.status === 200
		) {
			if (this.#configuration.server.renderCacheTime) {
				const cached = this.#cache.get(url.href);
				if (cached && Date.now() - cached.timestamp < this.#configuration.server.renderCacheTime) {
					// eslint-disable-next-line no-console
					console.log(Chalk.bold(`• Using cached response for ${url.href}`));

					response.setHeader('Content-Type', 'text/html; charset=utf-8');
					response.setHeader('Content-Encoding', 'gzip');

					await pipeline(cached.content, createGzip(), response);

					return;
				}
			}

			let result: IServerRendererResult;

			if (this.#configuration.server.renderCacheTime) {
				const cacheQueue = this.#cacheQueue.get(url.href);
				if (cacheQueue) {
					// eslint-disable-next-line no-console
					console.log(Chalk.bold(`• Waiting for ongoing rendering of ${url.href}`));

					result = await new Promise((resolve, reject) => {
						cacheQueue.push({ resolve, reject });
					});
				} else {
					this.#cacheQueue.set(url.href, []);
				}
			}

			if (!result) {
				result = (await this.#serverRenderer.render([{ url: url.href, headers }]))[0];

				const cacheQueue = this.#cacheQueue.get(url.href);

				if (cacheQueue) {
					this.#cacheQueue.delete(url.href);
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

			response.statusCode = result.status;

			if (result.error) {
				response.end(`<h1>Internal Server Error</h1>${result.error.replace(/\n/gm, '<br>')}`);
				return;
			}

			if (this.#configuration.server.renderCacheTime) {
				this.#cache.set(url.href, {
					timestamp: Date.now(),
					content: result.content
				});
			}

			response.setHeader('Content-Encoding', 'gzip');
			response.setHeader('Content-Type', 'text/html; charset=utf-8');

			try {
				await pipeline(result.content, createGzip(), response);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(Chalk.red(`\nFailed to send response: ${error.message}\n`));
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
				await pipeline(fetchResponse.body, createGzip(), response);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(Chalk.red(`\nFailed to send response: ${error.message}\n`));
				response.statusCode = 500;
				response.setHeader('Content-Type', 'text/plain; charset=utf-8');
				response.write('Internal Server Error');
			}
		} else {
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
	private getNetworkIP(): string {
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
	 * Returns the version of the package.
	 *
	 * @returns The version of the package.
	 */
	private async getVersion(): Promise<string> {
		const packageJson = await import('../package.json', { with: { type: 'json' } });
		return packageJson.default['version'];
	}
}
