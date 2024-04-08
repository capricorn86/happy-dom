import { describe, it, expect } from 'vitest';
import MediaStreamTrack from '../../../src/nodes/html-canvas-element/MediaStreamTrack.js';
import MediaStream from '../../../src/nodes/html-canvas-element/MediaStream.js';

describe('MediaStream', () => {
	describe('constructor()', () => {
		it('Supports another MediaStream as argument', () => {
			const track = new MediaStreamTrack({ kind: 'video' });
			const stream = new MediaStream();
			stream.addTrack(track);
			const newStream = new MediaStream(stream);
			expect(newStream).toBeInstanceOf(MediaStream);
			expect(newStream.getVideoTracks()).toEqual([track]);
		});

		it('Supports an array of MediaStreamTrack as argument', () => {
			const track1 = new MediaStreamTrack({ kind: 'video' });
			const track2 = new MediaStreamTrack({ kind: 'video' });
			const newStream = new MediaStream([track1, track2]);
			expect(newStream).toBeInstanceOf(MediaStream);
			expect(newStream.getVideoTracks()).toEqual([track1, track2]);
		});
	});

	describe('addTrack()', () => {
		it('Adds a track.', () => {
			const stream = new MediaStream();
			const track = new MediaStreamTrack({ kind: 'audio' });
			stream.addTrack(track);
			expect(stream.getAudioTracks()).toEqual([track]);
		});

		it('Does not add the same track twice.', () => {
			const stream = new MediaStream();
			const track = new MediaStreamTrack({ kind: 'video' });
			stream.addTrack(track);
			stream.addTrack(track);
			expect(stream.getVideoTracks()).toEqual([track]);
		});
	});

	describe('clone()', () => {
		it('Returns a clone.', () => {
			const track = new MediaStreamTrack({ kind: 'video' });
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
			const audioTrack1 = new MediaStreamTrack({ kind: 'audio' });
			const audioTrack2 = new MediaStreamTrack({ kind: 'audio' });
			const videoTrack = new MediaStreamTrack({ kind: 'video' });
			stream.addTrack(audioTrack1);
			stream.addTrack(audioTrack2);
			stream.addTrack(videoTrack);
			expect(stream.getAudioTracks()).toEqual([audioTrack1, audioTrack2]);
		});
	});

	describe('getTrackById()', () => {
		it('Returns track by id.', () => {
			const stream = new MediaStream();
			const track1 = new MediaStreamTrack({ kind: 'audio' });
			const track2 = new MediaStreamTrack({ kind: 'audio' });
			const track3 = new MediaStreamTrack({ kind: 'video' });
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
			const audioTrack = new MediaStreamTrack({ kind: 'audio' });
			const videoTrack1 = new MediaStreamTrack({ kind: 'video' });
			const videoTrack2 = new MediaStreamTrack({ kind: 'video' });
			stream.addTrack(audioTrack);
			stream.addTrack(videoTrack1);
			stream.addTrack(videoTrack2);
			expect(stream.getVideoTracks()).toEqual([videoTrack1, videoTrack2]);
		});
	});

	describe('removeTrack()', () => {
		it('Removes a track.', () => {
			const stream = new MediaStream();
			const track = new MediaStreamTrack({ kind: 'audio' });
			stream.addTrack(track);
			stream.removeTrack(track);
			expect(stream.getAudioTracks()).toEqual([]);
		});
	});
});
