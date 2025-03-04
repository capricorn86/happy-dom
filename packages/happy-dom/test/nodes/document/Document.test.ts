import Window from '../../../src/window/Window.js';
import CustomElement from '../../CustomElement.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import Text from '../../../src/nodes/text/Text.js';
import Comment from '../../../src/nodes/comment/Comment.js';
import DocumentFragment from '../../../src/nodes/document-fragment/DocumentFragment.js';
import NodeIterator from '../../../src/tree-walker/NodeIterator.js';
import TreeWalker from '../../../src/tree-walker/TreeWalker.js';
import Node from '../../../src/nodes/node/Node.js';
import Document from '../../../src/nodes/document/Document.js';
import Element from '../../../src/nodes/element/Element.js';
import Event from '../../../src/event/Event.js';
import SVGSVGElement from '../../../src/nodes/svg-svg-element/SVGSVGElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import Attr from '../../../src/nodes/attr/Attr.js';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility.js';
import QuerySelector from '../../../src/query-selector/QuerySelector.js';
import NodeFilter from '../../../src/tree-walker/NodeFilter.js';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement.js';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';
import NodeList from '../../../src/nodes/node/NodeList.js';
import HTMLLinkElement from '../../../src/nodes/html-link-element/HTMLLinkElement.js';
import Response from '../../../src/fetch/Response.js';
import ResourceFetch from '../../../src/fetch/ResourceFetch.js';
import HTMLScriptElement from '../../../src/nodes/html-script-element/HTMLScriptElement.js';
import DocumentReadyStateEnum from '../../../src/nodes/document/DocumentReadyStateEnum.js';
import CustomEvent from '../../../src/event/events/CustomEvent.js';
import Selection from '../../../src/selection/Selection.js';
import Range from '../../../src/range/Range.js';
import ProcessingInstruction from '../../../src/nodes/processing-instruction/ProcessingInstruction.js';
import DOMException from '../../../src/exception/DOMException.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Fetch from '../../../src/fetch/Fetch.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import HTMLUnknownElement from '../../../src/nodes/html-unknown-element/HTMLUnknownElement.js';
import EventTarget from '../../../src/event/EventTarget.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import SVGPolygonElement from '../../../src/nodes/svg-polygon-element/SVGPolygonElement.js';
import SVGFETurbulenceElement from '../../../src/nodes/svg-fe-turbulence-element/SVGFETurbulenceElement.js';

/* eslint-disable jsdoc/require-jsdoc */

