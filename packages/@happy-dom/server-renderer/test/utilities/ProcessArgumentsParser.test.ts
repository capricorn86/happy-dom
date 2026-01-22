import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ProcessArgumentsParser from '../../src/utilities/ProcessArgumentsParser.js';
import DefaultServerRendererConfiguration from '../../src/config/DefaultServerRendererConfiguration.js';
import IServerRendererConfiguration from '../../src/types/IServerRendererConfiguration.js';
import MockedConfiguration from './MockedConfiguration.js';
import Path from 'path';

const DEFAULT_CONFIGURATION: IServerRendererConfiguration = {
	...DefaultServerRendererConfiguration,
	outputDirectory: Path.resolve(DefaultServerRendererConfiguration.outputDirectory),
	cache: {
		...DefaultServerRendererConfiguration.cache,
		directory: Path.resolve(DefaultServerRendererConfiguration.cache.directory)
	}
};

describe('ProcessArgumentsParser', () => {
	describe('getConfiguration()', () => {
		it('Returns default configuration.', async () => {
			const config = await ProcessArgumentsParser.getConfiguration(['node', 'script.js']);
			expect(config).toEqual(DEFAULT_CONFIGURATION);
		});

		it('Returns configuration with render options.', async () => {
			const expectedConfig: IServerRendererConfiguration = {
				...DEFAULT_CONFIGURATION,
				render: {
					...DEFAULT_CONFIGURATION.render,
					timeout: 3600
				},
				renderItems: [
					{
						url: 'https://example.com/path/page1',
						outputFile: 'path/page1/index.html'
					},
					{
						url: 'https://example.com/path/page2/?query=123#hash',
						outputFile: 'path/page2/index.html'
					}
				]
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--render.timeout=3600',
					'"https://example.com/path/page1"',
					'"https://example.com/path/page2/?query=123#hash"'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-rt=3600',
					'"https://example.com/path/page1"',
					'"https://example.com/path/page2/?query=123#hash"'
				])
			).toEqual(expectedConfig);
		});

		it('Renders configuration with help option.', async () => {
			const expectedConfig: IServerRendererConfiguration = {
				...DEFAULT_CONFIGURATION,
				help: true
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--help'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-h'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with server options.', async () => {
			const expectedConfig: IServerRendererConfiguration = {
				...DEFAULT_CONFIGURATION,
				server: {
					...DEFAULT_CONFIGURATION.server,
					start: true,
					serverURL: 'http://localhost:8080/',
					targetOrigin: 'http://example.com/',
					disableCache: true,
					disableCacheQueue: true,
					cacheTime: 3600
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--server',
					'--server.serverURL=http://localhost:8080/',
					'--server.targetOrigin=http://example.com/',
					'--server.disableCache',
					'--server.disableCacheQueue',
					'--server.cacheTime=3600'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-s',
					'-su=http://localhost:8080/',
					'-st=http://example.com/',
					'-sdc',
					'-sdq',
					'-sct=3600'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration from config file.', async () => {
			const expectedConfig: IServerRendererConfiguration = {
				...MockedConfiguration,
				outputDirectory: Path.resolve(MockedConfiguration.outputDirectory),
				cache: {
					...MockedConfiguration.cache,
					directory: Path.resolve(MockedConfiguration.cache.directory)
				},
				renderItems: [
					{ url: 'https://example.com/page1', outputFile: 'page1/index.html' },
					{
						url: 'https://example.com/page2',
						outputFile: 'page2/index.html',
						headers: { 'X-Test': 'Value' }
					},
					{ url: 'https://example.com/page3', outputFile: 'page3/index.html' }
				]
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--config=./test/utilities/MockedConfiguration.ts'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-c="./test/utilities/MockedConfiguration.ts"'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "browser.fetch.requestHeaders".', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				browser: {
					...DEFAULT_CONFIGURATION.browser,
					fetch: {
						...DEFAULT_CONFIGURATION.browser.fetch,
						requestHeaders: [
							{
								url: null,
								headers: {
									'X-Custom-Header-1': 'Value-1'
								}
							},
							{
								url: /^https:\/\/example\.com\//,
								headers: {
									'X-Custom-Header-2': 'Value-2'
								}
							}
						]
					}
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.fetch.requestHeaders="X-Custom-Header-1:Value-1"',
					'--browser.fetch.requestHeaders="^https://example\\.com/|X-Custom-Header-2:Value-2"'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.fetch.requestHeader="X-Custom-Header-1:Value-1"',
					'--browser.fetch.requestHeader="^https://example\\.com/|X-Custom-Header-2:Value-2"'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-rh="X-Custom-Header-1:Value-1"',
					'-rh="^https://example\\.com/|X-Custom-Header-2:Value-2"'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "browser.fetch.virtualServer".', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				browser: {
					...DEFAULT_CONFIGURATION.browser,
					fetch: {
						...DEFAULT_CONFIGURATION.browser.fetch,
						virtualServers: [
							{
								url: /^https:\/\/example\.com\/path\//,
								directory: './virtual-server/path'
							}
						]
					}
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.fetch.virtualServers="^https://example\\.com/path/|./virtual-server/path"'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.fetch.virtualServer="^https://example\\.com/path/|./virtual-server/path"'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-vs="^https://example\\.com/path/|./virtual-server/path"'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "browser.module.resolveNodeModules".', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				browser: {
					...DEFAULT_CONFIGURATION.browser,
					module: {
						...DEFAULT_CONFIGURATION.browser.module,
						resolveNodeModules: {
							url: 'https://cdn.example.com/modules/',
							directory: './local-modules/',
							mainFields: ['module', 'main']
						}
					}
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.module.resolveNodeModules.url=https://cdn.example.com/modules/',
					'--browser.module.resolveNodeModules.directory=./local-modules/',
					'--browser.module.resolveNodeModules.mainFields=module,main'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "browser.viewport" width and height.', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				browser: {
					...DEFAULT_CONFIGURATION.browser,
					viewport: {
						...DEFAULT_CONFIGURATION.browser.viewport,
						width: 1920,
						height: 1080
					}
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.viewport.width=1920',
					'--browser.viewport.height=1080'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-vw=1920', '-vh=1080'])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "debug" enabled.', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				debug: true
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--debug'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-d'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with "inspect" enabled.', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				inspect: true
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--inspect'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-i'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with "outputDirectory.', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				outputDirectory: Path.resolve('./test/output/render')
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--outputDirectory=./test/output/render'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-o=./test/output/render'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "cache.directory".', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				cache: {
					...DEFAULT_CONFIGURATION.cache,
					directory: Path.resolve('./test/cache')
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--cache.directory=./test/cache'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-cd=./test/cache'])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with "logLevel".', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				logLevel: 2
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--logLevel=2'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-l=2'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with "enableJavaScriptEvaluation" enabled.', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				browser: {
					...DEFAULT_CONFIGURATION.browser,
					enableJavaScriptEvaluation: true
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.enableJavaScriptEvaluation'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--javaScript'])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--javascript'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-j'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with "suppressInsecureJavaScriptEnvironmentWarning" enabled.', async () => {
			const expectedConfig = {
				...DEFAULT_CONFIGURATION,
				browser: {
					...DEFAULT_CONFIGURATION.browser,
					suppressInsecureJavaScriptEnvironmentWarning: true
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.suppressInsecureJavaScriptEnvironmentWarning'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--suppressJavaScriptWarning'
				])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-sj'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration for all options.', async () => {
			const specialArguments = [
				// Deprecated
				'browser.disableErrorCapturing',
				'browser.enableFileSystemHttpRequests',
				'browser.disableIframePageLoading',
				'browser.disableJavaScriptEvaluation',
				'browser.suppressCodeGenerationFromStringsWarning',
				// Special handling
				'browser.enableJavaScriptEvaluation',
				'browser.fetch.requestHeaders',
				'browser.fetch.virtualServers',
				'renderItems'
			];
			const getArgs = (scope: any, args: string[] = [], parentKey: string = ''): string[] => {
				for (const key of Object.keys(scope)) {
					const newKey = `${parentKey}${key}`;
					if (!specialArguments.includes(newKey) && scope[key] !== null) {
						if (typeof scope[key] === 'object') {
							if (Array.isArray(scope[key])) {
								args.push(`--${newKey}=${scope[key].join(',')}`);
							} else {
								getArgs(scope[key], args, `${newKey}.`);
							}
						} else {
							if (typeof scope[key] === 'boolean' && scope[key] === true) {
								args.push(`--${newKey}`);
							} else {
								args.push(`--${newKey}=${scope[key]}`);
							}
						}
					}
				}
				return args;
			};

			const args = getArgs(MockedConfiguration);

			args.unshift('script.js');
			args.unshift('node');
			args.push('--browser.disableJavaScriptEvaluation');
			args.push('--browser.fetch.requestHeaders="X-Custom-Header-1:Value-1"');
			args.push('--browser.fetch.requestHeaders="https://example.com/|X-Custom-Header-2:Value-2"');
			args.push('--browser.fetch.virtualServers="https://example.com/path/|./virtual-server/path"');
			args.push(
				'"https://example.com/page1"',
				'"https://example.com/page2"',
				'"https://example.com/page3"'
			);

			const config = await ProcessArgumentsParser.getConfiguration(args);

			expect(config).toEqual({
				...MockedConfiguration,
				outputDirectory: Path.resolve(MockedConfiguration.outputDirectory),
				cache: {
					...MockedConfiguration.cache,
					directory: Path.resolve(MockedConfiguration.cache.directory)
				},
				renderItems: [
					{ url: 'https://example.com/page1', outputFile: 'page1/index.html' },
					{ url: 'https://example.com/page2', outputFile: 'page2/index.html' },
					{ url: 'https://example.com/page3', outputFile: 'page3/index.html' }
				]
			});
		});
	});
});
