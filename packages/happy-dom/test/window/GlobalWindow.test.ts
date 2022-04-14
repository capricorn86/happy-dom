import GlobalWindow from '../../src/window/GlobalWindow';
import IWindow from '../../src/window/IWindow';

describe('GlobalWindow', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new GlobalWindow();
	});

	describe('get Object()', () => {
		it('Is the same as {}.constructor.', () => {
			expect({}.constructor).toBe(window.Object);
		});
	});

	describe('get Function()', () => {
		it('Is the same as (() => {}).constructor.', () => {
			expect((() => {}).constructor).toBe(window.Function);
		});
	});

	describe('get Array()', () => {
		it('Is the same as [].constructor.', () => {
			expect([].constructor).toBe(window.Array);
		});
	});
});
