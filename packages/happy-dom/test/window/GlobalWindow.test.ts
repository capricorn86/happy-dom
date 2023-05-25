import GlobalWindow from '../../src/window/GlobalWindow.js';
import IWindow from '../../src/window/IWindow.js';

describe('GlobalWindow', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new GlobalWindow();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get Object()', () => {
		it('Is the same as {}.constructor.', () => {
			expect({}.constructor).toBe(window.Object);
		});

		it('Is the same as {}.constructor when using eval().', () => {
			global['window'] = window;
			expect(window.eval('({}).constructor === window.Object')).toBe(true);
			delete global['window'];
		});
	});

	describe('get Function()', () => {
		it('Is the same as (() => {}).constructor.', () => {
			expect((() => {}).constructor).toBe(window.Function);
		});

		it('Is the same as (() => {}).constructor when using eval().', () => {
			global['window'] = window;
			expect(window.eval('(() => {}).constructor === window.Function')).toBe(true);
			delete global['window'];
		});
	});

	describe('get Array()', () => {
		it('Is the same as [].constructor.', () => {
			expect([].constructor).toBe(window.Array);
		});

		it('Is the same as [].constructor when using eval().', () => {
			global['window'] = window;
			expect(window.eval('[].constructor === window.Array')).toBe(true);
			delete global['window'];
		});
	});
});
