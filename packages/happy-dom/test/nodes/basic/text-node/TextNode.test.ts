import Window from '../../../../src/window/Window';

describe('TextNode', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get nodeName()', () => {
		test('Returns "#text".', () => {
			const node = document.createTextNode('test');
			expect(node.nodeName).toBe('#text');
		});
	});

	describe('get textContent()', () => {
		test('Returns text content.', () => {
			const node = document.createTextNode('test');
			expect(node.textContent).toBe('test');
		});
	});

	describe('set textContent()', () => {
		test('Sets text content.', () => {
			const node = document.createTextNode('test');
			node.textContent = 'new text';
			expect(node.textContent).toBe('new text');
		});
	});

	describe('get nodeValue()', () => {
		test('Returns text content.', () => {
			const node = document.createTextNode('test');
			expect(node.nodeValue).toBe('test');
		});
	});

	describe('set nodeValue()', () => {
		test('Sets text content.', () => {
			const node = document.createTextNode('test');
			node.nodeValue = 'new text';
			expect(node.nodeValue).toBe('new text');
		});
	});

	describe('get data()', () => {
		test('Returns text content.', () => {
			const node = document.createTextNode('test');
			expect(node.data).toBe('test');
		});
	});

	describe('set data()', () => {
		test('Sets text content.', () => {
			const node = document.createTextNode('test');
			node.data = 'new text';
			expect(node.data).toBe('new text');
		});
	});

	describe('toString()', () => {
		test('Returns "[object Text]".', () => {
			const node = document.createTextNode('test');
			expect(node.toString()).toBe('[object Text]');
		});
	});
});
