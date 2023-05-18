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
			expect(
				new MediaQueryList(
					window,
					'all and (400px <= height <= 2000px) and (400px <= width <= 2000px)'
				).media
			).toBe('all and (400px <= height <= 2000px) and (400px <= width <= 2000px)');
			expect(
				new MediaQueryList(
					window,
					'all and (400px <= height <= 2000px) and (400px <= width <= 2000px) and (min-width: 400px)'
				).media
			).toBe(
				'all and (400px <= height <= 2000px) and (400px <= width <= 2000px) and (min-width: 400px)'
			);
			expect(new MediaQueryList(window, 'prefers-color-scheme').media).toBe('');
			expect(new MediaQueryList(window, '(prefers-color-scheme').media).toBe('not all');
			expect(new MediaQueryList(window, '(prefers-color-scheme)').media).toBe(
				'(prefers-color-scheme)'
			);
		});
	});

	describe('get matches()', () => {
		it('Handles media type with name "all".', () => {
			expect(new MediaQueryList(window, 'all and (min-width: 1024px)').matches).toBe(true);
		});

		it('Handles media type with name "print".', () => {
			expect(new MediaQueryList(window, 'print').matches).toBe(false);
			expect(new MediaQueryList(window, 'print and (min-width: 1024px)').matches).toBe(false);

			window.happyDOM.settings.device.mediaType = 'print';

			expect(new MediaQueryList(window, 'print').matches).toBe(true);
			expect(new MediaQueryList(window, 'print and (min-width: 1024px)').matches).toBe(true);
		});

		it('Handles media type with name "screen".', () => {
			expect(new MediaQueryList(window, 'screen').matches).toBe(true);
			expect(new MediaQueryList(window, 'screen and (min-width: 1024px)').matches).toBe(true);
		});

		it('Handles "not" keyword.', () => {
			expect(new MediaQueryList(window, 'not all').matches).toBe(false);
			expect(new MediaQueryList(window, 'not print').matches).toBe(true);
			expect(new MediaQueryList(window, 'not (min-width: 1025px)').matches).toBe(true);
			expect(new MediaQueryList(window, 'not (min-width: 1024px)').matches).toBe(false);
		});

		it('Handles "only" keyword.', () => {
			expect(new MediaQueryList(window, 'only all').matches).toBe(true);
			expect(new MediaQueryList(window, 'only print').matches).toBe(false);
			expect(new MediaQueryList(window, 'only screen and (min-width: 1024px)').matches).toBe(true);
		});

		it('Handles "min-width".', () => {
			expect(new MediaQueryList(window, '(min-width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(min-width: 1025px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-width: 1024px)').matches).toBe(true);

			expect(new MediaQueryList(window, `(min-width: ${1025 / 16}rem)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(min-width: ${1024 / 16}rem)`).matches).toBe(true);

			expect(new MediaQueryList(window, `(min-width: ${1025 / 16}em)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(min-width: ${1024 / 16}em)`).matches).toBe(true);

			expect(new MediaQueryList(window, '(min-width: 101vw)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-width: 100vw)').matches).toBe(true);

			window.document.documentElement.style.fontSize = '10px';

			expect(new MediaQueryList(window, `(min-width: ${1025 / 10}rem)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(min-width: ${1024 / 10}rem)`).matches).toBe(true);

			expect(new MediaQueryList(window, `(min-width: ${1025 / 10}em)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(min-width: ${1024 / 10}em)`).matches).toBe(true);
		});

		it('Handles "max-width".', () => {
			expect(new MediaQueryList(window, '(max-width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(max-width: 1023px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(max-width: 1024px)').matches).toBe(true);

			expect(new MediaQueryList(window, `(max-width: ${1023 / 16}rem)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(max-width: ${1024 / 16}rem)`).matches).toBe(true);
		});

		it('Handles "min-height".', () => {
			expect(new MediaQueryList(window, '(min-height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(min-height: 769px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-height: 768px)').matches).toBe(true);

			expect(new MediaQueryList(window, '(min-height: 101vh)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-height: 100vh)').matches).toBe(true);

			expect(new MediaQueryList(window, `(min-height: ${769 / 16}rem)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(min-height: ${768 / 16}rem)`).matches).toBe(true);
		});

		it('Handles "max-height".', () => {
			expect(new MediaQueryList(window, '(max-height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(max-height: 767px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(max-height: 768px)').matches).toBe(true);

			expect(new MediaQueryList(window, `(max-height: ${767 / 16}rem)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(max-height: ${768 / 16}rem)`).matches).toBe(true);
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

			window.happyDOM.settings.device.prefersColorScheme = 'dark';

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

		it('Handles "display-mode".', () => {
			expect(new MediaQueryList(window, '(display-mode)').matches).toBe(true);
			expect(new MediaQueryList(window, '(display-mode: invalid)').matches).toBe(false);
			expect(new MediaQueryList(window, '(display-mode: browser)').matches).toBe(true);
		});

		it('Handles "min-aspect-ratio".', () => {
			expect(new MediaQueryList(window, '(min-aspect-ratio)').matches).toBe(true);
			expect(new MediaQueryList(window, '(min-aspect-ratio: 1024/770)').matches).toBe(true);
			expect(new MediaQueryList(window, '(min-aspect-ratio: 1024/760)').matches).toBe(false);
		});

		it('Handles "max-aspect-ratio".', () => {
			expect(new MediaQueryList(window, '(max-aspect-ratio)').matches).toBe(true);
			expect(new MediaQueryList(window, '(max-aspect-ratio: 1024/760)').matches).toBe(true);
			expect(new MediaQueryList(window, '(max-aspect-ratio: 1024/770)').matches).toBe(false);
		});

		it('Handles "aspect-ratio".', () => {
			expect(new MediaQueryList(window, '(aspect-ratio)').matches).toBe(true);
			expect(new MediaQueryList(window, '(aspect-ratio: 1024/768)').matches).toBe(true);
			expect(new MediaQueryList(window, '(aspect-ratio: 1024/769)').matches).toBe(false);
			expect(new MediaQueryList(window, '(aspect-ratio: 1024/767)').matches).toBe(false);
		});

		it('Handles defining a resolution range using the range syntax.', () => {
			expect(new MediaQueryList(window, '(400px <= width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(400px < width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(2000px < width)').matches).toBe(false);
			expect(new MediaQueryList(window, '(400px <= width <= 2000px)').matches).toBe(true);
			expect(new MediaQueryList(window, '(400px <= width <= 1023px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(400px <= width <= 1024px)').matches).toBe(true);
			expect(new MediaQueryList(window, '(2000px => width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(2000px > width)').matches).toBe(true);
			expect(new MediaQueryList(window, '(700px > width)').matches).toBe(false);
			expect(new MediaQueryList(window, `(${1024 / 16}rem <= width)`).matches).toBe(true);
			expect(new MediaQueryList(window, `(${1024 / 16}em <= width)`).matches).toBe(true);
			expect(new MediaQueryList(window, `(${1024 / 16}rem < width)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(${1024 / 16}em < width)`).matches).toBe(false);

			expect(new MediaQueryList(window, '(400px <= height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(400px < height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(2000px < height)').matches).toBe(false);
			expect(new MediaQueryList(window, '(400px <= height <= 2000px)').matches).toBe(true);
			expect(new MediaQueryList(window, '(400px <= height <= 767px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(400px <= height <= 768px)').matches).toBe(true);
			expect(new MediaQueryList(window, '(2000px => height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(2000px > height)').matches).toBe(true);
			expect(new MediaQueryList(window, '(700px > height)').matches).toBe(false);
			expect(new MediaQueryList(window, `(${768 / 16}rem <= height)`).matches).toBe(true);
			expect(new MediaQueryList(window, `(${768 / 16}em <= height)`).matches).toBe(true);
			expect(new MediaQueryList(window, `(${768 / 16}rem < height)`).matches).toBe(false);
			expect(new MediaQueryList(window, `(${768 / 16}em < height)`).matches).toBe(false);

			expect(
				new MediaQueryList(window, '(400px <= height <= 2000px) and (400px <= width <= 2000px)')
					.matches
			).toBe(true);
		});

		it('Handles multiple rules.', () => {
			expect(
				new MediaQueryList(window, '(min-width: 1024px) and (max-width: 2000px)').matches
			).toBe(true);
			expect(new MediaQueryList(window, '(min-width: 768px) and (max-width: 1023px)').matches).toBe(
				false
			);
			expect(
				new MediaQueryList(window, 'screen and (min-width: 1024px) and (max-width: 2000px)').matches
			).toBe(true);
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
