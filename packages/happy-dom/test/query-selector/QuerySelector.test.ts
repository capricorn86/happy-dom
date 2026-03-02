import type HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';
import QuerySelectorHTML from './data/QuerySelectorHTML.js';
import QuerySelectorNthChildHTML from './data/QuerySelectorNthChildHTML.js';
import type HTMLInputElement from '../../src/nodes/html-input-element/HTMLInputElement.js';
import { beforeEach, describe, it, expect } from 'vitest';
import QuerySelector from '../../src/query-selector/QuerySelector.js';

describe('QuerySelector', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('querySelectorAll()', () => {
		it('Throws an error for invalid selectors.', () => {
			const container = document.createElement('div');
			expect(() => container.querySelectorAll(<string>(<unknown>12))).toThrow(
				new window.DOMException(
					`Failed to execute 'querySelectorAll' on 'HTMLDivElement': '12' is not a valid selector.`
				)
			);
			expect(() => container.querySelectorAll(<string>(<unknown>(() => {})))).toThrow(
				new window.DOMException(
					`Failed to execute 'querySelectorAll' on 'HTMLDivElement': '() => {\n      }' is not a valid selector.`
				)
			);
			expect(() => container.querySelectorAll(<string>(<unknown>Symbol('test')))).toThrow(
				new TypeError(
					`Failed to execute 'querySelectorAll' on 'HTMLDivElement': Cannot convert a Symbol value to a string`
				)
			);
			expect(() => container.querySelectorAll(<string>(<unknown>true))).not.toThrow();
		});

		it('Converts selector values to string.', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <span>
                    <false></false>
                    <true></true>
                    <null></null>
                    <undefined></undefined>
                </span>
            `;

			const elements = container.querySelectorAll(<string>(<unknown>['false']));
			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[0]).toBe(true);

			const elements2 = container.querySelectorAll(<string>(<unknown>false));
			expect(elements2.length).toBe(1);
			expect(elements2[0] === container.children[0].children[0]).toBe(true);

			const elements3 = container.querySelectorAll(<string>(<unknown>true));
			expect(elements3.length).toBe(1);
			expect(elements3[0] === container.children[0].children[1]).toBe(true);

			const elements4 = container.querySelectorAll(<string>(<unknown>null));
			expect(elements4.length).toBe(1);
			expect(elements4[0] === container.children[0].children[2]).toBe(true);

			const elements5 = container.querySelectorAll(<string>(<unknown>undefined));
			expect(elements5.length).toBe(1);
			expect(elements5[0] === container.children[0].children[3]).toBe(true);
		});

		it('Returns all span elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span');
			expect(elements.length).toBe(3);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns elements in document order.', () => {
			const element = document.createElement('div');

			element.innerHTML = `
                <div class="a">
                    <div class="aa">
                        <div class="aaa"></div>
                        <div class="aab"></div>
                        <div class="aac"></div>
                    </div>
                    <div class="ab">
                        <div class="aba"></div>
                        <div class="abb"></div>
                        <div class="abc"></div>
                    </div>
                    <div class="ac">
                        <div class="aca"></div>
                        <div class="acb"></div>
                        <div class="acc"></div>
                    </div>
                </div>
                <div class="b">
                    <div class="ba">
                        <div class="baa"></div>
                        <div class="bab"></div>
                        <div class="bac"></div>
                    </div> 
                    <div class="bb">
                        <div class="bba"></div>
                        <div class="bbb"></div>
                        <div class="bbc"></div>
                    </div>
                    <div class="bc">
                        <div class="bca"></div>
                        <div class="bcb"></div>
                        <div class="bcc"></div>
                    </div>
                </div>
                <div class="c">
                    <div class="ca">
                        <div class="caa"></div>
                        <div class="cab"></div>
                        <div class="cac"></div>
                    </div>
                    <div class="cb">
                        <div class="cba"></div>
                        <div class="cbb"></div>
                        <div class="cbc"></div>
                    </div>
                    <div class="cc">
                        <div class="cca"></div>
                        <div class="ccb"></div>
                        <div class="ccc"></div>
                    </div>
                </div>
            `;

			expect(
				Array.from(
					element.querySelectorAll('div[class^="c"], div[class^="b"], div[class^="a"]')
				).map((div) => div.className)
			).toEqual([
				'a',
				'aa',
				'aaa',
				'aab',
				'aac',
				'ab',
				'aba',
				'abb',
				'abc',
				'ac',
				'aca',
				'acb',
				'acc',
				'b',
				'ba',
				'baa',
				'bab',
				'bac',
				'bb',
				'bba',
				'bbb',
				'bbc',
				'bc',
				'bca',
				'bcb',
				'bcc',
				'c',
				'ca',
				'caa',
				'cab',
				'cac',
				'cb',
				'cba',
				'cbb',
				'cbc',
				'cc',
				'cca',
				'ccb',
				'ccc'
			]);

			element.innerHTML = `
            <div>0</div>
            <button>1</button>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <button>8</button>
            <button>9</button>
            <button>10</button>
            <button>11</button>
            `;

			expect(Array.from(element.querySelectorAll('button')).map((div) => div.textContent)).toEqual([
				'1',
				'8',
				'9',
				'10',
				'11'
			]);
		});

		it('Returns a NodeList with the method item().', () => {
			const container = <HTMLElement>document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span');
			expect(elements.item(0) === container.children[0].children[1].children[0]).toBe(true);
		});

		it('Returns all h1 (heading 1) elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('h1');
			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[0]).toBe(true);
			expect(elements[1] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all elements with class name "class1".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1');
			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with unicode class name "«unicode-class1»".', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <div class="class1 «unicode-class1» class2" id="«r1»">
                    <!-- Comment 1 !-->
                    <h1>Heading1</h1>
                    <!-- Comment 2 !-->
                    <div class="class1 «unicode-class1» class2">
                        <span class="class1 «unicode-class1» class2" attr1="value1" attr2="word1 word2" attr3="bracket[]bracket" type="hidden">Span1</span>
                        <span class="class1 «unicode-class1» class2" attr1="value1">Span2</span>
                        <span class="class1 «unicode-class1» class2" attr1="word1.word2">Span3</span>
                    </div>
                </div>
                <div>
                    <!-- Comment 1 !-->
                    <h1>Heading1</h1>
                    <!-- Comment 2 !-->
                </div>
            `;
			const elements = container.querySelectorAll('.«unicode-class1»');
			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns element with unicode ID "«r1»".', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <div class="class1 «unicode-class1» class2" id="«r1»">
                    <!-- Comment 1 !-->
                    <h1>Heading1</h1>
                    <!-- Comment 2 !-->
                    <div class="class1 «unicode-class1» class2">
                        <span class="class1 «unicode-class1» class2" attr1="value1" attr2="word1 word2" attr3="bracket[]bracket" type="hidden">Span1</span>
                        <span class="class1 «unicode-class1» class2" attr1="value1">Span2</span>
                        <span class="class1 «unicode-class1» class2" attr1="word1.word2">Span3</span>
                    </div>
                </div>
                <div>
                    <!-- Comment 1 !-->
                    <h1>Heading1</h1>
                    <!-- Comment 2 !-->
                </div>
            `;
			const element = container.querySelector('#«r1»');
			expect(element === container.children[0]).toBe(true);
		});

		it('Returns all elements with class name "before:after".', () => {
			const container = document.createElement('div');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			element1.className = 'before:after';
			element2.className = 'before:after';
			container.appendChild(element1);
			container.appendChild(element2);

			// Invalid selector ".before:" should throw (colon without pseudo-class name)
			expect(() => container.querySelectorAll('.before:')).toThrowError(
				new SyntaxError(
					`Failed to execute 'querySelectorAll' on 'Document': '.before:' is not a valid selector.`
				)
			);
			// Valid selector with escaped colon should match
			const validSelectorElements = container.querySelectorAll('.before\\:after');
			expect(validSelectorElements.length).toBe(2);
			expect(validSelectorElements[0] === element1).toBe(true);
			expect(validSelectorElements[1] === element2).toBe(true);
		});

		it('Returns all elements with class name "before#after".', () => {
			const container = document.createElement('div');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			element1.className = 'before#after';
			element2.className = 'before#after';
			container.appendChild(element1);
			container.appendChild(element2);

			const invalidSelectorElements = container.querySelectorAll('.before#after');
			const validSelectorElements = container.querySelectorAll('.before\\#after');
			expect(invalidSelectorElements.length).toBe(0);
			expect(validSelectorElements.length).toBe(2);
			expect(validSelectorElements[0] === element1).toBe(true);
			expect(validSelectorElements[1] === element2).toBe(true);
		});

		it('Returns all elements with class name "before&after".', () => {
			const container = document.createElement('div');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			element1.className = 'before&after';
			element2.className = 'before&after';
			container.appendChild(element1);
			container.appendChild(element2);

			// Invalid selector ".before&after" should throw (& is not valid in CSS selectors)
			expect(() => container.querySelectorAll('.before&after')).toThrow();
			// Valid selector with escaped ampersand should match
			const validSelectorElements = container.querySelectorAll('.before\\&after');
			expect(validSelectorElements.length).toBe(2);
			expect(validSelectorElements[0] === element1).toBe(true);
			expect(validSelectorElements[1] === element2).toBe(true);
		});

		it('Returns all elements with class name "class1 class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1.class2');
			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements matching ".class1 > .class1 > *".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1 > .class1 > *');
			expect(elements.length).toBe(3);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements matching "div > div > span".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('div > div > span');
			expect(elements.length).toBe(3);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns only first child elements for selector "div>span"', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <div>
                    <article></article>
                    <span><span></span></span>
                    <span><span></span></span>
                    <article></article>
                </div>
            `;
			const elements = div.querySelectorAll('div>span');
			expect(elements.length).toBe(2);
			expect(elements[0] === div.children[0].children[1]).toBe(true);
			expect(elements[1] === div.children[0].children[2]).toBe(true);
		});

		it('Returns only direct children for "#id > div > *" (child combinator with universal selector).', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<div id="root">
					<div>
						<span></span>
						<p><em>deep</em></p>
						<a href="#"></a>
					</div>
				</div>
			`;
			document.body.appendChild(container);
			const elements = container.querySelectorAll('#root > div > *');
			expect(elements.length).toBe(3);
			expect(elements[0].tagName).toBe('SPAN');
			expect(elements[1].tagName).toBe('P');
			expect(elements[2].tagName).toBe('A');
			container.remove();
		});

		it('Returns only direct children for document.querySelectorAll("#id > div > *").', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<div id="qsa-root">
					<div>
						<span></span>
						<p><em>deep</em></p>
					</div>
				</div>
			`;
			document.body.appendChild(container);
			const elements = document.querySelectorAll('#qsa-root > div > *');
			expect(elements.length).toBe(2);
			expect(elements[0].tagName).toBe('SPAN');
			expect(elements[1].tagName).toBe('P');
			container.remove();
		});

		it('Returns only direct children for "div > *" with nested structure.', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<div>
					<span><b>nested</b></span>
					<p><em>nested</em></p>
				</div>
			`;
			const elements = container.querySelectorAll('div > *');
			// Direct children of container's outer div: the inner div
			// Direct children of the inner div: span, p
			// Total: inner div + span + p = 3
			expect(elements.length).toBe(3);
		});

		it('Returns all elements matching "div > div > .class1.class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('div > div > .class1.class2');
			expect(elements.length).toBe(4);
			expect(elements[0] === container.children[0].children[1]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with tag name and class "span.class1".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span.class1');

			expect(elements.length).toBe(3);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with tag name and class ".a + .b".', () => {
			const div = document.createElement('div');

			div.innerHTML = `
				<div class="a">a1</div>
				<div class="b">b1</div>
				<div class="c">c1</div>
				<div class="a">a2</div>
				<div class="b">b2</div>
				<div class="a">a3</div>
			`;

			const firstDivB = div.querySelector('.a + .b');

			expect(firstDivB === div.children[1]).toBe(true);

			const allDivB = div.querySelectorAll('.a + .b');

			expect(allDivB.length).toBe(2);
			expect(allDivB[0].textContent).toBe('b1');
			expect(allDivB[1].textContent).toBe('b2');

			const firstDivC = div.querySelector('.a + .c');

			expect(firstDivC === null).toBe(true);
		});

		it('Returns all elements with matching attributes using "[attr1="value1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with matching attributes using "[attr1=""]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML.replace(/attr1="value1"/gm, 'attr1=""');
			const elements = container.querySelectorAll('[attr1=""]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with matching attributes using "[attr1="word1.word2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="word1.word2"]');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with multiple matching attributes using "[attr1="value1"][attr2="word1 word2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="value1"][attr2="word1 word2"]');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
		});

		it('Returns all elements with tag name and matching attributes using "span[attr1="value1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with tag name and matching attributes using "span[attr1=value1]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1=value1]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with tag name and matching attributes using "span[attr1=\'value1\']".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll("span[attr1='value1']");

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns elements with attribute values containing apostrophes using double quotes as delimiter.', () => {
			const container = document.createElement('div');
			container.innerHTML = `<div data-value="it's a test">Content</div>`;

			const elements = container.querySelectorAll('[data-value="it\'s a test"]');
			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0]).toBe(true);
		});

		it('Returns elements with attribute values containing double quotes using apostrophes as delimiter.', () => {
			const container = document.createElement('div');
			container.innerHTML = `<div data-value='say "hello"'>Content</div>`;

			const elements = container.querySelectorAll('[data-value=\'say "hello"\']');
			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0]).toBe(true);
		});

		it('Returns all elements with tag name and matching attributes using "span[_attr1]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML.replace(/ attr1/gm, '_attr1');
			const elements = container.querySelectorAll('span[_attr1]');

			expect(elements.length).toBe(3);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with tag name and matching attributes using Testing Library query "[type=submit], input[type=button], input[type=reset]".', () => {
			const container = document.createElement('div');

			container.innerHTML = `<input type="submit"></input><input type="reset"></input>`;

			const elements = container.querySelectorAll(
				'input[type=submit], input[type=button], input[type=reset]'
			);

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[1]).toBe(true);
		});

		it('Returns all elements with tag name and multiple matching attributes using "span[attr1="value1"][attr2="word1 word2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"][attr2="word1 word2"]');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
		});

		it('Returns all elements with tag name and multiple matching attributes using "span[attr1="value1"][attr3="bracket[]bracket"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"][attr3="bracket[]bracket"]');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
		});

		it(`Returns all elements for attribute value '[style*="expression("]'`, () => {
			const container = document.createElement('div');

			container.innerHTML = `
				<div style='expression("123")'>
					<span>Test</span>
				</div>
			`;

			const elements = container.querySelectorAll('[style*="expression("]');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0]).toBe(true);
		});

		it('Returns all elements with tag name and multiple matching attributes using "span[attr1="application/ld+json"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML.replace(
				/ attr1="value1"/gm,
				' attr1="application/ld+json"'
			);
			const elements = container.querySelectorAll('span[attr1="application/ld+json"]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with an attribute value containing a specified word using "[class~="class2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class~="class2"]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value containing a specified word using "[attr1~="value1"]" (which doesn\'t include spaces).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1~="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with an attribute value starting with the specified word using "[class|="class1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class|="class1"]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value containing a specified word using "[attr1|="value1"]" (which doesn\'t include spaces).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1|="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements with an attribute value that begins with a specified value using "[class^="cl"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class^="cl"]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value that begins with a specified value using "[class^=cl]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class^=cl]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value that ends with a specified value using "[class$="ss2"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class$="ss2"]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value that contains a specified value using "[class*="s1 cl"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class*="s1 cl"]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value that contains a specified value using "[class*="s1 cl"]" or matches exactly a value using "[attr1="value1"]".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class*="s1 cl"], [attr1="value1"]');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all elements with an attribute value that contains a specified value using "[class*="s1 cl"]" or has the tag "b".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[class*="s1 cl"], h1');
			const children = container.children;
			expect(children.length).toBe(2);
			expect(elements.length).toBe(7);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[0]).toBe(true);
			expect(elements[2] === container.children[0].children[1]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[4] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[5] === container.children[0].children[1].children[2]).toBe(true);
			expect(elements[6] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching ":first-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':first-child');

			expect(elements.length).toBe(4);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[0]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[3] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching "span:first-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:first-child');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching ":last-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':last-child');

			expect(elements.length).toBe(4);
			expect(elements[0] === container.children[0].children[1]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[2]).toBe(true);
			expect(elements[2] === container.children[1]).toBe(true);
			expect(elements[3] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching "span:last-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:last-child');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Returns all span elements matching ":only-child".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':only-child');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[1].children[0]);
		});

		it('Returns all span elements matching ":first-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':first-of-type');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[0]).toBe(true);
			expect(elements[2] === container.children[0].children[1]).toBe(true);
			expect(elements[3] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[4] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching "span:first-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:first-of-type');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching "span:first-of-type:last-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('h1:first-of-type:last-of-type');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[0]).toBe(true);
			expect(elements[1] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all span elements matching ":last-of-type".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll(':last-of-type');

			expect(elements.length).toBe(5);
			expect(elements[0] === container.children[0].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1]).toBe(true);
			expect(elements[2] === container.children[0].children[1].children[2]).toBe(true);
			expect(elements[3] === container.children[1]).toBe(true);
			expect(elements[4] === container.children[1].children[0]).toBe(true);

			// Check that cache works

			container.innerHTML = '';

			const elements2 = container.querySelectorAll(':last-of-type');
			expect(elements2.length).toBe(0);

			container.innerHTML = QuerySelectorHTML;

			const elements3 = container.querySelectorAll(':last-of-type');
			expect(elements3.length).toBe(5);
			expect(elements3[0] === container.children[0].children[0]).toBe(true);
			expect(elements3[1] === container.children[0].children[1]).toBe(true);
			expect(elements3[2] === container.children[0].children[1].children[2]).toBe(true);
			expect(elements3[3] === container.children[1]).toBe(true);
			expect(elements3[4] === container.children[1].children[0]).toBe(true);
		});

		it('Returns all input elements matching "input[name="op"]:checked".', () => {
			const container = document.createElement('div');
			container.innerHTML = `
			<form>
				<input type="radio" id="id1" name="op" value="one" checked="true"/>
				<input type="radio" id="id2" name="op" value="two"/>
				<input type="submit" id="submitbutton" value="Submit"/>
			</form>
			`;
			let elements = container.querySelectorAll('input[name="op"]:checked');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[0]).toBe(true);

			const radio1 = <HTMLInputElement>elements[0];

			expect(radio1.value).toBe('one');

			const radio2 = <HTMLInputElement>container.querySelector("input[value='two']");

			radio2.checked = true;

			// Here we also tests that cache works

			elements = container.querySelectorAll('input[name="op"]:checked');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0].children[1]).toBe(true);
			expect((<HTMLInputElement>elements[0]).value).toBe('two');
		});

		it('Returns all elements matching ":disabled".', () => {
			const container = document.createElement('div');
			container.innerHTML = `
			<form>
				<input type="radio" id="id1" name="op" value="one" disabled/>
				<input type="radio" id="id2" name="op" value="two"/>
                <button disabled>Disabled</button>
                <fieldset disabled></fieldset>
                <select disabled>
                    <option>Option 1</option>
                    <option disabled>Option 2</option>
                </select>
                <textarea disabled></textarea>
			</form>
			`;
			const elements = container.querySelectorAll(':disabled');

			expect(elements.length).toBe(6);
			expect(elements[0] === container.children[0].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[2]).toBe(true);
			expect(elements[2] === container.children[0].children[3]).toBe(true);
			expect(elements[3] === container.children[0].children[4]).toBe(true);
			expect(elements[4] === container.children[0].children[4].children[1]).toBe(true);
			expect(elements[5] === container.children[0].children[5]).toBe(true);

			// Here we also tests that cache works

			(<HTMLInputElement>container.children[0].children[0]).disabled = false;

			const elements2 = container.querySelectorAll(':disabled');

			expect(elements2.length).toBe(5);
			expect(elements2[0] === container.children[0].children[2]).toBe(true);
			expect(elements2[1] === container.children[0].children[3]).toBe(true);
			expect(elements2[2] === container.children[0].children[4]).toBe(true);
			expect(elements2[3] === container.children[0].children[4].children[1]).toBe(true);
			expect(elements2[4] === container.children[0].children[5]).toBe(true);
		});

		it('Returns all elements matching "span:not([type=hidden])".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:not([type=hidden])');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[2]).toBe(true);

			// Check that cache works

			(<HTMLInputElement>elements[0]).setAttribute('type', 'hidden');
			(<HTMLInputElement>elements[1]).setAttribute('type', 'hidden');

			const elements2 = container.querySelectorAll('span:not([type=hidden])');

			expect(elements2.length).toBe(0);

			(<HTMLInputElement>elements[0]).setAttribute('type', 'text');
			(<HTMLInputElement>elements[1]).setAttribute('type', 'text');

			const elements3 = container.querySelectorAll('span:not([type=hidden])');

			expect(elements3.length).toBe(2);

			expect(elements3[0] === container.children[0].children[1].children[1]).toBe(true);
			expect(elements3[1] === container.children[0].children[1].children[2]).toBe(true);
		});

		it('Throws error for selector without ending parenthesis "button:not([type]"', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<button></button>
                <button type="submit"></button>
                <button></button>
			`;
			// Invalid selector (missing closing parenthesis) should throw
			expect(() => container.querySelectorAll('button:not([type]')).toThrow();
			// Valid selector should work
			const elements = container.querySelectorAll('button:not([type])');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[2]);
		});

		it('Returns all elements matching the selector "[q\\:shadowroot]" with escaped colon', () => {
			const container = document.createElement('div');
			// Create element with attribute name containing colon
			const span = document.createElement('span');
			span.setAttribute('q:shadowroot', '');
			container.appendChild(span);
			container.appendChild(document.createElement('button'));
			container.appendChild(document.createElement('article'));

			// Selector [q\:shadowroot] looks for attribute "q:shadowroot" (colon is escaped)
			const elements = container.querySelectorAll('[q\\:shadowroot]');
			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0]);
		});

		it('Returns all elements matching "input:not([type]):not([list])" to verify that "screen.getByRole(\'checkbox\')" works in Testing Library.', () => {
			const container = document.createElement('div');

			container.innerHTML = '<input type="checkbox"></input>';

			expect(container.querySelectorAll('input:not([type]):not([list])').length).toBe(0);

			container.innerHTML = '<input></input>';

			const elements = container.querySelectorAll('input:not([type]):not([list])');
			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[0]).toBe(true);
		});

		it('Returns all elements matching ".foo:not(.bar)".', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<div data-foo data-bar class="foo bar"></div>
				<div data-foo class="foo"></div>
				<div data-bar class="bar"></div>
			`;
			const elements = container.querySelectorAll('.foo:not(.bar)');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[1]).toBe(true);
		});

		it('Supports :not with multiple selectors within', () => {
			const container = document.createElement('div');
			container.innerHTML = `<ul class="list">
				<li class="list-item"></li>
				<li class="list-item"></li>
				<li class="list-item"></li>
				<li class="other-item"></li>
				<li></li>
			</ul>`;

			const lastItem = container.querySelectorAll('ul > li:not(.list-item, .other-item)');
			expect(lastItem.length).toBe(1);
		});

		it('Returns all elements matching ".bar:not(.foo)".', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<div data-foo data-bar class="foo bar"></div>
				<div data-foo class="foo"></div>
				<div data-bar class="bar"></div>
			`;
			const elements = container.querySelectorAll('.bar:not(.foo)');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[2]).toBe(true);
		});

		it('Returns all elements matching "[data-foo]:not([data-bar])".', () => {
			document.body.innerHTML = `
				<div data-foo data-bar class="foo bar"></div>
				<div data-foo class="foo"></div>
				<div data-bar class="bar"></div>
			`;
			const elements = document.querySelectorAll('[data-foo]:not([data-bar])');

			expect(elements.length).toBe(1);
			expect(elements[0] === document.body.children[1]).toBe(true);
		});

		it('Returns all elements matching "[tabindex]:not(textarea)".', () => {
			document.body.innerHTML = `
				<div tabindex="-1"></div>
				<div tabindex="0"></div>
				<div tabindex="1"></div>
				<textarea tabindex="-1"></textarea>
			`;
			const elements = document.querySelectorAll('[tabindex]:not(textarea)');
			expect(elements.length).toBe(3);
			expect(elements[0] === document.body.children[0]).toBe(true);
		});

		it('Returns all span elements matching span:nth-child(1) or span:nth-child(2).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span:nth-child(1), span:nth-child(2)');

			expect(elements.length).toBe(2);
			expect(elements[0] === container.children[0].children[1].children[0]).toBe(true);
			expect(elements[1] === container.children[0].children[1].children[1]).toBe(true);
		});

		it('Returns all elements matching ":nth-child(n+8)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(n+8)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['span.n8', 'div.n9', 'i.n10']);
		});

		it('Returns all elements matching :nth-child(2n).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(2n)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['span.n2', 'b.n4', 'div.n6', 'span.n8', 'i.n10']);
		});

		it('Returns all elements matching :nth-child(-n + 3).', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(-n + 3)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['div.', 'b.n1', 'span.n2', 'div.n3']);
		});

		it('Returns all elements matching "div :nth-child(2n+1)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('div :nth-child(2n+1)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['div.', 'b.n1', 'div.n3', 'span.n5', 'b.n7', 'div.n9']);
		});

		it('Returns all elements matching "div :nth-child(3n+1)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('div :nth-child(3n+1)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['div.', 'b.n1', 'b.n4', 'b.n7', 'i.n10']);
		});

		it('Returns all elements matching ":nth-child(3n+1 of b)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(3n+1 of b)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['b.n1']);
		});

		it('Returns all elements matching ":nth-child(n+1 of span)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(n+1 of span)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['span.n2', 'span.n5', 'span.n8']);
		});

		it('Returns all elements matching ":nth-last-child(n+1 of span)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-last-child(n+1 of span)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['span.n2', 'span.n5', 'span.n8']);
		});

		it('Returns all elements matching "div :nth-child(3n+3)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('div :nth-child(3n+3)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['div.n3', 'div.n6', 'div.n9']);
		});

		it('Returns all elements matching "a[href]:not([href *= "javascript:" i])".', () => {
			const container = document.createElement('div');
			container.innerHTML = `<a href="JAVASCRIPT:alert(1)">Link</a><a href="https://example.com">Link</a>`;
			const elements = container.querySelectorAll('a[href]:not([href *= "javascript:" i])');

			expect(elements.length).toBe(1);
			expect(elements[0] === container.children[1]).toBe(true);
		});

		it('Returns all elements matching ":nth-child(odd)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(odd)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['div.', 'b.n1', 'div.n3', 'span.n5', 'b.n7', 'div.n9']);
		});

		it('Returns all elements matching ":nth-child(even)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-child(even)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['span.n2', 'b.n4', 'div.n6', 'span.n8', 'i.n10']);
		});

		it('Returns all elements matching ":nth-of-type(2n)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-of-type(2n)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['b.n4', 'span.n5', 'div.n6']);
		});

		it('Returns all elements matching ":nth-of-type(odd)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-of-type(odd)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['div.', 'b.n1', 'span.n2', 'div.n3', 'b.n7', 'span.n8', 'div.n9', 'i.n10']);
		});

		it('Returns all elements matching ":nth-last-child(2n)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-last-child(2n)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['b.n1', 'div.n3', 'span.n5', 'b.n7', 'div.n9']);
		});

		it('Returns all elements matching ":nth-last-of-type(2n)".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll(':nth-last-of-type(2n)');

			expect(
				Array.from(elements).map(
					(element) => `${element.tagName.toLowerCase()}.${element.className}`
				)
			).toEqual(['b.n4', 'span.n5', 'div.n6']);
		});

		it('Returns empty node list when match pseudo element "::-webkit-inner-spin-button".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorNthChildHTML;
			const elements = container.querySelectorAll('::-webkit-inner-spin-button');

			expect(elements.length).toBe(0);
		});

		it('Throws an error when providing an invalid selector', () => {
			const div = document.createElement('div');
			expect(() => div.querySelectorAll('1')).toThrowError(
				"Failed to execute 'querySelectorAll' on 'HTMLDivElement': '1' is not a valid selector."
			);
			expect(() => div.querySelectorAll('[1')).toThrowError(
				"Failed to execute 'querySelectorAll' on 'HTMLDivElement': '[1' is not a valid selector."
			);
			expect(() => div.querySelectorAll('.1')).toThrowError(
				"Failed to execute 'querySelectorAll' on 'HTMLDivElement': '.1' is not a valid selector."
			);
			expect(() => div.querySelectorAll('#1')).toThrowError(
				"Failed to execute 'querySelectorAll' on 'HTMLDivElement': '#1' is not a valid selector."
			);
			expect(() => div.querySelectorAll('a.')).toThrowError(
				"Failed to execute 'querySelectorAll' on 'HTMLDivElement': 'a.' is not a valid selector."
			);
			expect(() => div.querySelectorAll('a#')).toThrowError(
				"Failed to execute 'querySelectorAll' on 'HTMLDivElement': 'a#' is not a valid selector."
			);
		});

		it('Returns true for selector with CSS pseudo ":focus" and ":focus-visible"', () => {
			document.body.innerHTML = QuerySelectorHTML;
			const span = <HTMLElement>document.querySelector('span.class1');
			const div = <HTMLElement>document.querySelector('div.class1');

			expect(document.querySelectorAll(':focus')[0]).toBe(document.body);
			expect(document.querySelectorAll(':focus-visible')[0]).toBe(document.body);

			span.focus();

			expect(document.querySelectorAll(':focus')[0]).toBe(span);
			expect(document.querySelectorAll(':focus-visible')[0]).toBe(span);

			div.focus();

			expect(document.querySelectorAll(':focus')[0]).toBe(div);
			expect(document.querySelectorAll(':focus-visible')[0]).toBe(div);
		});

		it('Returns element matching selector with CSS pseudo ":has()"', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <span><video attr="value1"></video></span>
                <span><b><video></video></b></span>
                <video></video>
                <h1></h1>
                <h2></h2>
            `;
			expect(Array.from(container.querySelectorAll('span:has(video)'))).toEqual([
				container.children[0],
				container.children[1]
			]);
			expect(Array.from(container.querySelectorAll('span:has(video[attr="value1"])'))).toEqual([
				container.children[0]
			]);
			expect(Array.from(container.querySelectorAll('span:has(+video)'))).toEqual([
				container.children[1]
			]);
			expect(Array.from(container.querySelectorAll('h1:has( +h2)'))).toEqual([
				container.children[3]
			]);
			expect(Array.from(container.querySelectorAll('span:has(> video)'))).toEqual([
				container.children[0]
			]);
		});

		it('Correctly parses complex CSS :has() expression with nested :not() (issue #1910)', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<table class="emXRrt">
					<thead>
						<tr>
							<th>Header 1</th>
							<th>Header 2</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Cell 1</td>
							<td>Cell 2</td>
						</tr>
						<tr data-ignore-row>
							<td>Ignored 1</td>
							<td>Ignored 2</td>
						</tr>
					</tbody>
				</table>
			`;

			const elements = container.querySelectorAll(
				'.emXRrt>tbody>tr>td:nth-child(2),.emXRrt:not(:has(> tbody > tr:not([data-ignore-row])))>thead>tr>th:nth-child(2)'
			);

			// Should only match the 2 td elements from the first selector part
			expect(elements.length).toBe(2);
			expect(elements[0].textContent).toBe('Cell 2');
			expect(elements[1].textContent).toBe('Ignored 2');
		});

		it('Should throw error when ending with ","', () => {
			const container = document.createElement('div');
			expect(() => container.querySelectorAll('.test,.test-2,')).toThrowError(
				new SyntaxError(
					"Failed to execute 'querySelectorAll' on 'Element': '.test,.test-2,' is not a valid selector."
				)
			);
			expect(() => container.querySelectorAll('.test.,,test-2')).toThrowError(
				new SyntaxError(
					"Failed to execute 'querySelectorAll' on 'Element': '.test,,.test-2' is not a valid selector."
				)
			);
		});

		it('Correctly parses :not() with nested :has() containing :not() (issue #1910)', () => {
			const container = document.createElement('div');
			container.innerHTML = `
				<div class="parent">
					<div class="child" data-keep></div>
					<div class="child"></div>
				</div>
				<div class="parent no-match">
					<div class="child" data-keep></div>
				</div>
			`;

			const elements = container.querySelectorAll('.parent:not(:has(> .child:not([data-keep])))');

			expect(elements.length).toBe(1);
			expect(elements[0].classList.contains('no-match')).toBe(true);
		});

		it('Returns all elements for subsequent sibling selector using ".a ~ .a"', () => {
			const div = document.createElement('div');

			div.innerHTML = `
				<div class="a">a1</div>
				<div class="b">b1</div>
				<div class="c">c1</div>
				<div class="a">a2</div>
				<div class="b">b2</div>
				<div class="a">a3</div>
			`;

			const subsequentSiblings = QuerySelector.querySelectorAll(div, '.a ~ .a');
			expect(subsequentSiblings.length).toBe(2);
			expect(subsequentSiblings[0].textContent).toBe('a2');
			expect(subsequentSiblings[1].textContent).toBe('a3');

			// Test cache 1
			subsequentSiblings[0].className = 'z';

			const subsequentSiblings2 = QuerySelector.querySelectorAll(div, '.a ~ .a');
			expect(subsequentSiblings2.length).toBe(1);
			expect(subsequentSiblings2[0].textContent).toBe('a3');

			// Test cache 2
			div.innerHTML = `
                <div class="a">a1</div>
                <div class="b">b1</div>
                <div class="c">c1</div>
                <div class="a">a2</div>
                <div class="b">b2</div>
                <div class="a">a3</div>
            `;
			const subsequentSiblings3 = QuerySelector.querySelectorAll(div, '.a ~ .a');
			expect(subsequentSiblings3.length).toBe(2);
			expect(subsequentSiblings3[0].textContent).toBe('a2');
			expect(subsequentSiblings3[1].textContent).toBe('a3');
		});

		it('Returns all elements for attribute selector with round brackets within', () => {
			const div = document.createElement('div');

			div.innerHTML = `
				<span>loremipsum</span>
				<a href="/123">normal link</a>                        
				<a href="javascript:void(0)">void</a>
			`;

			const voidLinks = div.querySelectorAll('a[href="javascript:void(0)"]');
			expect(voidLinks.length).toBe(1);
			const normalLinks = div.querySelectorAll('a[href]:not([href="javascript:void(0)"])');
			expect(normalLinks.length).toBe(1);
		});

		it('Returns all elements for pseudo selector ":scope"', () => {
			const div = document.createElement('div');

			div.innerHTML = `
                <span>Span 1</span>
                <span>Span 2</span>
                <a>Link 1</a>                        
                <a>Link 2</a>
            `;

			expect(div.querySelectorAll(':scope').length).toBe(0);

			const spans = div.querySelectorAll(':scope > span');

			expect(spans.length).toBe(2);
			expect(spans[0].textContent).toBe('Span 1');
			expect(spans[1].textContent).toBe('Span 2');

			const links = div.querySelectorAll(':scope a');

			expect(links.length).toBe(2);
			expect(links[0].textContent).toBe('Link 1');
			expect(links[1].textContent).toBe('Link 2');
		});

		it('Returns all elements for pseudo selector ":scope > child" in XML document', () => {
			const xml = '<root><child>Content</child></root>';
			const parser = new window.DOMParser();
			const xmlDoc = parser.parseFromString(xml, 'application/xml');
			expect(xmlDoc.querySelectorAll(':scope > child').length).toBe(1);
			expect(xmlDoc.querySelectorAll(':root > child').length).toBe(1);
		});

		it('Returns all elements for pseudo selector ":root"', () => {
			const root = document.querySelectorAll(':root');
			expect(root.length).toBe(1);
			expect(root[0]).toBe(document.documentElement);
		});

		it('Matches XML query selector for #1912', () => {
			const xml = '<root><child Name="John">Content</child></root>';
			const parser = new window.DOMParser();
			const xmlDoc = parser.parseFromString(xml, 'application/xml');

			expect(xmlDoc.querySelectorAll('[Name]').length).toBe(1);
		});
	});

	describe('querySelector()', () => {
		it('Throws an error for invalid selectors.', () => {
			const container = document.createElement('div');
			expect(() => container.querySelector(<string>(<unknown>12))).toThrow(
				new window.DOMException(
					`Failed to execute 'querySelector' on 'HTMLDivElement': '12' is not a valid selector.`
				)
			);
			expect(() => container.querySelector(<string>(<unknown>(() => {})))).toThrow(
				new window.DOMException(
					`Failed to execute 'querySelector' on 'HTMLDivElement': '() => {\n      }' is not a valid selector.`
				)
			);
			expect(() => container.querySelector(<string>(<unknown>Symbol('test')))).toThrow(
				new TypeError(
					`Failed to execute 'querySelector' on 'HTMLDivElement': Cannot convert a Symbol value to a string`
				)
			);
			expect(() => container.querySelector(<string>(<unknown>true))).not.toThrow();
		});

		it('Converts selector values to string.', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <span>
                    <false></false>
                    <true></true>
                    <null></null>
                    <undefined></undefined>
                </span>
            `;

			expect(container.querySelector(<string>(<unknown>['false']))).toBe(
				container.children[0].children[0]
			);

			expect(container.querySelector(<string>(<string>(<unknown>false)))).toBe(
				container.children[0].children[0]
			);

			expect(container.querySelector(<string>(<string>(<unknown>true)))).toBe(
				container.children[0].children[1]
			);

			expect(container.querySelector(<string>(<string>(<unknown>null)))).toBe(
				container.children[0].children[2]
			);

			expect(container.querySelector(<string>(<string>(<unknown>undefined)))).toBe(
				container.children[0].children[3]
			);
		});

		it('Returns a span matching "span".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span') === span).toBe(true);
		});

		it('Returns span wkith a specific class name matching ".spanClass".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('.spanClass') === span).toBe(true);
		});

		it('Returns span wkith a specific class name matching ".spanClass".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('.spanClass') === span).toBe(true);
		});

		it('Returns span with a specific class name and tag name matching "span.spanClass".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span.spanClass') === span).toBe(true);
		});

		it('Returns div with a specific id and tag name matching "div#divId".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			div3.id = 'divId';
			div1.appendChild(div2);
			div2.appendChild(div3);
			expect(div1.querySelector('div#divId') === div3).toBe(true);
		});

		it('Returns span with a specific class name and tag name matching "custom-element.class1".', () => {
			const div = document.createElement('div');
			const customElement1 = document.createElement('custom-element');
			const customElement2 = document.createElement('custom-element');
			const customElement3 = document.createElement('custom-element');
			customElement1.className = 'class1';
			customElement2.className = 'class2';
			customElement3.className = 'class3';
			div.appendChild(customElement1);
			div.appendChild(customElement2);
			div.appendChild(customElement3);

			expect(div.querySelector('custom-element.class2') === customElement2).toBe(true);
		});

		it('Returns span with a specific tag name and attribute matching "span[attr1="value1"]".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.setAttribute('attr1', 'value1');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span[attr1="value1"]') === span).toBe(true);
			expect(div1.querySelector('[attr1="value1"]') === span).toBe(true);
			expect(div1.querySelector('span[attr1]') === span).toBe(true);
			expect(div1.querySelector('[attr1]') === span).toBe(true);
		});

		it('Returns the first element matching "div > div > span".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const span = container.querySelector('div > div > span');
			expect(span === container.children[0].children[1].children[0]).toBe(true);
		});

		it('Returns the first element matching "div > div > .class1.class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const div = container.querySelector('div > div > .class1.class2');
			expect(div === container.children[0].children[1]).toBe(true);
		});

		it('Returns the first element matching "*".', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('*') === div2).toBe(true);
		});

		it('Returns "null" if no element is found.', () => {
			const div = document.createElement('div');
			expect(div.querySelector('span')).toBe(null);
		});

		it('Returns an element by id matching "#id".', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div2.id = 'id';
			div.appendChild(div2);

			expect(div.querySelector('#id') === div2).toBe(true);
		});

		it('Returns an element matching :target', () => {
			const section = document.createElement('section');
			const headline = document.createElement('h2');
			headline.id = 'id';
			section.appendChild(headline);
			document.body.appendChild(section);

			window.location.hash = '#id';
			expect(section.querySelector(':target') === headline).toBe(true);
			expect(section.querySelector('h2:target') === headline).toBe(true);
			expect(section.querySelector('h3:target') === null).toBe(true);

			// Here we also test that cache works
			window.location.hash = '#something-else';
			expect(section.querySelector(':target') === null).toBe(true);
			expect(section.querySelector('h2:target') === null).toBe(true);
			expect(section.querySelector('h3:target') === null).toBe(true);

			// Detached Elements should not match
			window.location.hash = '#id';
			section.remove();
			expect(section.querySelector(':target') === null).toBe(true);
			expect(section.querySelector('h2:target') === null).toBe(true);
			expect(section.querySelector('h3:target') === null).toBe(true);
		});

		it('Returns an element by id matching "#:id:".', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div2.id = ':id:';
			div.appendChild(div2);

			expect(div.querySelector('#\\:id\\:') === div2).toBe(true);
		});

		it('Does not find input with selector of input:not([list])[type="search"]', () => {
			const div = document.createElement('div');
			const input = document.createElement('input');
			input.setAttribute('type', 'text');
			div.appendChild(input);

			expect(div.querySelector('input:not([list])[type="search"]')).toBeNull();
		});

		it('Returns null by pseudo element selector of ::-webkit-inner-spin-button', () => {
			const div = document.createElement('div');
			expect(div.querySelector('::-webkit-inner-spin-button')).toBeNull();
			expect(document.querySelector('::-webkit-inner-spin-button')).toBeNull();
		});

		it('Has support for attributes containing colon', () => {
			const div = document.createElement('div');
			div.innerHTML = '<meta ab="a:b"></meta>';
			const element = div.querySelector('[ab="a\\:b"]');
			const element2 = div.querySelector('[ab="a:b"]');
			expect(element === div.children[0]).toBe(true);
			expect(element2 === div.children[0]).toBe(true);
		});

		it('Returns SVG elements', () => {
			document.body.innerHTML = `<svg width="3955.829" height="880" viewBox="0 0 3955.829 880" xmlns="http://www.w3.org/2000/svg" id="id_svg_model">
                <g id="svgGroup" stroke-linecap="round" fill-rule="evenodd" font-size="9pt" 
                    stroke="#000" stroke-width="0.25mm" fill="none" style="stroke:#000;stroke-width:0.25mm;fill:none"
                >
                    <path d="M 0 0 L 0 880 L 1272.697 880 A 80 80 0 0 0 1350.647 817.996 L 1416.442 533.006 A 120 120 0 0 1 1533.367 440 L 1977.914 440 L 2422.462 440 A 120 120 0 0 1 2539.386 533.006 
                        L 2605.182 817.996 A 80 80 0 0 0 2683.131 880 L 3955.829 880 L 3955.829 0" 
                        vector-effect="non-scaling-stroke">
                    </path>
                    <unknown></unknown>
                </g>
            </svg>`;

			const svg = document.querySelector('svg');
			const path = document.querySelector('path');
			const unknown = document.querySelector('unknown');

			expect(svg?.constructor.name).toBe('SVGSVGElement');

			expect(path?.constructor.name).toBe('SVGPathElement');

			expect(unknown?.constructor.name).toBe('SVGElement');
		});

		it('Throws an error when providing an invalid selector', () => {
			const div = document.createElement('div');
			expect(() => div.querySelector('1')).toThrowError(
				"Failed to execute 'querySelector' on 'HTMLDivElement': '1' is not a valid selector."
			);
			expect(() => div.querySelector('[1')).toThrowError(
				"Failed to execute 'querySelector' on 'HTMLDivElement': '[1' is not a valid selector."
			);
			expect(() => div.querySelector('.1')).toThrowError(
				"Failed to execute 'querySelector' on 'HTMLDivElement': '.1' is not a valid selector."
			);
			expect(() => div.querySelector('#1')).toThrowError(
				"Failed to execute 'querySelector' on 'HTMLDivElement': '#1' is not a valid selector."
			);
			expect(() => div.querySelector('a.')).toThrowError(
				"Failed to execute 'querySelector' on 'HTMLDivElement': 'a.' is not a valid selector."
			);
			expect(() => div.querySelector('a#')).toThrowError(
				"Failed to execute 'querySelector' on 'HTMLDivElement': 'a#' is not a valid selector."
			);
		});

		it('Has support for passing pseudo selectors inside :not', () => {
			const div = document.createElement('div');
			const child = document.createElement('div');
			const child2 = document.createElement('div');

			div.appendChild(child);
			div.appendChild(child2);

			expect(div.querySelector(':not(:nth-child(1))')).toBe(child2);
		});

		it('Returns null for selector with CSS pseudo element ":before".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			expect(
				container.querySelector('span.class1') === container.children[0].children[1].children[0]
			).toBe(true);
			expect(
				container.querySelector('span.class1:first-of-type') ===
					container.children[0].children[1].children[0]
			).toBe(true);
			expect(container.querySelector('span.class1:before') === null).toBe(true);
			expect(container.querySelector('span.class1:first-of-type:before') === null).toBe(true);
		});

		it('Returns null for selector with CSS pseudo element ":after".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			expect(
				container.querySelector('span.class1') === container.children[0].children[1].children[0]
			).toBe(true);
			expect(
				container.querySelector('span.class1:first-of-type') ===
					container.children[0].children[1].children[0]
			).toBe(true);
			expect(container.querySelector('span.class1:after') === null).toBe(true);
			expect(container.querySelector('span.class1:first-of-type:after') === null).toBe(true);
		});

		it('Returns element matching selector with CSS pseudo ":is()"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			expect(container.querySelector(':is(span[attr1="word1.word2"])')).toBe(
				container.children[0].children[1].children[2]
			);
			expect(container.querySelector(':is(div, span[attr1="word1.word2"])')).toBe(
				container.children[0]
			);
			expect(container.querySelector(':is(span[attr1="val,ue1"], span[attr1="value1"])')).toBe(
				container.children[0].children[1].children[0]
			);
			expect(container.querySelector(':is(div)')).toBe(container.children[0]);
			expect(container.querySelector(':is(span[attr1="val,ue1"])')).toBe(null);
		});

		it('Returns element matching selector with CSS pseudo ":where()"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			expect(container.querySelector(':where(span[attr1="word1.word2"])')).toBe(
				container.children[0].children[1].children[2]
			);
			expect(container.querySelector(':where(div, span[attr1="word1.word2"])')).toBe(
				container.children[0]
			);
			expect(container.querySelector(':where(span[attr1="val,ue1"], span[attr1="value1"])')).toBe(
				container.children[0].children[1].children[0]
			);
			expect(container.querySelector(':where(div)')).toBe(container.children[0]);
			expect(container.querySelector(':where(span[attr1="val,ue1"])')).toBe(null);
		});

		it('Returns element matching selector with CSS pseudo ":has()"', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <span><video attr="value1"></video></span>
                <span><b><video></video></b></span>
                <video></video>
                <h1></h1>
                <h2></h2>
            `;
			expect(container.querySelector('span:has(video)')).toBe(container.children[0]);
			expect(container.querySelector('span:has(video[attr="value1"])')).toBe(container.children[0]);
			expect(container.querySelector('span:has(+video)')).toBe(container.children[1]);
			expect(container.querySelector('h1:has(+h2)')).toBe(container.children[3]);
		});

		it('Remove new line from selector and trim selector before parse', () => {
			const container = document.createElement('div');

			container.innerHTML = QuerySelectorHTML;

			expect(container.querySelector('\n \n\r	\t	\f h1 \n \n\r	\t	\f')).toBe(
				container.children[0].children[0]
			);
			expect(container.querySelector('\n \n\r	\t	\f div div        span \n \n\r	\t	\f')).toBe(
				container.children[0].children[1].children[0]
			);
			expect(
				container.querySelector('div.class1\n.class2 span') ===
					container.children[0].children[1].children[0]
			).toBe(true);
		});

		it('Returns element matching selector "datalist#id"', () => {
			const div = document.createElement('div');
			const datalist = document.createElement('datalist');
			const span = document.createElement('span');

			datalist.id = 'datalist_id';
			span.id = 'span_id';

			div.appendChild(datalist);
			div.appendChild(span);

			expect(div.querySelector('datalist#span_id') === null).toBe(true);
			expect(div.querySelector('datalist#datalist_id') === datalist).toBe(true);
			expect(div.querySelector('span#datalist_id') === null).toBe(true);
			expect(div.querySelector('span#span_id') === span).toBe(true);
		});

		it('Returns true for selector with CSS pseudo ":focus" and ":focus-visible"', () => {
			document.body.innerHTML = QuerySelectorHTML;
			const span = <HTMLElement>document.querySelector('span.class1');
			const div = <HTMLElement>document.querySelector('div.class1');

			expect(document.querySelector(':focus')).toBe(document.body);
			expect(document.querySelector(':focus-visible')).toBe(document.body);

			span.focus();

			expect(document.querySelector(':focus')).toBe(span);
			expect(document.querySelector(':focus-visible')).toBe(span);

			div.focus();

			expect(document.querySelector(':focus')).toBe(div);
			expect(document.querySelector(':focus-visible')).toBe(div);
		});

		it('Handles class names with line breaks', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <div class="class1
                class2"></div>
            `;

			expect(div.querySelector('.class1.class2')).toBe(div.children[0]);
		});

		it('Returns element matching subsequent sibling selector using ".a ~ .b"', () => {
			const div = document.createElement('div');

			div.innerHTML = `
				<div class="a">a1</div>
				<div class="b">b1</div>
				<div class="c">c1</div>
				<div class="a">a2</div>
				<div class="b">b2</div>
				<div class="a">a3</div>
			`;

			const sibling = <HTMLElement>div.querySelector('.a ~ .b');
			const secondChild = div.children[1];

			expect(secondChild === sibling).toBe(true);
			expect(sibling.textContent).toBe('b1');

			// Test cache 1
			sibling.setAttribute('class', 'z');

			expect(div.querySelector('.a ~ .b')).toBe(div.children[4]);

			// Test cache 2
			div.innerHTML = `
                <div class="a">a1</div>
                <div class="b">b1</div>
                <div class="c">c1</div>
                <div class="a">a2</div>
                <div class="b">b2</div>
                <div class="a">a3</div>
            `;

			expect(div.querySelector('.a ~ .b')).toBe(div.children[1]);
		});

		it('Returns element for pseudo selector ":scope"', () => {
			const div = document.createElement('div');

			div.innerHTML = `
                <span>Span 1</span>
                <span>Span 2</span>
                <a>Link 1</a>                        
                <a>Link 2</a>
            `;

			expect(div.querySelector(':scope')).toBe(null);

			expect(div.querySelector(':scope > span')!.textContent).toBe('Span 1');

			expect(div.querySelector(':scope a')!.textContent).toBe('Link 1');
		});

		it('Return element for pseudo selector ":root"', () => {
			expect(document.querySelectorAll(':root')[0]).toBe(document.documentElement);
		});

		it('Returns element matching unicode class name', () => {
			const div = document.createElement('div');
			const unicodeClassName = 'class-😀';
			const element = document.createElement('span');
			element.className = unicodeClassName;
			div.appendChild(element);

			expect(div.querySelector(`.${unicodeClassName}`)).toBe(element);
		});
	});

	describe('matches()', () => {
		it('Throws an error for invalid selectors.', () => {
			const container = document.createElement('div');
			expect(() => container.matches(<string>(<unknown>12))).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': '12' is not a valid selector.`
				)
			);
			expect(() => container.matches(<string>(<unknown>(() => {})))).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': '() => {\n      }' is not a valid selector.`
				)
			);
			expect(() => container.matches(<string>(<unknown>Symbol('test')))).toThrow(
				new SyntaxError(`Cannot convert a Symbol value to a string`)
			);
			expect(() => container.matches(<string>(<unknown>true))).not.toThrow();
		});

		it('Converts selector values to string.', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <false></false>
                <true></true>
                <null></null>
                <undefined></undefined>
            `;

			expect(container.children[0].matches(<string>(<unknown>['false']))).toBe(true);
			expect(container.children[0].matches(<string>(<unknown>false))).toBe(true);
			expect(container.children[1].matches(<string>(<unknown>true))).toBe(true);
			expect(container.children[2].matches(<string>(<unknown>null))).toBe(true);
			expect(container.children[3].matches(<string>(<unknown>undefined))).toBe(true);
		});

		it('Returns true when the element matches the selector', () => {
			const div = document.createElement('div');
			div.innerHTML = '<div class="foo"></div>';
			const element = div.children[0];
			expect(element.matches('.foo')).toBe(true);
		});

		it('Returns false when the element does not match the selector', () => {
			const div = document.createElement('div');
			div.innerHTML = '<div class="foo"></div>';
			const element = div.children[0];
			expect(element.matches('.bar')).toBe(false);
		});

		it('Returns true for the selector "div.class1 .class2 span"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const element = container.children[0].children[1].children[0];
			expect(element.matches('div.class1 .class2 span')).toBe(true);
			expect(element.matches('div.class1 .class3 span')).toBe(false);
		});

		it('Returns false for selector with CSS pseado element ":before"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const element = container.children[0].children[1].children[0];
			expect(element.matches('span.class1')).toBe(true);
			expect(element.matches('span.class1:first-of-type')).toBe(true);
			expect(element.matches('span.class1:before')).toBe(false);
			expect(element.matches('span.class1:first-of-type:before')).toBe(false);
		});

		it('Returns false for selector with CSS pseado element ":after"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const element = container.children[0].children[1].children[0];
			expect(element.matches('span.class1')).toBe(true);
			expect(element.matches('span.class1:first-of-type')).toBe(true);
			expect(element.matches('span.class1:after')).toBe(false);
			expect(element.matches('span.class1:first-of-type:after')).toBe(false);
		});

		it('Returns true for selector with CSS pseudo ":is()"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const element = container.children[0].children[1].children[0];
			expect(element.matches(':is(span)')).toBe(true);
			expect(element.matches(':is(div, span)')).toBe(true);
			expect(element.matches(':is(div, span.class1)')).toBe(true);
			expect(element.matches(':is(div, span[attr1="value1"])')).toBe(true);
			expect(element.matches(':is(span[attr1="val,ue1"], span[attr1="value1"])')).toBe(true);
			expect(element.matches(':is(div)')).toBe(false);
		});

		it('Returns true for selector with CSS pseudo ":where()"', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const element = container.children[0].children[1].children[0];
			expect(element.matches(':where(span)')).toBe(true);
			expect(element.matches(':where(div, span)')).toBe(true);
			expect(element.matches(':where(div, span.class1)')).toBe(true);
			expect(element.matches(':where(div, span[attr1="value1"])')).toBe(true);
			expect(element.matches(':where(span[attr1="val,ue1"], span[attr1="value1"])')).toBe(true);
			expect(element.matches(':where(div)')).toBe(false);
		});

		it('Returns element matching selector with CSS pseudo ":has()"', () => {
			const container = document.createElement('div');
			container.innerHTML = `
                <span><video attr="value1"></video></span>
                <span><b><video></video></b></span>
                <video></video>
                <h1></h1>
                <h2></h2>
            `;
			expect(container.children[0].matches('span:has(video)')).toBe(true);
			expect(container.children[0].matches(':has(video[attr="value1"])')).toBe(true);
			expect(container.children[1].matches('span:has(+video)')).toBe(true);
			expect(container.children[3].matches(':has(+h2)')).toBe(true);
			expect(container.children[3].matches('h1:has(+h2)')).toBe(true);
		});

		it('Returns true for selector with CSS pseudo ":focus" and ":focus-visible"', () => {
			document.body.innerHTML = QuerySelectorHTML;
			const span = <HTMLElement>document.querySelector('span.class1');
			const div = <HTMLElement>document.querySelector('div.class1');

			expect(span.matches(':focus')).toBe(false);
			expect(span.matches(':focus-visible')).toBe(false);

			span.focus();

			expect(span.matches(':focus')).toBe(true);
			expect(span.matches(':focus-visible')).toBe(true);

			div.focus();

			expect(span.matches(':focus')).toBe(false);
			expect(span.matches(':focus-visible')).toBe(false);
			expect(div.matches(':focus')).toBe(true);
			expect(div.matches(':focus-visible')).toBe(true);
		});

		it('Throws an error when providing an invalid selector', () => {
			const div = document.createElement('div');
			div.innerHTML = '<div class="foo"></div>';
			const element = div.children[0];
			expect(() => element.matches('1')).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': '1' is not a valid selector.`
				)
			);
			expect(() => element.matches(':not')).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': ':not' is not a valid selector.`
				)
			);
			expect(() => element.matches(':is')).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': ':is' is not a valid selector.`
				)
			);
			expect(() => element.matches(':where')).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': ':where' is not a valid selector.`
				)
			);
			expect(() => element.matches('div:not')).toThrow(
				new window.DOMException(
					`Failed to execute 'matches' on 'HTMLDivElement': 'div:not' is not a valid selector.`
				)
			);
		});

		it('Ignores invalid selectors if option "ignoreErrors" is set to true', () => {
			const div = document.createElement('div');
			div.innerHTML = '<div class="foo"></div>';
			const element = div.children[0];
			expect(QuerySelector.matches(element, '1', { ignoreErrors: true })).toBe(null);
			expect(QuerySelector.matches(element, ':not', { ignoreErrors: true })).toBe(null);
			expect(QuerySelector.matches(element, ':is', { ignoreErrors: true })).toBe(null);
			expect(QuerySelector.matches(element, ':where', { ignoreErrors: true })).toBe(null);
			expect(QuerySelector.matches(element, 'div:not', { ignoreErrors: true })).toBe(null);
		});

		it('Returns element matching subsequent sibling selector using ".a ~ .b"', () => {
			const div = document.createElement('div');

			div.innerHTML = `
				<div class="a">a1</div>
				<div class="b">b1</div>
				<div class="c">c1</div>
				<div class="a">a2</div>
				<div class="b">b2</div>
				<div class="a">a3</div>
			`;

			const sibling = <HTMLElement>div.querySelector('.a ~ .b');

			expect(sibling.matches('.a ~ .b')).toBe(true);
			expect(sibling.matches('.a ~ .z')).toBe(false);

			// Test cache 1
			sibling.setAttribute('class', 'z');

			expect(sibling.matches('.a ~ .b')).toBe(false);
			expect(sibling.matches('.a ~ .z')).toBe(true);

			// Test cache 2
			div.innerHTML = `
                <div class="a">a1</div>
                <div class="b">b1</div>
                <div class="c">c1</div>
                <div class="a">a2</div>
                <div class="b">b2</div>
                <div class="a">a3</div>
            `;

			const sibling2 = <HTMLElement>div.querySelector('.a ~ .b');

			expect(sibling2.matches('.a ~ .b')).toBe(true);
			expect(sibling2.matches('.a ~ .z')).toBe(false);
		});

		it('Matches grouped selectors in the right order', () => {
			const div = document.createElement('div');

			div.innerHTML = `
				<div class>
            		<h1><span>Here is a heading</span></h1>
            		<div class="a">
              			<span>With a child span</span>
            		</div>
          		</div>
			`;

			expect(div.querySelector('.a,h1')).toBe(div.children[0].children[0]);
		});

		it('Matches grouped selectors with nesting', () => {
			const div = document.createElement('div');

			div.innerHTML = `
			 <div>
              <blockquote>
                <div class="a">
                  <ul>
                    <li><span>Item 1</span></li>
                    <li><span>Item 2</span></li>
                  </ul>
                </div>
              </blockquote>
            </div>
			`;

			expect(div.querySelector('.a,BLOCKQUOTE')).toBe(div.children[0].children[0]);
		});

		it('Matches element for pseudo selector ":scope"', () => {
			const div = document.createElement('div');

			div.innerHTML = `
                <span>Span 1</span>
                <span>Span 2</span>
                <a>Link 1</a>                        
                <a>Link 2</a>
            `;

			expect(div.matches(':scope')).toBe(true);
			expect(div.matches(':scope > span')).toBe(false);

			expect(div.children[0].matches(':scope')).toBe(true);
			expect(div.children[0].matches(':scope > span')).toBe(false);
		});

		it('Matches element for pseudo selector ":root"', () => {
			expect(document.documentElement.matches(':root')).toBe(true);

			const div = document.createElement('div');

			document.body.appendChild(div);

			expect(div.matches(':root')).toBe(false);
		});

		it('Matches unicode characters for #2034', () => {
			// Apostrophe in double-quoted attribute value
			document.body.innerHTML = `
            <label id="type d'activité-label">Type d'activité</label>
            <input aria-labelledby="type d'activité-label" />
            `;
			expect(!!document.querySelector('[id="type d\'activité-label"]')).toBe(true);

			// Test 2: Double quote in single-quoted attribute value
			document.body.innerHTML = `<div id='say "hello"'></div>`;
			expect(!!document.querySelector('[id=\'say "hello"\']')).toBe(true);

			// Test 3: Simple ID (control test)
			document.body.innerHTML = `<div id="simple"></div>`;
			expect(!!document.querySelector('[id="simple"]')).toBe(true);
		});
	});
});
