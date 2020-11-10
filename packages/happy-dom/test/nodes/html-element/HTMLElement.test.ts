import Window from '../../../src/window/Window';

describe('HTMLElement', () => {
	let window, document, element;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get innerText()', () => {
		test('Returns the as the textContent property.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');
			element.appendChild(div);
			element.appendChild(textNode2);
			div.appendChild(textNode1);
			expect(element.innerText).toBe('text1text2');
			expect(element.innerText).toBe(element.textContent);
		});
	});

	describe('set innerText()', () => {
		test('Sets the value of the textContent property.', () => {
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
		test('Returns styles.', () => {
			element.setAttribute('style', 'border-radius: 2px; padding: 2px;');
			expect(element.style.length).toEqual(2);
			expect(element.style[0]).toEqual('border-radius');
			expect(element.style[1]).toEqual('padding');
			expect(element.style['borderRadius']).toEqual('2px');
			expect(element.style['padding']).toEqual('2px');
			expect(element.style.cssText).toEqual('border-radius: 2px;padding: 2px;');

			element.setAttribute('style', 'border-radius: 4px; padding: 4px;');
			expect(element.style.length).toEqual(2);
			expect(element.style[0]).toEqual('border-radius');
			expect(element.style[1]).toEqual('padding');
			expect(element.style['borderRadius']).toEqual('4px');
			expect(element.style['padding']).toEqual('4px');
			expect(element.style.cssText).toEqual('border-radius: 4px;padding: 4px;');
		});
	});

	for (const eventType of ['click', 'blur', 'focus']) {
		describe(`${eventType}()`, () => {
			test(`Dispatches a "${eventType}" event.`, () => {
				let triggeredEvent = null;
				element.addEventListener(eventType, event => {
					triggeredEvent = event;
				});
				element[eventType]();
				expect(triggeredEvent).toEqual({
					_immediatePropagationStopped: false,
					_propagationStopped: false,
					bubbles: true,
					cancelable: false,
					composed: true,
					currentTarget: element,
					defaultPrevented: false,
					target: element,
					type: eventType
				});
			});
		});
	}
});