describe('Document', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	for (const event of [
		'readystatechange',
		'pointerlockchange',
		'pointerlockerror',
		'beforecopy',
		'beforecut',
		'beforepaste',
		'freeze',
		'prerenderingchange',
		'resume',
		'search',
		'visibilitychange',
		'fullscreenchange',
		'fullscreenerror',
		'webkitfullscreenchange',
		'webkitfullscreenerror',
		'beforexrselect',
		'abort',
		'beforeinput',
		'beforematch',
		'beforetoggle',
		'blur',
		'cancel',
		'canplay',
		'canplaythrough',
		'change',
		'click',
		'close',
		'contentvisibilityautostatechange',
		'contextlost',
		'contextmenu',
		'contextrestored',
		'cuechange',
		'dblclick',
		'drag',
		'dragend',
		'dragenter',
		'dragleave',
		'dragover',
		'dragstart',
		'drop',
		'durationchange',
		'emptied',
		'ended',
		'error',
		'focus',
		'formdata',
		'input',
		'invalid',
		'keydown',
		'keypress',
		'keyup',
		'load',
		'loadeddata',
		'loadedmetadata',
		'loadstart',
		'mousedown',
		'mouseenter',
		'mouseleave',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'mousewheel',
		'pause',
		'play',
		'playing',
		'progress',
		'ratechange',
		'reset',
		'resize',
		'scroll',
		'securitypolicyviolation',
		'seeked',
		'seeking',
		'select',
		'slotchange',
		'stalled',
		'submit',
		'suspend',
		'timeupdate',
		'toggle',
		'volumechange',
		'waiting',
		'webkitanimationend',
		'webkitanimationiteration',
		'webkitanimationstart',
		'webkittransitionend',
		'wheel',
		'auxclick',
		'gotpointercapture',
		'lostpointercapture',
		'pointerdown',
		'pointermove',
		'pointerrawupdate',
		'pointerup',
		'pointercancel',
		'pointerover',
		'pointerout',
		'pointerenter',
		'pointerleave',
		'selectstart',
		'selectionchange',
		'animationend',
		'animationiteration',
		'animationstart',
		'transitionrun',
		'transitionstart',
		'transitionend',
		'transitioncancel',
		'copy',
		'cut',
		'paste',
		'scrollend',
		'scrollsnapchange',
		'scrollsnapchanging'
	]) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				document[`on${event}`] = () => {
					window['test'] = 1;
				};
				expect(document[`on${event}`]).toBeTypeOf('function');
				document[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				document[`on${event}`] = () => {
					window['test'] = 1;
				};
				document.dispatchEvent(new Event(event));
				expect(window['test']).toBe(1);
			});
		});
	}

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

	describe('get referrer()', () => {
		it('Returns empty string.', () => {
			expect(document.referrer).toBe('');
		});
	});

	describe('get nodeName()', () => {
		it('Returns "#document".', () => {
			expect(document.nodeName).toBe('#document');
		});
	});

	describe('get children()', () => {
		it('Returns Element child nodes.', () => {
			document.appendChild(document.createComment('test'));
			expect(document.children.length).toEqual(1);
			expect(document.children[0] === document.documentElement).toBe(true);
		});

		it('Is a getter.', () => {
			expect(typeof Object.getOwnPropertyDescriptor(Document.prototype, 'children')?.get).toBe(
				'function'
			);
		});
	});

	describe('get links()', () => {
		it('Returns a elements.', () => {
			const link1 = document.createElement('a');
			const link2 = document.createElement('a');
			link1.setAttribute('href', '');

			document.body.appendChild(link1);
			document.body.appendChild(link2);

			let links = document.links;

			expect(links.length).toBe(1);
			expect(links[0]).toBe(link1);

			link2.setAttribute('href', '');
			links = document.links;
			expect(links.length).toBe(2);
			expect(links[0]).toBe(link1);
			expect(links[1]).toBe(link2);
		});
	});

	describe('get forms()', () => {
		it('Returns a elements.', () => {
			const form1 = document.createElement('form');
			const form2 = document.createElement('form');

			document.body.appendChild(form1);
			document.body.appendChild(form2);

			const forms = document.forms;

			expect(forms).toBeInstanceOf(HTMLCollection);
			expect(forms.length).toBe(2);
			expect(forms[0]).toBe(form1);
			expect(forms[1]).toBe(form2);
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
			document.body.appendChild(document.createElement('div'));
			document.body.appendChild(document.createTextNode('test'));
			expect(document.body.childElementCount).toEqual(1);
		});
	});

	describe('get firstElementChild()', () => {
		it('Returns first element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of Array.from(document.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
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

			for (const node of Array.from(document.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
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

		it('Unset previous cookie.', () => {
			document.cookie = 'name=Dave; expires=Thu, 01 Jan 2030 00:00:00 GMT;';
			expect(document.cookie).toBe('name=Dave');
			document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
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

	describe('get title()', () => {
		it('Returns title trimmed.', () => {
			document.write(`<html>
                <head>
                    <meta charset="utf-8">
                    <title>
                        Hello world!
                    </title>
                </head>
                <body></body>
            </html>`);

			expect(document.title).toBe('Hello world!');
		});

		it('Returns empty string if no title is set.', () => {
			document.write(`<html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body></body>
            </html>`);

			expect(document.title).toBe('');
		});

		it('Should only return the data of Text nodes inside the HTMLTitleElement', () => {
			document.write(`<html>
                <head>
                    <meta charset="utf-8">
                    <title>
                        Hello world! <span class="highlight">Isn't this wonderful</span> really?
                    </title>
                </head>
                <body></body>
            </html>`);

			expect(document.title).toBe('Hello world!  really?');
		});
	});

	describe('set title()', () => {
		it('Sets text content of HTMLTitleElement.', () => {
			document.write(`<html><head><title>Hello world!</title></head><body></body></html>`);

			document.title = '  New title!  ';

			expect(document.documentElement.outerHTML).toBe(
				'<html><head><title>  New title!  </title></head><body></body></html>'
			);

			expect(document.title).toBe('New title!');
		});

		it('Creates a new title element if it does not exist.', () => {
			document.write(`<html><head></head><body></body></html>`);

			document.title = '  New title!  ';

			expect(document.documentElement.outerHTML).toBe(
				'<html><head><title>  New title!  </title></head><body></body></html>'
			);

			expect(document.title).toBe('New title!');
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
			document.write('<!DOCTYPE html>');
			expect(document.doctype === document.childNodes[0]).toBe(true);
		});
	});

	describe('get styleSheets()', () => {
		it('Returns all stylesheets loaded to the document.', async () => {
			await new Promise((resolve) => {
				const textNode = document.createTextNode(
					'body { background-color: red }\ndiv { background-color: green }'
				);
				const style = document.createElement('style');
				const link = document.createElement('link');
				let fetchedUrl: string | null = null;

				link.rel = 'stylesheet';
				link.href = 'https://localhost:8080/path/to/file.css';

				vi.spyOn(Fetch.prototype, 'send').mockImplementation(function () {
					fetchedUrl = this.request.url;
					return <Promise<Response>>Promise.resolve({
						text: () => Promise.resolve('button { background-color: red }'),
						ok: true
					});
				});

				style.appendChild(textNode);

				document.body.appendChild(style);
				document.body.appendChild(link);

				setTimeout(() => {
					expect(fetchedUrl).toBe('https://localhost:8080/path/to/file.css');

					const styleSheets = document.styleSheets;

					expect(styleSheets.length).toBe(2);
					expect(styleSheets[0].cssRules.length).toBe(2);
					expect(styleSheets[0].cssRules[0].cssText).toBe('body { background-color: red; }');
					expect(styleSheets[0].cssRules[1].cssText).toBe('div { background-color: green; }');
					expect(styleSheets[1].cssRules.length).toBe(1);
					expect(styleSheets[1].cssRules[0].cssText).toBe('button { background-color: red; }');

					resolve(null);
				}, 0);
			});
		});
	});

	describe('get activeElement()', () => {
		it('Returns the currently active element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			document.body.appendChild(div);
			document.body.appendChild(span);

			expect(document.activeElement === document.body).toBe(true);

			div.focus();

			expect(document.activeElement === div).toBe(true);

			span.focus();

			expect(document.activeElement === span).toBe(true);

			span.blur();

			expect(document.activeElement === document.body).toBe(true);
		});

		it('Unsets the active element when it gets disconnected.', () => {
			const div = document.createElement('div');

			document.body.appendChild(div);

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
					(<ShadowRoot>this.shadowRoot).innerHTML = `
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
					(<ShadowRoot>this.shadowRoot).innerHTML = `
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

			const button = <HTMLElement>(
				(<HTMLElement>(
					customElementA.shadowRoot?.querySelector('custom-element-b')
				)).shadowRoot?.querySelector('button')
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

	describe('get URL()', () => {
		it('Returns the URL of the document.', () => {
			document.location.href = 'http://localhost:8080/path/to/file.html';
			expect(document.URL).toBe('http://localhost:8080/path/to/file.html');
		});
	});

	describe('get documentURI()', () => {
		it('Returns the documentURI of the document.', () => {
			document.location.href = 'http://localhost:8080/path/to/file.html';
			expect(document.documentURI).toBe('http://localhost:8080/path/to/file.html');
		});
	});
	describe('get domain()', () => {
		it('Returns hostname.', () => {
			document.location.href = 'http://localhost:8080/path/to/file.html';
			expect(document.domain).toBe('localhost');
		});
	});

	describe('append()', () => {
		it('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document.body).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.body.append(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('prepend()', () => {
		it('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ParentNodeUtility, 'prepend').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document.body).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.body.prepend(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceChildren()', () => {
		it('Replaces the existing children of a ParentNode with a specified new set of children.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ParentNodeUtility, 'replaceChildren').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document.body).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.body.replaceChildren(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		it('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			vi.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode === document).toBe(true);
				expect(selector).toEqual(expectedSelector);
				return new NodeList(PropertySymbol.illegalConstructor, [element]);
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

			vi.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode === document).toBe(true);
				expect(selector).toEqual(expectedSelector);
				return element;
			});

			expect(document.querySelector(expectedSelector) === element).toBe(true);
		});
	});

	describe('queryCommandSupported', () => {
		it('Returns true if the command is supported.', () => {
			// It's just a simple simulation implementation, and it will return true no matter what parameters are passed.
			expect(document.queryCommandSupported('copy')).toBe(true);
			expect(document.queryCommandSupported('selectall')).toBe(true);
		});
		it('Throws an error if the command is not passed.', () => {
			// @ts-ignore - Intentionally testing without parameters.
			expect(() => document.queryCommandSupported()).toThrowError(
				new TypeError(
					"Failed to execute 'queryCommandSupported' on 'Document': 1 argument required, but only 0 present."
				)
			);
		});
	});

	describe('getElementsByClassName()', () => {
		it('Returns an elements by class name.', () => {
			const element = document.createElement('div');
			const className = 'className';

			vi.spyOn(ParentNodeUtility, 'getElementsByClassName').mockImplementation(
				(parentNode, requestedClassName) => {
					expect(parentNode === document).toBe(true);
					expect(requestedClassName).toEqual(className);
					return new HTMLCollection(PropertySymbol.illegalConstructor, () => [element]);
				}
			);

			const result = document.getElementsByClassName(className);
			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('getElementsByTagName()', () => {
		it('Returns an elements by tag name.', () => {
			const element = document.createElement('div');
			const tagName = 'tag-name';

			vi.spyOn(ParentNodeUtility, 'getElementsByTagName').mockImplementation(
				(parentNode, requestedTagName) => {
					expect(parentNode === document).toBe(true);
					expect(requestedTagName).toEqual(tagName);
					return new HTMLCollection(PropertySymbol.illegalConstructor, () => [element]);
				}
			);

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

			vi.spyOn(ParentNodeUtility, 'getElementsByTagNameNS').mockImplementation(
				(parentNode, requestedNamespaceURI, requestedTagName) => {
					expect(parentNode === document).toBe(true);
					expect(requestedNamespaceURI).toEqual(namespaceURI);
					expect(requestedTagName).toEqual(tagName);
					return <HTMLCollection<Element>>(<unknown>[element]);
				}
			);

			const result = document.getElementsByTagNameNS(namespaceURI, tagName);

			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('getElementById()', () => {
		it('Returns an element by ID.', () => {
			const element = document.createElement('div');
			const id = 'id';

			vi.spyOn(ParentNodeUtility, 'getElementById').mockImplementation(
				(parentNode, requestedID) => {
					expect(parentNode === document).toBe(true);
					expect(requestedID).toEqual(id);
					return element;
				}
			);

			expect(document.getElementById(id) === element).toBe(true);
		});
	});

	describe('getElementsByName()', () => {
		it('Returns elements by name.', () => {
			const parent = document.createElement('div');
			parent.innerHTML = `<img alt="" name="image" src=""/><img alt="" name="image" src=""/><img alt="" name="image" src=""/><img alt="" name="image" src=""/><meta name="test"><p name="test"><span name="test">test</span></p></meta>`;
			document.body.appendChild(parent);
			expect(document.getElementsByName('image').length).toBe(4);
			expect(document.getElementsByName('test').length).toBe(3);
		});
	});

	describe('appendChild()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			for (const node of Array.from(document.body.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
			}

			document.body.appendChild(document.createComment('test'));
			document.body.appendChild(div);
			document.body.appendChild(document.createComment('test'));
			document.body.appendChild(span);

			expect(document.body.children.length).toBe(2);
			expect(document.body.children[0]).toBe(div);
			expect(document.body.children[1]).toBe(span);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the children instead of the actual element if the type is DocumentFragment.', () => {
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const clone = template.content.cloneNode(true);

			for (const node of Array.from(document.body.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
			}

			document.body.appendChild(clone);

			expect(clone.childNodes.length).toBe(0);
			expect(clone.children.length).toBe(0);
			expect(
				Array.from(document.body.children)
					.map((child) => child.outerHTML)
					.join('')
			).toBe('<div>Div</div><span>Span</span>');
		});
	});

	describe('removeChild()', () => {
		it('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			for (const node of Array.from(document.body.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
			}

			document.body.appendChild(document.createComment('test'));
			document.body.appendChild(div);
			document.body.appendChild(document.createComment('test'));
			document.body.appendChild(span);

			document.body.removeChild(div);

			expect(document.body.children.length).toBe(1);
			expect(document.body.children[0]).toBe(span);
		});
	});

	describe('insertBefore()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');

			for (const node of Array.from(document.body.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
			}

			document.body.appendChild(document.createComment('test'));
			document.body.appendChild(div1);
			document.body.appendChild(document.createComment('test'));
			document.body.appendChild(span);
			document.body.insertBefore(div2, div1);

			expect(document.body.children.length).toBe(3);
			expect(document.body.children[0]).toBe(div2);
			expect(document.body.children[1]).toBe(div1);
			expect(document.body.children[2]).toBe(span);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Insert the children instead of the actual element before another reference Node if the type is DocumentFragment.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Template DIV 1</div><span>Template SPAN 1</span>';

			const clone = template.content.cloneNode(true);

			for (const node of Array.from(document.body.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
			}

			document.body.appendChild(child1);
			document.body.appendChild(child2);

			document.body.insertBefore(clone, child2);

			expect(document.body.children.length).toBe(4);
			expect(
				Array.from(document.body.children)
					.map((child) => child.outerHTML)
					.join('')
			).toBe('<span></span><div>Template DIV 1</div><span>Template SPAN 1</span><span></span>');
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
			expect(document.documentElement.outerHTML).toBe(
				`<html><head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					
				
			
				
					
						<title>Title</title>
					
					
						<span>Body</span>
					
				
			</body></html>`
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

		it('Adds elements outside of the <html> tag to the <body> tag.', () => {
			const html = `<html test="1"><body>Test></body></html>`;
			document.write(html);
			expect(document.documentElement.outerHTML).toBe(
				'<html test="1"><head></head><body>Test&gt;</body></html>'
			);
		});

		it('Adds <html>, <head>, and <body> tags if they are missing.', () => {
			const html = `<div>Test</div>`;

			while (document.firstChild) {
				document.removeChild(document.firstChild);
			}

			document.write(html);

			expect(document.documentElement.outerHTML).toBe(
				'<html><head></head><body><div>Test</div></body></html>'
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
			const element = document.createElement('div');
			expect(element.tagName).toBe('DIV');
			expect(element.localName).toBe('div');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof HTMLElement).toBe(true);
		});

		it('Creates an HTMLUnknownElement if not a custom element and is not matching any known tag.', () => {
			const element = document.createElement('unknown');
			expect(element instanceof HTMLUnknownElement).toBe(true);
		});

		it('Creates an HTMLUnknownElement if given tag is "svg".', () => {
			const element = document.createElement('svg');
			expect(element.tagName).toBe('SVG');
			expect(element.localName).toBe('svg');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof HTMLUnknownElement).toBe(true);
		});

		it('Lowercases the "localName" of non-custom HTML element names.', () => {
			const element = document.createElement('DIV');
			expect(element.tagName).toBe('DIV');
			expect(element.localName).toBe('div');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof HTMLElement).toBe(true);
		});

		it('Creates a custom element.', () => {
			window.customElements.define('custom-element', CustomElement);
			const element = document.createElement('custom-element');
			expect(element.tagName).toBe('CUSTOM-ELEMENT');
			expect(element.localName).toBe('custom-element');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof CustomElement).toBe(true);
		});

		it('Creates a custom element that has been extended from an "li" element.', () => {
			window.customElements.define('custom-element', CustomElement, { extends: 'li' });
			const element = document.createElement('li', { is: 'custom-element' });
			expect(element.tagName).toBe('LI');
			expect(element.localName).toBe('li');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof CustomElement).toBe(true);
		});

		it('Custom element must match local name (should not be case insensitive).', () => {
			window.customElements.define('custom-element', CustomElement);

			const element = document.createElement('CUSTOM-ELEMENT');

			expect(element.tagName).toBe('CUSTOM-ELEMENT');
			expect(element.localName).toBe('custom-element');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof HTMLElement).toBe(true);
		});

		it('Creates a custom element defined with non-ASCII capital letters.', () => {
			window.customElements.define('a-Öa', CustomElement);
			const element = document.createElement('a-Öa');
			expect(element.tagName).toBe('A-ÖA');
			expect(element.localName).toBe('a-Öa');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof CustomElement).toBe(true);
			expect(element.outerHTML).toBe('<a-Öa></a-Öa>');
		});
	});

	describe('createElementNS()', () => {
		it('Creates an svg element.', () => {
			const element = document.createElementNS(NamespaceURI.svg, 'svg');
			expect(element.tagName).toBe('svg');
			expect(element.localName).toBe('svg');
			expect(element.namespaceURI).toBe(NamespaceURI.svg);
			expect(element instanceof SVGSVGElement).toBe(true);
		});

		it('Creates svg elements.', () => {
			expect(document.createElementNS(NamespaceURI.svg, 'rect')).toBeInstanceOf(SVGGraphicsElement);
			expect(document.createElementNS(NamespaceURI.svg, 'polygon')).toBeInstanceOf(
				SVGPolygonElement
			);
			const feTurbulence = document.createElementNS(NamespaceURI.svg, 'feTurbulence');
			expect(feTurbulence).toBeInstanceOf(SVGFETurbulenceElement);
			expect(feTurbulence.localName).toBe('feTurbulence');
			expect(feTurbulence.tagName).toBe('feTurbulence');
		});

		it('Creates an unknown SVG element.', () => {
			const element = document.createElementNS(NamespaceURI.svg, 'test');
			expect(element.tagName).toBe('test');
			expect(element.localName).toBe('test');
			expect(element.namespaceURI).toBe(NamespaceURI.svg);
			expect(element instanceof SVGElement).toBe(true);
		});

		it('Creates a custom element that has been extended from an "li" element.', () => {
			window.customElements.define('custom-element', CustomElement, { extends: 'li' });
			const element = document.createElementNS(NamespaceURI.html, 'li', { is: 'custom-element' });
			expect(element.tagName).toBe('LI');
			expect(element.localName).toBe('li');
			expect(element.namespaceURI).toBe(NamespaceURI.html);
			expect(element instanceof CustomElement).toBe(true);
		});

		it('Creates an SVG element and can set style on it.', () => {
			const element = <SVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
			element.style.cssText = 'user-select:none;';
			expect(element.style.cssText).toBe('user-select: none;');
		});

		it("Creates an element when tag name isn't a string.", () => {
			const element = <HTMLElement>(
				document.createElementNS(<string>(<unknown>null), <string>(<unknown>true))
			);
			expect(element.tagName).toBe('true');
		});

		it("Returns HTMLUnknownElement when case doesn't match for an HTML element.", () => {
			const element = document.createElementNS(NamespaceURI.html, 'BuTtOn');
			expect(element.tagName).toBe('BUTTON');
			expect(element.localName).toBe('BuTtOn');
			expect(element).toBeInstanceOf(HTMLUnknownElement);
			expect(element.constructor.name).toBe('HTMLUnknownElement');
		});

		it("Returns SVGElement when case doesn't match for an SVG element.", () => {
			const element = document.createElementNS(NamespaceURI.svg, 'clippath');
			expect(element.tagName).toBe('clippath');
			expect(element.localName).toBe('clippath');
			expect(element).toBeInstanceOf(SVGElement);
			expect(element.constructor.name).toBe('SVGElement');
		});
	});

	describe('createAttribute()', () => {
		it('Creates an Attr node.', () => {
			const attribute = document.createAttribute('KEY1');

			expect(attribute instanceof window.Attr).toBe(true);

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
			expect(textNode instanceof window.Text).toBe(true);
		});

		it('Creates a text node without content.', () => {
			// @ts-ignore
			expect(() => document.createTextNode()).toThrow(
				new TypeError(
					`Failed to execute 'createTextNode' on 'Document': 1 argument required, but only 0 present.`
				)
			);
		});

		it('Creates a text node with non string content.', () => {
			const inputs = [1, -1, true, false, null, undefined, {}, []];
			const outputs = ['1', '-1', 'true', 'false', 'null', 'undefined', '[object Object]', ''];

			for (let i = 0; i < inputs.length; i++) {
				// @ts-ignore
				const textNode = document.createTextNode(<string>inputs[i]);
				expect(textNode.data).toBe(outputs[i]);
			}
		});
	});

	describe('createComment()', () => {
		it('Creates a comment node.', () => {
			const commentContent = 'comment';
			const commentNode = document.createComment(commentContent);
			expect(commentNode.textContent).toBe(commentContent);
			expect(commentNode instanceof window.Comment).toBe(true);
		});

		it('Creates a comment node without content.', () => {
			// @ts-ignore
			expect(() => document.createComment()).toThrow(
				new TypeError(
					`Failed to execute 'createComment' on 'Document': 1 argument required, but only 0 present.`
				)
			);
		});

		it('Creates a comment node with non string content.', () => {
			const inputs = [1, -1, true, false, null, undefined, {}, []];
			const outputs = ['1', '-1', 'true', 'false', 'null', 'undefined', '[object Object]', ''];

			for (let i = 0; i < inputs.length; i++) {
				// @ts-ignore
				const commentNode = document.createComment(<string>inputs[i]);
				expect(commentNode.data).toBe(outputs[i]);
			}
		});
	});

	describe('createDocumentFragment()', () => {
		it('Creates a document fragment.', () => {
			const documentFragment = document.createDocumentFragment();
			expect(documentFragment.ownerDocument).toBe(document);
			expect(documentFragment instanceof window.DocumentFragment).toBe(true);
		});
	});

	describe('createNodeIterator()', () => {
		it('Creates a node iterator.', () => {
			const root = document.createElement('div');
			const whatToShow = 1;
			const filter = {
				acceptNode(node) {
					if (node === Node.ELEMENT_NODE) {
						return NodeFilter.FILTER_ACCEPT;
					}
					return NodeFilter.FILTER_REJECT;
				}
			};
			const nodeIterator = document.createNodeIterator(root, whatToShow, filter);
			expect(nodeIterator.root).toBe(root);
			expect(nodeIterator.whatToShow).toBe(whatToShow);
			expect(nodeIterator.filter).toBe(filter);
			expect(nodeIterator).toBeInstanceOf(NodeIterator);
		});
	});

	describe('createTreeWalker()', () => {
		it('Creates a tree walker.', () => {
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
			expect(treeWalker.root).toBe(root);
			expect(treeWalker.whatToShow).toBe(whatToShow);
			expect(treeWalker.filter).toBe(filter);
			expect(treeWalker).toBeInstanceOf(TreeWalker);
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
			const window1 = new Window();
			const window2 = new Window();
			const node = window1.document.createElement('div');
			const clone = <Element>window2.document.importNode(node);
			expect(clone.tagName).toBe('DIV');
			expect(clone.ownerDocument === window2.document).toBe(true);
			expect(clone instanceof HTMLElement).toBe(true);
		});

		it('Creates a clone of a Node and sets the ownerDocument to be the current document on child nodes when setting the "deep" parameter to "true".', () => {
			const window1 = new Window();
			const window2 = new Window();
			const node = window1.document.createElement('div');
			const childNode1 = window1.document.createElement('span');
			const childNode2 = window1.document.createElement('span');

			node.appendChild(childNode1);
			node.appendChild(childNode2);

			const clone = <Element>window2.document.importNode(node, true);
			expect(clone.tagName).toBe('DIV');
			expect(clone.ownerDocument === window2.document).toBe(true);

			expect(clone.children.length).toBe(2);
			expect(clone.children[0].tagName).toBe('SPAN');
			expect(clone.children[0].ownerDocument === window2.document).toBe(true);
			expect(clone.children[1].tagName).toBe('SPAN');
			expect(clone.children[1].ownerDocument === window2.document).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the properties of the document when cloned.', () => {
			const child = document.createElement('div');
			child.className = 'className';

			for (const node of Array.from(document.body.childNodes)) {
				(<Node>node.parentNode).removeChild(node);
			}

			document.body.appendChild(child);

			const clone = document.cloneNode(false);
			const clone2 = document.cloneNode(true);
			expect(clone[PropertySymbol.window] === window).toBe(true);
			expect(clone.defaultView === null).toBe(true);
			expect(clone.children.length).toBe(0);
			expect(clone2.children.length).toBe(1);
			expect(clone2.children[0].outerHTML).toBe(
				'<html><head></head><body><div class="className"></div></body></html>'
			);
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
		it('Triggers "readystatechange" event if no resources needs to be loaded.', async () => {
			await new Promise((resolve) => {
				let event: Event | null = null;
				let target: EventTarget | null = null;
				let currentTarget: EventTarget | null = null;

				document.addEventListener('readystatechange', (e) => {
					event = e;
					target = e.target;
					currentTarget = e.currentTarget;
				});

				expect(document.readyState).toBe(DocumentReadyStateEnum.interactive);

				setTimeout(() => {
					expect((<Event>event).target).toBe(document);
					expect(target).toBe(document);
					expect(currentTarget).toBe(document);
					expect(document.readyState).toBe(DocumentReadyStateEnum.complete);
					resolve(null);
				}, 20);
			});
		});

		it('Triggers "readystatechange" event when all resources have been loaded.', async () => {
			await new Promise((resolve) => {
				const cssURL = 'https://localhost:8080/path/to/file.css';
				const jsURL = 'https://localhost:8080/path/to/file.js';
				const cssResponse = 'body { background-color: red; }';
				const jsResponse = 'globalThis.test = "test";';
				let resourceFetchCSSWindow: BrowserWindow | null = null;
				let resourceFetchCSSURL: string | null = null;
				let resourceFetchJSWindow: BrowserWindow | null = null;
				let resourceFetchJSURL: string | null = null;
				let event: Event | null = null;
				let target: EventTarget | null = null;
				let currentTarget: EventTarget | null = null;

				vi.spyOn(ResourceFetch.prototype, 'fetch').mockImplementation(async function (
					url: string | URL
				) {
					if ((<string>url).endsWith('.css')) {
						resourceFetchCSSWindow = this.window;
						resourceFetchCSSURL = <string>url;
						return cssResponse;
					}

					resourceFetchJSWindow = this.window;
					resourceFetchJSURL = <string>url;
					return jsResponse;
				});

				document.addEventListener('readystatechange', (e) => {
					event = e;
					target = e.target;
					currentTarget = e.currentTarget;
				});

				const script = <HTMLScriptElement>document.createElement('script');
				script.async = true;
				script.src = jsURL;

				const link = <HTMLLinkElement>document.createElement('link');
				link.href = cssURL;
				link.rel = 'stylesheet';

				document.body.appendChild(script);
				document.body.appendChild(link);

				expect(document.readyState).toBe(DocumentReadyStateEnum.interactive);

				setTimeout(() => {
					expect(resourceFetchCSSWindow).toBe(window);
					expect(resourceFetchCSSURL).toBe(cssURL);
					expect(resourceFetchJSWindow).toBe(window);
					expect(resourceFetchJSURL).toBe(jsURL);
					expect((<Event>event).target).toBe(document);
					expect(target).toBe(document);
					expect(currentTarget).toBe(document);
					expect(document.readyState).toBe(DocumentReadyStateEnum.complete);
					expect(document.styleSheets.length).toBe(1);
					expect(document.styleSheets[0].cssRules[0].cssText).toBe(cssResponse);

					expect(window['test']).toBe('test');

					delete window['test'];

					resolve(null);
				}, 10);
			});
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
			let emittedEvent: Event | null = null;

			window.addEventListener('click', (event) => (emittedEvent = event));
			document.dispatchEvent(event);

			expect(emittedEvent).toBe(event);
		});

		it('Doesn\t bubble to Window if the event type is "load".', () => {
			const event = new Event('load', { bubbles: true });
			let emittedEvent: Event | null = null;

			window.addEventListener('load', (event) => (emittedEvent = event));
			document.dispatchEvent(event);

			expect(emittedEvent).toBe(null);
		});
	});

	describe('createProcessingInstruction()', () => {
		it('Creates a Processing Instruction node with target & data.', () => {
			const instruction = document.createProcessingInstruction('foo', 'bar');
			expect(instruction instanceof window.ProcessingInstruction).toBe(true);
			expect(instruction.target).toBe('foo');
			expect(instruction.data).toBe('bar');
			expect(instruction.ownerDocument).toBe(document);
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

	describe('currentScript', () => {
		it('Returns the currently executing script element.', () => {
			expect(document.currentScript).toBe(null);
			const script1 = document.createElement('script');
			script1.textContent = 'window.test = document.currentScript;';
			document.body.appendChild(script1);
			expect(window['test']).toBe(script1);
			expect(document.currentScript).toBe(null);
			const script2 = document.createElement('script');
			script2.textContent = 'window.test = document.currentScript;';
			document.body.appendChild(script2);
			expect(window['test']).toBe(script2);
			expect(document.currentScript).toBe(null);
		});
	});

	describe('elementFromPoint', () => {
		it('Returns null.', () => {
			const element = document.elementFromPoint(0, 0);
			expect(element).toBe(null);
		});
	});
});
