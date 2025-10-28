import ICachedResponse from '../../../../src/fetch/cache/response/ICachedResponse';
import ResponseCacheFileSystem from '../../../../src/fetch/cache/response/ResponseCacheFileSystem';
import FS from 'fs';
import Path from 'path';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import Headers from '../../../../src/fetch/Headers';

const ROOT_DIRECTORY = '/root/';
const CACHE_DIRECTORY = '/directory/';
const ABSOLUTE_DIRECTORY = '/root/directory/';
const NOW = 1756378175576;
const EXPIRES = NOW + 60 * 60 * 1000; // 1 hour from now
const CACHE_FILES = {
	'/root/directory/bb9670b6c3bfec6d32e26a2718bdab31.json': JSON.stringify(
		{
			response: {
				status: 200,
				statusText: 'OK',
				url: 'https://localhost:8080/static/style.css',
				headers: {
					Connection: 'close',
					'Content-Length': '64712',
					ETag: '"bcd58b3a528416716412c44465ca4d54"',
					'x-amz-server-side-encryption': 'AES256',
					'Content-Encoding': 'br',
					'Content-Type': 'text/css',
					'X-CDN': 'fastly',
					'alt-svc': 'h3=":443";ma=600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Max-Age': '86400',
					'Access-Control-Expose-Headers': 'X-CDN',
					Vary: 'Accept-Encoding, Origin',
					'Cache-Control': 'max-age=31536000',
					date: 'Sat, 23 Aug 2025 12:11:05 GMT'
				},
				waitingForBody: false,
				body: null
			},
			request: {
				headers: {},
				method: 'GET'
			},
			vary: {},
			expires: EXPIRES,
			etag: '"bcd58b3a528416716412c44465ca4d54"',
			cacheUpdateTime: 1755951065755,
			lastModified: null,
			mustRevalidate: false,
			staleWhileRevalidate: false,
			state: 'fresh',
			virtual: false
		},
		null,
		3
	),
	'/root/directory/bb9670b6c3bfec6d32e26a2718bdab31.data': Buffer.from('body { color: red; }'),
	'/root/directory/a778981fb84eaf6431802bdbd8914c21.json': JSON.stringify(
		{
			response: {
				status: 200,
				statusText: 'OK',
				url: 'https://localhost:8080/static/app.js',
				headers: {
					Connection: 'close',
					'Content-Length': '3900',
					ETag: '"100238fb7ec9b0e857cf5a5796da9ebc"',
					'x-amz-server-side-encryption': 'AES256',
					'Content-Encoding': 'br',
					'Content-Type': 'application/javascript',
					'X-CDN': 'fastly',
					'alt-svc': 'h3=":443";ma=600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Max-Age': '86400',
					'Access-Control-Expose-Headers': 'X-CDN',
					Vary: 'Accept-Encoding, Origin',
					'Cache-Control': 'max-age=31536000',
					date: 'Sat, 23 Aug 2025 12:11:05 GMT'
				},
				waitingForBody: false,
				body: null
			},
			request: {
				headers: {},
				method: 'GET'
			},
			vary: {},
			expires: EXPIRES,
			etag: '"100238fb7ec9b0e857cf5a5796da9ebc"',
			cacheUpdateTime: 1755951065766,
			lastModified: null,
			mustRevalidate: false,
			staleWhileRevalidate: false,
			state: 'fresh',
			virtual: false
		},
		null,
		3
	)
};
const CACHE_ENTRIES = {
	'https://localhost:8080/static/style.css': [
		{
			response: {
				status: 200,
				statusText: 'OK',
				url: 'https://localhost:8080/static/style.css',
				headers: new Headers({
					Connection: 'close',
					'Content-Length': '64712',
					ETag: '"bcd58b3a528416716412c44465ca4d54"',
					'x-amz-server-side-encryption': 'AES256',
					'Content-Encoding': 'br',
					'Content-Type': 'text/css',
					'X-CDN': 'fastly',
					'alt-svc': 'h3=":443";ma=600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Max-Age': '86400',
					'Access-Control-Expose-Headers': 'X-CDN',
					Vary: 'Accept-Encoding, Origin',
					'Cache-Control': 'max-age=31536000',
					date: 'Sat, 23 Aug 2025 12:11:05 GMT'
				}),
				waitingForBody: false,
				body: Buffer.from('body { color: red; }')
			},
			request: {
				headers: new Headers(),
				method: 'GET'
			},
			vary: {},
			expires: EXPIRES,
			etag: '"bcd58b3a528416716412c44465ca4d54"',
			cacheUpdateTime: 1755951065755,
			lastModified: null,
			mustRevalidate: false,
			staleWhileRevalidate: false,
			state: 'fresh',
			virtual: false
		}
	],
	'https://localhost:8080/static/app.js': [
		{
			response: {
				status: 200,
				statusText: 'OK',
				url: 'https://localhost:8080/static/app.js',
				headers: new Headers({
					Connection: 'close',
					'Content-Length': '3900',
					ETag: '"100238fb7ec9b0e857cf5a5796da9ebc"',
					'x-amz-server-side-encryption': 'AES256',
					'Content-Encoding': 'br',
					'Content-Type': 'application/javascript',
					'X-CDN': 'fastly',
					'alt-svc': 'h3=":443";ma=600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Max-Age': '86400',
					'Access-Control-Expose-Headers': 'X-CDN',
					Vary: 'Accept-Encoding, Origin',
					'Cache-Control': 'max-age=31536000',
					date: 'Sat, 23 Aug 2025 12:11:05 GMT'
				}),
				waitingForBody: false,
				body: null
			},
			request: {
				headers: new Headers(),
				method: 'GET'
			},
			vary: {},
			expires: EXPIRES,
			etag: '"100238fb7ec9b0e857cf5a5796da9ebc"',
			cacheUpdateTime: 1755951065766,
			lastModified: null,
			mustRevalidate: false,
			staleWhileRevalidate: false,
			state: 'fresh',
			virtual: false
		}
	]
};

