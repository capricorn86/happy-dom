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
			div.innerHTML = `<div name="container1" class="container1"></div><div name="container2" class="container2"></div><div name="0" class="container3"></div><div name="1" class="container4"></div>`;
			const container1 = div.querySelector('.container1');
			const container2 = div.querySelector('.container2');
			const container3 = div.querySelector('.container3');
			const container4 = div.querySelector('.container4');

			expect(div.children.length).toBe(4);
			expect(div.children[0] === container1).toBe(true);
			expect(div.children[1] === container2).toBe(true);
			expect(div.children[2] === container3).toBe(true);
			expect(div.children[3] === container4).toBe(true);
			expect(div.children.namedItem('container1') === container1).toBe(true);
			expect(div.children.namedItem('container2') === container2).toBe(true);
			expect(div.children.namedItem('0') === container3).toBe(true);
			expect(div.children.namedItem('1') === container4).toBe(true);

			container3.remove();

			expect(div.children.length).toBe(3);
			expect(div.children[0] === container1).toBe(true);
			expect(div.children[1] === container2).toBe(true);
			expect(div.children[2] === container4).toBe(true);
			expect(div.children.namedItem('container1') === container1).toBe(true);
			expect(div.children.namedItem('container2') === container2).toBe(true);
			expect(div.children.namedItem('0') === null).toBe(true);
			expect(div.children.namedItem('1') === container4).toBe(true);

			div.insertBefore(container3, container4);

			expect(div.children.length).toBe(4);
			expect(div.children[0] === container1).toBe(true);
			expect(div.children[1] === container2).toBe(true);
			expect(div.children[2] === container3).toBe(true);
			expect(div.children[3] === container4).toBe(true);
			expect(div.children.namedItem('container1') === container1).toBe(true);
			expect(div.children.namedItem('container2') === container2).toBe(true);
			expect(div.children.namedItem('0') === container3).toBe(true);
			expect(div.children.namedItem('1') === container4).toBe(true);
		});

		it('Supports attributes that has the same name as properties and methods of the HTMLCollection class.', () => {
			const div = document.createElement('div');
			div.innerHTML = `<div name="length" class="container1"></div><div name="namedItem" class="container2"></div><div name="push" class="container3"></div>`;
			const container1 = div.querySelector('.container1');
			const container2 = div.querySelector('.container2');
			const container3 = div.querySelector('.container3');

			expect(div.children.length).toBe(3);
			expect(div.children[0] === container1).toBe(true);
			expect(div.children[1] === container2).toBe(true);
			expect(div.children[2] === container3).toBe(true);
			expect(div.children.namedItem('length') === container1).toBe(true);
			expect(div.children.namedItem('namedItem') === container2).toBe(true);
			expect(div.children.namedItem('push') === container3).toBe(true);

			expect(typeof div.children['namedItem']).toBe('function');
			expect(typeof div.children['push']).toBe('function');

			container2.remove();

			expect(div.children.length).toBe(2);
			expect(div.children[0] === container1).toBe(true);
			expect(div.children[1] === container3).toBe(true);
			expect(div.children.namedItem('length') === container1).toBe(true);
			expect(div.children.namedItem('push') === container3).toBe(true);

			div.insertBefore(container2, container3);

			expect(div.children.length).toBe(3);
			expect(div.children[0] === container1).toBe(true);
			expect(div.children[1] === container2).toBe(true);
			expect(div.children[2] === container3).toBe(true);
			expect(div.children.namedItem('length') === container1).toBe(true);
			expect(div.children.namedItem('namedItem') === container2).toBe(true);
			expect(div.children.namedItem('push') === container3).toBe(true);

			expect(typeof div.children['namedItem']).toBe('function');
			expect(typeof div.children['push']).toBe('function');
		});
	});
});
