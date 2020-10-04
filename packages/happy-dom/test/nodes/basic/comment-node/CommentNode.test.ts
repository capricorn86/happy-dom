import Window from '../../../../src/window/Window';

describe('CommentNode', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get nodeName()', () => {
		test('Returns "#comment".', () => {
			const node = document.createComment('test');
			expect(node.nodeName).toBe('#comment');
		});
	});

	describe('get textContent()', () => {
		test('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.textContent).toBe('test');
		});
	});

	describe('set textContent()', () => {
		test('Sets text content.', () => {
			const node = document.createComment('test');
			node.textContent = 'new text';
			expect(node.textContent).toBe('new text');
		});
	});

	describe('get nodeValue()', () => {
		test('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.nodeValue).toBe('test');
		});
	});

	describe('set nodeValue()', () => {
		test('Sets text content.', () => {
			const node = document.createComment('test');
			node.nodeValue = 'new text';
			expect(node.nodeValue).toBe('new text');
		});
	});

	describe('get data()', () => {
		test('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.data).toBe('test');
		});
	});

	describe('set data()', () => {
		test('Sets text content.', () => {
			const node = document.createComment('test');
			node.data = 'new text';
			expect(node.data).toBe('new text');
		});
	});

	describe('toString()', () => {
		test('Returns "[object Comment]".', () => {
			const node = document.createComment('test');
			expect(node.toString()).toBe('[object Comment]');
		});
	});
});