describe('ResponseCacheFileSystem', () => {
	let entries: Map<string, ICachedResponse[]>;
	let fileSystem: ResponseCacheFileSystem;

	beforeEach(() => {
		entries = new Map();
		fileSystem = new ResponseCacheFileSystem(entries);
		vi.spyOn(Date, 'now').mockReturnValue(NOW);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('load()', () => {
		it('Loads cache from file system.', async () => {
			vi.spyOn(Path, 'resolve').mockImplementation((directory: string): string =>
				`${ROOT_DIRECTORY}${directory}`.replace('//', '/')
			);

			vi.spyOn(FS.promises, 'readdir').mockImplementation((directory: any): any => {
				expect(directory).toBe(ABSOLUTE_DIRECTORY);
				return Promise.resolve(
					Object.keys(CACHE_FILES).map((filePath) => filePath.split('/').pop())
				);
			});

			vi.spyOn(FS.promises, 'readFile').mockImplementation((filePath: any, encoding: any): any => {
				expect(encoding).toBe(filePath.endsWith('.json') ? 'utf8' : undefined);

				if (CACHE_FILES[filePath]) {
					return Promise.resolve(CACHE_FILES[filePath]);
				}

				return Promise.reject();
			});

			await fileSystem.load(CACHE_DIRECTORY);

			expect(entries.size).toBe(2);

			for (const key of Object.keys(CACHE_ENTRIES)) {
				expect(entries.get(key)).toEqual(CACHE_ENTRIES[key]);
			}
		});
	});

	describe('save()', () => {
		it('Saves the cache to file system.', async () => {
			const createdDirectories: string[] = [];
			const writtenFiles: Array<{ filePath: string; content: string | Buffer }> = [];

			for (const key of Object.keys(CACHE_ENTRIES)) {
				entries.set(key, CACHE_ENTRIES[key]);
			}

			vi.spyOn(Path, 'resolve').mockImplementation((directory: string): string =>
				`${ROOT_DIRECTORY}${directory}`.replace('//', '/')
			);

			vi.spyOn(FS.promises, 'mkdir').mockImplementation((directory: any): any => {
				expect(directory).toBe(ABSOLUTE_DIRECTORY);
				createdDirectories.push(directory);
				return Promise.resolve();
			});

			vi.spyOn(FS.promises, 'writeFile').mockImplementation(
				(filePath: any, content: any): Promise<void> => {
					writtenFiles.push({ filePath, content });
					return Promise.resolve();
				}
			);

			await fileSystem.save(CACHE_DIRECTORY);

			expect(createdDirectories).toEqual([ABSOLUTE_DIRECTORY]);

			expect(writtenFiles.length).toBe(3);

			for (const writtenFile of writtenFiles) {
				expect(writtenFile.content).toEqual(CACHE_FILES[writtenFile.filePath]);
			}
		});
	});
});
