import CSSStyleDeclaration from '../../src/css/CSSStyleDeclaration';
import Window from '../../src/window/Window';

describe('Window', () => {
	let window;

	beforeEach(() => {
		window = new Window();
	});

	describe('getComputedStyle()', () => {
		test('Returns a CSSStyleDeclaration object set in the property HTMLElement.style.', () => {
			const element = window.document.createElement('div');
			element.style.direction = 'rtl';
			window.document.body.appendChild(element);
			expect(window.getComputedStyle(element) instanceof CSSStyleDeclaration).toBe(true);
			expect(window.getComputedStyle(element).direction).toBe('rtl');
		});

		test('Returns an empty CSSStyleDeclaration if the element is not connected to the DOM.', () => {
			const element = window.document.createElement('div');
			element.style.direction = 'rtl';
			expect(window.getComputedStyle(element) instanceof CSSStyleDeclaration).toBe(true);
			expect(window.getComputedStyle(element).direction).toBe('');
		});
	});

	describe('setTimeout()', () => {
		test('Sets a timeout.', done => {
			const timeoutId = window.setTimeout(() => done());
			expect(timeoutId.constructor.name).toBe('Timeout');
		});
	});

	describe('clearTimeout()', () => {
		test('Clears a timeout.', () => {
			const timeoutId = window.setTimeout(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.clearTimeout(timeoutId);
		});
	});

	describe('setInterval()', () => {
		test('Sets an interval.', done => {
			let count = 0;
			const intervalId = window.setInterval(() => {
				count++;
				if (count > 2) {
					clearInterval(intervalId);
					done();
				}
			});
		});
	});

	describe('clearInterval()', () => {
		test('Clears an interval.', () => {
			const intervalId = window.setInterval(() => {
				throw new Error('This interval should have been canceled.');
			});
			window.clearInterval(intervalId);
		});
	});

	describe('requestAnimationFrame()', () => {
		test('Requests an animation frame.', done => {
			const timeoutId = window.requestAnimationFrame(() => done());
			expect(timeoutId.constructor.name).toBe('Timeout');
		});
	});

	describe('cancelAnimationFrame()', () => {
		test('Cancels an animation frame.', () => {
			const timeoutId = window.requestAnimationFrame(() => {
				throw new Error('This timeout should have been canceled.');
			});
			window.cancelAnimationFrame(timeoutId);
		});
	});
});
