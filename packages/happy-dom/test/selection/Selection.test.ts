import Selection from '../../src/selection/Selection';

describe('History', () => {
	let selection: Selection;

	beforeEach(() => {
		selection = new Selection();
	});

	describe('get anchorNode()', () => {
		it('Returns "null".', () => {
			expect(selection.anchorNode).toBe(null);
		});
	});

	describe('get anchorOffset()', () => {
		it('Returns "0".', () => {
			expect(selection.anchorOffset).toBe(0);
		});
	});

	describe('get baseNode()', () => {
		it('Returns "null".', () => {
			expect(selection.baseNode).toBe(null);
		});
	});

	describe('get baseOffset()', () => {
		it('Returns "0".', () => {
			expect(selection.baseOffset).toBe(0);
		});
	});

	describe('get extentNode()', () => {
		it('Returns "null".', () => {
			expect(selection.extentNode).toBe(null);
		});
	});

	describe('get extentOffset()', () => {
		it('Returns "0".', () => {
			expect(selection.extentOffset).toBe(0);
		});
	});

	describe('get focusNode()', () => {
		it('Returns "null".', () => {
			expect(selection.focusNode).toBe(null);
		});
	});

	describe('get focusOffset()', () => {
		it('Returns "0".', () => {
			expect(selection.focusOffset).toBe(0);
		});
	});

	describe('get isCollapsed()', () => {
		it('Returns "true".', () => {
			expect(selection.isCollapsed).toBe(true);
		});
	});

	describe('get rangeCount()', () => {
		it('Returns "0".', () => {
			expect(selection.rangeCount).toBe(0);
		});
	});

	describe('get type()', () => {
		it('Returns "None".', () => {
			expect(selection.type).toBe('None');
		});
	});

	for (const methodName of [
		'addRange',
		'collapse',
		'collapseToEnd',
		'collapseToStart',
		'containsNode',
		'deleteFromDocument',
		'extend',
		'getRangeAt',
		'removeRange',
		'removeAllRanges',
		'selectAllChildren',
		'setBaseAndExtent',
		'toString'
	]) {
		describe(`${methodName}()`, () => {
			it('Method exists.', () => {
				expect(typeof selection[methodName]).toBe('function');
			});
		});
	}
});
