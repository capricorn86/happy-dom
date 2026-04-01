import File from '../../src/file/File.js';
import { afterEach, describe, it, expect, vi } from 'vitest';

const NOW = 1;

describe('File', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get name()', () => {
		it('Returns the name of the File.', () => {
			const file = new File(['TEST'], 'filename.jpg');
			expect(file.name).toBe('filename.jpg');
		});
	});

	describe('get lastModified()', () => {
		it('Returns the current time if not provided to the constructor.', () => {
			vi.spyOn(Date, 'now').mockImplementation(() => NOW);
			const file = new File(['TEST'], 'filename.jpg');
			expect(file.lastModified).toBe(NOW);
		});

		it('Returns the current time if not provided to the constructor.', () => {
			const file = new File(['TEST'], 'filename.jpg', { lastModified: NOW });
			expect(file.lastModified).toBe(NOW);
		});
	});

	describe('get webkitRelativePath()', () => {
		it('Returns an empty string by default.', () => {
			const file = new File(['TEST'], 'filename.jpg');
			expect(file.webkitRelativePath).toBe('');
		});
	});
});
