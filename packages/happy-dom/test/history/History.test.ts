import History from '../../src/history/History.js';
import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum.js';

describe('History', () => {
	let history: History;

	beforeEach(() => {
		history = new History();
	});

	describe('get length()', () => {
		it('Returns "0".', () => {
			expect(history.length).toBe(0);
		});
	});

	describe('get state()', () => {
		it('Returns "null".', () => {
			expect(history.state).toBe(null);
		});
	});

	describe('get scrollRestoration()', () => {
		it('Returns "auto" by default.', () => {
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});
	});

	describe('set scrollRestoration()', () => {
		it('Is not possible to set an invalid value.', () => {
			// @ts-ignore
			history.scrollRestoration = 'invalid';
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});

		it('Is possible to set to "manual".', () => {
			history.scrollRestoration = HistoryScrollRestorationEnum.manual;
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.manual);
		});
	});

	for (const method of ['back', 'forward', 'go', 'pushState', 'replaceState']) {
		describe(`${method}()`, () => {
			it('Method exists and does nothing.', () => {
				expect(typeof history[method]).toBe('function');
				history[method]();
			});
		});
	}
});
