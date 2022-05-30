import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import Range from '../../src/range/Range';

describe('Range', () => {
	let window: IWindow;
	let document: IDocument;
	let range: Range;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		range = document.createRange();
	});

	describe('get collapsed()', () => {
		it('Returns true when start and end container are the same and has the same offset.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;
			range.setStart(container, 0);
			range.setEnd(container, 0);

			expect(range.collapsed).toBe(true);
		});

		it('Returns false when start and end container are the same, but does not have the same offset.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;
			range.setStart(container, 0);
			range.setEnd(container, 1);

			expect(range.collapsed).toBe(false);
		});

		it('Returns false when start and end container are not the same, but have the same offset.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;
			range.setStart(container, 0);
			range.setEnd(container.children[0], 0);

			expect(range.collapsed).toBe(false);
		});
	});

	describe('get commonAncestorContainer()', () => {
		it('Returns ancestor parent container when end container is set to a child of start container.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;

			range.setStart(container, 0);
			range.setEnd(container.children[0], 0);

			expect(range.commonAncestorContainer === container).toBe(true);
		});

		it('Returns ancestor parent container when start and end container are the same.', () => {
			const container = document.createElement('div');

			range.setStart(container, 0);
			range.setEnd(container, 0);

			expect(range.commonAncestorContainer === container).toBe(true);
		});

		it('Returns end container when start and end container does not have a common ancestor.', () => {
			const container = document.createElement('div');
			const container2 = document.createElement('div');

			range.setStart(container, 0);
			range.setEnd(container2, 0);

			expect(range.commonAncestorContainer === container2).toBe(true);
		});

		it('Returns common parent container.', () => {
			const container = document.createElement('div');
			const span = document.createElement('span');
			const span2 = document.createElement('span');

			container.appendChild(span);
			container.appendChild(span2);

			range.setStart(span, 0);
			range.setEnd(span2, 0);

			expect(range.commonAncestorContainer === container).toBe(true);
		});

		it('Returns body when it is the common parent container.', () => {
			const span = document.createElement('span');
			const span2 = document.createElement('span');

			document.body.appendChild(span);
			document.body.appendChild(span2);

			range.setStart(span, 0);
			range.setEnd(span2, 0);

			expect(range.commonAncestorContainer === document.body).toBe(true);
		});
	});

	describe('collapse()', () => {
		it('Collapses the Range to the end container by default.', () => {
			const container = document.createElement('div');

			container.innerHTML = `Hello <u>world</u>!`;

			range.setStart(container, 2);
			range.setEnd(container.children[0], 1);

			range.collapse();

			expect(range.startContainer === container.children[0]).toBe(true);
			expect(range.endContainer === container.children[0]).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(1);
			expect(range.collapsed).toBe(true);
		});

		it('Collapses the Range to the end container, even though the toStart parameter is set to true, when the end container is a child of the start container.', () => {
			const container = document.createElement('div');

			container.innerHTML = `Hello <u>world</u>!`;

			range.setStart(container, 2);
			range.setEnd(container.children[0], 1);

			range.collapse(true);

			expect(range.startContainer === container.children[0]).toBe(true);
			expect(range.endContainer === container.children[0]).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(1);
			expect(range.collapsed).toBe(true);
		});

		it('Collapses the Range to the start container if the toStart parameter is set to true.', () => {
			const container = document.createElement('div');
			const span = document.createElement('span');
			const span2 = document.createElement('span');

			span.textContent = 'hello';
			span2.textContent = 'world';

			container.appendChild(span);
			container.appendChild(span2);

			range.setStart(span.childNodes[0], 1);
			range.setEnd(span2.childNodes[0], 2);

			range.collapse(true);

			expect(range.startContainer === span.childNodes[0]).toBe(true);
			expect(range.endContainer === span.childNodes[0]).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(1);
			expect(range.collapsed).toBe(true);
		});
	});

	describe('compareBoundaryPoints()', () => {
		it('Returns -1 when pointB is after pointA and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();

			document.body.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.selectNode(document.body.children[0]);
			sourceRange.selectNode(document.body.children[1]);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(-1);
		});

		it('Returns 1 when pointA is after pointB and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();

			document.body.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`.trim();

			range.selectNode(document.body.children[1]);
			sourceRange.selectNode(document.body.children[0]);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(1);
		});

		it('Returns 1 when pointA is the same as pointB and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();

			document.body.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`.trim();

			range.selectNode(document.body.children[0]);
			sourceRange.selectNode(document.body.children[0]);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(1);
		});
	});
});
