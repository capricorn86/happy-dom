import { describe, it, expect } from 'vitest';
import MediaStreamTrack from '../../../src/nodes/html-media-element/MediaStreamTrack.js';
import MediaStream from '../../../src/nodes/html-media-element/MediaStream.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('MediaStream', () => {
	describe('constructor()', () => {
		it('Supports another MediaStream as argument', () => {
			const track = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			const stream = new MediaStream();
			stream.addTrack(track);
			const newStream = new MediaStream(stream);
			expect(newStream).toBeInstanceOf(MediaStream);
			expect(newStream.getVideoTracks()).toEqual([track]);
		});

		it('Supports an array of MediaStreamTrack as argument', () => {
			const track1 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const track2 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track1[PropertySymbol.kind] = 'video';
			track2[PropertySymbol.kind] = 'video';
			const newStream = new MediaStream([track1, track2]);
			expect(newStream).toBeInstanceOf(MediaStream);
			expect(newStream.getVideoTracks()).toEqual([track1, track2]);
		});
	});

	describe('addTrack()', () => {
		it('Adds a track.', () => {
			const stream = new MediaStream();
			const track = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'audio';
			stream.addTrack(track);
			expect(stream.getAudioTracks()).toEqual([track]);
		});

		it('Does not add the same track twice.', () => {
			const stream = new MediaStream();
			const track = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			stream.addTrack(track);
			stream.addTrack(track);
			expect(stream.getVideoTracks()).toEqual([track]);
		});
	});

	describe('clone()', () => {
		it('Returns a clone.', () => {
			const track = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			const stream = new MediaStream();
			stream.addTrack(track);
			const clone = stream.clone();
			expect(clone).toBeInstanceOf(MediaStream);
			expect(clone.getVideoTracks()).toEqual([track]);
		});
	});

	describe('getAudioTracks()', () => {
		it('Returns audio tracks.', () => {
			const stream = new MediaStream();
			const audioTrack1 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const audioTrack2 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const videoTrack = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			audioTrack1[PropertySymbol.kind] = 'audio';
			audioTrack2[PropertySymbol.kind] = 'audio';
			videoTrack[PropertySymbol.kind] = 'video';
			stream.addTrack(audioTrack1);
			stream.addTrack(audioTrack2);
			stream.addTrack(videoTrack);
			expect(stream.getAudioTracks()).toEqual([audioTrack1, audioTrack2]);
		});
	});

	describe('getTrackById()', () => {
		it('Returns track by id.', () => {
			const stream = new MediaStream();
			const track1 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const track2 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const track3 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track1[PropertySymbol.kind] = 'audio';
			track2[PropertySymbol.kind] = 'audio';
			track3[PropertySymbol.kind] = 'video';
			stream.addTrack(track1);
			stream.addTrack(track2);
			stream.addTrack(track3);
			expect(stream.getTrackById(track1.id)).toBe(track1);
			expect(stream.getTrackById(track2.id)).toBe(track2);
			expect(stream.getTrackById(track3.id)).toBe(track3);
		});
	});

	describe('getVideoTracks()', () => {
		it('Returns video tracks.', () => {
			const stream = new MediaStream();
			const audioTrack = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const videoTrack1 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			const videoTrack2 = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			audioTrack[PropertySymbol.kind] = 'audio';
			videoTrack1[PropertySymbol.kind] = 'video';
			videoTrack2[PropertySymbol.kind] = 'video';
			stream.addTrack(audioTrack);
			stream.addTrack(videoTrack1);
			stream.addTrack(videoTrack2);
			expect(stream.getVideoTracks()).toEqual([videoTrack1, videoTrack2]);
		});
	});

	describe('removeTrack()', () => {
		it('Removes a track.', () => {
			const stream = new MediaStream();
			const track = new MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'audio';
			stream.addTrack(track);
			stream.removeTrack(track);
			expect(stream.getAudioTracks()).toEqual([]);
		});
	});
});
