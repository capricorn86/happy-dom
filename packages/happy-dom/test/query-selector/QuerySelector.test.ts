import IHTMLElement from '../../src/nodes/html-element/IHTMLElement';
import Window from '../../src/window/Window';
import QuerySelectorHTML from './data/QuerySelectorHTML';
import QuerySelectorNthChildHTML from './data/QuerySelectorNthChildHTML';

describe('QuerySelector', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('querySelectorAll', () => {
		test('Returns all span elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns a NodeList with the method item().', () => {
			const container = <IHTMLElement>document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span');
			expect(elements.item(0)).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all h1 (heading 1) elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('h1');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[0]);
			expect(elements[1]).toBe(container.children[1].children[0]);
		});

		test('Returns all elements with class name "class1".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1');
			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with class name "class1 class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1.class2');
			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements matching ".class1 > .class1 > *".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1 > .class1 > *');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements matching "div > div > span".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('div > div > span');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements matching "div > div > .class1.class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('div > div > .class1.class2');
			expect(elements.length).toBe(3);
			expect(elements[0]).toBe(container.children[0].children[1]);
			expect(elements[1]).toBe(container.children[0].children[1].children[0]);
			expect(elements[2]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with matching attributes using "[attr1="value1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with multiple matching attributes using "[attr1="value1"][attr2="word1 word2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="value1"][attr2="word1 word2"]');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all elements with tag name and matching attributes using "span[attr1="value1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with tag name and matching attributes using "span[attr1=value1]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1=value1]');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with tag name and matching attributes using "span[attr1=\'value1\']".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll("span[attr1='value1']");

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with tag name and matching attributes using "span[_attr1]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML.replace(/ attr1/gm, '_attr1');
			const elements = container.querySelectorAll('span[_attr1]');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with tag name and multiple matching attributes using "span[attr1="value1"][attr2="word1 word2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"][attr2="word1 word2"]');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all elements with tag name and multiple matching attributes using "span[attr1="value1"][attr3="bracket[]bracket"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"][attr3="bracket[]bracket"]');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all elements with an attribute value containing a specified word using "[class~="class2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class~="class2"]');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with an attribute value starting with the specified word using "[class|="class1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class|="class1"]');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with an attribute value that begins with a specified value using "[class^="cl"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class^="cl"]');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with an attribute value that ends with a specified value using "[class$="ss2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class$="ss2"]');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with an attribute value that contains a specified value using "[class*="s1 cl"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class*="s1 cl"]');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with an attribute value that contains a specified value using "[class*="s1 cl"]" or matches exactly a value using "[attr1="value1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class*="s1 cl"], [attr1="value1"]');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with an attribute value that contains a specified value using "[class*="s1 cl"]" or has the tag "b".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class*="s1 cl"], h1');

			expect(elements.length).toBe(6);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
			expect(elements[4]).toBe(container.children[0].children[0]);
			expect(elements[5]).toBe(container.children[1].children[0]);
		});

		test('Returns all span elements matching ":first-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':first-child');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[0]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[1].children[0]);
		});

		test('Returns all span elements matching "span:first-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:first-child');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all span elements matching ":last-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':last-child');

			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0].children[1]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
			expect(elements[2]).toBe(container.children[1]);
			expect(elements[3]).toBe(container.children[1].children[0]);
		});

		test('Returns all span elements matching "span:last-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:last-child');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all span elements matching ":only-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':only-child');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[1].children[0]);
		});

		test('Returns all span elements matching ":first-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':first-of-type');

			expect(elements.length).toBe(5);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[0]);
			expect(elements[2]).toBe(container.children[0].children[1]);
			expect(elements[3]).toBe(container.children[0].children[1].children[0]);
			expect(elements[4]).toBe(container.children[1].children[0]);
		});

		test('Returns all span elements matching "span:first-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:first-of-type');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all span elements matching ":last-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':last-of-type');

			expect(elements.length).toBe(5);
			expect(elements[0]).toBe(container.children[0].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[1]);
			expect(elements[3]).toBe(container.children[1]);
			expect(elements[4]).toBe(container.children[1].children[0]);
		});

		test('Returns all span elements matching span:nth-child(1) or span:nth-child(2).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:nth-child(1), span:nth-child(2)');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements matching :nth-child(2n).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(2n)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['span.n2', 'b.n4', 'div.n6', 'span.n8', 'i.n10']);
		});

		test('Returns all elements matching "div :nth-child(2n+1)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('div :nth-child(2n+1)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['div.', 'b.n1', 'div.n3', 'span.n5', 'b.n7', 'div.n9']);
		});

		test('Returns all elements matching "div :nth-child(3n+1)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('div :nth-child(3n+1)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['div.', 'b.n1', 'b.n4', 'b.n7', 'i.n10']);
		});

		test('Returns all elements matching "div :nth-child(3n+3)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('div :nth-child(3n+3)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['div.n3', 'div.n6', 'div.n9']);
		});

		test('Returns all elements matching ":nth-child(odd)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(odd)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['div.', 'b.n1', 'div.n3', 'span.n5', 'b.n7', 'div.n9']);
		});

		test('Returns all elements matching ":nth-child(even)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(even)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['span.n2', 'b.n4', 'div.n6', 'span.n8', 'i.n10']);
		});

		test('Returns all elements matching ":nth-of-type(2n)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-of-type(2n)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['b.n4', 'span.n5', 'div.n6']);
		});

		test('Returns all elements matching ":nth-of-type(odd)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-of-type(odd)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['div.', 'b.n1', 'span.n2', 'div.n3', 'b.n7', 'span.n8', 'div.n9', 'i.n10']);
		});

		test('Returns all elements matching ":nth-last-child(2n)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-last-child(2n)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['b.n1', 'div.n3', 'span.n5', 'b.n7', 'div.n9']);
		});

		test('Returns all elements matching ":nth-last-of-type(2n)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-last-of-type(2n)');

			expect(
				elements.map(element => `${element.tagName.toLowerCase()}.${element.className}`)
			).toEqual(['b.n4', 'span.n5', 'div.n6']);
		});
	});

	describe('querySelector', () => {
		test('Returns a span matching "span".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span')).toBe(span);
		});

		test('Returns span wkith a specific class name matching ".spanClass".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('.spanClass')).toBe(span);
		});

		test('Returns span wkith a specific class name matching ".spanClass".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('.spanClass')).toBe(span);
		});

		test('Returns span with a specific class name and tag name matching "span.spanClass".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span.spanClass')).toBe(span);
		});

		test('Returns span with a specific tag name and attribute matching "span[attr1="value1"]".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.setAttribute('attr1', 'value1');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span[attr1="value1"]')).toBe(span);
			expect(div1.querySelector('[attr1="value1"]')).toBe(span);
			expect(div1.querySelector('span[attr1]')).toBe(span);
			expect(div1.querySelector('[attr1]')).toBe(span);
		});

		test('Returns the first element matching "div > div > span".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const span = container.querySelector('div > div > span');
			expect(span).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns the first element matching "div > div > .class1.class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const div = container.querySelector('div > div > .class1.class2');
			expect(div).toBe(container.children[0].children[1]);
		});

		test('Returns the first element matching "*".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('*')).toBe(div2);
		});

		test('Returns "null" if no element is found.', () => {
			const div = document.createElement('div');
			expect(div.querySelector('span')).toBe(null);
		});

		test('Returns an element by id matching "#id".', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div2.id = 'id';
			div.appendChild(div2);

			expect(div.querySelector('#id')).toEqual(div2);
		});
	});
});
