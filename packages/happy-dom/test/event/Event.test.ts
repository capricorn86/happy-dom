import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import IDocument from '../../src/nodes/document/IDocument';
import Event from '../../src/event/Event';
import CustomElement from '../CustomElement';
import { performance } from 'perf_hooks';

describe('Event', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;

		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get timeStamp()', () => {
		it('Returns the value returned by performance.now() at the time it was created.', () => {
			Object.defineProperty(performance, 'now', {
				value: jest.fn(),
				configurable: true,
				writable: true
			});

			const performanceNow = 12345;
			jest.spyOn(performance, 'now').mockImplementation(() => performanceNow);
			const event = new Event('click');
			expect(event.timeStamp).toBe(performanceNow);
		});
	});

	describe('composedPath()', () => {
		it('Returns a composed path.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			let composedPath = null;

			div.appendChild(span);
			document.body.appendChild(div);

			div.addEventListener('click', (event: Event) => {
				composedPath = event.composedPath();
			});

			span.dispatchEvent(
				new Event('click', {
					bubbles: true
				})
			);

			expect(composedPath).toEqual([
				span,
				div,
				document.body,
				document.documentElement,
				document,
				window
			]);
		});

		it('Goes through shadow roots if composed is set to "true".', () => {
			const div = document.createElement('div');
			const customELement = document.createElement('custom-element');
			let composedPath = null;

			div.appendChild(customELement);

			document.body.appendChild(div);

			div.addEventListener('click', (event: Event) => {
				composedPath = event.composedPath();
			});

			customELement.shadowRoot.children[1].children[0].dispatchEvent(
				new Event('click', {
					bubbles: true,
					composed: true
				})
			);

			expect(composedPath).toEqual([
				customELement.shadowRoot.children[1].children[0],
				customELement.shadowRoot.children[1],
				customELement.shadowRoot,
				customELement,
				div,
				document.body,
				document.documentElement,
				document,
				window
			]);
		});

		it('Does not go through shadow roots if composed is set to "false".', () => {
			const customELement = document.createElement('custom-element');
			let composedPath = null;

			document.body.appendChild(customELement);

			customELement.shadowRoot.children[1].addEventListener('click', (event: Event) => {
				composedPath = event.composedPath();
			});

			customELement.shadowRoot.children[1].children[0].dispatchEvent(
				new Event('click', {
					bubbles: true
				})
			);

			expect(composedPath).toEqual([
				customELement.shadowRoot.children[1].children[0],
				customELement.shadowRoot.children[1],
				customELement.shadowRoot
			]);
		});

		it('Returns correct composed for HTMLAnchorElement event target and composed is set to "true".', () => {
			const anchor = document.createElement('a');
			anchor.setAttribute('href', 'https://example.com');
			let composedPath = null;

			document.body.appendChild(anchor);

			anchor.addEventListener('click', (event: Event) => {
				composedPath = event.composedPath();
			});

			anchor.dispatchEvent(
				new Event('click', {
					bubbles: true,
					composed: true
				})
			);

			expect(composedPath).toEqual([
				anchor,
				document.body,
				document.documentElement,
				document,
				window
			]);
		});
	});
});
