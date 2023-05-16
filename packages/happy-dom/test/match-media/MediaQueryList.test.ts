import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import MediaQueryList from '../../src/match-media/MediaQueryList';
import MediaQueryListEvent from '../../src/event/events/MediaQueryListEvent';

describe('MediaQueryList', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window({ innerWidth: 1024, innerHeight: 768 });
	});

	describe('get media()', () => {
		it('Returns media string.', () => {
			expect(new MediaQueryList(window, '(min-width: 1023px)').media).toBe('(min-width: 1023px)');
			expect(new MediaQueryList(window, 'PRINT and (MAX-width: 1024px)').media).toBe(
				'print and (max-width: 1024px)'
			);
			expect(new MediaQueryList(window, 'NOT all AND (prefers-COLOR-scheme)').media).toBe(
				'not all and (prefers-color-scheme)'
			);
			expect(new MediaQueryList(window, 'all and (hover: none').media).toBe(
				'all and (hover: none)'
			);
			expect(new MediaQueryList(window, 'prefers-color-scheme').media).toBe('');
			expect(new MediaQueryList(window, '(prefers-color-scheme').media).toBe('not all');
			expect(new MediaQueryList(window, '(prefers-color-scheme)').media).toBe(
				'(prefers-color-scheme)'
			);
		});
	});

	describe('get matches()', () => {
		it('Handles device with name "all".', () => {
			expect(new MediaQueryList(window, 'all and (min-width: 1024px)').matches).toBe(true);
		});

		it('Handles device with name "print".', () => {
			expect(new MediaQueryList(window, 'print').matches).toBe(false);
			expect(new MediaQueryList(window, 'print and (min-width: 1024px)').matches).toBe(false);
		});

		it('Handles device with name "screen".', () => {
			expect(new MediaQueryList(window, 'screen').matches).toBe(true);
			expect(new MediaQueryList(window, 'screen and (min-width: 1024px)').matches).toBe(true);
		});

		it('Handles "not" keyword.', () => {
			expect(new MediaQueryList(window, 'not all').matches).toBe(false);
			expect(new MediaQueryList(window, 'not print').matches).toBe(true);
			expect(new MediaQueryList(window, 'not (min-width: 1025px)').matches).toBe(true);
			expect(new MediaQueryList(window, 'not (min-width: 1024px)').matches).toBe(false);
		});

		it('Handles "min-width".', () => {
			expect(new MediaQueryList(window, '(min-width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(min-width: 1025px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-width: 1024px)').matches).toBe(true);
		});

		it('Handles "max-width".', () => {
			expect(new MediaQueryList(window, '(max-width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(max-width: 1023px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(max-width: 1024px)').matches).toBe(true);
		});

		it('Handles "min-height".', () => {
			expect(new MediaQueryList(window, '(min-height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(min-height: 769px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-height: 768px)').matches).toBe(true);
		});

		it('Handles "max-height".', () => {
			expect(new MediaQueryList(window, '(max-height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(max-height: 767px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(max-height: 768px)').matches).toBe(true);
		});

		it('Handles "orientation".', () => {
			expect(new MediaQueryList(window, '(orientation)').matches).toBe(true);
			expect(new MediaQueryList(window, '(orientation: portrait)').matches).toBe(false);
			expect(new MediaQueryList(window, '(orientation: landscape)').matches).toBe(true);

			window.happyDOM.setInnerWidth(500);
			window.happyDOM.setInnerHeight(1000);

			expect(new MediaQueryList(window, '(orientation: portrait)').matches).toBe(true);
			expect(new MediaQueryList(window, '(orientation: landscape)').matches).toBe(false);
		});

		it('Handles "prefers-color-scheme".', () => {
			expect(new MediaQueryList(window, '(prefers-color-scheme)').matches).toBe(true);
			expect(new MediaQueryList(window, '(prefers-color-scheme: dark)').matches).toBe(false);
			expect(new MediaQueryList(window, '(prefers-color-scheme: light)').matches).toBe(true);

			window.happyDOM.settings.colorScheme = 'dark';

			expect(new MediaQueryList(window, '(prefers-color-scheme: dark)').matches).toBe(true);
			expect(new MediaQueryList(window, '(prefers-color-scheme: light)').matches).toBe(false);
		});

		it('Handles "hover".', () => {
			expect(new MediaQueryList(window, '(hover)').matches).toBe(true);
			expect(new MediaQueryList(window, '(hover: invalid)').matches).toBe(false);
			expect(new MediaQueryList(window, '(hover: none)').matches).toBe(false);
			expect(new MediaQueryList(window, '(hover: hover)').matches).toBe(true);
		});

		it('Handles "pointer".', () => {
			expect(new MediaQueryList(window, '(pointer)').matches).toBe(true);
			expect(new MediaQueryList(window, '(pointer: invalid)').matches).toBe(false);
			expect(new MediaQueryList(window, '(pointer: none)').matches).toBe(false);
			expect(new MediaQueryList(window, '(pointer: coarse)').matches).toBe(false);
			expect(new MediaQueryList(window, '(pointer: fine)').matches).toBe(true);
		});

		it('Handles "any-pointer".', () => {
			expect(new MediaQueryList(window, '(any-pointer)').matches).toBe(true);
			expect(new MediaQueryList(window, '(any-pointer: invalid)').matches).toBe(false);
			expect(new MediaQueryList(window, '(any-pointer: none)').matches).toBe(false);
			expect(new MediaQueryList(window, '(any-pointer: coarse)').matches).toBe(false);
			expect(new MediaQueryList(window, '(any-pointer: fine)').matches).toBe(true);
		});
	});

	describe('addEventListener()', () => {
		it('Listens for window "resize" event when sending in a "change" event.', () => {
			let triggeredEvent = null;
			const media = '(min-width: 1025px)';
			const mediaQueryList = new MediaQueryList(window, media);

			mediaQueryList.addEventListener('change', (event: MediaQueryListEvent): void => {
				triggeredEvent = event;
			});

			expect(mediaQueryList.matches).toBe(false);

			window.happyDOM.setInnerWidth(1025);

			expect(triggeredEvent.matches).toBe(true);
			expect(triggeredEvent.media).toBe(media);
		});
	});

	describe('removeEventListener()', () => {
		it('Removes listener for window "resize" event when sending in a "change" event.', () => {
			let triggeredEvent = null;
			const mediaQueryList = new MediaQueryList(window, '(min-width: 1025px)');
			const listener = (event: MediaQueryListEvent): void => {
				triggeredEvent = event;
			};

			mediaQueryList.addEventListener('change', listener);
			mediaQueryList.removeEventListener('change', listener);

			window.happyDOM.setInnerWidth(1025);

			expect(triggeredEvent).toBe(null);
		});
	});
});
