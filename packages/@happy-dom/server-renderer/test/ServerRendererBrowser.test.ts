import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import FS from 'fs';
import Path from 'path';
import ServerRendererBrowser from '../src/ServerRendererBrowser.js';
import ServerRendererConfigurationFactory from '../src/utilities/ServerRendererConfigurationFactory.js';
import Fetch from 'happy-dom/lib/fetch/Fetch.js';
import Headers from 'happy-dom/lib/fetch/Headers.js';
import Response from 'happy-dom/lib/fetch/Response.js';
import MockedPageHTML from './MockedPageHTML.js';
import MockedURLList from './MockedURLList.js';
import ResponseCacheFileSystem from 'happy-dom/lib/fetch/cache/response/ResponseCacheFileSystem.js';

describe('ServerRendererBrowser', () => {
	beforeEach(() => {});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('render()', () => {
		it('Renders an item without output file.', async () => {
			const createdDirectories: string[] = [];
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => MockedPageHTML
				};
			});
			vi.spyOn(FS.promises, 'mkdir').mockImplementation(async (path: any): Promise<any> => {
				createdDirectories.push(path);
				return Promise.resolve();
			});
			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true }
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);

			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: MockedPageHTML.replace('<h1></h1>', '<h1>Path: /gb/en/</h1>'),
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}
			]);
			expect(createdDirectories).toEqual([]);
		});

		it('Renders multiple items without output file.', async () => {
			const createdDirectories: string[] = [];
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => MockedPageHTML
				};
			});
			vi.spyOn(FS.promises, 'mkdir').mockImplementation(async (path: any): Promise<any> => {
				createdDirectories.push(path);
				return Promise.resolve();
			});
			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true }
				})
			);
			const results = await browser.render(MockedURLList.slice(0, 15).map((url) => ({ url })));

			expect(results).toEqual(
				MockedURLList.slice(0, 15).map((url) => ({
					url,
					content: MockedPageHTML.replace('<h1></h1>', `<h1>Path: ${new URL(url).pathname}</h1>`),
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}))
			);
			expect(createdDirectories).toEqual([]);
		});

		it('Renders multiple items with output file.', async () => {
			const createdDirectories: string[] = [];
			const loadedCacheDirectories: string[] = [];
			const savedCacheDirectories: string[] = [];
			const writtenFiles: { filePath: string; content: string }[] = [];
			const requestHeaders: Array<{ [key: string]: string }> = [];

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async function (this: Fetch) {
				const headers: { [key: string]: string } = {};
				for (const [key, value] of (<any>this).request.headers) {
					headers[key] = value;
				}
				requestHeaders.push(headers);
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value', 'Cache-Control': 'max-age=3600' }),
					status: 200,
					statusText: 'OK',
					text: async () => MockedPageHTML
				};
			});
			vi.spyOn(FS.promises, 'mkdir').mockImplementation(async (path: any): Promise<any> => {
				createdDirectories.push(path);
				return Promise.resolve();
			});
			vi.spyOn(FS.promises, 'writeFile').mockImplementation(async (filePath: any, content: any) => {
				writtenFiles.push({ filePath, content });
				return Promise.resolve();
			});
			vi.spyOn(ResponseCacheFileSystem.prototype, 'load').mockImplementation(
				async (directory: string) => {
					loadedCacheDirectories.push(directory);
				}
			);
			vi.spyOn(ResponseCacheFileSystem.prototype, 'save').mockImplementation(
				async (directory: string) => {
					savedCacheDirectories.push(directory);
				}
			);

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true }
				})
			);
			const results = await browser.render(
				MockedURLList.slice(0, 15).map((url, index) => ({
					url,
					outputFile: `./test-output/test-${index + 1}.html`,
					headers:
						index === 1 ? { 'Request-Header-1': 'Value1', 'Request-Header-2': 'Value2' } : undefined
				}))
			);
			expect(results).toEqual(
				MockedURLList.slice(0, 15).map((url, index) => ({
					url,
					content: null,
					error: null,
					headers: { key1: 'value', 'Cache-Control': 'max-age=3600' },
					outputFile: `./test-output/test-${index + 1}.html`,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}))
			);
			expect(requestHeaders).toEqual([
				{},
				{ 'Request-Header-1': 'Value1', 'Request-Header-2': 'Value2' },
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{}
			]);
			expect(createdDirectories).toEqual(['./test-output']);
			expect(loadedCacheDirectories).toEqual([Path.resolve('./happy-dom/cache')]);
			expect(savedCacheDirectories).toEqual([Path.resolve('./happy-dom/cache')]);
			expect(writtenFiles).toEqual(
				MockedURLList.slice(0, 15).map((url, index) => ({
					filePath: `./test-output/test-${index + 1}.html`,
					content: MockedPageHTML.replace('<h1></h1>', `<h1>Path: ${new URL(url).pathname}</h1>`)
				}))
			);
		});

		it('Handles error response.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: false,
					headers: new Headers({ key1: 'value' }),
					status: 500,
					statusText: 'Internal Server Error',
					text: async () => 'Error'
				};
			});
			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true }
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);

			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: null,
					error: 'Failed to render page https://example.com/gb/en/ (500 Internal Server Error)',
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: 'GET https://example.com/gb/en/ 500 (Internal Server Error)\n',
					pageErrors: [],
					status: 500,
					statusText: 'Internal Server Error'
				}
			]);
		});

		it('Handles render timeout error.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => `<script>function t(){ setTimeout(t, 10) } t()</script>`
				};
			});

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true },
					render: {
						timeout: 100
					}
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);
			(<any>results[0]).error = results[0]
				.error!.replace(/\(.+\/happy-dom\/src\//gm, '(/')
				.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: null,
					error: `The page was not rendered within the defined time of 100ms and the operation was aborted. You can increase this value with the \"render.timeout\" setting.

The page may contain scripts with timer loops that prevent it from completing. You can debug open handles by setting \"debug\" to true, or prevent timer loops by setting \"browser.timer.preventTimerLoops\" to true. Read more about this in the documentation.`,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}
			]);
		});

		it('Handles debug error caused while waiting for the page to complete.', async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => `<script>function t(){ setTimeout(t, 10) } t()</script>`
				};
			});

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true },
					render: {
						timeout: 100
					},
					debug: true
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);
			(<any>results[0]).error = results[0]
				.error!.replace(/\(.+\/happy-dom\/src\//gm, '(/')
				.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: null,
					error: `Error: The maximum time was reached for "waitUntilComplete()".

1 task did not end in time.

The following traces were recorded:

Timer #1
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
> AsyncTaskManager.startTimer (/async-task-manager/AsyncTaskManager.ts:0:0)
> BrowserWindow.setTimeout (/window/BrowserWindow.ts:0:0)
> t (https://example.com/gb/en/:0:0)
> Timeout._onTimeout (/window/BrowserWindow.ts:0:0)
> listOnTimeout (node:internal/timers:0:0)
> processTimers (node:internal/timers:0:0)


    at Timeout._onTimeout (/async-task-manager/AsyncTaskManager.ts:0:0)
    at listOnTimeout (node:internal/timers:0:0)
    at processTimers (node:internal/timers:0:0)`,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}
			]);
		});

		it('Outputs captured error events on the page Window.', async () => {
			const html = `<!DOCTYPE html><html><head></head><body><script>setTimeout(() => { throw new Error('Error') }, 10);</script></body></html>`;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => html
				};
			});

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true }
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);
			(<any>results[0]).pageConsole = results[0].pageConsole
				.replace(/\(.+\/happy-dom\/src\//gm, '(/')
				.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
			(<any>results[0]).pageErrors[0] = results[0].pageErrors[0]
				.replace(/\(.+\/happy-dom\/src\//gm, '(/')
				.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: html,
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: `Error: Error
    at https://example.com/gb/en/:1:26
    at Timeout._onTimeout (/window/BrowserWindow.ts:0:0)
    at listOnTimeout (node:internal/timers:0:0)
    at processTimers (node:internal/timers:0:0)
`,
					pageErrors: [
						`Error: Error
    at https://example.com/gb/en/:1:26
    at Timeout._onTimeout (/window/BrowserWindow.ts:0:0)
    at listOnTimeout (node:internal/timers:0:0)
    at processTimers (node:internal/timers:0:0)`
					],
					status: 200,
					statusText: 'OK'
				}
			]);
		});

		it('Supports rendering all shadow roots.', async () => {
			const html = `<custom-element></custom-element>
            <script>
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Shadow root content</p>';
                    }
                }
                customElements.define('custom-element', CustomElement);
            </script>`;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => html
				};
			});

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true },
					render: {
						allShadowRoots: true
					}
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);
			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: `<!DOCTYPE html><html><head></head><body><custom-element><template shadowrootmode=\"open\"><p>Shadow root content</p></template></custom-element>
            <script>
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Shadow root content</p>';
                    }
                }
                customElements.define('custom-element', CustomElement);
            </script></body></html>`,
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}
			]);
		});

		it('Supports rendering serializable shadow roots.', async () => {
			const html = `<custom-element></custom-element>
            <script>
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Should not render</p>';
                    }
                }
                class CustomElement2 extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open', serializable: true });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Shadow root content</p>';
                    }
                }
                customElements.define('custom-element', CustomElement);
                customElements.define('custom-element-2', CustomElement2);
            </script>`;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => html
				};
			});

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true },
					render: {
						serializableShadowRoots: true
					}
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);
			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: `<!DOCTYPE html><html><head></head><body><custom-element></custom-element>
            <script>
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Should not render</p>';
                    }
                }
                class CustomElement2 extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open', serializable: true });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Shadow root content</p>';
                    }
                }
                customElements.define('custom-element', CustomElement);
                customElements.define('custom-element-2', CustomElement2);
            </script></body></html>`,
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}
			]);
		});

		it('Supports excluding shadow root tags.', async () => {
			const html = `<custom-element></custom-element>
            <script>
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Should not render</p>';
                    }
                }
                class CustomElement2 extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Shadow root content</p>';
                    }
                }
                customElements.define('custom-element', CustomElement);
                customElements.define('custom-element-2', CustomElement2);
            </script>`;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value' }),
					status: 200,
					statusText: 'OK',
					text: async () => html
				};
			});

			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true },
					render: {
						allShadowRoots: true,
						excludeShadowRootTags: ['custom-element']
					}
				})
			);
			const results = await browser.render([{ url: 'https://example.com/gb/en/' }]);
			expect(results).toEqual([
				{
					url: 'https://example.com/gb/en/',
					content: `<!DOCTYPE html><html><head></head><body><custom-element></custom-element>
            <script>
                class CustomElement extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Should not render</p>';
                    }
                }
                class CustomElement2 extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });
                    }
                    connectedCallback() {
                        this.shadowRoot.innerHTML = '<p>Shadow root content</p>';
                    }
                }
                customElements.define('custom-element', CustomElement);
                customElements.define('custom-element-2', CustomElement2);
            </script></body></html>`,
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				}
			]);
		});

		it('Supports disabling all cache.', async () => {
			const loadedCacheDirectories: string[] = [];
			const savedCacheDirectories: string[] = [];
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
				return <Response>{
					ok: true,
					headers: new Headers({ key1: 'value', 'Cache-Control': 'max-age=3600' }),
					status: 200,
					statusText: 'OK',
					text: async () => MockedPageHTML
				};
			});
			vi.spyOn(ResponseCacheFileSystem.prototype, 'load').mockImplementation(
				async (directory: string) => {
					loadedCacheDirectories.push(directory);
				}
			);
			vi.spyOn(ResponseCacheFileSystem.prototype, 'save').mockImplementation(
				async (directory: string) => {
					savedCacheDirectories.push(directory);
				}
			);
			const browser = new ServerRendererBrowser(
				ServerRendererConfigurationFactory.createConfiguration({
					browser: { suppressCodeGenerationFromStringsWarning: true },
					cache: {
						disable: true
					}
				})
			);
			await browser.render([{ url: 'https://example.com/gb/en/' }]);
			expect(loadedCacheDirectories).toEqual([]);
			expect(savedCacheDirectories).toEqual([]);
		});
	});
});
