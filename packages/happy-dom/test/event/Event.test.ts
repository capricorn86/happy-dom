import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import IDocument from '../../src/nodes/document/IDocument';
import Event from '../../src/event/Event';
import CustomElement from '../CustomElement';

describe('Event', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;

		window.customElements.define('custom-element', CustomElement);
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
	});
});
