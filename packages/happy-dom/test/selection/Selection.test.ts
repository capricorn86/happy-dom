import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import Selection from '../../src/selection/Selection';

describe('Selection', () => {
	let window: IWindow;
	let document: IDocument;
	let selection: Selection;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		selection = new Selection(document);
	});

	describe('get rangeCount()', () => {
		it('Returns number of Ranges.', () => {
			const range = document.createRange();
			expect(selection.rangeCount).toBe(0);
			selection.addRange(range);
			expect(selection.rangeCount).toBe(1);
		});
	});

	describe('get anchorNode()', () => {
		xit('Returns "null".', () => {
			expect(selection.anchorNode).toBe(null);
		});
	});

	describe('get anchorOffset()', () => {
		xit('Returns "0".', () => {
			expect(selection.anchorOffset).toBe(0);
		});
	});

	describe('get baseNode()', () => {
		xit('Returns "null".', () => {
			expect(selection.baseNode).toBe(null);
		});
	});

	describe('get baseOffset()', () => {
		xit('Returns "0".', () => {
			expect(selection.baseOffset).toBe(0);
		});
	});

	describe('get extentNode()', () => {
		xit('Returns "null".', () => {
			expect(selection.extentNode).toBe(null);
		});
	});

	describe('get extentOffset()', () => {
		xit('Returns "0".', () => {
			expect(selection.extentOffset).toBe(0);
		});
	});

	describe('get focusNode()', () => {
		xit('Returns "null".', () => {
			expect(selection.focusNode).toBe(null);
		});
	});

	describe('get focusOffset()', () => {
		xit('Returns "0".', () => {
			expect(selection.focusOffset).toBe(0);
		});
	});

	describe('get isCollapsed()', () => {
		xit('Returns "true".', () => {
			expect(selection.isCollapsed).toBe(true);
		});
	});

	describe('get type()', () => {
		xit('Returns "None".', () => {
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
			xit('Method exists.', () => {
				expect(typeof selection[methodName]).toBe('function');
			});
		});
	}
});
