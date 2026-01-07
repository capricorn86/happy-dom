import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import ServerRendererPage from '../src/ServerRendererPage.js';
import ServerRendererConfigurationFactory from '../src/utilities/ServerRendererConfigurationFactory.js';
import Fetch from 'happy-dom/lib/fetch/Fetch.js';
import Headers from 'happy-dom/lib/fetch/Headers.js';
import Response from 'happy-dom/lib/fetch/Response.js';
import MockedPageHTML from './MockedPageHTML.js';
import { Browser, BrowserPage } from 'happy-dom';
import ServerRendererModeEnum from '../src/enums/ServerRendererModeEnum.js';

describe('ServerRendererPage', () => {
	let browser: Browser;
	let page: BrowserPage;

	beforeEach(() => {
		browser = new Browser({
			settings: {
				enableJavaScriptEvaluation: true,
				suppressInsecureJavaScriptEnvironmentWarning: true
			}
		});
		page = browser.newPage();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('render()', () => {
		for (const mode of [ServerRendererModeEnum.browser, ServerRendererModeEnum.page]) {
			it(`Renders an item URL without output file in ${mode} mode.`, async () => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
					return <Response>{
						ok: true,
						headers: new Headers({ key1: 'value' }),
						status: 200,
						statusText: 'OK',
						text: async () => MockedPageHTML
					};
				});
				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration()
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });

				expect(result).toEqual({
					url: 'https://example.com/gb/en/',
					content: MockedPageHTML.replace('<h1></h1>', '<h1>Path: /gb/en/</h1>'),
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				});
			});

			it(`Renders an item HTML string without output file in ${mode} mode.`, async () => {
				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration()
				);
				const result = await pageRenderer.render(page, {
					html: MockedPageHTML,
					url: 'https://example.com/gb/en/'
				});

				expect(result).toEqual({
					url: 'https://example.com/gb/en/',
					content: MockedPageHTML.replace('<h1></h1>', '<h1>Path: /gb/en/</h1>'),
					error: null,
					headers: null,
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: null,
					statusText: null
				});
			});

			it(`Executes setup script in ${mode} mode.`, async () => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
					return <Response>{
						ok: true,
						headers: new Headers({ key1: 'value' }),
						status: 200,
						statusText: 'OK',
						text: async () => MockedPageHTML
					};
				});

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						render: {
							setupScript: `setTimeout(() => {
                                document.querySelector('h1').textContent = 'Setup script executed';
                            }, 50);`
						}
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });

				expect(result).toEqual({
					url: 'https://example.com/gb/en/',
					content: MockedPageHTML.replace('<h1></h1>', '<h1>Setup script executed</h1>'),
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK'
				});
			});

			it(`Handles error response in ${mode} mode.`, async () => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
					return <Response>{
						ok: false,
						headers: new Headers({ key1: 'value' }),
						status: 500,
						statusText: 'Internal Server Error',
						text: async () => 'Error'
					};
				});
				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration()
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });

				expect(result).toEqual({
					url: 'https://example.com/gb/en/',
					content: null,
					error: 'Failed to render page https://example.com/gb/en/ (500 Internal Server Error)',
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: 'GET https://example.com/gb/en/ 500 (Internal Server Error)\n',
					pageErrors: [],
					status: 500,
					statusText: 'Internal Server Error'
				});
			});

			it(`Handles render timeout error in ${mode} mode.`, async () => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
					return <Response>{
						ok: true,
						headers: new Headers({ key1: 'value' }),
						status: 200,
						statusText: 'OK',
						text: async () => `<script>function t(){ setTimeout(t, 10) } t()</script>`
					};
				});

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						render: {
							timeout: 100
						}
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });
				(<any>result).error = result
					.error!.replace(/\(.+\/happy-dom\/src\//gm, '(/')
					.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
				expect(result).toEqual({
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
				});
			});

			it(`Handles debug error caused while waiting for the page to complete in ${mode} mode.`, async () => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(async () => {
					return <Response>{
						ok: true,
						headers: new Headers({ key1: 'value' }),
						status: 200,
						statusText: 'OK',
						text: async () => `<script>function t(){ setTimeout(t, 10) } t()</script>`
					};
				});

				browser.settings.debug.traceWaitUntilComplete = 100;

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						render: {
							timeout: 100
						},
						debug: true
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });
				(<any>result).error = result
					.error!.replace(/\(.+\/happy-dom\/src\//gm, '(/')
					.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
				expect(result).toEqual({
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
				});
			});

			it(`Outputs captured error events on the page Window in ${mode} mode.`, async () => {
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

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						render: {
							timeout: 100
						},
						debug: true
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });
				(<any>result).pageConsole = result.pageConsole
					.replace(/\(.+\/happy-dom\/src\//gm, '(/')
					.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
				(<any>result).pageErrors[0] = result.pageErrors[0]
					.replace(/\(.+\/happy-dom\/src\//gm, '(/')
					.replace(/:[0-9]+:[0-9]+\)/gm, ':0:0)');
				expect(result).toEqual({
					url: 'https://example.com/gb/en/',
					content: html,
					error: null,
					headers: { key1: 'value' },
					outputFile: null,
					pageConsole: `Error: Error
    at https://example.com/gb/en/:1:64
    at Timeout._onTimeout (/window/BrowserWindow.ts:0:0)
    at listOnTimeout (node:internal/timers:0:0)
    at processTimers (node:internal/timers:0:0)
`,
					pageErrors: [
						`Error: Error
    at https://example.com/gb/en/:1:64
    at Timeout._onTimeout (/window/BrowserWindow.ts:0:0)
    at listOnTimeout (node:internal/timers:0:0)
    at processTimers (node:internal/timers:0:0)`
					],
					status: 200,
					statusText: 'OK'
				});
			});

			it(`Supports rendering all shadow roots in ${mode} mode.`, async () => {
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

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						browser: {
							enableJavaScriptEvaluation: true,
							suppressInsecureJavaScriptEnvironmentWarning: true
						},
						render: {
							allShadowRoots: true
						}
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });
				expect(result).toEqual({
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
				});
			});

			it(`Supports rendering serializable shadow roots in ${mode} mode.`, async () => {
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

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						browser: {
							enableJavaScriptEvaluation: true,
							suppressInsecureJavaScriptEnvironmentWarning: true
						},
						render: {
							serializableShadowRoots: true
						}
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });
				expect(result).toEqual({
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
				});
			});

			it(`Supports excluding shadow root tags in ${mode} mode.`, async () => {
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

				const pageRenderer = new ServerRendererPage(
					ServerRendererConfigurationFactory.createConfiguration({
						browser: {
							enableJavaScriptEvaluation: true,
							suppressInsecureJavaScriptEnvironmentWarning: true
						},
						render: {
							allShadowRoots: true,
							excludeShadowRootTags: ['custom-element']
						}
					})
				);
				const result = await pageRenderer.render(page, { url: 'https://example.com/gb/en/' });
				expect(result).toEqual({
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
				});
			});
		}
	});
});
