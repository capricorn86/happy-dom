import Blob from '../../src/file/Blob';

describe('Blob', () => {
	describe('get size()', () => {
		test('Returns the correct size when bits is an Array of strings.', () => {
			const blob = new Blob(['TEST']);
			expect(blob.size).toBe(4);
		});
	});

	describe('get type()', () => {
		test('Returns the type sent into the constructor.', () => {
			const blob = new Blob(['TEST'], { type: 'TYPE' });
			expect(blob.type).toBe('type');
		});
	});

	describe('slice()', () => {
		test('Returns a slice of the data when bits is an Array of strings.', () => {
			const blob = new Blob(['TEST']);
			expect(blob.slice(1, 2)._buffer.toString()).toBe('E');
		});
	});

	describe('toString()', () => {
		test('Returns "[object Blob]".', () => {
			const blob = new Blob(['TEST']);
			expect(blob.toString()).toBe('[object Blob]');
		});
	});
});
