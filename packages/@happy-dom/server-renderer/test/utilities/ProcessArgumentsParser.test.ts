import { describe, it, expect } from 'vitest';
import ProcessArgumentsParser from '../../src/utilities/ProcessArgumentsParser.js';
import DefaultServerRendererConfiguration from '../../src/config/DefaultServerRendererConfiguration.js';
import IServerRendererConfiguration from '../../src/types/IServerRendererConfiguration.js';
import MockedConfiguration from './MockedConfiguration.js';

describe('ProcessArgumentsParser', () => {
	describe('getConfiguration()', () => {
		it('Returns default configuration.', async () => {
			const config = await ProcessArgumentsParser.getConfiguration(['node', 'script.js']);
			expect(config).toEqual(DefaultServerRendererConfiguration);
		});

		it('Returns configuration with render options.', async () => {
			const expectedConfig: IServerRendererConfiguration = {
				...DefaultServerRendererConfiguration,
				render: {
					...DefaultServerRendererConfiguration.render,
					timeout: 3600
				},
				urls: [
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
				...DefaultServerRendererConfiguration,
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
				...DefaultServerRendererConfiguration,
				server: {
					...DefaultServerRendererConfiguration.server,
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
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--config=./test/utilities/MockedConfiguration.ts'
				])
			).toEqual(MockedConfiguration);
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'-c="./test/utilities/MockedConfiguration.ts"'
				])
			).toEqual(MockedConfiguration);
		});

		it('Returns configuration with request headers.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				browser: {
					...DefaultServerRendererConfiguration.browser,
					fetch: {
						...DefaultServerRendererConfiguration.browser.fetch,
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

		it('Returns configuration with virtual server.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				browser: {
					...DefaultServerRendererConfiguration.browser,
					fetch: {
						...DefaultServerRendererConfiguration.browser.fetch,
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

		it('Returns configuration with viewport width and height.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				browser: {
					...DefaultServerRendererConfiguration.browser,
					viewport: {
						...DefaultServerRendererConfiguration.browser.viewport,
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

		it('Returns configuration with debug enabled.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				debug: true
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--debug'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-d'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with inspect enabled.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				inspect: true
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--inspect'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-i'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with output directory.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				outputDirectory: './output/render'
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--outputDirectory=./output/render'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-o=./output/render'])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with cache directory.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				cache: {
					...DefaultServerRendererConfiguration.cache,
					directory: './output/cache'
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--cache.directory=./output/cache'
				])
			).toEqual(expectedConfig);
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-cd=./output/cache'])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with log level.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				logLevel: 2
			};
			expect(
				await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '--logLevel=2'])
			).toEqual(expectedConfig);
			expect(await ProcessArgumentsParser.getConfiguration(['node', 'script.js', '-l=2'])).toEqual(
				expectedConfig
			);
		});

		it('Returns configuration with javascript evaluation disabled.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				browser: {
					...DefaultServerRendererConfiguration.browser,
					enableJavaScriptEvaluation: false
				}
			};
			expect(
				await ProcessArgumentsParser.getConfiguration([
					'node',
					'script.js',
					'--browser.disableJavaScriptEvaluation'
				])
			).toEqual(expectedConfig);
		});

		it('Returns configuration with suppressed JavaScript environment warning.', async () => {
			const expectedConfig = {
				...DefaultServerRendererConfiguration,
				browser: {
					...DefaultServerRendererConfiguration.browser,
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
				'urls'
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
			const config2 = MockedConfiguration;

			expect({
				...config,
				urls: [
					{
						url: 'https://example.com/page1',
						outputFile: 'page1/index.html',
						headers: null
					},
					{
						url: 'https://example.com/page2',
						outputFile: 'page2/index.html',
						headers: { 'X-Test': 'Value' }
					},
					{ url: 'https://example.com/page3', outputFile: 'page3/index.html', headers: null }
				]
			}).toEqual(config2);
		});
	});
});
