import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import CustomElement from '../../CustomElement';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement';
import Text from '../../../src/nodes/text/Text';
import Comment from '../../../src/nodes/comment/Comment';
import DocumentFragment from '../../../src/nodes/document-fragment/DocumentFragment';
import TreeWalker from '../../../src/tree-walker/TreeWalker';
import Node from '../../../src/nodes/node/Node';
import IDocument from '../../../src/nodes/document/IDocument';
import Element from '../../../src/nodes/element/Element';
import Event from '../../../src/event/Event';
import SVGSVGElement from '../../../src/nodes/svg-element/SVGSVGElement';
import NamespaceURI from '../../../src/config/NamespaceURI';
import Attr from '../../../src/nodes/attr/Attr';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility';
import QuerySelector from '../../../src/query-selector/QuerySelector';
import NodeFilter from '../../../src/tree-walker/NodeFilter';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement';
import IHTMLCollection from '../../../src/nodes/element/IHTMLCollection';
import IElement from '../../../src/nodes/element/IElement';
import INodeList from '../../../src/nodes/node/INodeList';
import IHTMLElement from '../../../src/nodes/html-element/IHTMLElement';
import IHTMLLinkElement from '../../../src/nodes/html-link-element/IHTMLLinkElement';
import IResponse from '../../../src/fetch/types/IResponse';
import ResourceFetch from '../../../src/fetch/ResourceFetch';
import IHTMLScriptElement from '../../../src/nodes/html-script-element/IHTMLScriptElement';
import DocumentReadyStateEnum from '../../../src/nodes/document/DocumentReadyStateEnum';
import ISVGElement from '../../../src/nodes/svg-element/ISVGElement';
import CustomEvent from '../../../src/event/events/CustomEvent';
import Selection from '../../../src/selection/Selection';
import Range from '../../../src/range/Range';
import ProcessingInstruction from '../../../src/nodes/processing-instruction/ProcessingInstruction';
import DOMException from '../../../src/exception/DOMException';

/* eslint-disable jsdoc/require-jsdoc */

