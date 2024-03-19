import PointerEvent from '../../../src/event/events/PointerEvent.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import HTMLElementUtility from '../../../src/nodes/html-element/HTMLElementUtility.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import Window from '../../../src/window/Window.js';
import Window from '../../../src/window/Window.js';
import CustomElement from '../../CustomElement.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import CustomElementRegistry from '../../../src/custom-element/CustomElementRegistry.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('HTMLElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLElement>document.createElement('div');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLElement]');
		});
	});

	describe('get accessKey()', () => {
		it('Returns "".', () => {
			const div = <HTMLElement>document.createElement('div');
			expect(div.accessKey).toBe('');
		});
	});

	for (const property of [
		'offsetHeight',
		'offsetWidth',
		'offsetLeft',
		'offsetTop',
		'clientHeight',
		'clientWidth',
		'clientLeft',
		'clientTop'
	]) {
		describe(`get ${property}()`, () => {
			it('Returns "0".', () => {
				const div = document.createElement('div');
				expect(div[property]).toBe(0);
			});
		});
	}

	describe('contentEditable', () => {
		it('Returns "inherit".', () => {
			const div = <HTMLElement>document.createElement('div');
			expect(div.contentEditable).toBe('inherit');
		});
	});

	describe('isContentEditable', () => {
		it('Returns "false".', () => {
			const div = <HTMLElement>document.createElement('div');
			expect(div.isContentEditable).toBe(false);
		});
	});

	describe('get tabIndex()', () => {
		it('Returns the attribute "tabindex" as a number.', () => {
			const div = <HTMLElement>document.createElement('div');
			div.setAttribute('tabindex', '5');
			expect(div.tabIndex).toBe(5);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const div = <HTMLElement>document.createElement('div');
			div.tabIndex = 5;
			expect(div.getAttribute('tabindex')).toBe('5');
		});

		it('Removes the attribute "tabindex" when set to "-1".', () => {
			const div = <HTMLElement>document.createElement('div');
			div.tabIndex = 5;
			div.tabIndex = -1;
			expect(div.getAttribute('tabindex')).toBe(null);
		});
	});

	describe('get innerText()', () => {
		it('Returns the as the textContent property if element is not connected to document.', () => {
			const div = document.createElement('div');
			const script = document.createElement('script');
			const style = document.createElement('style');
			element.appendChild(div);
			element.appendChild(script);
			element.appendChild(style);
			element.appendChild(document.createTextNode('text2'));
			div.appendChild(document.createTextNode('text1'));
			script.appendChild(document.createTextNode('var key = "value";'));
			style.appendChild(document.createTextNode('button { background: red; }'));
			expect(element.innerText).toBe('text1var key = "value";button { background: red; }text2');
		});

		it('Returns the as the textContent property without any line breaks if element is not connected to document.', () => {
			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><div>Jumped over the lazy dog</div>`;
			expect(element.innerText).toBe('The quick brown foxJumped over the lazy dog');
		});

		it('Returns rendered text with line breaks between block and flex elements and without hidden elements being rendered if element is connected to the document.', () => {
			document.body.appendChild(element);

			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><script>var key = "value";</script><style>button { background: red; }</style><div>Jumped over the lazy dog</div>`;
			expect(element.innerText).toBe('The quick brown fox\nJumped over the lazy dog');

			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><span style="display: flex">Jumped over the lazy dog</span><div>.</div>`;
			expect(element.innerText).toBe('The quick brown fox\nJumped over the lazy dog\n.');
		});

		it('Returns rendered text affected by the "text-transform" CSS property.', () => {
			document.body.appendChild(element);

			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><span>Jumped over the lazy dog</span><style>span { text-transform: uppercase; display: block; }</style>`;
			expect(element.innerText).toBe('The quick brown fox\nJUMPED OVER THE LAZY DOG');

			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><span>JUMPED OVER THE LAZY DOG</span><style>span { text-transform: lowercase; display: block; }</style>`;
			expect(element.innerText).toBe('The quick brown fox\njumped over the lazy dog');

			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><span>jumped over the lazy dog</span><style>span { text-transform: capitalize; display: block; }</style>`;
			expect(element.innerText).toBe('The quick brown fox\nJumped Over The Lazy Dog');
		});
	});

	describe('set innerText()', () => {
		it('Sets the value of the textContent property.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			element.appendChild(div);
			element.appendChild(textNode1);
			element.appendChild(textNode2);

			element.textContent = 'new_text';

			expect(element.innerText).toBe('new_text');
			expect(element.innerText).toBe(element.textContent);
			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0].textContent).toBe('new_text');
		});
	});

	describe('get style()', () => {
		it('Returns styles.', () => {
			element.setAttribute('style', 'border-radius: 2px; padding: 2px;');

			expect(element.style.length).toEqual(8);
			expect(element.style[0]).toEqual('border-top-left-radius');
			expect(element.style[1]).toEqual('border-top-right-radius');
			expect(element.style[2]).toEqual('border-bottom-right-radius');
			expect(element.style[3]).toEqual('border-bottom-left-radius');
			expect(element.style[4]).toEqual('padding-top');
			expect(element.style[5]).toEqual('padding-right');
			expect(element.style[6]).toEqual('padding-bottom');
			expect(element.style[7]).toEqual('padding-left');
			expect(element.style.borderRadius).toEqual('2px');
			expect(element.style.padding).toEqual('2px');
			expect(element.style.cssText).toEqual('border-radius: 2px; padding: 2px;');

			element.setAttribute('style', 'border-radius: 4px; padding: 4px;');

			expect(element.style.length).toEqual(8);
			expect(element.style[0]).toEqual('border-top-left-radius');
			expect(element.style[1]).toEqual('border-top-right-radius');
			expect(element.style[2]).toEqual('border-bottom-right-radius');
			expect(element.style[3]).toEqual('border-bottom-left-radius');
			expect(element.style[4]).toEqual('padding-top');
			expect(element.style[5]).toEqual('padding-right');
			expect(element.style[6]).toEqual('padding-bottom');
			expect(element.style[7]).toEqual('padding-left');

			expect(element.style.borderRadius).toEqual('4px');
			expect(element.style.padding).toEqual('4px');
			expect(element.style.cssText).toEqual('border-radius: 4px; padding: 4px;');
		});

		it('Setting a property changes the "style" attribute.', () => {
			element.setAttribute('style', 'border-radius: 2px; padding: 2px;');

			element.style.borderRadius = '4rem';
			element.style.backgroundColor = 'green';

			expect(element.style.length).toEqual(9);
			expect(element.style[0]).toEqual('border-top-left-radius');
			expect(element.style[1]).toEqual('border-top-right-radius');
			expect(element.style[2]).toEqual('border-bottom-right-radius');
			expect(element.style[3]).toEqual('border-bottom-left-radius');
			expect(element.style[4]).toEqual('padding-top');
			expect(element.style[5]).toEqual('padding-right');
			expect(element.style[6]).toEqual('padding-bottom');
			expect(element.style[7]).toEqual('padding-left');
			expect(element.style[8]).toEqual('background-color');

			expect(element.style.borderRadius).toEqual('4rem');
			expect(element.style.padding).toEqual('2px');
			expect(element.style.backgroundColor).toEqual('green');

			expect(element.style.cssText).toEqual(
				'border-radius: 4rem; padding: 2px; background-color: green;'
			);

			expect(element.getAttribute('style')).toEqual(
				'border-radius: 4rem; padding: 2px; background-color: green;'
			);
		});

		it('Settings a property to empty string also removes it.', () => {
			element.setAttribute('style', 'border-radius: 2px; padding: 2px;');

			element.style.borderRadius = '';
			element.style.backgroundColor = 'green';

			expect(element.style.length).toEqual(5);
			expect(element.style[0]).toEqual('padding-top');
			expect(element.style[1]).toEqual('padding-right');
			expect(element.style[2]).toEqual('padding-bottom');
			expect(element.style[3]).toEqual('padding-left');
			expect(element.style[4]).toEqual('background-color');
			expect(element.style[5]).toBe(undefined);

			expect(element.style.borderRadius).toEqual('');
			expect(element.style.padding).toEqual('2px');
			expect(element.style.backgroundColor).toEqual('green');

			expect(element.style.cssText).toEqual('padding: 2px; background-color: green;');

			expect(element.getAttribute('style')).toEqual('padding: 2px; background-color: green;');
		});
	});

	describe('set style()', () => {
		it('Sets the value of the style.cssText property.', () => {
			element.style = 'border-radius: 2px; padding: 2px;';

			expect(element.style.cssText).toEqual('border-radius: 2px; padding: 2px;');
			expect(element.style.borderRadius).toEqual('2px');
			expect(element.style.padding).toEqual('2px');
			expect(element.getAttribute('style')).toEqual('border-radius: 2px; padding: 2px;');
			expect(element.outerHTML).toEqual('<div style="border-radius: 2px; padding: 2px;"></div>');

			element.style = '';

			expect(element.style.cssText).toEqual('');
			expect(element.style.borderRadius).toEqual('');
			expect(element.style.padding).toEqual('');
			expect(element.getAttribute('style')).toEqual('');
			expect(element.outerHTML).toEqual('<div style=""></div>');

			element.style = null;

			expect(element.style.cssText).toEqual('');
			expect(element.style.borderRadius).toEqual('');
			expect(element.style.padding).toEqual('');
			expect(element.getAttribute('style')).toEqual('');
			expect(element.outerHTML).toEqual('<div style=""></div>');
		});
	});

	describe('get dataset()', () => {
		it('Returns a Proxy behaving like an object that can add, remove, set and get element attributes prefixed with "data-".', () => {
			element.setAttribute('test-alpha', 'value1');
			element.setAttribute('data-test-alpha', 'value2');
			element.setAttribute('test-beta', 'value3');
			element.setAttribute('data-test-beta', 'value4');

			const dataset = element.dataset;

			expect(dataset).toBe(element.dataset);
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4']);

			dataset.testGamma = 'value5';

			expect(element.getAttribute('data-test-gamma')).toBe('value5');
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5']);

			element.setAttribute('data-test-delta', 'value6');

			expect(dataset.testDelta).toBe('value6');
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma', 'testDelta']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5', 'value6']);

			delete dataset.testDelta;

			expect(element.getAttribute('data-test-delta')).toBe(null);
			expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma']);
			expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5']);

			delete dataset.nonExistentKey;
		});

		// https://github.com/capricorn86/happy-dom/issues/493
		it('Creates dataset from "innerHTML" markup.', () => {
			const main = document.createElement('main');
			main.innerHTML = `<button data-test="test"></button>`;
			document.body.append(main);
			const button = <HTMLElement>main.querySelector('button');
			expect(button.dataset.test).toBe('test');
		});

		// https://github.com/capricorn86/happy-dom/issues/493
		it('Finds closest ancestor element by data attribute.', () => {
			const main = document.createElement('main');
			document.body.append(main);
			const div = <HTMLElement>document.createElement('div');
			div.dataset.test = 'test';
			div.innerHTML = '<button>label</button>';
			main.append(div);
			const button = <HTMLElement>main.querySelector('button');
			expect(button.closest('[data-test]')).toBe(div);
		});
	});

	describe('get dir()', () => {
		it('Returns the attribute "dir".', () => {
			const div = <HTMLElement>document.createElement('div');
			div.setAttribute('dir', 'rtl');
			expect(div.dir).toBe('rtl');
		});
	});

	describe('set dir()', () => {
		it('Sets the attribute "tabindex".', () => {
			const div = <HTMLElement>document.createElement('div');
			div.dir = 'rtl';
			expect(div.getAttribute('dir')).toBe('rtl');
		});
	});

	describe('get hidden()', () => {
		it('Returns the attribute "hidden".', () => {
			const div = <HTMLElement>document.createElement('div');
			div.setAttribute('hidden', '');
			expect(div.hidden).toBe(true);
		});
	});

	describe('set hidden()', () => {
		it('Sets the attribute "hidden".', () => {
			const div = <HTMLElement>document.createElement('div');
			div.hidden = true;
			expect(div.getAttribute('hidden')).toBe('');
			div.hidden = false;
			expect(div.getAttribute('hidden')).toBe(null);
		});
	});

	for (const property of ['lang', 'title']) {
		describe(`get ${property}`, () => {
			it(`Returns the attribute "${property}".`, () => {
				const div = document.createElement('div');
				div.setAttribute(property, 'value');
				expect(div[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const div = document.createElement('div');
				div[property] = 'value';
				expect(div.getAttribute(property)).toBe('value');
			});
		});
	}

	describe('click()', () => {
		it('Dispatches "click" event.', () => {
			let triggeredEvent: PointerEvent | null = null;

			element.addEventListener('click', (event) => (triggeredEvent = <PointerEvent>event));

			element.click();

			expect(<PointerEvent>(<unknown>triggeredEvent) instanceof PointerEvent).toBe(true);
			expect((<PointerEvent>(<unknown>triggeredEvent)).type).toBe('click');
			expect((<PointerEvent>(<unknown>triggeredEvent)).bubbles).toBe(true);
			expect((<PointerEvent>(<unknown>triggeredEvent)).composed).toBe(true);
			expect((<PointerEvent>(<unknown>triggeredEvent)).target === element).toBe(true);
			expect((<PointerEvent>(<unknown>triggeredEvent)).currentTarget === element).toBe(true);
			expect((<PointerEvent>(<unknown>triggeredEvent)).width).toBe(1);
			expect((<PointerEvent>(<unknown>triggeredEvent)).height).toBe(1);
		});
	});

	describe('blur()', () => {
		it('Calls HTMLElementUtility.blur().', () => {
			let blurredElement: HTMLElement | null = null;

			vi.spyOn(HTMLElementUtility, 'blur').mockImplementation(
				(element: HTMLElement | SVGElement) => {
					blurredElement = <HTMLElement>element;
				}
			);

			element.blur();

			expect(blurredElement === element).toBe(true);
		});
	});

	describe('focus()', () => {
		it('Calls HTMLElementUtility.focus().', () => {
			let focusedElement: HTMLElement | null = null;

			vi.spyOn(HTMLElementUtility, 'focus').mockImplementation(
				(element: HTMLElement | SVGElement) => {
					focusedElement = <HTMLElement>element;
				}
			);

			element.focus();

			expect(focusedElement === element).toBe(true);
		});
	});

	describe('setAttributeNode()', () => {
		it('Sets css text of existing CSSStyleDeclaration.', () => {
			element.style.background = 'green';
			element.style.color = 'black';
			element.setAttribute('style', 'color: green');
			expect(element.style.length).toEqual(1);
			expect(element.style[0]).toEqual('color');
			expect(element.style.color).toEqual('green');
		});
	});

	describe('removeAttributeNode()', () => {
		it('Removes property from CSSStyleDeclaration.', () => {
			element.style.background = 'green';
			element.style.color = 'black';
			element.removeAttribute('style');
			expect(element.style.length).toEqual(0);
			expect(element.style.cssText).toEqual('');
		});
	});

	describe('[PropertySymbol.connectNode]()', () => {
		it('Waits for a custom element to be defined and replace it when it is.', () => {
			const element = <HTMLElement>document.createElement('custom-element');
			const parent = document.createElement('div');

			parent.appendChild(element);

			expect(window.customElements[PropertySymbol.callbacks]['custom-element'].length).toBe(1);

			parent.removeChild(element);

			expect(Object.keys(window.customElements[PropertySymbol.callbacks]).length).toBe(0);

			parent.appendChild(element);

			window.customElements.define('custom-element', CustomElement);

			expect(parent.children.length).toBe(1);

			expect(parent.children[0] instanceof CustomElement).toBe(true);
			expect(parent.children[0].shadowRoot.children.length).toBe(0);

			document.body.appendChild(parent);

			expect(parent.children[0].shadowRoot.children.length).toBe(2);
		});

		it('Copies all properties from the unknown element to the new instance.', () => {
			const element = <HTMLElement>document.createElement('custom-element');
			const child1 = document.createElement('div');
			const child2 = document.createElement('div');

			element.appendChild(child1);
			element.appendChild(child2);

			document.body.appendChild(element);

			const attribute1 = document.createAttribute('test');
			attribute1.value = 'test';
			element.attributes.setNamedItem(attribute1);

			const childNodes = element.childNodes;
			const children = element.children;
			const rootNode = (element[PropertySymbol.rootNode] = document.createElement('div'));
			const formNode = (element[PropertySymbol.formNode] = document.createElement('div'));
			const selectNode = (element[PropertySymbol.selectNode] = document.createElement('div'));
			const textAreaNode = (element[PropertySymbol.textAreaNode] = document.createElement('div'));
			const observers = element[PropertySymbol.observers];
			const isValue = (element[PropertySymbol.isValue] = 'test');

			window.customElements.define('custom-element', CustomElement);

			const customElement = <CustomElement>document.body.children[0];

			expect(document.body.children.length).toBe(1);
			expect(customElement instanceof CustomElement).toBe(true);

			expect(customElement.isConnected).toBe(true);
			expect(customElement.shadowRoot?.children.length).toBe(2);

			expect(customElement.childNodes === childNodes).toBe(true);
			expect(customElement.children === children).toBe(true);
			expect(customElement[PropertySymbol.rootNode] === rootNode).toBe(true);
			expect(customElement[PropertySymbol.formNode] === formNode).toBe(true);
			expect(customElement[PropertySymbol.selectNode] === selectNode).toBe(true);
			expect(customElement[PropertySymbol.textAreaNode] === textAreaNode).toBe(true);
			expect(customElement[PropertySymbol.observers] === observers).toBe(true);
			expect(customElement[PropertySymbol.isValue] === isValue).toBe(true);
			expect(customElement.attributes.length).toBe(1);
			expect(customElement.attributes[0] === attribute1).toBe(true);
		});

		it('Does nothing if the property "_callback" doesn\'t exist on Window.customElements.', () => {
			(<CustomElementRegistry>window.customElements) = <CustomElementRegistry>(<unknown>{
				get: () => undefined
			});

			const element = <HTMLElement>document.createElement('custom-element');
			const parent = document.createElement('div');

			expect(() => {
				parent.appendChild(element);
			}).not.toThrow();
		});
	});
});
