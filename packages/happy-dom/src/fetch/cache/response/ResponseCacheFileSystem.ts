import ICachedResponse from './ICachedResponse.js';
import Headers from '../../Headers.js';
import FS from 'fs';
import Path from 'path';
import Crypto from 'crypto';
import IResponseCacheFileSystem from './IResponseCacheFileSystem.js';

/**
 * Fetch response cache file system implementation.
 */
export default class ResponseCacheFileSystem implements IResponseCacheFileSystem {
	#createdDirectories: Set<string> = new Set();
	#hashes: Set<string> = new Set();
	#entries: Map<string, ICachedResponse[]>;

	/**
	 * Constructor.
	 *
	 * @param entries Map of URL to cached responses.
	 */
	constructor(entries: Map<string, ICachedResponse[]>) {
		this.#entries = entries;
	}

	/**
	 * Loads cache from file system.
	 *
	 * @param directory Directory to load from.
	 */
	public async load(directory: string): Promise<void> {
		if (!directory) {
			throw new Error(
				"Failed to execute 'load' on 'ResponseCacheFileSystem': Directory is not specified."
			);
		}

		const absoluteDirectory = Path.resolve(directory);
		let files: string[] = [];

		try {
			files = await FS.promises.readdir(absoluteDirectory);
		} catch (error) {
			// Ignore if the directory does not exist
			return;
		}

		const promises = [];
		const entries = this.#entries;

		for (const file of files) {
			if (file.endsWith('.json')) {
				promises.push(
					FS.promises
						.readFile(Path.join(absoluteDirectory, file), 'utf8')
						.then((content) => {
							const cachedResponse = <ICachedResponse>JSON.parse(content);
							if (cachedResponse.response && cachedResponse.request && !cachedResponse.virtual) {
								cachedResponse.response.headers = new Headers(cachedResponse.response.headers);
								cachedResponse.request.headers = new Headers(cachedResponse.request.headers);

								return FS.promises
									.readFile(Path.join(absoluteDirectory, file.split('.')[0] + '.data'))
									.then((body) => {
										cachedResponse.response.body = body;
										let entry = entries.get(cachedResponse.response.url);
										if (!entry) {
											entry = [];
											entries.set(cachedResponse.response.url, entry);
										}
										entry.push(cachedResponse);
									})
									.catch(() => {
										let entry = entries.get(cachedResponse.response.url);
										if (!entry) {
											entry = [];
											entries.set(cachedResponse.response.url, entry);
										}
										entry.push(cachedResponse);
									});
							}
						})
						.catch(() => {})
				);
			}
		}

		await Promise.all(promises);
	}

	/**
	 * Saves the cache to file system.
	 *
	 * @param directory Directory to store to.
	 */
	public async save(directory: string): Promise<void> {
		if (!directory) {
			throw new Error(
				"Failed to execute 'store' on 'ResponseCacheFileSystem': Directory is not specified."
			);
		}

		if (!this.#entries.size) {
			return;
		}

		const absoluteDirectory = Path.resolve(directory);
		const isDirectoryCreated = this.#createdDirectories.has(absoluteDirectory);

		if (!isDirectoryCreated) {
			this.#createdDirectories.add(absoluteDirectory);
			try {
				await FS.promises.mkdir(absoluteDirectory, {
					recursive: true
				});
			} catch (error) {
				// Ignore if the directory already exists
			}
		}

		const entries = this.#entries;
		const promises = [];

		for (const entry of entries.values()) {
			for (const cachedResponse of entry) {
				if (!cachedResponse.virtual) {
					const responseHeaders: { [k: string]: string } = {};
					const requestHeaders: { [k: string]: string } = {};

					for (const [key, value] of cachedResponse.response.headers.entries()) {
						responseHeaders[key] = value;
					}

					for (const [key, value] of cachedResponse.request.headers.entries()) {
						requestHeaders[key] = value;
					}

					const cacheableEntry = {
						...cachedResponse,
						response: {
							...cachedResponse.response,
							headers: responseHeaders,
							body: null
						},
						request: {
							...cachedResponse.request,
							headers: requestHeaders
						}
					};

					const json = JSON.stringify(cacheableEntry, null, 3);
					const hash = Crypto.createHash('md5').update(json).digest('hex');

					if (!this.#hashes.has(hash)) {
						this.#hashes.add(hash);

						promises.push(
							FS.promises.writeFile(Path.join(absoluteDirectory, `${hash}.json`), json)
						);

						if (cachedResponse.response.body) {
							promises.push(
								FS.promises.writeFile(
									Path.join(absoluteDirectory, `${hash}.data`),
									cachedResponse.response.body
								)
							);
						}
					}
				}
			}
		}

		await Promise.all(promises);
	}
}
