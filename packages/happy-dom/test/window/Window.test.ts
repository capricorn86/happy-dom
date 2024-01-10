import IDocument from '../../src/nodes/document/IDocument.js';
import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import Headers from '../../src/fetch/Headers.js';
import CustomElement from '../../test/CustomElement.js';
import IResponse from '../../src/fetch/types/IResponse.js';
import Fetch from '../../src/fetch/Fetch.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import VirtualConsole from '../../src/console/VirtualConsole.js';
import VirtualConsolePrinter from '../../src/console/VirtualConsolePrinter.js';
import PackageVersion from '../../src/version.js';
import IHTMLIFrameElement from '../../src/nodes/html-iframe-element/IHTMLIFrameElement.js';
import DetachedWindowAPI from '../../src/window/DetachedWindowAPI.js';
import '../types.d.js';
import BrowserErrorCaptureEnum from '../../src/browser/enums/BrowserErrorCaptureEnum.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';

const GET_NAVIGATOR_PLATFORM = (): string => {
	return (
		'X11; ' +
		process.platform.charAt(0).toUpperCase() +
		process.platform.slice(1) +
		' ' +
		process.arch
	);
};

describe('Window', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		resetMockedModules();
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Is able to handle multiple instances of Window', () => {
			const window1 = new Window({ url: 'https://localhost:1' });
			const window2 = new Window({ url: 'https://localhost:2' });
			const window3 = new Window({ url: 'https://localhost:3' });

			// Request
			const request1 = new window1.Request('test1');
			const request2 = new window2.Request('test2');
			const request3 = new window3.Request('test3');

			expect(request1.url).toBe('https://localhost:1/test1');
			expect(request2.url).toBe('https://localhost:2/test2');
			expect(request3.url).toBe('https://localhost:3/test3');

			// FileReader
			let setTimeoutCalls = 0;
			window1.setTimeout = () => <NodeJS.Timeout>(<unknown>setTimeoutCalls++);
			window2.setTimeout = () => <NodeJS.Timeout>(<unknown>setTimeoutCalls++);
			window3.setTimeout = () => <NodeJS.Timeout>(<unknown>setTimeoutCalls++);

			const fileReader1 = new window1.FileReader();
			const fileReader2 = new window2.FileReader();
			const fileReader3 = new window3.FileReader();

			fileReader1.readAsText(new window1.Blob(['test1']));
			fileReader2.readAsText(new window1.Blob(['test1']));
			fileReader3.readAsText(new window1.Blob(['test1']));

			expect(setTimeoutCalls).toBe(3);

			// DOMParser
			const domParser1 = new window1.DOMParser();
			const domParser2 = new window2.DOMParser();
			const domParser3 = new window3.DOMParser();

			const document1 = domParser1.parseFromString('<html></html>', 'text/html');
			const document2 = domParser2.parseFromString('<html></html>', 'text/html');
			const document3 = domParser3.parseFromString('<html></html>', 'text/html');

			expect(document1.childNodes[0].ownerDocument === document1).toBe(true);
			expect(document2.childNodes[0].ownerDocument === document2).toBe(true);
			expect(document3.childNodes[0].ownerDocument === document3).toBe(true);

			// Range
			const range1 = window1.document.createRange();
			const range2 = window2.document.createRange();
			const range3 = window3.document.createRange();

			expect(range1[PropertySymbol.ownerDocument] === window1.document).toBe(true);
			expect(range2[PropertySymbol.ownerDocument] === window2.document).toBe(true);
			expect(range3[PropertySymbol.ownerDocument] === window3.document).toBe(true);

			// Image
			const image1 = new window1.Image();
			const image2 = new window2.Image();
			const image3 = new window3.Image();

			expect(image1.ownerDocument === window1.document).toBe(true);
			expect(image2.ownerDocument === window2.document).toBe(true);
			expect(image3.ownerDocument === window3.document).toBe(true);

			// Audio
			const audio1 = new window1.Audio();
			const audio2 = new window2.Audio();
			const audio3 = new window3.Audio();

			expect(audio1.ownerDocument === window1.document).toBe(true);
			expect(audio2.ownerDocument === window2.document).toBe(true);
			expect(audio3.ownerDocument === window3.document).toBe(true);

			// DocumentFragment
			const documentFragment1 = new window1.DocumentFragment();
			const documentFragment2 = new window2.DocumentFragment();
			const documentFragment3 = new window3.DocumentFragment();

			expect(documentFragment1.ownerDocument === window1.document).toBe(true);
			expect(documentFragment2.ownerDocument === window2.document).toBe(true);
			expect(documentFragment3.ownerDocument === window3.document).toBe(true);

			const element1 = window1.document.createElement('div');
			const element2 = window2.document.createElement('div');
			const element3 = window3.document.createElement('div');

			expect(element1.ownerDocument === window1.document).toBe(true);
			expect(element2.ownerDocument === window2.document).toBe(true);
			expect(element3.ownerDocument === window3.document).toBe(true);

			const text1 = window1.document.createTextNode('Test');
			const text2 = window2.document.createTextNode('Test');
			const text3 = window3.document.createTextNode('Test');

			expect(text1.ownerDocument === window1.document).toBe(true);
			expect(text2.ownerDocument === window2.document).toBe(true);
			expect(text3.ownerDocument === window3.document).toBe(true);

			const comment1 = window1.document.createComment('Test');
			const comment2 = window2.document.createComment('Test');
			const comment3 = window3.document.createComment('Test');

			expect(comment1.ownerDocument === window1.document).toBe(true);
			expect(comment2.ownerDocument === window2.document).toBe(true);
			expect(comment3.ownerDocument === window3.document).toBe(true);
		});

		it('Initializes by using given options.', () => {
			const windowWithOptions = new Window({
				width: 1920,
				height: 1080,
				url: 'http://localhost:8080',
				console: globalThis.console,
				settings: {
					disableJavaScriptEvaluation: true,
					navigator: {
						userAgent: 'test'
					},
					device: {
						prefersColorScheme: 'dark'
					}
				}
			});
			const windowWithoutOptions = new Window();

			expect(windowWithOptions.innerWidth).toBe(1920);
			expect(windowWithOptions.innerHeight).toBe(1080);
			expect(windowWithOptions.outerWidth).toBe(1920);
			expect(windowWithOptions.outerHeight).toBe(1080);
			expect(windowWithOptions.console).toBe(globalThis.console);
			expect(windowWithOptions.location.href).toBe('http://localhost:8080/');
			expect(windowWithOptions.happyDOM?.virtualConsolePrinter).toBeInstanceOf(
				VirtualConsolePrinter
			);
			expect(windowWithOptions.happyDOM?.settings.disableJavaScriptEvaluation).toBe(true);
			expect(windowWithOptions.happyDOM?.settings.disableJavaScriptFileLoading).toBe(false);
			expect(windowWithOptions.happyDOM?.settings.disableCSSFileLoading).toBe(false);
			expect(windowWithOptions.happyDOM?.settings.disableIframePageLoading).toBe(false);
			expect(windowWithOptions.happyDOM?.settings.disableErrorCapturing).toBe(false);
			expect(windowWithOptions.happyDOM?.settings.errorCapture).toBe(
				BrowserErrorCaptureEnum.tryAndCatch
			);
			expect(windowWithOptions.happyDOM?.settings.enableFileSystemHttpRequests).toBe(false);
			expect(windowWithOptions.happyDOM?.settings.navigator.userAgent).toBe('test');
			expect(windowWithOptions.happyDOM?.settings.device.prefersColorScheme).toBe('dark');
			expect(windowWithOptions.happyDOM?.settings.device.mediaType).toBe('screen');

			expect(windowWithoutOptions.innerWidth).toBe(1024);
			expect(windowWithoutOptions.innerHeight).toBe(768);
			expect(windowWithoutOptions.outerWidth).toBe(1024);
			expect(windowWithoutOptions.outerHeight).toBe(768);
			expect(windowWithoutOptions.console).toBeInstanceOf(VirtualConsole);
			expect(windowWithoutOptions.location.href).toBe('about:blank');
			expect(windowWithoutOptions.happyDOM?.virtualConsolePrinter).toBeInstanceOf(
				VirtualConsolePrinter
			);
			expect(windowWithoutOptions.happyDOM?.settings.disableJavaScriptEvaluation).toBe(false);
			expect(windowWithoutOptions.happyDOM?.settings.disableJavaScriptFileLoading).toBe(false);
			expect(windowWithoutOptions.happyDOM?.settings.disableCSSFileLoading).toBe(false);
			expect(windowWithoutOptions.happyDOM?.settings.disableIframePageLoading).toBe(false);
			expect(windowWithoutOptions.happyDOM?.settings.disableErrorCapturing).toBe(false);
			expect(windowWithoutOptions.happyDOM?.settings.errorCapture).toBe(
				BrowserErrorCaptureEnum.tryAndCatch
			);
			expect(windowWithoutOptions.happyDOM?.settings.enableFileSystemHttpRequests).toBe(false);
			expect(windowWithoutOptions.happyDOM?.settings.navigator.userAgent).toBe(
				`Mozilla/5.0 (${GET_NAVIGATOR_PLATFORM()}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${
					PackageVersion.version
				}`
			);
			expect(windowWithoutOptions.happyDOM?.settings.device.prefersColorScheme).toBe('light');
			expect(windowWithoutOptions.happyDOM?.settings.device.mediaType).toBe('screen');
		});

		it('Supports deprecated "innerWidth" and "innerHeight".', () => {
			const window = new Window({
				innerWidth: 1920,
				innerHeight: 1080
			});

			expect(window.innerWidth).toBe(1920);
			expect(window.innerHeight).toBe(1080);
			expect(window.outerWidth).toBe(1920);
			expect(window.outerHeight).toBe(1080);
		});
	});

	describe('get happyDOM()', () => {
		it('Returns an instance of DetachedWindowAPI.', () => {
			expect(window.happyDOM).toBeInstanceOf(DetachedWindowAPI);
		});

		it('Returns "undefined" when navigating an iframe for security reasons. The page loaded can potentially contain malicious code.', async () => {
			await new Promise((resolve) => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
					return Promise.resolve(<IResponse>(<unknown>{
						text: () => Promise.resolve('<html><body>Test</body></html>'),
						headers: new Headers()
					}));
				});

				window.happyDOM?.setURL('https://localhost:8080');

				const iframe = <IHTMLIFrameElement>document.createElement('iframe');

				iframe.src = 'https://localhost:8080/test/page/';
				iframe.addEventListener('load', () => {
					expect((<IWindow>iframe.contentWindow).happyDOM).toBeUndefined();
					resolve(null);
				});

				document.body.appendChild(iframe);
			});
		});

		it('Returns "undefined" when opening a new page. The page loaded can potentially contain malicious code.', async () => {
			await new Promise((resolve) => {
				vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
					return Promise.resolve(<IResponse>(<unknown>{
						text: () => Promise.resolve('<html><body>Test</body></html>'),
						headers: new Headers()
					}));
				});

				window.happyDOM?.setURL('https://localhost:8080');

				const newWindow = <IWindow>window.open('https://localhost:8080/test/page/');

				newWindow.addEventListener('load', () => {
					expect(newWindow.happyDOM).toBeUndefined();
					resolve(null);
				});
			});
		});
	});

	describe('open()', () => {
		it(`Doesn't navigate the browser if the target is the main frame of a detached browser.`, () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				throw new Error('This should not be called.');
			});

			window.happyDOM?.setURL('https://www.github.com/');

			expect(window.open('/capricorn86/happy-dom/', '_self') === null).toBe(true);
			expect(window.location.href).toBe('https://www.github.com/capricorn86/happy-dom/');

			expect(window.open('/capricorn86/happy-dom/2/', '_top') === null).toBe(true);
			expect(window.location.href).toBe('https://www.github.com/capricorn86/happy-dom/2/');

			expect(window.open('/capricorn86/happy-dom/3/', '_parent') === null).toBe(true);
			expect(window.location.href).toBe('https://www.github.com/capricorn86/happy-dom/3/');
		});

		it(`Navigates the "_top" frame of a detached browser.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('<html><body>Test</body></html>')
				});
			});

			window.happyDOM?.setURL('https://localhost:8080');

			const newWindow = <IWindow>window.open('/test/1/', '_blank');

			expect(newWindow.name).toBe('');
			newWindow.document.write('<iframe src="https://localhost:8080"></iframe>');

			const iframe = <IHTMLIFrameElement>newWindow.document.querySelector('iframe');
			expect((<IWindow>iframe.contentWindow).happyDOM).toBeUndefined();
			const newWindow2 = <IWindow>(
				(<IWindow>iframe.contentWindow).open('https://localhost:8080/test/2/', '_top')
			);

			expect(newWindow2.name).toBe('');
			expect(newWindow2.location.href).toBe('https://localhost:8080/test/2/');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(newWindow2.document.body.innerHTML).toBe('Test');
		});

		it(`Navigates the "_parent" frame of a detached browser.`, async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<IResponse> {
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('<html><body>Test</body></html>')
				});
			});

			window.happyDOM?.setURL('https://localhost:8080');

			const newWindow = <IWindow>window.open('/test/1/', '_blank');

			expect(newWindow.name).toBe('');
			newWindow.document.write('<iframe src="https://localhost:8080"></iframe>');

			const iframe = <IHTMLIFrameElement>newWindow.document.querySelector('iframe');
			expect((<IWindow>iframe.contentWindow).happyDOM).toBeUndefined();
			const newWindow2 = <IWindow>(
				(<IWindow>iframe.contentWindow).open('https://localhost:8080/test/2/', '_parent')
			);

			expect(newWindow2.name).toBe('');
			expect(newWindow2.location.href).toBe('https://localhost:8080/test/2/');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(newWindow2.document.body.innerHTML).toBe('Test');
		});
	});
});
