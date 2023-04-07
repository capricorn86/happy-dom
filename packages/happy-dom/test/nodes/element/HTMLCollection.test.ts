import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';

describe('HTMLCollection', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('item()', () => {
		it('Returns node at index.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			document.body.appendChild(div);
			document.body.appendChild(span);
			expect(document.body.children[0] === div).toBe(true);
			expect(document.body.children[1] === span).toBe(true);
			expect(document.body.children.item(0) === div).toBe(true);
			expect(document.body.children.item(1) === span).toBe(true);
		});
	});

	describe('namedItem()', () => {
		it('Returns named items.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			const div4 = document.createElement('div');
			const div5 = document.createElement('div');

			div1.id = 'div1';
			div2.setAttribute('name', 'div2');

			document.body.appendChild(div1);
			document.body.appendChild(div2);
			document.body.appendChild(div3);
			document.body.appendChild(div4);
			document.body.appendChild(div5);

			div3.id = 'div3';
			div4.id = 'div3';
			div5.setAttribute('name', 'div3');

			expect(document.body.children['div1'] === div1).toBe(true);
			expect(document.body.children['div2'] === div2).toBe(true);
			expect(document.body.children['div3'] === div3).toBe(true);
			expect(document.body.children.namedItem('div1') === div1).toBe(true);
			expect(document.body.children.namedItem('div2') === div2).toBe(true);
			expect(document.body.children.namedItem('div3') === div3).toBe(true);

			document.body.removeChild(div3);
			document.body.removeChild(div4);

			expect(document.body.children['div1'] === div1).toBe(true);
			expect(document.body.children['div2'] === div2).toBe(true);
			expect(document.body.children['div3'] === div5).toBe(true);
			expect(document.body.children.namedItem('div1') === div1).toBe(true);
			expect(document.body.children.namedItem('div2') === div2).toBe(true);
			expect(document.body.children.namedItem('div3') === div5).toBe(true);

			div5.id = 'div5';

			expect(document.body.children.namedItem('div3') === div5).toBe(true);
			expect(document.body.children.namedItem('div5') === div5).toBe(true);

			div5.removeAttribute('name');

			expect(document.body.children.namedItem('div3') === null).toBe(true);
			expect(document.body.children.namedItem('div5') === div5).toBe(true);
		});

		it('Supports attributes only consisting of numbers.', () => {
			const div = document.createElement('div');
			div.innerHTML = `<div name="1" class="container"></div>`;
			const container = div.children[0];
			expect(div.children.length).toBe(1);
			expect(div.children[0]).toBe(container.children[0]);
			expect(div.children[1]).toBe(undefined);
			expect(div.children.namedItem('1')).toBe(container.children[0]);
		});
	});
});
