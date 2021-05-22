import Storage from '../../src/storage/Storage';

describe('Storage', () => {
	let storage: Storage;

	beforeEach(() => {
		storage = new Storage();
	});

	describe('get length()', () => {
		it('Returns length.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.length).toBe(2);
			storage.setItem('key3', 'value3');
			expect(storage.length).toBe(3);
		});
	});

	describe('key()', () => {
		it('Returns name of the nth name.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.key(0)).toBe('key1');
			expect(storage.key(1)).toBe('key2');
			expect(storage.key(2)).toBe(null);
		});
	});

	describe('getItem()', () => {
		it('Returns item.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
		});
	});

	describe('setItem()', () => {
		it('Returns item.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe('value2');
		});
	});

	describe('removeItem()', () => {
		it('Removes an item.', () => {
			storage.setItem('key1', 'value1');
			storage.setItem('key2', 'value2');
			storage.removeItem('key2');
			expect(storage.length).toBe(1);
			expect(storage.getItem('key1')).toBe('value1');
			expect(storage.getItem('key2')).toBe(null);
		});
	});
});
