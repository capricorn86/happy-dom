import Window from '../../../src/window/Window.js';
import DOMException from '../../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLMediaElement from '../../../src/nodes/html-media-element/HTMLMediaElement.js';
import Event from '../../../src/event/Event.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLVideoElement from '../../../src/nodes/html-video-element/HTMLVideoElement.js';
import HTMLAudioElement from '../../../src/nodes/html-audio-element/HTMLAudioElement.js';
import TimeRanges from '../../../src/nodes/html-media-element/TimeRanges.js';
import RemotePlayback from '../../../src/nodes/html-media-element/RemotePlayback.js';
import DOMTokenList from '../../../src/dom/DOMTokenList.js';
import TextTrackKindEnum from '../../../src/nodes/html-media-element/TextTrackKindEnum.js';
import TextTrack from '../../../src/nodes/html-media-element/TextTrack.js';
import MediaStream from '../../../src/nodes/html-media-element/MediaStream.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';

describe('HTMLMediaElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLMediaElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLMediaElement>document.createElement('audio');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLMediaElement for the tags <audio> and <video>', () => {
			expect(document.createElement('audio')).toBeInstanceOf(HTMLMediaElement);
			expect(document.createElement('audio')).toBeInstanceOf(HTMLAudioElement);
			expect(document.createElement('video')).toBeInstanceOf(HTMLMediaElement);
			expect(document.createElement('video')).toBeInstanceOf(HTMLVideoElement);

			const audio = new window.Audio();
			expect(audio).toBeInstanceOf(HTMLMediaElement);
			expect(audio).toBeInstanceOf(HTMLAudioElement);
			expect(audio.ownerDocument).toBe(document);
			expect(audio.tagName).toBe('AUDIO');
			expect(audio.localName).toBe('audio');
			expect(audio.namespaceURI).toBe(NamespaceURI.html);

			expect(window['Video']).toBe(undefined);
		});
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLAudioElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLAudioElement]');
		});
	});

	for (const event of [
		'abort',
		'canplay',
		'canplaythrough',
		'durationchange',
		'emptied',
		'ended',
		'error',
		'loadeddata',
		'loadedmetadata',
		'loadstart',
		'pause',
		'play',
		'playing',
		'progress',
		'ratechange',
		'resize',
		'seeked',
		'seeking',
		'stalled',
		'suspend',
		'timeupdate',
		'volumechange',
		'waiting'
	]) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	describe('get buffered()', () => {
		it('Returns TimeRanges object.', () => {
			expect(element.buffered).toBeInstanceOf(TimeRanges);
			expect(element.buffered.length).toBe(0);
		});
	});

	describe('get duration()', () => {
		it('Return NaN by default', () => {
			expect(element.duration).toBe(NaN);
		});
	});

	describe('get error()', () => {
		it('Return null by default', () => {
			expect(element.error).toBeNull();
		});
	});

	describe('get ended()', () => {
		it('Returns false', () => {
			expect(element.ended).toBe(false);
		});
	});

	describe('get networkState()', () => {
		it('Return 0 by default', () => {
			expect(element.networkState).toBe(0);
		});
	});

	describe('get readyState()', () => {
		it('Return 0 by default', () => {
			expect(element.readyState).toBe(0);
		});
	});

	describe('get remote()', () => {
		it('Returns RemotePlayback object.', () => {
			expect(element.remote).toBeInstanceOf(RemotePlayback);
		});
	});

	describe('get seeking()', () => {
		it('Returns false by default', () => {
			expect(element.seeking).toBe(false);
		});
	});

	describe('get seekable()', () => {
		it('Returns TimeRanges object.', () => {
			expect(element.seekable).toBeInstanceOf(TimeRanges);
			expect(element.seekable.length).toBe(0);
		});
	});

	describe('get sinkId()', () => {
		it('Returns empty string by default', () => {
			expect(element.sinkId).toBe('');
		});

		it('Returns set value using setSinkId()', async () => {
			expect(element.setSinkId('sinkId')).resolves.toBeUndefined();
			expect(element.sinkId).toBe('sinkId');
		});
	});

	describe('get played()', () => {
		it('Returns TimeRanges object.', () => {
			expect(element.played).toBeInstanceOf(TimeRanges);
			expect(element.played.length).toBe(0);
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

	describe('get preload()', () => {
		it('Returns the "preload" attribute.', () => {
			element.setAttribute('preload', 'test');
			expect(element.preload).toBe('test');
		});
	});

	describe('set preload()', () => {
		it('Sets the attribute "preload".', () => {
			element.preload = 'test';
			expect(element.getAttribute('preload')).toBe('test');
		});
	});

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});

		it('Dispatches "canplay" event after "src" is set.', () => {
			let dispatchedEvent: Event | null = null;
			element.addEventListener('canplay', (event: Event) => (dispatchedEvent = event));
			element.src = 'https://example.com/media/flower.webm';
			expect((<Event>(<unknown>dispatchedEvent)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatchedEvent)).bubbles).toBe(false);
		});

		it('Does not dispatch "canplay" event when "src" is empty', () => {
			let dispatchedEvent: Event | null = null;
			element.addEventListener('canplay', (event: Event) => (dispatchedEvent = event));
			element.src = '';
			expect(dispatchedEvent).toBeNull();
		});
	});

	describe('get controlsList()', () => {
		it('Returns the "controlslist" attribute.', () => {
			element.setAttribute('controlslist', 'value1 value2');
			expect(element.controlsList).toBeInstanceOf(DOMTokenList);
			expect(element.controlsList.length).toBe(2);
			expect(element.controlsList[0]).toBe('value1');
			expect(element.controlsList[1]).toBe('value2');
		});
	});

	describe('set controlsList()', () => {
		it('Sets the attribute "controlslist".', () => {
			element.controlsList = 'value1 value2';
			expect(element.getAttribute('controlslist')).toBe('value1 value2');
		});
	});

	describe('get mediaKeys()', () => {
		it('Returns null by default', () => {
			expect(element.mediaKeys).toBeNull();
		});

		it('Returns set value using setMediaKeys()', async () => {
			const mediaKeys = {};
			expect(element.setMediaKeys(mediaKeys)).resolves.toBeUndefined();
			expect(element.mediaKeys).toBe(mediaKeys);
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

	describe('get disableRemotePlayback()', () => {
		it('Returns "disableremoteplayback" attribute.', () => {
			element.setAttribute('disableremoteplayback', '');
			expect(element.disableRemotePlayback).toBe(true);
		});
	});

	describe('set disableRemotePlayback()', () => {
		it('Sets "disableremoteplayback" attribute.', () => {
			element.disableRemotePlayback = true;
			expect(element.getAttribute('disableremoteplayback')).toBe('');
		});
	});

	describe('get srcObject()', () => {
		it('Returns null by default', () => {
			expect(element.srcObject).toBeNull();
		});
	});

	describe('set srcObject()', () => {
		it('Sets a MediaStream object', () => {
			const srcObject = new window.MediaStream();
			element.srcObject = srcObject;
			expect(element.srcObject).toBe(srcObject);
		});

		it('Allows to be set to null', () => {
			element.srcObject = new window.MediaStream();
			element.srcObject = null;
			expect(element.srcObject).toBeNull();
		});

		it('Throws an error if the value is not a MediaStream object', () => {
			expect(() => {
				element.srcObject = <MediaStream>{};
			}).toThrowError(
				new TypeError(
					`Failed to set the 'srcObject' property on 'HTMLMediaElement': The provided value is not of type 'MediaStream'.`
				)
			);
		});
	});

	describe('get textTracks()', () => {
		it('Returns an empty TextTrackList object by default.', () => {
			expect(element.textTracks.length).toBe(0);
		});

		it('Returns TextTrack objects.', () => {
			const track1 = element.addTextTrack(TextTrackKindEnum.descriptions, 'Test 1', 'en');
			const track2 = element.addTextTrack(TextTrackKindEnum.chapters, 'Test 2', 'en');

			expect(element.textTracks.length).toBe(2);
			expect(element.textTracks[0]).toBe(track1);
			expect(element.textTracks[1]).toBe(track2);

			track1[PropertySymbol.id] = 'track1';
			expect(element.textTracks.getTrackById('track1')).toBe(track1);

			element.innerHTML = `
                <track id="track1" kind="captions" label="English" srclang="en" src="https://example.com/media/captions_en.vtt">
                <track id="track2" kind="invalid" label="French" srclang="fr" src="https://example.com/media/captions_fr.vtt" default>
            `;

			expect(element.textTracks.length).toBe(4);

			expect(element.textTracks[2].id).toBe('track1');
			expect(element.textTracks[2].kind).toBe('captions');
			expect(element.textTracks[2].label).toBe('English');
			expect(element.textTracks[2].language).toBe('en');

			expect(element.textTracks[3].id).toBe('track2');
			expect(element.textTracks[3].kind).toBe('metadata');
			expect(element.textTracks[3].label).toBe('French');
			expect(element.textTracks[3].language).toBe('fr');
		});
	});

	describe('get currentSrc()', () => {
		it('Returns empty string by default.', () => {
			expect(element.currentSrc).toBe('');
		});

		it('Returns the "src" property when it is set.', () => {
			const src = 'https://example.com/media/flower.webm';
			element.src = src;
			expect(element.currentSrc).toBe(src);
		});

		it('Returns the source of the first <source> element.', () => {
			const div = document.createElement('div');
			div.innerHTML = '<source src="https://example.com/media/flower.webm">';
			element.appendChild(div);
			expect(element.currentSrc).toBe('https://example.com/media/flower.webm');
		});
	});

	describe('get volume()', () => {
		it('Returns default value', () => {
			expect(element.volume).toBe(1);
		});
		it('Returns set volume', () => {
			element.volume = 0.5;
			expect(element.volume).toBe(0.5);
		});
	});

	describe('set volume()', () => {
		it('Sets value', () => {
			element.volume = 0.5;
			expect(element.volume).toBe(0.5);
		});

		it('Sets parse volume as a number', () => {
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

	describe('get crossOrigin()', () => {
		it('Returns null by default', () => {
			expect(element.crossOrigin).toBeNull();
		});

		it('Returns "use-credentials" when set', () => {
			element.setAttribute('crossorigin', 'use-credentials');
			expect(element.crossOrigin).toBe('use-credentials');
		});

		it('Returns "anonymous" for any value that is not "use-credentials"', () => {
			element.setAttribute('crossorigin', 'anonymous');
			expect(element.crossOrigin).toBe('anonymous');
			element.setAttribute('crossorigin', 'invalid');
			expect(element.crossOrigin).toBe('anonymous');
			element.setAttribute('crossorigin', '');
			expect(element.crossOrigin).toBe('anonymous');
			element.removeAttribute('crossorigin');
			expect(element.crossOrigin).toBe(null);
		});
	});

	describe('set crossOrigin()', () => {
		it('Sets "crossorigin" attribute', () => {
			element.crossOrigin = 'any-value';
			expect(element.getAttribute('crossorigin')).toBe('any-value');
		});
	});

	describe('get currentTime()', () => {
		it('Return "0" as default value', () => {
			expect(element.currentTime).toBe(0);
		});

		it('Return set value', () => {
			element.currentTime = 42;
			expect(element.currentTime).toBe(42);
		});
	});

	describe('set currentTime()', () => {
		it('Sets value', () => {
			element.currentTime = 42;
			expect(element.currentTime).toBe(42);
		});

		it('Sets value as a string', () => {
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

	describe('get playbackRate()', () => {
		it('Returns "1" as default value', () => {
			expect(element.playbackRate).toBe(1);
		});

		it('Returns set value', () => {
			element.playbackRate = 2.3;
			expect(element.playbackRate).toBe(2.3);
		});
	});

	describe('set playbackRate()', () => {
		it('Sets value', () => {
			element.playbackRate = 2.3;
			expect(element.playbackRate).toBe(2.3);
		});
		it('Sets value as a string', () => {
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

	describe('get defaultPlaybackRate()', () => {
		it('Return default value', () => {
			expect(element.defaultPlaybackRate).toBe(1);
		});

		it('Returns set value', () => {
			element.defaultPlaybackRate = 2.3;
			expect(element.defaultPlaybackRate).toBe(2.3);
		});
	});

	describe('set defaultPlaybackRate()', () => {
		it('Sets value', () => {
			element.defaultPlaybackRate = 2.3;
			expect(element.defaultPlaybackRate).toBe(2.3);
		});

		it('Sets value as a string', () => {
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

	describe('get preservesPitch()', () => {
		it('Return true by default', () => {
			expect(element.preservesPitch).toBe(true);
		});

		it('Returns set value', () => {
			element.preservesPitch = false;
			expect(element.preservesPitch).toBe(false);
		});
	});

	describe('set preservesPitch()', () => {
		it('Sets value', () => {
			element.preservesPitch = false;
			expect(element.preservesPitch).toBe(false);
			element.preservesPitch = true;
			expect(element.preservesPitch).toBe(true);
		});
		it('Handles invalid values', () => {
			element.preservesPitch = <boolean>(<unknown>null);
			expect(element.preservesPitch).toBe(false);
			element.preservesPitch = true;
			element.preservesPitch = <boolean>(<unknown>undefined);
			expect(element.preservesPitch).toBe(false);
			element.preservesPitch = <boolean>(<unknown>'invalid');
			expect(element.preservesPitch).toBe(true);
		});
	});

	describe('get paused()', () => {
		it('Returns true by default', () => {
			expect(element.paused).toBe(true);
		});

		it('Returns false when playing', () => {
			element.play();
			expect(element.paused).toBe(false);
			element.pause();
			expect(element.paused).toBe(true);
		});
	});

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('video');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('video');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('video');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('video');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
		});
	});

	describe('addTextTrack()', () => {
		it('Throws an error if no arguments are provided', () => {
			expect(() => {
				// @ts-ignore
				element.addTextTrack();
			}).toThrowError(
				new TypeError(
					`Failed to execute 'addTextTrack' on 'HTMLMediaElement': 1 argument required, but only 0 present.`
				)
			);
		});

		it('Throws an error if the first argument is not a valid enum value of type TextTrackKind', () => {
			expect(() => {
				// @ts-ignore
				element.addTextTrack('invalid');
			}).toThrowError(
				new TypeError(
					`Failed to execute 'addTextTrack' on 'HTMLMediaElement': The provided value 'invalid' is not a valid enum value of type TextTrackKind.`
				)
			);
		});

		it('Returns a TextTrack object', () => {
			const track = element.addTextTrack(TextTrackKindEnum.subtitles, 'Test', 'en');
			expect(track).toBeInstanceOf(TextTrack);
			expect(track.kind).toBe(TextTrackKindEnum.subtitles);
			expect(track.label).toBe('Test');
			expect(track.language).toBe('en');
		});

		it('Adds TextTrack object to "textTracks" property', () => {
			const track = element.addTextTrack(TextTrackKindEnum.subtitles, 'Test', 'en');
			expect(element.textTracks[0]).toBe(track);
		});
	});

	describe('pause()', () => {
		it('Dispatches "pause" event', () => {
			element.play();
			let dispatchedEvent: Event | null = null;
			element.addEventListener('pause', (event: Event) => (dispatchedEvent = event));
			element.pause();
			expect((<Event>(<unknown>dispatchedEvent)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatchedEvent)).bubbles).toBe(false);
		});

		it('Does not dispatch "pause" event when already paused', () => {
			element.play();
			element.pause();
			let dispatchedEvent: Event | null = null;
			element.addEventListener('pause', (event: Event) => (dispatchedEvent = event));
			element.pause();
			expect(dispatchedEvent).toBeNull();
		});

		it('It sets the paused property to true', () => {
			element.play();
			expect(element.paused).toBe(false);
			element.pause();
			expect(element.paused).toBe(true);
		});
	});

	describe('play()', () => {
		it('Dispatches "play" event', () => {
			let dispatchedEvent: Event | null = null;
			element.addEventListener('play', (event: Event) => (dispatchedEvent = event));
			element.play();
			expect((<Event>(<unknown>dispatchedEvent)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatchedEvent)).bubbles).toBe(false);
		});

		it('Dispatches "playing" event', () => {
			let dispatchedEvent: Event | null = null;
			element.addEventListener('playing', (event: Event) => (dispatchedEvent = event));
			element.play();
			expect((<Event>(<unknown>dispatchedEvent)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatchedEvent)).bubbles).toBe(false);
		});

		it('Does not dispatch "play" event when already playing', () => {
			element.play();
			let dispatchedEvent: Event | null = null;
			element.addEventListener('play', (event: Event) => (dispatchedEvent = event));
			element.play();
			expect(dispatchedEvent).toBeNull();
		});

		it('It sets the paused property to false', () => {
			element.play();
			expect(element.paused).toBe(false);
			element.pause();
			expect(element.paused).toBe(true);
		});
	});

	describe('canPlayType()', () => {
		it('Returns empty string', () => {
			expect(element.canPlayType('notValidMIMEtype')).toBe('');
		});
	});

	describe('fastSeek()', () => {
		it('Does nothing as it is not implemented', () => {
			element.fastSeek(0);
		});
	});

	describe('load()', () => {
		it('Dispatches "emptied" event', () => {
			let dispatchedEvent: Event | null = null;
			element.addEventListener('emptied', (event: Event) => (dispatchedEvent = event));

			element.load();

			expect((<Event>(<unknown>dispatchedEvent)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatchedEvent)).bubbles).toBe(false);
		});
	});

	describe('setMediaKeys()', () => {
		it('Returns a promise', () => {
			expect(element.setMediaKeys({})).resolves.toBeUndefined();
		});

		it('Sets the mediaKeys property', async () => {
			const mediaKeys = {};
			await element.setMediaKeys(mediaKeys);
			expect(element.mediaKeys).toBe(mediaKeys);
		});
	});

	describe('setSinkId()', () => {
		it('Returns a promise', () => {
			expect(element.setSinkId('sinkId')).resolves.toBeUndefined();
		});

		it('Sets the sinkId property', async () => {
			await element.setSinkId('sinkId');
			expect(element.sinkId).toBe('sinkId');
		});
	});

	describe('captureStream()', () => {
		it('Returns a MediaStream object', () => {
			expect(element.captureStream()).toBeInstanceOf(MediaStream);
		});
	});
});