describe('Document', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	for (const property of ['charset', 'characterSet']) {
		describe(`get ${property}()`, () => {
			it('Returns the value of a "charset" attribute set in a meta element.', () => {
				const meta = document.createElement('meta');

				meta.setAttribute('charset', 'windows-1252');

				document.head.appendChild(meta);

				expect(document[property]).toBe('windows-1252');
			});
		});
	}

	describe('get nodeName()', () => {
		it('Returns "#document".', () => {
			expect(document.nodeName).toBe('#document');
		});
	});

	describe('get children()', () => {
		it('Returns Element child nodes.', () => {
			document.appendChild(document.createTextNode('test'));
			expect(document.children.length).toEqual(1);
			expect(document.children[0] === document.documentElement).toBe(true);
		});
	});

	describe('get scripts()', () => {
		it('Returns script elements.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const script1 = document.createElement('script');
			const script2 = document.createElement('script');

			span1.appendChild(script1);
			span2.appendChild(script2);

			div.appendChild(span1);
			div.appendChild(span2);

			document.body.appendChild(div);

			const scripts = Array.from(document.scripts);

			expect(scripts.length).toBe(2);
			expect(scripts[0]).toBe(script1);
			expect(scripts[1]).toBe(script2);
		});
	});

	describe('get childElementCount()', () => {
		it('Returns child element count.', () => {
			document.appendChild(document.createElement('div'));
			document.appendChild(document.createTextNode('test'));
			expect(document.childElementCount).toEqual(2);
		});
	});

	describe('get firstElementChild()', () => {
		it('Returns first element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			div.appendChild(text1);
			div.appendChild(span1);
			div.appendChild(span2);
			div.appendChild(text2);

			expect(div.firstElementChild === span1).toBe(true);
		});
	});

	describe('get lastElementChild()', () => {
		it('Returns last element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			div.appendChild(text1);
			div.appendChild(span1);
			div.appendChild(span2);
			div.appendChild(text2);

			expect(div.lastElementChild === span2).toBe(true);
		});
	});

	describe('get cookie()', () => {
		it('Returns cookie string.', () => {
			document.cookie = 'name=value1';
			expect(document.cookie).toBe('name=value1');
		});
	});

	describe('set cookie()', () => {
		it('Sets multiple cookies.', () => {
			document.cookie = 'name1=value1';
			document.cookie = 'name2=value2';
			expect(document.cookie).toBe('name1=value1; name2=value2');
		});

		it('Replaces cookie with the same name, but treats cookies with no value set differently from cookies with a value.', () => {
			document.cookie = 'name=value1';
			document.cookie = 'name';
			document.cookie = 'name=value2';
			document.cookie = 'name';
			expect(document.cookie).toBe('name=value2; name');
		});

		it('Sets a cookie with a domain.', () => {
			window.location.href = 'https://test.com';
			document.cookie = 'name=value1; domain=test.com';
			expect(document.cookie).toBe('name=value1');
		});

		it('Sets a cookie with an invalid domain.', () => {
			window.location.href = 'https://test.com';
			document.cookie = 'name=value1; domain=invalid.com';
			expect(document.cookie).toBe('');
		});

		it('Sets a cookie on a top-domain from a sub-domain.', () => {
			window.location.href = 'https://sub.test.com';
			document.cookie = 'name=value1; domain=test.com';
			expect(document.cookie).toBe('name=value1');
		});

		it('Sets a cookie with a path.', () => {
			window.location.href = 'https://sub.test.com/path/to/cookie/';
			document.cookie = 'name1=value1; path=path/to';
			document.cookie = 'name2=value2; path=/path/to';
			document.cookie = 'name3=value3; path=/path/to/cookie/';
			expect(document.cookie).toBe('name1=value1; name2=value2; name3=value3');
		});

		it('Does not set cookie if the path does not match the current path.', () => {
			window.location.href = 'https://sub.test.com/path/to/cookie/';
			document.cookie = 'name1=value1; path=/cookie/';
			expect(document.cookie).toBe('');
		});

		it('Sets a cookie if it expires is in the future.', () => {
			const date = new Date();
			const oneHour = 3600000;
			date.setTime(date.getTime() + oneHour);
			const expires = date.toUTCString();
			document.cookie = `name=value1; expires=${expires}`;
			expect(document.cookie).toBe('name=value1');
		});

		it('Does not set cookie if "expires" is in the past.', () => {
			document.cookie = 'name=value1; expires=Thu, 01 Jan 1970 00:00:01 GMT';
			expect(document.cookie).toBe('');
		});

		it('Removes a previously defined cookie if "expires" is in the past, but treats cookies with no value set differently from cookies with a value.', () => {
			document.cookie = 'name=value1';
			document.cookie = 'name';
			document.cookie = 'name=value1; expires=Thu, 01 Jan 1970 00:00:01 GMT';
			expect(document.cookie).toBe('name');
			document.cookie = 'name; expires=Thu, 01 Jan 1970 00:00:01 GMT';
			expect(document.cookie).toBe('');
		});
	});

	describe('get title() and set title()', () => {
		it('Returns and sets title.', () => {
			document.title = 'test title';
			expect(document.title).toBe('test title');
			const title = document.head.querySelector('title');
			expect(title.textContent).toBe('test title');
			document.title = 'new title';
			expect(document.title).toBe('new title');
			expect(title.textContent).toBe('new title');
			title.textContent = 'new title 2';
			expect(document.title).toBe('new title 2');
		});
	});

	describe('get body()', () => {
		it('Returns <body> element.', () => {
			expect(document.body === document.children[0].children[1]).toBe(true);
		});
	});

	describe('get head()', () => {
		it('Returns <head> element.', () => {
			expect(document.head === document.children[0].children[0]).toBe(true);
		});
	});

	describe('get documentElement()', () => {
		it('Returns <html> element.', () => {
			expect(document.documentElement === document.children[0]).toBe(true);
		});
	});

	describe('get doctype()', () => {
		it('Returns DocumentType element.', () => {
			expect(document.doctype === document.childNodes[0]).toBe(true);
		});
	});

	describe('get styleSheets()', () => {
		it('Returns all stylesheets loaded to the document.', (done) => {
			const textNode = document.createTextNode(
				'body { background-color: red }\ndiv { background-color: green }'
			);
			const style = document.createElement('style');
			const link = <IHTMLLinkElement>document.createElement('link');
			let fetchedUrl = null;
			let fetchedInit = null;

			link.rel = 'stylesheet';
			link.href = '/path/to/file.css';

			jest.spyOn(window, 'fetch').mockImplementation((url, init) => {
				fetchedUrl = url;
				fetchedInit = init;
				return <Promise<IResponse>>Promise.resolve({
					text: () => Promise.resolve('button { background-color: red }'),
					ok: true
				});
			});

			style.appendChild(textNode);

			document.appendChild(style);
			document.appendChild(link);

			setTimeout(() => {
				expect(fetchedUrl).toBe('/path/to/file.css');
				expect(fetchedInit).toBe(undefined);

				const styleSheets = document.styleSheets;

				expect(styleSheets.length).toBe(2);
				expect(styleSheets[0].cssRules.length).toBe(1);
				expect(styleSheets[0].cssRules[0].cssText).toBe('button { background-color: red; }');
				expect(styleSheets[1].cssRules.length).toBe(2);
				expect(styleSheets[1].cssRules[0].cssText).toBe('body { background-color: red; }');
				expect(styleSheets[1].cssRules[1].cssText).toBe('div { background-color: green; }');

				done();
			}, 0);
		});
	});

	describe('get activeElement()', () => {
		it('Returns the currently active element.', () => {
			const div = <IHTMLElement>document.createElement('div');
			const span = <IHTMLElement>document.createElement('span');

			document.appendChild(div);
			document.appendChild(span);

			expect(document.activeElement === document.body).toBe(true);

			div.focus();

			expect(document.activeElement === div).toBe(true);

			span.focus();

			expect(document.activeElement === span).toBe(true);

			span.blur();

			expect(document.activeElement === document.body).toBe(true);
		});

		it('Unsets the active element when it gets disconnected.', () => {
			const div = <IHTMLElement>document.createElement('div');

			document.appendChild(div);

			expect(document.activeElement === document.body).toBe(true);

			div.focus();

			expect(document.activeElement === div).toBe(true);

			div.remove();

			expect(document.activeElement === document.body).toBe(true);
		});

		it('Returns the first custom element that has document as root node when the focused element is nestled in multiple shadow roots.', () => {
			class CustomElementA extends (<Window>window).HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode: 'open' });
				}

				public connectedCallback(): void {
					this.shadowRoot.innerHTML = `
						<div>
							<custom-element-b></custom-element-b>
						</div>
					`;
				}
			}
			class CustomElementB extends (<Window>window).HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode: 'open' });
				}

				public connectedCallback(): void {
					this.shadowRoot.innerHTML = `
						<div>
							<button tabindex="0"></button>
						</div>
					`;
				}
			}

			window.customElements.define('custom-element-a', CustomElementA);
			window.customElements.define('custom-element-b', CustomElementB);

			const customElementA = document.createElement('custom-element-a');
			const div = document.createElement('div');
			div.appendChild(customElementA);
			document.body.appendChild(div);

			const button = <IHTMLElement>(
				(<IHTMLElement>(
					customElementA.shadowRoot.querySelector('custom-element-b')
				)).shadowRoot.querySelector('button')
			);

			let focusCalls = 0;
			button.addEventListener('focus', () => focusCalls++);

			button.focus();
			button.focus();

			expect(document.activeElement === customElementA).toBe(true);
			expect(focusCalls).toBe(1);
		});
	});

	describe('get scrollingElement()', () => {
		it('Returns document element as scrolling element.', () => {
			expect(document.scrollingElement === document.documentElement).toBe(true);
		});
	});

	describe('get location()', () => {
		it('Returns the current location', () => {
			expect(document.location === window.location).toBe(true);
		});
	});

	describe('get baseURI()', () => {
		it('Returns location.href.', () => {
			document.location.href = 'https://localhost:8080/base/path/to/script/?key=value=1#test';

			expect(document.baseURI).toBe('https://localhost:8080/base/path/to/script/?key=value=1#test');
		});

		it('Returns the "href" attribute set on a <base> element.', () => {
			document.location.href = 'https://localhost:8080/base/path/to/script/?key=value=1#test';

			const base = document.createElement('base');
			base.setAttribute('href', 'https://www.test.test/base/path/to/script/?key=value=1#test');
			document.documentElement.appendChild(base);

			expect(document.baseURI).toBe('https://www.test.test/base/path/to/script/?key=value=1#test');
		});
	});

	describe('URL', () => {
		it('Returns the URL of the document.', () => {
			document.location.href = 'http://localhost:8080/path/to/file.html';
			expect(document.URL).toBe('http://localhost:8080/path/to/file.html');
		});
	});
	describe('documentURI', () => {
		it('Returns the documentURI of the document.', () => {
			document.location.href = 'http://localhost:8080/path/to/file.html';
			expect(document.documentURI).toBe('http://localhost:8080/path/to/file.html');
		});
	});

	describe('append()', () => {
		it('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.append(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('prepend()', () => {
		it('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'prepend').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.prepend(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceChildren()', () => {
		it('Replaces the existing children of a ParentNode with a specified new set of children.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest
				.spyOn(ParentNodeUtility, 'replaceChildren')
				.mockImplementation((parentNode, ...nodes) => {
					expect(parentNode === document).toBe(true);
					expect(nodes.length).toBe(2);
					expect(nodes[0] === node1).toBe(true);
					expect(nodes[1] === node2).toBe(true);
					isCalled = true;
				});

			document.replaceChildren(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		it('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode === document).toBe(true);
				expect(selector).toEqual(expectedSelector);
				return <INodeList<IElement>>[element];
			});

			const result = document.querySelectorAll(expectedSelector);

			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('querySelector()', () => {
		it('Query CSS selector to find a matching element.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode === document).toBe(true);
				expect(selector).toEqual(expectedSelector);
				return element;
			});

			expect(document.querySelector(expectedSelector) === element).toBe(true);
		});
	});

	describe('getElementsByClassName()', () => {
		it('Returns an elements by class name.', () => {
			const element = document.createElement('div');
			const className = 'className';

			jest
				.spyOn(ParentNodeUtility, 'getElementsByClassName')
				.mockImplementation((parentNode, requestedClassName) => {
					expect(parentNode === document).toBe(true);
					expect(requestedClassName).toEqual(className);
					return <IHTMLCollection<IElement, IElement>>[element];
				});

			const result = document.getElementsByClassName(className);
			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('getElementsByTagName()', () => {
		it('Returns an elements by tag name.', () => {
			const element = document.createElement('div');
			const tagName = 'tag-name';

			jest
				.spyOn(ParentNodeUtility, 'getElementsByTagName')
				.mockImplementation((parentNode, requestedTagName) => {
					expect(parentNode === document).toBe(true);
					expect(requestedTagName).toEqual(tagName);
					return <IHTMLCollection<IElement, IElement>>[element];
				});

			const result = document.getElementsByTagName(tagName);
			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		it('Returns an elements by tag name and namespace.', () => {
			const element = document.createElement('div');
			const tagName = 'tag-name';
			const namespaceURI = '/namespace/uri/';

			jest
				.spyOn(ParentNodeUtility, 'getElementsByTagNameNS')
				.mockImplementation((parentNode, requestedNamespaceURI, requestedTagName) => {
					expect(parentNode === document).toBe(true);
					expect(requestedNamespaceURI).toEqual(namespaceURI);
					expect(requestedTagName).toEqual(tagName);
					return <IHTMLCollection<IElement, IElement>>[element];
				});

			const result = document.getElementsByTagNameNS(namespaceURI, tagName);

			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('getElementById()', () => {
		it('Returns an element by ID.', () => {
			const element = document.createElement('div');
			const id = 'id';

			jest
				.spyOn(ParentNodeUtility, 'getElementById')
				.mockImplementation((parentNode, requestedID) => {
					expect(parentNode === document).toBe(true);
					expect(requestedID).toEqual(id);
					return element;
				});

			expect(document.getElementById(id) === element).toBe(true);
		});
	});

	describe('getElementsByName()', () => {
		it('Returns elements by name.', () => {
			const parent = document.createElement('div');
			parent.innerHTML = `<img alt="" name="image" src=""/><img alt="" name="image" src=""/><img alt="" name="image" src=""/><img alt="" name="image" src=""/><meta name="test"><p name="test"><span name="test">test</span></p></meta>`;
			document.appendChild(parent);
			expect(document.getElementsByName('image').length).toBe(4);
			expect(document.getElementsByName('test').length).toBe(3);
		});
	});

	describe('appendChild()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(document.createComment('test'));
			document.appendChild(div);
			document.appendChild(document.createComment('test'));
			document.appendChild(span);

			expect(document.children.length).toBe(2);
			expect(document.children[0]).toBe(div);
			expect(document.children[1]).toBe(span);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the children instead of the actual element if the type is DocumentFragment.', () => {
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const clone = template.content.cloneNode(true);

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(clone);

			expect(clone.childNodes.length).toBe(0);
			expect(clone.children.length).toBe(0);
			expect(document.children.map((child) => child.outerHTML).join('')).toBe(
				'<div>Div</div><span>Span</span>'
			);
		});
	});

	describe('removeChild()', () => {
		it('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(document.createComment('test'));
			document.appendChild(div);
			document.appendChild(document.createComment('test'));
			document.appendChild(span);

			document.removeChild(div);

			expect(document.children.length).toBe(1);
			expect(document.children[0]).toBe(span);
		});
	});

	describe('insertBefore()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(document.createComment('test'));
			document.appendChild(div1);
			document.appendChild(document.createComment('test'));
			document.appendChild(span);
			document.insertBefore(div2, div1);

			expect(document.children.length).toBe(3);
			expect(document.children[0]).toBe(div2);
			expect(document.children[1]).toBe(div1);
			expect(document.children[2]).toBe(span);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Insert the children instead of the actual element before another reference Node if the type is DocumentFragment.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Template DIV 1</div><span>Template SPAN 1</span>';

			const clone = template.content.cloneNode(true);

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(child1);
			document.appendChild(child2);

			document.insertBefore(clone, child2);

			expect(document.children.length).toBe(4);
			expect(document.children.map((child) => child.outerHTML).join('')).toBe(
				'<span></span><div>Template DIV 1</div><span>Template SPAN 1</span><span></span>'
			);
		});
	});

	describe('write()', () => {
		it('Replaces the content of documentElement with new content the first time it is called and writes the body part to the body the second time.', () => {
			const html = `
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
			`;
			document.write(html);
			document.write(html);
			expect(document.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
						<span>Body</span>
					</body>
				</html>
				`.replace(/[\s]/gm, '')
			);
		});

		it('Adds elements outside of the <html> tag to the <body> tag.', () => {
			const html = `
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
				<div>Should be added to body</div>
			`;
			document.write(html);
			expect(document.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
						<div>Should be added to body</div>
					</body>
				</html>
				`.replace(/[\s]/gm, '')
			);
		});
	});

	describe('open()', () => {
		it('Clears the document and opens it for writing.', () => {
			const html = `
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
			`;
			document.write(html);
			document.open();
			document.write(html);
			expect(document.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
				html.replace(/[\s]/gm, '')
			);
		});
	});

	describe('close()', () => {
		it('Has a close method.', () => {
			document.close();
			expect(typeof document.close).toBe('function');
		});
	});

	describe('createElement()', () => {
		it('Creates an element.', () => {
			const div = document.createElement('div');
			expect(div.tagName).toBe('DIV');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof HTMLElement).toBe(true);
		});

		it('Creates an svg element.', () => {
			const div = document.createElement('svg');
			expect(div.tagName).toBe('SVG');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof SVGSVGElement).toBe(true);
		});

		it('Creates a custom element.', () => {
			window.customElements.define('custom-element', CustomElement);
			const div = document.createElement('custom-element');
			expect(div.tagName).toBe('CUSTOM-ELEMENT');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof CustomElement).toBe(true);
		});

		it('Creates a custom element that has been extended from an "li" element.', () => {
			window.customElements.define('custom-element', CustomElement, { extends: 'li' });
			const div = document.createElement('li', { is: 'custom-element' });
			expect(div.tagName).toBe('LI');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof CustomElement).toBe(true);
		});
	});

	describe('createElementNS()', () => {
		it('Creates an svg element with namespace set to SVG.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			expect(svg.tagName).toBe('SVG');
			expect(svg.namespaceURI).toBe(NamespaceURI.svg);
			expect(svg instanceof SVGSVGElement).toBe(true);
		});

		it('Creates a custom element with namespace set to SVG.', () => {
			window.customElements.define('custom-element', CustomElement);
			const div = document.createElementNS(NamespaceURI.svg, 'custom-element');
			expect(div.tagName).toBe('CUSTOM-ELEMENT');
			expect(div.namespaceURI).toBe(NamespaceURI.svg);
			expect(div instanceof CustomElement).toBe(true);
		});

		it('Creates a custom element that has been extended from an "li" element with namespace set to SVG.', () => {
			window.customElements.define('custom-element', CustomElement, { extends: 'li' });
			const div = document.createElementNS(NamespaceURI.svg, 'li', { is: 'custom-element' });
			expect(div.tagName).toBe('LI');
			expect(div.namespaceURI).toBe(NamespaceURI.svg);
			expect(div instanceof CustomElement).toBe(true);
		});

		it('Creates a custom element with namespace set to SVG and can set the style.', () => {
			const svg = <ISVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
			svg.style.cssText = 'user-select:none;';
			expect(svg.style.cssText).toBe('user-select: none;');
		});

		it("Creates an element when tag name isn't a string.", () => {
			const element = <ISVGElement>document.createElementNS(null, <string>(<unknown>true));
			expect(element.tagName).toBe('TRUE');
		});
	});

	describe('createAttribute()', () => {
		it('Creates an Attr node.', () => {
			const attribute = document.createAttribute('KEY1');

			expect(attribute instanceof Attr).toBe(true);

			expect(attribute.value).toBe(null);
			expect(attribute.name).toBe('key1');
			expect(attribute.namespaceURI).toBe(null);
			expect(attribute.specified).toBe(true);
			expect(attribute.ownerElement === null).toBe(true);
			expect(attribute.ownerDocument === document).toBe(true);
		});
	});

	describe('createAttributeNS()', () => {
		it('Creates an Attr node with namespace set to HTML.', () => {
			const attribute = document.createAttributeNS(NamespaceURI.html, 'KEY1');

			expect(attribute instanceof Attr).toBe(true);

			expect(attribute.value).toBe(null);
			expect(attribute.name).toBe('KEY1');
			expect(attribute.namespaceURI).toBe(NamespaceURI.html);
			expect(attribute.specified).toBe(true);
			expect(attribute.ownerElement === null).toBe(true);
			expect(attribute.ownerDocument === document).toBe(true);
		});

		it('Creates an Attr node with namespace set to SVG.', () => {
			const attribute = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			expect(attribute instanceof Attr).toBe(true);

			expect(attribute.value).toBe(null);
			expect(attribute.name).toBe('KEY1');
			expect(attribute.namespaceURI).toBe(NamespaceURI.svg);
			expect(attribute.specified).toBe(true);
			expect(attribute.ownerElement === null).toBe(true);
			expect(attribute.ownerDocument === document).toBe(true);
		});
	});

	describe('createTextNode()', () => {
		it('Creates a text node.', () => {
			const textContent = 'text';
			const textNode = document.createTextNode(textContent);
			expect(textNode.textContent).toBe(textContent);
			expect(textNode instanceof Text).toBe(true);
		});

		it('Creates a text node without content.', () => {
			const textNode = document.createTextNode();
			expect(textNode.data).toBe('');
		});
	});

	describe('createComment()', () => {
		it('Creates a comment node.', () => {
			const textContent = 'text';
			const commentNode = document.createComment(textContent);
			expect(commentNode.textContent).toBe(textContent);
			expect(commentNode instanceof Comment).toBe(true);
		});

		it('Creates a comment node without content.', () => {
			const commentNode = document.createComment();
			expect(commentNode.data).toBe('');
		});
	});

	describe('createDocumentFragment()', () => {
		it('Creates a document fragment.', () => {
			const documentFragment = document.createDocumentFragment();
			expect(documentFragment.ownerDocument).toBe(document);
			expect(documentFragment instanceof DocumentFragment).toBe(true);
		});
	});

	describe('createTreeWalker()', () => {
		it('Creates a document fragment.', () => {
			const root = document.createElement('div');
			const whatToShow = 1;
			const filter = {
				acceptNode: (node) => {
					if (node === Node.ELEMENT_NODE) {
						return NodeFilter.FILTER_ACCEPT;
					}
					return NodeFilter.FILTER_REJECT;
				}
			};
			const treeWalker = document.createTreeWalker(root, whatToShow, filter);
			expect(treeWalker.root === root).toBe(true);
			expect(treeWalker.whatToShow).toBe(whatToShow);
			expect(treeWalker.filter).toBe(filter);
			expect(treeWalker instanceof TreeWalker).toBe(true);
		});
	});

	describe('createEvent()', () => {
		it('Creates a legacy event.', () => {
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			expect(event.type).toBe('click');
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(true);
			expect(event instanceof Event).toBe(true);
		});

		it('Creates a legacy custom event.', () => {
			const event = <CustomEvent>document.createEvent('CustomEvent');
			const detail = {};
			event.initCustomEvent('click', true, true, detail);
			expect(event.type).toBe('click');
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(true);
			expect(event.detail).toBe(detail);
			expect(event instanceof CustomEvent).toBe(true);
		});
	});

	describe('importNode()', () => {
		it('Creates a clone of a Node and sets the ownerDocument to be the current document.', () => {
			const node = new Window().document.createElement('div');
			const clone = <Element>document.importNode(node);
			expect(clone.tagName).toBe('DIV');
			expect(clone.ownerDocument === document).toBe(true);
			expect(clone instanceof HTMLElement).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the properties of the document when cloned.', () => {
			const child = document.createElement('div');
			child.className = 'className';

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(child);

			const clone = document.cloneNode(false);
			const clone2 = document.cloneNode(true);
			expect(clone.defaultView === window).toBe(true);
			expect(clone.children.length).toBe(0);
			expect(clone2.children.length).toBe(1);
			expect(clone2.children[0].outerHTML).toBe('<div class="className"></div>');
		});
	});

	describe('adoptNode()', () => {
		it('Removes node from its original document and sets the ownerDocument to be the current document.', () => {
			const originalDocument = new Window().document;
			const node = originalDocument.createElement('div');
			originalDocument.body.append(node);
			const adopted = <Element>document.adoptNode(node);

			expect(adopted.tagName).toBe('DIV');
			expect(adopted instanceof HTMLElement).toBe(true);
			expect(adopted.ownerDocument === document).toBe(true);
			expect(originalDocument.querySelector('div')).toBe(null);
		});

		it('Just change the ownerDocument of the node to be the current document, if the original document does not have node inside tree.', () => {
			const node = new Window().document.createElement('div');
			const adopted = <Element>document.adoptNode(node);

			expect(adopted.tagName).toBe('DIV');
			expect(adopted instanceof HTMLElement).toBe(true);
			expect(adopted.ownerDocument === document).toBe(true);
		});
	});

	describe('addEventListener()', () => {
		it('Triggers "readystatechange" event if no resources needs to be loaded.', (done) => {
			let readyChangeEvent = null;

			document.addEventListener('readystatechange', (event) => {
				readyChangeEvent = event;
			});

			expect(document.readyState).toBe(DocumentReadyStateEnum.interactive);

			setTimeout(() => {
				expect(readyChangeEvent.target).toBe(document);
				expect(document.readyState).toBe(DocumentReadyStateEnum.complete);
				done();
			}, 1);
		});

		it('Triggers "readystatechange" event when all resources have been loaded.', (done) => {
			const cssURL = '/path/to/file.css';
			const jsURL = '/path/to/file.js';
			const cssResponse = 'body { background-color: red; }';
			const jsResponse = 'globalThis.test = "test";';
			let resourceFetchCSSDocument = null;
			let resourceFetchCSSURL = null;
			let resourceFetchJSDocument = null;
			let resourceFetchJSURL = null;
			let readyChangeEvent = null;

			jest
				.spyOn(ResourceFetch, 'fetch')
				.mockImplementation(async (document: IDocument, url: string) => {
					if (url.endsWith('.css')) {
						resourceFetchCSSDocument = document;
						resourceFetchCSSURL = url;
						return cssResponse;
					}

					resourceFetchJSDocument = document;
					resourceFetchJSURL = url;
					return jsResponse;
				});

			document.addEventListener('readystatechange', (event) => {
				readyChangeEvent = event;
			});

			const script = <IHTMLScriptElement>document.createElement('script');
			script.async = true;
			script.src = jsURL;

			const link = <IHTMLLinkElement>document.createElement('link');
			link.href = cssURL;
			link.rel = 'stylesheet';

			document.body.appendChild(script);
			document.body.appendChild(link);

			expect(document.readyState).toBe(DocumentReadyStateEnum.interactive);

			setTimeout(() => {
				expect(resourceFetchCSSDocument).toBe(document);
				expect(resourceFetchCSSURL).toBe(cssURL);
				expect(resourceFetchJSDocument).toBe(document);
				expect(resourceFetchJSURL).toBe(jsURL);
				expect(readyChangeEvent.target).toBe(document);
				expect(document.readyState).toBe(DocumentReadyStateEnum.complete);
				expect(document.styleSheets.length).toBe(1);
				expect(document.styleSheets[0].cssRules[0].cssText).toBe(cssResponse);

				expect(window['test']).toBe('test');

				delete window['test'];

				done();
			}, 0);
		});
	});

	describe('getSelection()', () => {
		it('Returns an instance of Selection.', () => {
			expect(document.getSelection() instanceof Selection).toBe(true);
		});

		it('Returns the same instance when called multiple times.', () => {
			const selection1 = document.getSelection();
			const selection2 = document.getSelection();
			expect(selection1 === selection2).toBe(true);
		});
	});

	describe('createRange()', () => {
		it('Returns an instance of Range.', () => {
			expect(document.createRange() instanceof Range).toBe(true);
		});
	});

	describe('hasFocus()', () => {
		it('Returns "true" if activeElement has focus.', () => {
			expect(document.hasFocus()).toBe(true);
			document.documentElement.remove();
			expect(document.hasFocus()).toBe(false);
		});
	});

	describe('dispatchEvent()', () => {
		it('Bubbles events to Window.', () => {
			const event = new Event('click', { bubbles: true });
			let emittedEvent = null;

			window.addEventListener('click', (event) => (emittedEvent = event));
			document.dispatchEvent(event);

			expect(emittedEvent).toBe(event);
		});
	});

	describe('createProcessingInstruction()', () => {
		it('Creates a Processing Instruction node with target & data.', () => {
			const instruction = document.createProcessingInstruction('foo', 'bar');
			expect(instruction instanceof ProcessingInstruction).toBe(true);
			expect(instruction).toEqual(
				expect.objectContaining({
					target: 'foo',
					data: 'bar',
					ownerDocument: document
				})
			);
		});

		it('Throws an exception if target is invalid".', () => {
			expect.assertions(1);
			try {
				document.createProcessingInstruction('-foo', 'bar');
			} catch (e) {
				expect(e).toEqual(
					new DOMException(
						`Failed to execute 'createProcessingInstruction' on 'Document': The target provided ('-foo') is not a valid name.`
					)
				);
			}
		});

		it('Throws an exception if data contains "?>".', () => {
			expect.assertions(1);
			try {
				document.createProcessingInstruction('foo', 'bar?>');
			} catch (e) {
				expect(e).toEqual(
					new DOMException(
						`Failed to execute 'createProcessingInstruction' on 'Document': The data provided ('?>') contains '?>'`
					)
				);
			}
		});
	});
});
