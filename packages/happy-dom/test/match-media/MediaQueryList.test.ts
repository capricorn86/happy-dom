import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import MediaQueryList from '../../src/match-media/MediaQueryList';
import MediaQueryListEvent from '../../src/event/events/MediaQueryListEvent';

describe('MediaQueryList', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window({ innerWidth: 1024, innerHeight: 1024 });
	});

	describe('get matches()', () => {
		it('Handles "min-width".', () => {
			expect(new MediaQueryList(window, '(min-width: 1025px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-width: 1024px)').matches).toBe(true);
		});

		it('Handles "max-width".', () => {
			expect(new MediaQueryList(window, '(max-width: 1023px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(max-width: 1024px)').matches).toBe(true);
		});

		it('Handles "min-height".', () => {
			expect(new MediaQueryList(window, '(min-height: 1025px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(min-height: 1024px)').matches).toBe(true);
		});

		it('Handles "max-height".', () => {
			expect(new MediaQueryList(window, '(max-height: 1023px)').matches).toBe(false);
			expect(new MediaQueryList(window, '(max-height: 1024px)').matches).toBe(true);
		});
	});

	describe('get media()', () => {
		it('Returns media string.', () => {
			const media = '(min-width: 1023px)';
			expect(new MediaQueryList(window, media).media).toBe(media);
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
