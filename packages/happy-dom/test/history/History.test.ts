import History from '../../src/history/History';
import HistoryScrollRestorationEnum from '../../src/history/HistoryScrollRestorationEnum';

describe('History', () => {
	let history: History;

	beforeEach(() => {
		history = new History();
	});

	describe('get length()', () => {
		test('Returns "0".', () => {
			expect(history.length).toBe(0);
		});
	});

	describe('get state()', () => {
		test('Returns "null".', () => {
			expect(history.state).toBe(null);
		});
	});

	describe('get scrollRestoration()', () => {
		test('Returns "auto" by default.', () => {
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});
	});

	describe('set scrollRestoration()', () => {
		test('Is not possible to set an invalid value.', () => {
			// @ts-ignore
			history.scrollRestoration = 'invalid';
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.auto);
		});

		test('Is possible to set to "manual".', () => {
			history.scrollRestoration = HistoryScrollRestorationEnum.manual;
			expect(history.scrollRestoration).toBe(HistoryScrollRestorationEnum.manual);
		});
	});

	for (const method of ['back', 'forward', 'go', 'pushState', 'replaceState']) {
		describe(`${method}()`, () => {
			test('Method exists and does nothing.', () => {
				expect(typeof history[method]).toBe('function');
				history[method]();
			});
		});
	}
});
