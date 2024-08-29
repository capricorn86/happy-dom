import HTMLTrackElement from '../../../src/nodes/html-track-element/HTMLTrackElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import TextTrackKindEnum from '../../../src/nodes/html-media-element/TextTrackKindEnum.js';

describe('HTMLTrackElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTrackElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('track');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTrackElement', () => {
			expect(element instanceof HTMLTrackElement).toBe(true);
		});
	});

	describe('get kind()', () => {
		it('Should return "subtitles" by default', () => {
			expect(element.kind).toBe('subtitles');
		});

		it('Returns the "kind" attribute', () => {
			element.setAttribute('kind', 'subtitles');
			expect(element.kind).toBe('subtitles');
		});

		it('Returns "metadata" if the "kind" attribute is invalid', () => {
			element.setAttribute('kind', 'invalid');
			expect(element.kind).toBe('metadata');
		});
	});

	describe('set kind()', () => {
		it('Sets the "kind" attribute', () => {
			element.kind = 'subtitles';
			expect(element.getAttribute('kind')).toBe('subtitles');
		});

		it('Sets "metadata" if the value is invalid', () => {
			element.kind = 'invalid';
			expect(element.getAttribute('kind')).toBe('metadata');
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
	});

	describe('get srclang()', () => {
		it('Returns an empty string by default.', () => {
			expect(element.srclang).toBe('');
		});

		it('Returns the "srclang" attribute.', () => {
			element.setAttribute('srclang', 'test');
			expect(element.srclang).toBe('test');
		});
	});

	describe('set srclang()', () => {
		it('Sets the "srclang" attribute.', () => {
			element.srclang = 'test';
			expect(element.getAttribute('srclang')).toBe('test');
		});
	});

	describe('get label()', () => {
		it('Returns an empty string by default.', () => {
			expect(element.label).toBe('');
		});

		it('Returns the "label" attribute.', () => {
			element.setAttribute('label', 'test');
			expect(element.label).toBe('test');
		});
	});

	describe('set label()', () => {
		it('Sets the "label" attribute.', () => {
			element.label = 'test';
			expect(element.getAttribute('label')).toBe('test');
		});
	});

	describe('get default()', () => {
		it('Returns false by default.', () => {
			expect(element.default).toBe(false);
		});

		it('Returns true if the attribute is present.', () => {
			element.setAttribute('default', '');
			expect(element.default).toBe(true);
		});
	});

	describe('set default()', () => {
		it('Sets the "default" attribute.', () => {
			element.default = true;
			expect(element.getAttribute('default')).toBe('');
		});
	});

	describe('get readyState()', () => {
		it('Returns "0".', () => {
			expect(element.readyState).toBe(0);
		});
	});

	describe('get track()', () => {
		it('Returns a TextTrack with default values.', () => {
			const track = element.track;

			expect(track.kind).toBe('subtitles');
			expect(track.label).toBe('');
			expect(track.language).toBe('');
			expect(track.id).toBe('');
			expect(track.mode).toBe('disabled');
		});

		it('Returns a TextTrack object.', () => {
			element.kind = TextTrackKindEnum.chapters;
			element.label = 'testLabel';
			element.srclang = 'testLanguage';
			element.id = 'testID';
			element.default = true;

			const track = element.track;

			expect(track.kind).toBe('chapters');
			expect(track.label).toBe('testLabel');
			expect(track.language).toBe('testLanguage');
			expect(track.id).toBe('testID');
			expect(track.mode).toBe('showing');
		});
	});
});
