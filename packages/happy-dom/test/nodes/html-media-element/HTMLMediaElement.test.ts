import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import DOMException from '../../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum';
import IDocument from '../../../src/nodes/document/IDocument';
import IHTMLMediaElement from '../../../src/nodes/html-media-element/IHTMLMediaElement';
import Event from '../../../src/event/Event';

describe('HTMLMediaElement', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLMediaElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLMediaElement>document.createElement('audio');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLAudioElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLAudioElement]');
		});
	});

	for (const property of ['autoplay', 'controls', 'loop']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(false);
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});

			it('Remove attribute value.', () => {
				element.setAttribute(property, '');
				element[property] = false;
				expect(element.getAttribute(property)).toBeNull();
			});
		});
	}

	for (const property of ['src', 'preload']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe(`get defaultMuted()`, () => {
		it('Returns value.', () => {
			expect(element.defaultMuted).toBe(false);
			element.defaultMuted = true;
			expect(element.defaultMuted).toBe(true);
		});
	});

	describe(`set defaultMuted()`, () => {
		it('Sets attribute value.', () => {
			element.defaultMuted = true;
			expect(element.getAttribute('muted')).toBe('');
		});

		it('Remove attribute value.', () => {
			element.defaultMuted = true;
			element.defaultMuted = false;
			expect(element.getAttribute('muted')).toBeNull();
		});
	});

	describe(`get muted()`, () => {
		it('Returns value.', () => {
			element.setAttribute('muted', '');
			expect(element.muted).toBe(true);
		});
		it('Returns setter value.', () => {
			element.muted = true;
			expect(element.muted).toBe(true);
		});
	});

	describe(`set muted()`, () => {
		it('Sets attribute value.', () => {
			element.muted = true;
			expect(element.getAttribute('muted')).toBe('');
		});

		it('Remove attribute value.', () => {
			element.setAttribute('muted', '');
			element.muted = false;
			expect(element.getAttribute('muted')).toBeNull();
		});

		it('Keep attribute value, if default muted true', () => {
			element.setAttribute('muted', '');
			element.defaultMuted = true;
			element.muted = false;
			expect(element.getAttribute('muted')).toBe('');
			expect(element.muted).toBe(false);
		});
	});

	describe('canplay event', () => {
		it('Should dispatch after src set', () => {
			let dispatchedEvent: Event = null;
			element.addEventListener('canplay', (event: Event) => (dispatchedEvent = event));
			element.src = 'https://songURL';
			expect(dispatchedEvent.cancelable).toBe(false);
			expect(dispatchedEvent.bubbles).toBe(false);
		});
		it('Should not dispatch if src is empty', () => {
			let dispatchedEvent: Event = null;
			element.addEventListener('canplay', (event: Event) => (dispatchedEvent = event));
			element.src = '';
			expect(dispatchedEvent).toBeNull();
		});
	});

	describe('currentSrc', () => {
		it('Returns the current src', () => {
			const src = 'https://src';
			element.src = src;
			expect(element.currentSrc).toBe(src);
		});
	});

	describe('paused', () => {
		it('Default is true', () => {
			expect(element.paused).toBeTruthy();
		});

		it('Set false with play', () => {
			element.play();
			expect(element.paused).toBeFalsy();
		});

		it('Set true with pause', () => {
			element.play();
			element.pause();
			expect(element.paused).toBeTruthy();
		});
	});

	describe('volume()', () => {
		it('Returns default value', () => {
			expect(element.volume).toBe(1);
		});

		it('Set value', () => {
			element.volume = 0.5;
			expect(element.volume).toBe(0.5);
		});

		it('Set parse volmue as a number', () => {
			element.volume = '0.5';
			expect(element.volume).toBe(0.5);
		});

		it('Throw type error if volume is not a number', () => {
			expect(() => {
				element.volume = 'zeropointfive';
			}).toThrowError(
				new TypeError(
					`Failed to set the 'volume' property on 'HTMLMediaElement': The provided double value is non-finite.`
				)
			);
		});

		for (const volume of [-0.4, 1.3]) {
			it(`Throw error if out of range: ${volume}`, () => {
				expect(() => {
					element.volume = volume;
				}).toThrowError(
					new DOMException(
						`Failed to set the 'volume' property on 'HTMLMediaElement': The volume provided (${volume}) is outside the range [0, 1].`,
						DOMExceptionNameEnum.indexSizeError
					)
				);
			});
		}
	});

	describe('canPlayType', () => {
		it('Returns empty string', () => {
			expect(element.canPlayType('notValidMIMEtype')).toBe('');
		});
	});

	describe('enden', () => {
		it('Returns false', () => {
			expect(element.ended).toBeFalsy();
		});
	});

	describe('CrossOrigin', () => {
		for (const crossOrigin of ['', null, 'use-credentials', 'anonymous']) {
			it(`Set ${crossOrigin} as a valid crossOrigin`, () => {
				element.crossOrigin = crossOrigin;
				expect(element.getAttribute('crossorigin')).toBe(crossOrigin);
				expect(element.crossOrigin).toBe(crossOrigin);
			});
		}

		it(`Return 'anonymous' if crossOrigin is not valid`, () => {
			element.crossOrigin = 'randomString';
			expect(element.getAttribute('crossorigin')).toBe('anonymous');
			expect(element.crossOrigin).toBe('anonymous');
		});
	});

	describe('duration', () => {
		it('Return NaN by default', () => {
			expect(element.duration).toBe(NaN);
		});
	});

	describe('currentTime', () => {
		it('Return default value', () => {
			expect(element.currentTime).toBe(0);
		});
		it('Set value', () => {
			element.currentTime = 42;
			expect(element.currentTime).toBe(42);
		});
		it('Set value as a string', () => {
			element.currentTime = '42';
			expect(element.currentTime).toBe(42);
		});

		it('Throw type error if currentTime is not a number', () => {
			expect(() => {
				element.currentTime = 'zeropointfive';
			}).toThrowError(
				new TypeError(
					`Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.`
				)
			);
		});
	});

	describe('playbackRate', () => {
		it('Return default value', () => {
			expect(element.playbackRate).toBe(1);
		});
		it('Set value', () => {
			element.playbackRate = 2.3;
			expect(element.playbackRate).toBe(2.3);
		});
		it('Set value as a string', () => {
			element.playbackRate = '2.3';
			expect(element.playbackRate).toBe(2.3);
		});

		it('Throw type error if playbackRate is not a number', () => {
			expect(() => {
				element.playbackRate = 'zeropointfive';
			}).toThrowError(
				new TypeError(
					`Failed to set the 'playbackRate' property on 'HTMLMediaElement': The provided double value is non-finite.`
				)
			);
		});
	});

	describe('defaultPlaybackRate', () => {
		it('Return default value', () => {
			expect(element.defaultPlaybackRate).toBe(1);
		});
		it('Set value', () => {
			element.defaultPlaybackRate = 2.3;
			expect(element.defaultPlaybackRate).toBe(2.3);
		});
		it('Set value as a string', () => {
			element.defaultPlaybackRate = '0.3';
			expect(element.defaultPlaybackRate).toBe(0.3);
		});

		it('Throw type error if defaultPlaybackRate is not a number', () => {
			expect(() => {
				element.defaultPlaybackRate = 'zeropointfive';
			}).toThrowError(
				new TypeError(
					`Failed to set the 'defaultPlaybackRate' property on 'HTMLMediaElement': The provided double value is non-finite.`
				)
			);
		});
	});

	describe('error', () => {
		it('Return null by default', () => {
			expect(element.error).toBeNull();
		});
	});

	describe('networkState', () => {
		it('Return 0 by default', () => {
			expect(element.networkState).toBe(0);
		});
	});

	describe('preservesPitch', () => {
		it('Return true by default', () => {
			expect(element.preservesPitch).toBe(true);
		});

		for (const property of [null, undefined, false]) {
			it(`Set false with ${property}`, () => {
				element.preservesPitch = property;
				expect(element.preservesPitch).toBe(false);
			});
		}
	});

	describe('readyState', () => {
		it('Return 0 by default', () => {
			expect(element.readyState).toBe(0);
		});
	});

	describe('load', () => {
		it('Dispatch emptied event', () => {
			let dispatchedEvent: Event = null;
			element.addEventListener('emptied', (event: Event) => (dispatchedEvent = event));

			element.load();

			expect(dispatchedEvent.cancelable).toBe(false);
			expect(dispatchedEvent.bubbles).toBe(false);
		});
	});
});
