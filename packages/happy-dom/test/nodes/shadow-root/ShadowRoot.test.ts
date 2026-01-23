import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import CustomElement from '../../CustomElement.js';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot.js';
import { beforeEach, describe, it, expect } from 'vitest';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('ShadowRoot', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);

		/* eslint-disable jsdoc/require-jsdoc */
		class CustomElementA extends window.HTMLElement {
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
			}

			public connectedCallback(): void {
				(<ShadowRoot>this.shadowRoot).innerHTML = `
                        <div>Test A</div>
                    `;
			}
		}
		class CustomElementB extends window.HTMLElement {
			constructor() {
				super();
				if (!this.shadowRoot) {
					this.attachShadow({
						mode: 'closed',
						clonable: true,
						serializable: true,
						delegateFocus: true,
						slotAssignment: 'manual'
					});
				}
			}

			public connectedCallback(): void {
				(<ShadowRoot>this.shadowRoot).innerHTML = `
                        <div>Test B</div>
                    `;
			}
		}
		/* eslint-enable jsdoc/require-jsdoc */

		window.customElements.define('custom-element-a', CustomElementA);
		window.customElements.define('custom-element-b', CustomElementB);
	});

	describe('get mode()', () => {
		it('Returns the mode of the shadow root.', () => {
			expect(document.createElement('custom-element-a').shadowRoot?.mode).toBe('open');
			expect(document.createElement('custom-element-b')[PropertySymbol.shadowRoot]?.mode).toBe(
				'closed'
			);
		});
	});

	describe('get host()', () => {
		it('Returns the host of the shadow root.', () => {
			const customElement = document.createElement('custom-element');
			const shadowRoot = <ShadowRoot>customElement.shadowRoot;
			expect(shadowRoot.host).toBe(customElement);
		});
	});

	describe('get clonable()', () => {
		it('Returns the clonable of the shadow root.', () => {
			expect(document.createElement('custom-element-a').shadowRoot?.clonable).toBe(false);
			expect(document.createElement('custom-element-b')[PropertySymbol.shadowRoot]?.clonable).toBe(
				true
			);
		});
	});

	describe('get delegatesFocus()', () => {
		it('Returns the delegatesFocus of the shadow root.', () => {
			expect(document.createElement('custom-element-a').shadowRoot?.delegatesFocus).toBe(false);
			expect(
				document.createElement('custom-element-b')[PropertySymbol.shadowRoot]?.delegatesFocus
			).toBe(true);
		});
	});

	describe('get serializable()', () => {
		it('Returns the serializable of the shadow root.', () => {
			expect(document.createElement('custom-element-a').shadowRoot?.serializable).toBe(false);
			expect(
				document.createElement('custom-element-b')[PropertySymbol.shadowRoot]?.serializable
			).toBe(true);
		});
	});

	describe('get slotAssignment()', () => {
		it('Returns the slotAssignment of the shadow root.', () => {
			expect(document.createElement('custom-element-a').shadowRoot?.slotAssignment).toBe('named');
			expect(
				document.createElement('custom-element-b')[PropertySymbol.shadowRoot]?.slotAssignment
			).toBe('manual');
		});
	});

	describe('get fullscreenElement()', () => {
		it('Returns null as it is not fully implemented.', () => {
			expect(document.createElement('custom-element').shadowRoot?.fullscreenElement).toBe(null);
		});
	});

	describe('get pictureInPictureElement()', () => {
		it('Returns null as it is not fully implemented.', () => {
			expect(document.createElement('custom-element').shadowRoot?.pictureInPictureElement).toBe(
				null
			);
		});
	});

	describe('get pointerLockElement()', () => {
		it('Returns null as it is not fully implemented.', () => {
			expect(document.createElement('custom-element').shadowRoot?.pointerLockElement).toBe(null);
		});
	});

	describe('set innerHTML()', () => {
		it('Sets the innerHTML of the shadow root.', () => {
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			expect(shadowRoot.childNodes.length).toBe(1);
			expect(shadowRoot.childNodes[0].childNodes.length).toBe(1);
			expect((<HTMLElement>shadowRoot.childNodes[0]).tagName).toBe('DIV');
			expect((<HTMLElement>shadowRoot.childNodes[0].childNodes[0]).tagName).toBe('SPAN');
		});
	});

	describe('get innerHTML()', () => {
		it('Returns the innerHTML of the shadow root.', () => {
			const html = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = html;
			expect(shadowRoot.innerHTML).toBe(html);
		});
	});

	describe('get adoptedStyleSheets()', () => {
		it('Returns set adopted style sheets.', () => {
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			const styleSheet = new CSSStyleSheet();
			shadowRoot.adoptedStyleSheets = [styleSheet];
			expect(shadowRoot.adoptedStyleSheets).toEqual([styleSheet]);
		});
	});

	describe('set adoptedStyleSheets()', () => {
		it('Sets adopted style sheets.', () => {
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			const styleSheet = new CSSStyleSheet();
			shadowRoot.adoptedStyleSheets = [styleSheet];
			expect(shadowRoot.adoptedStyleSheets).toEqual([styleSheet]);
		});
	});

	describe('get activeElement()', () => {
		it('Returns the currently active element within the ShadowRoot.', () => {
			const customElement = document.createElement('custom-element');
			const shadowRoot = <ShadowRoot>customElement.shadowRoot;
			const div = <HTMLElement>document.createElement('div');
			const span = <HTMLElement>document.createElement('span');

			document.body.appendChild(customElement);

			shadowRoot.appendChild(div);
			shadowRoot.appendChild(span);

			expect(shadowRoot.activeElement === null).toBe(true);

			div.focus();

			expect(shadowRoot.activeElement === div).toBe(true);

			span.focus();

			expect(shadowRoot.activeElement === span).toBe(true);

			span.blur();

			expect(shadowRoot.activeElement === null).toBe(true);

			document.body.appendChild(span);

			span.focus();

			expect(shadowRoot.activeElement === null).toBe(true);
		});

		it('Unsets the active element when it gets disconnected.', () => {
			const customElement = document.createElement('custom-element');
			const shadowRoot = <ShadowRoot>customElement.shadowRoot;
			const div = <HTMLElement>document.createElement('div');

			document.body.appendChild(customElement);

			shadowRoot.appendChild(div);

			expect(shadowRoot.activeElement === null).toBe(true);

			div.focus();

			expect(shadowRoot.activeElement === div).toBe(true);

			customElement.remove();

			expect(shadowRoot.activeElement === null).toBe(true);
		});

		it('Returns the first custom element when the active element is not a child of the ShadowRoot, but is a child of a custom element within it.', () => {
			const customElement = document.createElement('custom-element');
			const shadowRoot = <ShadowRoot>customElement.shadowRoot;
			const div = <HTMLElement>document.createElement('div');
			const customElementA = document.createElement('custom-element-a');
			const shadowRootA = <ShadowRoot>customElementA.shadowRoot;

			document.body.appendChild(customElement);

			shadowRoot.appendChild(customElementA);
			shadowRootA.appendChild(div);

			expect(shadowRoot.activeElement === null).toBe(true);

			div.focus();

			expect(shadowRoot.activeElement).toBe(customElementA);

			customElementA.remove();

			expect(shadowRoot.activeElement === null).toBe(true);
		});
	});

	describe('getAnimations()', () => {
		it('Returns an empty array as it is not fully implemented.', () => {
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			expect(shadowRoot.getAnimations()).toEqual([]);
		});
	});

	describe('setHTMLUnsafe()', () => {
		it('Sets the inner HTML of the shadow root.', () => {
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			shadowRoot.setHTMLUnsafe('<div attr1="value1" attr2="value2"><span>Test</span></div>');
			expect(shadowRoot.innerHTML).toBe(
				'<div attr1="value1" attr2="value2"><span>Test</span></div>'
			);
		});
	});

	describe('toString()', () => {
		it('Returns the innerHTML of the shadow root.', () => {
			const html = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			const shadowRoot = <ShadowRoot>document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = html;
			expect(shadowRoot.toString()).toBe(html);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the value of the "mode" property when cloned.', () => {
			const customElement = document.createElement('custom-element-b');
			const shadowRoot = <ShadowRoot>customElement[PropertySymbol.shadowRoot];
			const clone = shadowRoot.cloneNode();

			expect(clone.mode).toBe('closed');
			expect(clone.clonable).toBe(true);
			expect(clone.delegatesFocus).toBe(true);
			expect(clone.serializable).toBe(true);
			expect(clone.slotAssignment).toBe('manual');
		});
	});
});
