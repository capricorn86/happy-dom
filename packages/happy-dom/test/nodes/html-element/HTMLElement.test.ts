import PointerEvent from '../../../src/event/events/PointerEvent';
import IDocument from '../../../src/nodes/document/IDocument';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement';
import IHTMLElement from '../../../src/nodes/html-element/IHTMLElement';
import IWindow from '../../../src/window/IWindow';
import Window from '../../../src/window/Window';

describe('HTMLElement', () => {
	let window: IWindow = null;
	let document: IDocument = null;
	let element: IHTMLElement = null;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLElement>document.createElement('div');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	for (const property of ['accessKey', 'accessKeyLabel']) {
		describe(`${property}`, () => {
			it('Returns "".', () => {
				const div = document.createElement('div');
				expect(div[property]).toBe('');
			});
		});
	}

	for (const property of [
		'offsetHeight',
		'offsetWidth',
		'offsetLeft',
		'offsetTop',
		'clientHeight',
		'clientWidth'
	]) {
		describe(`${property}`, () => {
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

		it('Returns rendered text with line breaks between block elements and without hidden elements being rendered if element is connected to the document.', () => {
			element.innerHTML = `<div>The <strong>quick</strong> brown fox</div><script>var key = "value";</script><style>button { background: red; }</style><div>Jumped over the lazy dog</div>`;
			document.body.appendChild(element);
			expect(element.innerText).toBe('The quick brown fox\nJumped over the lazy dog');
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
			let triggeredEvent = null;

			element.addEventListener('click', (event) => {
				triggeredEvent = event;
			});

			element.click();

			const event = new PointerEvent('click', {
				bubbles: true,
				composed: true
			});
			event.target = element;
			event.currentTarget = element;

			expect(triggeredEvent).toEqual(event);
		});
	});

	describe('blur()', () => {
		it('Dispatches "blur" and "focusout" event.', () => {
			let triggeredBlurEvent = null;
			let triggeredFocusOutEvent = null;

			document.body.appendChild(element);

			element.addEventListener('blur', (event) => {
				triggeredBlurEvent = event;
			});

			element.addEventListener('focusout', (event) => {
				triggeredFocusOutEvent = event;
			});

			element.focus();
			element.blur();

			expect(triggeredBlurEvent.type).toBe('blur');
			expect(triggeredBlurEvent.bubbles).toBe(true);
			expect(triggeredBlurEvent.composed).toBe(true);
			expect(triggeredBlurEvent.target === element).toBe(true);

			expect(triggeredFocusOutEvent.type).toBe('focusout');
			expect(triggeredFocusOutEvent.bubbles).toBe(true);
			expect(triggeredFocusOutEvent.composed).toBe(true);
			expect(triggeredFocusOutEvent.target === element).toBe(true);

			expect(document.activeElement).toEqual(document.body);
		});

		it('Does not dispatch "blur" event if not connected to the DOM.', () => {
			let triggeredEvent = null;

			element.addEventListener('blur', (event) => {
				triggeredEvent = event;
			});

			element.focus();
			element.blur();

			expect(triggeredEvent).toBe(null);
		});

		it('Does not dispatch "blur" event if it is not in focus.', () => {
			let triggeredEvent = null;

			document.body.appendChild(element);

			element.addEventListener('blur', (event) => {
				triggeredEvent = event;
			});

			element.blur();

			expect(triggeredEvent).toBe(null);
		});
	});

	describe('focus()', () => {
		it('Dispatches "focus" and "focusin" event.', () => {
			let triggeredFocusEvent = null;
			let triggeredFocusInEvent = null;

			document.body.appendChild(element);

			element.addEventListener('focus', (event) => {
				triggeredFocusEvent = event;
			});

			element.addEventListener('focusin', (event) => {
				triggeredFocusInEvent = event;
			});

			element.focus();

			expect(triggeredFocusEvent.type).toBe('focus');
			expect(triggeredFocusEvent.bubbles).toBe(true);
			expect(triggeredFocusEvent.composed).toBe(true);
			expect(triggeredFocusEvent.target === element).toBe(true);

			expect(triggeredFocusInEvent.type).toBe('focusin');
			expect(triggeredFocusInEvent.bubbles).toBe(true);
			expect(triggeredFocusInEvent.composed).toBe(true);
			expect(triggeredFocusInEvent.target === element).toBe(true);

			expect(document.activeElement).toEqual(element);
		});

		it('Does not dispatch "focus" event if not connected to the DOM.', () => {
			let triggeredEvent = null;

			element.addEventListener('focus', (event) => {
				triggeredEvent = event;
			});

			element.focus();

			expect(triggeredEvent).toBe(null);
		});

		it('Does not dispatch "focus" event if it is already focused.', () => {
			let triggeredEvent = null;

			document.body.appendChild(element);

			element.focus();

			element.addEventListener('focus', (event) => {
				triggeredEvent = event;
			});

			element.focus();

			expect(triggeredEvent).toBe(null);
		});

		it('Dispatches "blur" event on the previously focused element.', () => {
			const previousElement = <HTMLElement>document.createElement('div');
			let triggeredEvent = null;

			document.body.appendChild(element);
			document.body.appendChild(previousElement);

			previousElement.focus();

			previousElement.addEventListener('blur', (event) => {
				triggeredEvent = event;
			});

			element.focus();

			expect(triggeredEvent.type).toBe('blur');
			expect(triggeredEvent.bubbles).toBe(true);
			expect(triggeredEvent.composed).toBe(true);
			expect(triggeredEvent.target === previousElement).toBe(true);
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
});
