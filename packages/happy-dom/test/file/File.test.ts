import File from '../../src/file/File';

const NOW = 1;

describe('File', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get name()', () => {
		it('Returns the name of the File.', () => {
			const file = new File(['TEST'], 'filename.jpg');
			expect(file.name).toBe('filename.jpg');
		});
	});

	describe('get lastModified()', () => {
		it('Returns the current time if not provided to the constructor.', () => {
			jest.spyOn(Date, 'now').mockImplementation(() => NOW);
			const file = new File(['TEST'], 'filename.jpg');
			expect(file.lastModified).toBe(NOW);
		});

		it('Returns the current time if not provided to the constructor.', () => {
			const file = new File(['TEST'], 'filename.jpg', { lastModified: NOW });
			expect(file.lastModified).toBe(NOW);
		});
	});
});
