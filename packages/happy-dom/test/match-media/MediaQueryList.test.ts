import Window from '../../src/window/Window.js';
import MediaQueryList from '../../src/match-media/MediaQueryList.js';
import MediaQueryListEvent from '../../src/event/events/MediaQueryListEvent.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('MediaQueryList', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window({ width: 1024, height: 768 });
	});

	describe('get media()', () => {
		it('Returns media string.', () => {
			expect(new MediaQueryList({ window: window, media: '(min-width: 1023px)' }).media).toBe(
				'(min-width: 1023px)'
			);
			expect(
				new MediaQueryList({ window: window, media: 'PRINT and (MAX-width: 1024px)' }).media
			).toBe('print and (max-width: 1024px)');
			expect(
				new MediaQueryList({ window: window, media: 'NOT all AND (prefers-COLOR-scheme)' }).media
			).toBe('not all and (prefers-color-scheme)');
			expect(
				new MediaQueryList({ window: window, media: 'NOT all AND (prefers-REDUCED-motion)' }).media
			).toBe('not all and (prefers-reduced-motion)');
			expect(new MediaQueryList({ window: window, media: 'all and (hover: none' }).media).toBe(
				'all and (hover: none)'
			);
			expect(
				new MediaQueryList({
					window: window,
					media: 'all and (400px <= height <= 2000px) and (400px <= width <= 2000px)'
				}).media
			).toBe('all and (400px <= height <= 2000px) and (400px <= width <= 2000px)');
			expect(
				new MediaQueryList({
					window: window,
					media:
						'all and (400px <= height <= 2000px) and (400px <= width <= 2000px) and (min-width: 400px)'
				}).media
			).toBe(
				'all and (400px <= height <= 2000px) and (400px <= width <= 2000px) and (min-width: 400px)'
			);
			expect(new MediaQueryList({ window: window, media: 'prefers-color-scheme' }).media).toBe('');
			expect(new MediaQueryList({ window: window, media: '(prefers-color-scheme' }).media).toBe(
				'not all'
			);
			expect(new MediaQueryList({ window: window, media: '(prefers-color-scheme)' }).media).toBe(
				'(prefers-color-scheme)'
			);
			expect(new MediaQueryList({ window: window, media: 'prefers-reduced-motion' }).media).toBe(
				''
			);
			expect(new MediaQueryList({ window: window, media: '(prefers-reduced-motion' }).media).toBe(
				'not all'
			);
			expect(new MediaQueryList({ window: window, media: '(prefers-reduced-motion)' }).media).toBe(
				'(prefers-reduced-motion)'
			);

			expect(
				new MediaQueryList({ window: window, media: '(forced-colors:      active)' }).media
			).toBe('(forced-colors: active)');
		});
	});

	describe('get matches()', () => {
		it('Handles media type with name "all".', () => {
			expect(
				new MediaQueryList({ window: window, media: 'all and (min-width: 1024px)' }).matches
			).toBe(true);
		});

		it('Handles media type with name "print".', () => {
			expect(new MediaQueryList({ window: window, media: 'print' }).matches).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: 'print and (min-width: 1024px)' }).matches
			).toBe(false);

			window = new Window({
				width: 1024,
				height: 768,
				settings: { device: { mediaType: 'print' } }
			});

			expect(new MediaQueryList({ window: window, media: 'print' }).matches).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: 'print and (min-width: 1024px)' }).matches
			).toBe(true);
		});

		it('Handles media type with name "screen".', () => {
			expect(new MediaQueryList({ window: window, media: 'screen' }).matches).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: 'screen and (min-width: 1024px)' }).matches
			).toBe(true);
		});

		it('Handles "not" keyword.', () => {
			expect(new MediaQueryList({ window: window, media: 'not all' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: 'not print' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: 'not (min-width: 1025px)' }).matches).toBe(
				true
			);
			expect(new MediaQueryList({ window: window, media: 'not (min-width: 1024px)' }).matches).toBe(
				false
			);
		});

		it('Handles "only" keyword.', () => {
			expect(new MediaQueryList({ window: window, media: 'only all' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: 'only print' }).matches).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: 'only screen and (min-width: 1024px)' }).matches
			).toBe(true);
		});

		it('Handles "min-width".', () => {
			expect(new MediaQueryList({ window: window, media: '(min-width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(min-width: 1025px)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(min-width: 1024px)' }).matches).toBe(
				true
			);

			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1025 / 16}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1024 / 16}rem)` }).matches
			).toBe(true);

			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1025 / 16}em)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1024 / 16}em)` }).matches
			).toBe(true);

			expect(new MediaQueryList({ window: window, media: '(min-width: 101vw)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(min-width: 100vw)' }).matches).toBe(
				true
			);

			// Percentages should never match
			expect(new MediaQueryList({ window: window, media: '(min-width: 0%)' }).matches).toBe(false);

			window.document.documentElement.style.fontSize = '10px';

			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1025 / 10}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1024 / 10}rem)` }).matches
			).toBe(true);

			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1025 / 10}em)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(min-width: ${1024 / 10}em)` }).matches
			).toBe(true);
		});

		it('Handles "max-width".', () => {
			expect(new MediaQueryList({ window: window, media: '(max-width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(max-width: 1023px)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(max-width: 1024px)' }).matches).toBe(
				true
			);

			expect(
				new MediaQueryList({ window: window, media: `(max-width: ${1023 / 16}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(max-width: ${1024 / 16}rem)` }).matches
			).toBe(true);
		});

		it('Handles "min-height".', () => {
			expect(new MediaQueryList({ window: window, media: '(min-height)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(min-height: 769px)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(min-height: 768px)' }).matches).toBe(
				true
			);

			expect(new MediaQueryList({ window: window, media: '(min-height: 101vh)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(min-height: 100vh)' }).matches).toBe(
				true
			);

			// Percentages should never match
			expect(new MediaQueryList({ window: window, media: '(min-height: 0%)' }).matches).toBe(false);

			expect(
				new MediaQueryList({ window: window, media: `(min-height: ${769 / 16}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(min-height: ${768 / 16}rem)` }).matches
			).toBe(true);
		});

		it('Handles "max-height".', () => {
			expect(new MediaQueryList({ window: window, media: '(max-height)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(max-height: 767px)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(max-height: 768px)' }).matches).toBe(
				true
			);

			expect(
				new MediaQueryList({ window: window, media: `(max-height: ${767 / 16}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(max-height: ${768 / 16}rem)` }).matches
			).toBe(true);
		});

		it('Handles "width".', () => {
			expect(new MediaQueryList({ window: window, media: '(width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(width: 1023px)' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: '(width: 1024px)' }).matches).toBe(true);
		});

		it('Handles "height".', () => {
			expect(new MediaQueryList({ window: window, media: '(height)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(height: 767px)' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: '(height: 768px)' }).matches).toBe(true);
		});

		it('Handles "orientation".', () => {
			expect(new MediaQueryList({ window: window, media: '(orientation)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(orientation: portrait)' }).matches).toBe(
				false
			);
			expect(
				new MediaQueryList({ window: window, media: '(orientation: landscape)' }).matches
			).toBe(true);

			window.happyDOM?.setInnerWidth(500);
			window.happyDOM?.setInnerHeight(1000);

			expect(new MediaQueryList({ window: window, media: '(orientation: portrait)' }).matches).toBe(
				true
			);
			expect(
				new MediaQueryList({ window: window, media: '(orientation: landscape)' }).matches
			).toBe(false);
		});

		it('Handles "prefers-color-scheme".', () => {
			expect(new MediaQueryList({ window: window, media: '(prefers-color-scheme)' }).matches).toBe(
				true
			);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-color-scheme: dark)' }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-color-scheme: light)' }).matches
			).toBe(true);

			window = new Window({
				width: 1024,
				height: 768,
				settings: { device: { prefersColorScheme: 'dark' } }
			});

			expect(
				new MediaQueryList({ window: window, media: '(prefers-color-scheme: dark)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-color-scheme: light)' }).matches
			).toBe(false);
		});

		it('Handles "forced-colors".', () => {
			expect(new MediaQueryList({ window: window, media: '(forced-colors)' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: '(forced-colors: active)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(forced-colors: none)' }).matches).toBe(
				true
			);

			window = new Window({
				settings: { device: { forcedColors: 'active' } }
			});

			expect(new MediaQueryList({ window: window, media: '(forced-colors)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(forced-colors: active)' }).matches).toBe(
				true
			);
			expect(new MediaQueryList({ window: window, media: '(forced-colors: none)' }).matches).toBe(
				false
			);
		});

		it('Handles "prefers-reduced-motion".', () => {
			expect(
				new MediaQueryList({ window: window, media: '(prefers-reduced-motion)' }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-reduced-motion: reduce)' }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-reduced-motion: no-preference)' })
					.matches
			).toBe(true);

			window = new Window({
				width: 1024,
				height: 768,
				settings: { device: { prefersReducedMotion: 'reduce' } }
			});

			expect(
				new MediaQueryList({ window: window, media: '(prefers-reduced-motion)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-reduced-motion: reduce)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(prefers-reduced-motion: no-preference)' })
					.matches
			).toBe(false);
		});

		it('Handles "hover".', () => {
			expect(new MediaQueryList({ window: window, media: '(hover)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(hover: invalid)' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: '(hover: none)' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: '(hover: hover)' }).matches).toBe(true);
		});

		it('Handles "pointer".', () => {
			expect(new MediaQueryList({ window: window, media: '(pointer)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(pointer: invalid)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(pointer: none)' }).matches).toBe(false);
			expect(new MediaQueryList({ window: window, media: '(pointer: coarse)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(pointer: fine)' }).matches).toBe(true);
		});

		it('Handles "any-pointer".', () => {
			expect(new MediaQueryList({ window: window, media: '(any-pointer)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(any-pointer: invalid)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(any-pointer: none)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(any-pointer: coarse)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(any-pointer: fine)' }).matches).toBe(
				true
			);
		});

		it('Handles "display-mode".', () => {
			expect(new MediaQueryList({ window: window, media: '(display-mode)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(display-mode: invalid)' }).matches).toBe(
				false
			);
			expect(new MediaQueryList({ window: window, media: '(display-mode: browser)' }).matches).toBe(
				true
			);
		});

		it('Handles "min-aspect-ratio".', () => {
			expect(new MediaQueryList({ window: window, media: '(min-aspect-ratio)' }).matches).toBe(
				true
			);
			expect(
				new MediaQueryList({ window: window, media: '(min-aspect-ratio: 1024/770)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(min-aspect-ratio: 1024/760)' }).matches
			).toBe(false);
		});

		it('Handles "max-aspect-ratio".', () => {
			expect(new MediaQueryList({ window: window, media: '(max-aspect-ratio)' }).matches).toBe(
				true
			);
			expect(
				new MediaQueryList({ window: window, media: '(max-aspect-ratio: 1024/760)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(max-aspect-ratio: 1024/770)' }).matches
			).toBe(false);
		});

		it('Handles "aspect-ratio".', () => {
			expect(new MediaQueryList({ window: window, media: '(aspect-ratio)' }).matches).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(aspect-ratio: 1024/768)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(aspect-ratio: 1024/769)' }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(aspect-ratio: 1024/767)' }).matches
			).toBe(false);
		});

		it('Handles defining a resolution range using the range syntax.', () => {
			expect(new MediaQueryList({ window: window, media: '(400px <= width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(400px < width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(2000px < width)' }).matches).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(400px <= width <= 2000px)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(400px <= width <= 1023px)' }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(400px <= width <= 1024px)' }).matches
			).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(2000px => width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(2000px > width)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(700px > width)' }).matches).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(${1024 / 16}rem <= width)` }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: `(${1024 / 16}em <= width)` }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: `(${1024 / 16}rem < width)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(${1024 / 16}em < width)` }).matches
			).toBe(false);

			expect(new MediaQueryList({ window: window, media: '(400px <= height)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(400px < height)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(2000px < height)' }).matches).toBe(
				false
			);
			expect(
				new MediaQueryList({ window: window, media: '(400px <= height <= 2000px)' }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: '(400px <= height <= 767px)' }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: '(400px <= height <= 768px)' }).matches
			).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(2000px => height)' }).matches).toBe(
				true
			);
			expect(new MediaQueryList({ window: window, media: '(2000px > height)' }).matches).toBe(true);
			expect(new MediaQueryList({ window: window, media: '(700px > height)' }).matches).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(${768 / 16}rem <= height)` }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: `(${768 / 16}em <= height)` }).matches
			).toBe(true);
			expect(
				new MediaQueryList({ window: window, media: `(${768 / 16}rem < height)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(${768 / 16}em < height)` }).matches
			).toBe(false);

			expect(
				new MediaQueryList({
					window: window,
					media: '(400px <= height <= 2000px) and (400px <= width <= 2000px)'
				}).matches
			).toBe(true);
		});

		it('Handles multiple rules.', () => {
			expect(
				new MediaQueryList({
					window: window,
					media: '(min-width: 1024px) and (max-width: 2000px)'
				}).matches
			).toBe(true);
			expect(
				new MediaQueryList({
					window: window,
					media: '(min-width: 768px) and (max-width: 1023px)'
				}).matches
			).toBe(false);
			expect(
				new MediaQueryList({
					window: window,
					media: 'screen and (min-width: 1024px) and (max-width: 2000px)'
				}).matches
			).toBe(true);
		});

		it('Handles disabling computed style rendering with the Happy DOM setting "disableComputedStyleRendering" set to "true".', () => {
			window.document.documentElement.style.fontSize = '10px';

			expect(
				new MediaQueryList({ window: window, media: `(max-width: ${1023 / 10}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(max-width: ${1024 / 10}rem)` }).matches
			).toBe(true);

			window = new Window({
				width: 1024,
				height: 768,
				settings: { disableComputedStyleRendering: true }
			});

			expect(
				new MediaQueryList({ window: window, media: `(max-width: ${1023 / 16}rem)` }).matches
			).toBe(false);
			expect(
				new MediaQueryList({ window: window, media: `(max-width: ${1024 / 16}rem)` }).matches
			).toBe(true);
		});
	});

	describe('addEventListener()', () => {
		it('Listens for window "resize" event when sending in a "change" event.', () => {
			let triggeredEvent: MediaQueryListEvent | null = null;
			const media = '(min-width: 1025px)';
			const mediaQueryList = new MediaQueryList({ window: window, media: media });

			mediaQueryList.addEventListener('change', (event): void => {
				triggeredEvent = <MediaQueryListEvent>event;
			});

			expect(mediaQueryList.matches).toBe(false);

			window.happyDOM?.setInnerWidth(1025);

			expect((<MediaQueryListEvent>(<unknown>triggeredEvent)).matches).toBe(true);
			expect((<MediaQueryListEvent>(<unknown>triggeredEvent)).media).toBe(media);
		});
	});

	describe('removeEventListener()', () => {
		it('Removes listener for window "resize" event when sending in a "change" event.', () => {
			let triggeredEvent: MediaQueryListEvent | null = null;
			const mediaQueryList = new MediaQueryList({
				window: window,
				media: '(min-width: 1025px)'
			});
			const listener = (event): void => {
				triggeredEvent = event;
			};

			mediaQueryList.addEventListener('change', listener);
			mediaQueryList.removeEventListener('change', listener);

			window.happyDOM?.setInnerWidth(1025);

			expect(triggeredEvent).toBe(null);
		});
	});
});
