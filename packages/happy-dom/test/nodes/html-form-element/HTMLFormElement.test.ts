import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement.js';
import RadioNodeList from '../../../src/nodes/html-form-element/RadioNodeList.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import Event from '../../../src/event/Event.js';
import SubmitEvent from '../../../src/event/events/SubmitEvent.js';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement.js';
import HTMLTextAreaElement from '../../../src/nodes/html-text-area-element/HTMLTextAreaElement.js';
import HTMLButtonElement from '../../../src/nodes/html-button-element/HTMLButtonElement.js';
import Fetch from '../../../src/fetch/Fetch.js';
import Request from '../../../src/fetch/Request.js';
import Response from '../../../src/fetch/Response.js';
import Browser from '../../../src/browser/Browser.js';
import File from '../../../src/file/File.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import HTMLIFrameElement from '../../../src/nodes/html-iframe-element/HTMLIFrameElement.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import THTMLFormControlElement from '../../../src/nodes/html-form-element/THTMLFormControlElement.js';

describe('HTMLFormElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLFormElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLFormElement>document.createElement('form');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLFormElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLFormElement]');
		});
	});

	for (const property of [
		'name',
		'target',
		'encoding',
		'enctype',
		'acceptCharset',
		'autocomplete'
	]) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe('');
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	describe('get action()', () => {
		it('Returns attribute value.', () => {
			expect(element.action).toBe('about:blank');

			element.setAttribute('action', '/test/');

			expect(element.action).toBe('');

			window.happyDOM.setURL('https://localhost/path/');

			expect(element.action).toBe('https://localhost/test/');

			element.setAttribute('action', 'https://example.com');

			expect(element.action).toBe('https://example.com/');
		});
	});

	describe('set action()', () => {
		it('Sets attribute value.', () => {
			element.action = '/test/';

			expect(element.getAttribute('action')).toBe('/test/');

			element.action = 'https://example.com';

			expect(element.getAttribute('action')).toBe('https://example.com');
		});
	});

	describe('get noValidate()', () => {
		it('Returns "true" if defined.', () => {
			expect(element.noValidate).toBe(false);
			element.setAttribute('novalidate', '');
			expect(element.noValidate).toBe(true);
		});
	});

	describe('set noValidate()', () => {
		it('Sets attribute value.', () => {
			element.noValidate = true;
			expect(element.getAttribute('novalidate')).toBe('');
		});
	});

	describe('get method()', () => {
		it('Returns attribute value.', () => {
			expect(element.method).toBe('get');
			element.setAttribute('method', 'post');
			expect(element.method).toBe('post');
		});
	});

	describe('set method()', () => {
		it('Sets attribute value.', () => {
			element.method = 'post';
			expect(element.getAttribute('method')).toBe('post');
		});
	});

	describe('get elements()', () => {
		it('Returns control elements.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" value="value1">
					<button name="button1" value="value1"></button>
                    <input type="checkbox" name="checkbox1" value="value1">
                    <input type="checkbox" name="checkbox1" value="value2" checked>
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio1" value="value2" checked>
                    <input type="radio" name="radio1" value="value3">
                    <input type="hidden" name="1" value="value1">
                </div>
            `;
			const elements = element.elements;
			const root = element.children[0];

			expect(element.length).toBe(9);
			expect(elements.length).toBe(9);

			expect(element[0] === root.children[0]).toBe(true);
			expect(element[1] === root.children[1]).toBe(true);
			expect(element[2] === root.children[2]).toBe(true);
			expect(element[3] === root.children[3]).toBe(true);
			expect(element[4] === root.children[4]).toBe(true);
			expect(element[5] === root.children[5]).toBe(true);
			expect(element[6] === root.children[6]).toBe(true);
			expect(element[7] === root.children[7]).toBe(true);
			expect(element[8] === root.children[8]).toBe(true);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);
			expect(elements[5] === root.children[5]).toBe(true);
			expect(elements[6] === root.children[6]).toBe(true);
			expect(elements[7] === root.children[7]).toBe(true);
			expect(elements[8] === root.children[8]).toBe(true);

			expect(elements.item(0) === root.children[0]).toBe(true);
			expect(elements.item(1) === root.children[1]).toBe(true);
			expect(elements.item(2) === root.children[2]).toBe(true);
			expect(elements.item(3) === root.children[3]).toBe(true);
			expect(elements.item(4) === root.children[4]).toBe(true);
			expect(elements.item(5) === root.children[5]).toBe(true);
			expect(elements.item(6) === root.children[6]).toBe(true);
			expect(elements.item(7) === root.children[7]).toBe(true);
			expect(elements.item(8) === root.children[8]).toBe(true);

			const radioNodeList1 = new RadioNodeList([
				<THTMLFormControlElement>root.children[2],
				<THTMLFormControlElement>root.children[3],
				<THTMLFormControlElement>root.children[4]
			]);
			const radioNodeList2 = new RadioNodeList([
				<THTMLFormControlElement>root.children[5],
				<THTMLFormControlElement>root.children[6],
				<THTMLFormControlElement>root.children[7]
			]);

			expect(element['text1'] === root.children[0]).toBe(true);
			expect(element['button1'] === root.children[1]).toBe(true);
			expect(element['checkbox1']).toEqual(radioNodeList1);
			expect(element['radio1']).toEqual(radioNodeList2);

			expect(elements['text1'] === root.children[0]).toBe(true);
			expect(elements['button1'] === root.children[1]).toBe(true);
			expect(elements['checkbox1']).toEqual(radioNodeList1);
			expect(elements['radio1']).toEqual(radioNodeList2);

			expect(elements.namedItem('text1') === root.children[0]).toBe(true);
			expect(elements.namedItem('button1') === root.children[1]).toBe(true);
			expect(elements.namedItem('checkbox1')).toEqual(radioNodeList1);
			expect((<HTMLInputElement>elements.namedItem('checkbox1')).value).toBe('value2');
			expect(elements.namedItem('radio1')).toEqual(radioNodeList2);
			expect((<HTMLInputElement>elements.namedItem('radio1')).value).toBe('value2');
			expect((<HTMLInputElement>elements.namedItem('1')).value).toBe('value1');

			(<HTMLInputElement>elements.namedItem('text1')).name = 'text2';
			(<HTMLInputElement>elements.namedItem('text2')).id = 'text3';

			expect(element['text2'] === root.children[0]).toBe(true);
			expect(element['text3'] === root.children[0]).toBe(true);

			expect(elements['text2'] === root.children[0]).toBe(true);
			expect(elements['text3'] === root.children[0]).toBe(true);

			const anotherElement = document.createElement('div');
			anotherElement.innerHTML = `
                <span>
                    <input type="text" name="anotherText1" value="value1">
                    <button name="anotherButton1" value="value1"></button>
                    <input type="checkbox" name="anotherCheckbox1" value="value1">
                    <input type="checkbox" name="anotherCheckbox1" value="value2" checked>
                    <input type="checkbox" name="anotherCheckbox1" value="value3">
                    <input type="radio" name="anotherRadio1" value="value1">
                    <input type="radio" name="anotherRadio1" value="value2" checked>
                    <input type="radio" name="anotherRadio1" value="value3">
                </span>
            `;

			const anotherRoot = anotherElement.children[0];

			root.appendChild(anotherElement);

			expect(element.length).toBe(17);
			expect(elements.length).toBe(17);

			expect(element[9] === anotherRoot.children[0]).toBe(true);
			expect(element[10] === anotherRoot.children[1]).toBe(true);
			expect(element[11] === anotherRoot.children[2]).toBe(true);
			expect(element[12] === anotherRoot.children[3]).toBe(true);
			expect(element[13] === anotherRoot.children[4]).toBe(true);
			expect(element[14] === anotherRoot.children[5]).toBe(true);
			expect(element[15] === anotherRoot.children[6]).toBe(true);
			expect(element[16] === anotherRoot.children[7]).toBe(true);

			expect(elements[9] === anotherRoot.children[0]).toBe(true);
			expect(elements[10] === anotherRoot.children[1]).toBe(true);
			expect(elements[11] === anotherRoot.children[2]).toBe(true);
			expect(elements[12] === anotherRoot.children[3]).toBe(true);
			expect(elements[13] === anotherRoot.children[4]).toBe(true);
			expect(elements[14] === anotherRoot.children[5]).toBe(true);
			expect(elements[15] === anotherRoot.children[6]).toBe(true);
			expect(elements[16] === anotherRoot.children[7]).toBe(true);

			const anotherRadioNodeList1 = new RadioNodeList([
				<THTMLFormControlElement>anotherRoot.children[2],
				<THTMLFormControlElement>anotherRoot.children[3],
				<THTMLFormControlElement>anotherRoot.children[4]
			]);
			const anotherRadioNodeList2 = new RadioNodeList([
				<THTMLFormControlElement>anotherRoot.children[5],
				<THTMLFormControlElement>anotherRoot.children[6],
				<THTMLFormControlElement>anotherRoot.children[7]
			]);

			expect(element['anotherText1'] === anotherRoot.children[0]).toBe(true);
			expect(element['anotherButton1'] === anotherRoot.children[1]).toBe(true);
			expect(element['anotherCheckbox1']).toEqual(anotherRadioNodeList1);
			expect(element['anotherRadio1']).toEqual(anotherRadioNodeList2);

			expect(elements['anotherText1'] === anotherRoot.children[0]).toBe(true);
			expect(elements['anotherButton1'] === anotherRoot.children[1]).toBe(true);
			expect(elements['anotherCheckbox1']).toEqual(anotherRadioNodeList1);
			expect(elements['anotherRadio1']).toEqual(anotherRadioNodeList2);

			for (const child of Array.from(root.children)) {
				if (child !== anotherElement) {
					root.removeChild(child);
				}
			}

			expect(element.length).toBe(8);
			expect(elements.length).toBe(8);

			expect(element[0] === anotherRoot.children[0]).toBe(true);
			expect(element[1] === anotherRoot.children[1]).toBe(true);
			expect(element[2] === anotherRoot.children[2]).toBe(true);
			expect(element[3] === anotherRoot.children[3]).toBe(true);
			expect(element[4] === anotherRoot.children[4]).toBe(true);
			expect(element[5] === anotherRoot.children[5]).toBe(true);
			expect(element[6] === anotherRoot.children[6]).toBe(true);
			expect(element[7] === anotherRoot.children[7]).toBe(true);

			expect(elements[0] === anotherRoot.children[0]).toBe(true);
			expect(elements[1] === anotherRoot.children[1]).toBe(true);
			expect(elements[2] === anotherRoot.children[2]).toBe(true);
			expect(elements[3] === anotherRoot.children[3]).toBe(true);
			expect(elements[4] === anotherRoot.children[4]).toBe(true);
			expect(elements[5] === anotherRoot.children[5]).toBe(true);
			expect(elements[6] === anotherRoot.children[6]).toBe(true);
			expect(elements[7] === anotherRoot.children[7]).toBe(true);

			expect(element['text1'] === undefined).toBe(true);
			expect(element['button1'] === undefined).toBe(true);
			expect(element['checkbox1'] === undefined).toBe(true);
			expect(element['radio1'] === undefined).toBe(true);

			expect(elements['text1'] === undefined).toBe(true);
			expect(elements['button1'] === undefined).toBe(true);
			expect(elements['checkbox1'] === undefined).toBe(true);
			expect(elements['radio1'] === undefined).toBe(true);
		});

		it('Returns control elements using the same name as properties and methods of the HTMLCollection class.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="length" value="value1">
                    <input type="checkbox" name="namedItem" value="value1">
                    <input type="checkbox" name="namedItem" value="value2" checked>
                    <input type="checkbox" name="namedItem" value="value3">
                    <input type="hidden" name="item" value="value1">
                </div>
            `;
			const elements = element.elements;
			const root = element.children[0];

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			expect(element[0] === root.children[0]).toBe(true);
			expect(element[1] === root.children[1]).toBe(true);
			expect(element[2] === root.children[2]).toBe(true);
			expect(element[3] === root.children[3]).toBe(true);
			expect(element[4] === root.children[4]).toBe(true);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);

			expect(elements.item(0) === root.children[0]).toBe(true);
			expect(elements.item(1) === root.children[1]).toBe(true);
			expect(elements.item(2) === root.children[2]).toBe(true);
			expect(elements.item(3) === root.children[3]).toBe(true);
			expect(elements.item(4) === root.children[4]).toBe(true);

			const radioNodeList = new RadioNodeList([
				<THTMLFormControlElement>root.children[1],
				<THTMLFormControlElement>root.children[2],
				<THTMLFormControlElement>root.children[3]
			]);

			expect(typeof elements.item).toBe('function');
			expect(typeof elements.namedItem).toBe('function');
			expect(elements.namedItem('length') === root.children[0]).toBe(true);
			expect(elements.namedItem('namedItem')).toEqual(radioNodeList);
			expect(elements.namedItem('item') === root.children[4]).toBe(true);

			const children = Array.from(root.children);

			for (const child of children) {
				root.removeChild(child);
			}

			expect(element.length).toBe(0);

			for (const child of children) {
				root.appendChild(child);
			}

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);

			expect(typeof elements.item).toBe('function');
			expect(typeof elements.namedItem).toBe('function');
			expect(elements.namedItem('length') === root.children[0]).toBe(true);
			expect(elements.namedItem('namedItem')).toEqual(radioNodeList);
			expect(elements.namedItem('item') === root.children[4]).toBe(true);
		});

		it('Returns control elements referenced by "form" attribute.', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <div>
                    <input form="testForm" type="text" name="length" value="value1">
                    <input form="testForm" type="checkbox" name="namedItem" value="value1">
                    <input form="testForm" type="checkbox" name="namedItem" value="value2" checked>
                    <input form="testForm" type="checkbox" name="namedItem" value="value3">
                    <input form="testForm" type="hidden" name="item" value="value1">
                </div>
            `;
			element.id = 'testForm';
			document.body.appendChild(element);
			document.body.appendChild(div);

			const elements = element.elements;
			const root = div.children[0];

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			expect(element[0] === root.children[0]).toBe(true);
			expect(element[1] === root.children[1]).toBe(true);
			expect(element[2] === root.children[2]).toBe(true);
			expect(element[3] === root.children[3]).toBe(true);
			expect(element[4] === root.children[4]).toBe(true);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);

			expect(elements.item(0) === root.children[0]).toBe(true);
			expect(elements.item(1) === root.children[1]).toBe(true);
			expect(elements.item(2) === root.children[2]).toBe(true);
			expect(elements.item(3) === root.children[3]).toBe(true);
			expect(elements.item(4) === root.children[4]).toBe(true);

			expect(elements[0].form === element).toBe(true);
			expect(elements[1].form === element).toBe(true);
			expect(elements[2].form === element).toBe(true);
			expect(elements[3].form === element).toBe(true);
			expect(elements[4].form === element).toBe(true);

			const radioNodeList = new RadioNodeList([
				<THTMLFormControlElement>root.children[1],
				<THTMLFormControlElement>root.children[2],
				<THTMLFormControlElement>root.children[3]
			]);

			expect(typeof elements.item).toBe('function');
			expect(typeof elements.namedItem).toBe('function');
			expect(elements.namedItem('length') === root.children[0]).toBe(true);
			expect(elements.namedItem('namedItem')).toEqual(radioNodeList);
			expect(elements.namedItem('item') === root.children[4]).toBe(true);

			const children = Array.from(root.children);

			for (const child of children) {
				root.removeChild(child);
			}

			expect(element.length).toBe(0);
			expect(elements.length).toBe(0);

			for (const child of children) {
				root.appendChild(child);
			}

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);

			expect(typeof elements.item).toBe('function');
			expect(typeof elements.namedItem).toBe('function');
			expect(elements.namedItem('length') === root.children[0]).toBe(true);
			expect(elements.namedItem('namedItem')).toEqual(radioNodeList);
			expect(elements.namedItem('item') === root.children[4]).toBe(true);

			element.id = 'testForm2';

			expect(element.length).toBe(0);
			expect(elements.length).toBe(0);

			element.id = 'testForm';

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			for (const child of children) {
				child.removeAttribute('form');
			}

			expect(element.length).toBe(0);
			expect(elements.length).toBe(0);
		});
	});

	describe('submit()', () => {
		it('Fallbacks to set location URL when in the main frame of a detached Window.', () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				throw new Error('Request should not be sent.');
			});

			expect(window.location.href).toBe('about:blank');

			element.action = 'https://localhost:3000';
			element.submit();

			expect(window.location.href).toBe('https://localhost:3000/');
		});

		it('Submits form as query string when method is "GET".', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 2))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			page.mainFrame.url = 'http://referrer.example.com';

			oldWindow.document.write(`
                <form action="http://example.com">
                    <input type="text" name="text1" value="value1">
                    <input type="hidden" name="text2" value="value2">
                    <input type="checkbox" name="checkbox1" value="value1" checked>
                    <input type="checkbox" name="checkbox2" value="value2">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio1" value="value2" checked>
                    <input type="radio" name="radio1" value="value3">
                    <input type="submit" name="button1">
                </form>
            `);

			oldWindow.document.body.children[0]['button1'].click();

			await page.mainFrame.waitForNavigation();

			expect((<Request>(<unknown>request)).referrer).toBe('about:client');
			expect((<Request>(<unknown>request)).referrerPolicy).toBe('origin');
			expect((<Request>(<unknown>request)).method).toBe('GET');

			expect(page.mainFrame.url).toBe(
				'http://example.com/?text1=value1&text2=value2&checkbox1=value1&radio1=value2'
			);
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(oldWindow.location.href).toBe('http://referrer.example.com/');
			expect(page.mainFrame.window.location.href).toBe(
				'http://example.com/?text1=value1&text2=value2&checkbox1=value1&radio1=value2'
			);
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
		});

		for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
			it(`Submits form as form data when method is "${method}".`, async () => {
				let request: Request | null = null;

				vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
					request = this.request;
					return Promise.resolve(<Response>{
						url: request?.url,
						text: () =>
							new Promise((resolve) =>
								setTimeout(() => resolve('<html><body>Test</body></html>'), 2)
							)
					});
				});

				const browser = new Browser();
				const page = browser.newPage();
				const oldWindow = page.mainFrame.window;

				page.mainFrame.url = 'http://referrer.example.com';

				oldWindow.document.write(`
                    <button form="form-id">Submit</button>
                    <form id="form-id" action="http://example.com" method="${method}">
                        <input type="text" name="text1" value="value1">
                        <input type="hidden" name="text2" value="value2">
                        <input type="checkbox" name="checkbox1" value="value1" checked>
                        <input type="checkbox" name="checkbox2" value="value2">
                        <input type="radio" name="radio1" value="value1">
                        <input type="radio" name="radio1" value="value2" checked>
                        <input type="radio" name="radio1" value="value3">
                    </form>
                `);

				(<HTMLElement>oldWindow.document.body.children[0]).click();

				await page.mainFrame.waitForNavigation();

				expect((<Request>(<unknown>request)).referrer).toBe('about:client');
				expect((<Request>(<unknown>request)).referrerPolicy).toBe('origin');
				expect((<Request>(<unknown>request)).method).toBe(method);
				expect(
					(<Request>(<unknown>request)).headers
						.get('Content-Type')
						?.startsWith('multipart/form-data; boundary=----HappyDOMFormDataBoundary')
				).toBe(true);

				const requestFormData = await (<Request>(<unknown>request)).formData();
				const list: Array<{ key: string; value: string | File }> = [];

				for (const [key, value] of requestFormData) {
					list.push({ key, value });
				}

				expect(list).toEqual([
					{ key: 'text1', value: 'value1' },
					{ key: 'text2', value: 'value2' },
					{ key: 'checkbox1', value: 'value1' },
					{ key: 'radio1', value: 'value2' }
				]);

				expect(page.mainFrame.url).toBe('http://example.com/');
				expect(page.mainFrame.window).not.toBe(oldWindow);
				expect(oldWindow.location.href).toBe('http://referrer.example.com/');
				expect(page.mainFrame.window.location.href).toBe('http://example.com/');
				expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
			});
		}

		it(`Supports "_self" as target.`, async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 2))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			oldWindow.document.write(`
                    <button form="form-id">Submit</button>
                    <form id="form-id" action="http://example.com" target="_self">
                        <input type="text" name="text1" value="value1">
                        <input type="hidden" name="text2" value="value2">
                        <input type="checkbox" name="checkbox1" value="value1" checked>
                        <input type="checkbox" name="checkbox2" value="value2">
                        <input type="radio" name="radio1" value="value1">
                        <input type="radio" name="radio1" value="value2" checked>
                        <input type="radio" name="radio1" value="value3">
                    </form>
                `);

			(<HTMLElement>oldWindow.document.body.children[0]).click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.url).toBe(
				'http://example.com/?text1=value1&text2=value2&checkbox1=value1&radio1=value2'
			);
		});

		it(`Supports "_top" as target.`, async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) =>
							setTimeout(
								() =>
									resolve(
										request?.url === 'http://example.com/iframe'
											? `
                                <button form="form-id">Submit</button>
                                <form id="form-id" action="http://example.com" target="_top">
                                    <input type="text" name="text1" value="value1">
                                    <input type="hidden" name="text2" value="value2">
                                    <input type="checkbox" name="checkbox1" value="value1" checked>
                                    <input type="checkbox" name="checkbox2" value="value2">
                                    <input type="radio" name="radio1" value="value1">
                                    <input type="radio" name="radio1" value="value2" checked>
                                    <input type="radio" name="radio1" value="value3">
                                </form>
                                `
											: 'Test'
									),
								2
							)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			page.mainFrame.url = 'http://example.com';

			oldWindow.document.write(`<iframe src="http://example.com/iframe"></iframe>`);

			await new Promise((resolve) =>
				oldWindow.document.querySelector('iframe')?.addEventListener('load', resolve)
			);

			(<BrowserWindow>(
				(<HTMLIFrameElement>oldWindow.document.body.children[0]).contentWindow
			)).document.body
				.querySelector('button')
				?.click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.url).toBe(
				'http://example.com/?text1=value1&text2=value2&checkbox1=value1&radio1=value2'
			);
		});

		it(`Supports "_parent" as target.`, async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) =>
							setTimeout(
								() =>
									resolve(
										request?.url === 'http://example.com/iframe'
											? `
                                <button form="form-id">Submit</button>
                                <form id="form-id" action="http://example.com" target="_parent">
                                    <input type="text" name="text1" value="value1">
                                    <input type="hidden" name="text2" value="value2">
                                    <input type="checkbox" name="checkbox1" value="value1" checked>
                                    <input type="checkbox" name="checkbox2" value="value2">
                                    <input type="radio" name="radio1" value="value1">
                                    <input type="radio" name="radio1" value="value2" checked>
                                    <input type="radio" name="radio1" value="value3">
                                </form>
                                `
											: 'Test'
									),
								2
							)
						)
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			page.mainFrame.url = 'http://example.com';

			oldWindow.document.write(`<iframe src="http://example.com/iframe"></iframe>`);

			await new Promise((resolve) =>
				oldWindow.document.querySelector('iframe')?.addEventListener('load', resolve)
			);

			(<BrowserWindow>(
				(<HTMLIFrameElement>oldWindow.document.body.children[0]).contentWindow
			)).document.body
				.querySelector('button')
				?.click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.url).toBe(
				'http://example.com/?text1=value1&text2=value2&checkbox1=value1&radio1=value2'
			);
		});

		it(`Supports "_blank" as target.`, async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 2))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			oldWindow.document.write(`
                    <form action="http://example.com" target="_blank">
                        <input type="text" name="text1" value="value1">
                        <input type="hidden" name="text2" value="value2">
                        <input type="checkbox" name="checkbox1" value="value1" checked>
                        <input type="checkbox" name="checkbox2" value="value2">
                        <input type="radio" name="radio1" value="value1">
                        <input type="radio" name="radio1" value="value2" checked>
                        <input type="radio" name="radio1" value="value3">
                        <button>Submit</button>
                    </form>
                `);

			oldWindow.document.body.querySelector('button')?.click();

			const newPage = page.context.pages[1];

			expect(newPage.mainFrame.url).toBe(
				'http://example.com/?text1=value1&text2=value2&checkbox1=value1&radio1=value2'
			);

			await newPage.waitForNavigation();

			expect(newPage.mainFrame.document.body.innerHTML).toBe('Test');
		});

		it(`Uses "action" from button when "formaction" is set as an attribute on the button.`, async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 2))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			oldWindow.document.write(`
                    <button form="form-id" formaction="http://button.example.com">Submit</button>
                    <form id="form-id" action="http://example.com" method="POST">
                        <input type="text" name="text1" value="value1">
                        <input type="hidden" name="text2" value="value2">
                        <input type="checkbox" name="checkbox1" value="value1" checked>
                        <input type="checkbox" name="checkbox2" value="value2">
                        <input type="radio" name="radio1" value="value1">
                        <input type="radio" name="radio1" value="value2" checked>
                        <input type="radio" name="radio1" value="value3">
                    </form>
                `);

			(<HTMLElement>oldWindow.document.body.children[0]).click();

			await page.mainFrame.waitForNavigation();

			expect(page.mainFrame.url).toBe('http://button.example.com/');
			expect(page.mainFrame.window.location.href).toBe('http://button.example.com/');
		});

		it(`Sets hash to "#blocked" when action is invalid.`, async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			oldWindow.document.write(`
                    <form action="/not-possible-to-be-relative-to-about-blank/">
                        <input type="text" name="text1" value="value1">
                        <input type="hidden" name="text2" value="value2">
                        <input type="checkbox" name="checkbox1" value="value1" checked>
                        <input type="checkbox" name="checkbox2" value="value2">
                        <input type="radio" name="radio1" value="value1">
                        <input type="radio" name="radio1" value="value2" checked>
                        <input type="radio" name="radio1" value="value3">
                        <button>Submit</button>
                    </form>
                `);

			oldWindow.document.querySelector('button')?.click();

			expect(page.mainFrame.url).toBe('about:blank#blocked');
		});
	});

	describe('requestSubmit()', () => {
		it('Validates form and triggers a "submit" event when valid.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" required>
					<button name="button1"></button>
                    <input type="checkbox" name="checkbox1" value="value1" required>
                    <input type="checkbox" name="checkbox1" value="value2">
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1" required>
                    <input type="radio" name="radio1" value="value2" required>
                    <input type="radio" name="radio1" value="value3" required>
                </div>
            `;

			document.body.appendChild(element);

			const root = element.children[0];
			let submitEvent: Event | null = null;

			element.addEventListener('submit', (event: Event) => (submitEvent = event));

			element.action = 'https://localhost:3000';

			element.noValidate = true;
			element.requestSubmit();

			expect(submitEvent).toBeInstanceOf(SubmitEvent);
			expect((<SubmitEvent>(<unknown>submitEvent)).type).toBe('submit');
			expect((<SubmitEvent>(<unknown>submitEvent)).submitter === element).toBe(true);

			submitEvent = null;

			element.noValidate = false;
			element.requestSubmit();

			expect(submitEvent).toBe(null);

			(<HTMLInputElement>root.children[0]).value = 'value';
			(<HTMLInputElement>root.children[2]).click();
			(<HTMLInputElement>root.children[6]).click();

			element.requestSubmit(<HTMLButtonElement>root.children[1]);

			expect((<SubmitEvent>(<unknown>submitEvent)).type).toBe('submit');
			expect((<SubmitEvent>(<unknown>submitEvent)).submitter).toBe(root.children[1]);

			expect(window.location.href).toBe(
				'https://localhost:3000/?text1=value&checkbox1=value1&radio1=value2'
			);
		});

		it('Skips validating if a submitter is sent that has "formNoValidate" set to "true".', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" required>
                    <input type="checkbox" name="checkbox1" value="value1" required>
                    <input type="checkbox" name="checkbox1" value="value2">
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1" required>
                    <input type="radio" name="radio1" value="value2" required>
                    <input type="radio" name="radio1" value="value3" required>
					<input type="submit" name="button1"></input>
                </div>
            `;

			document.body.appendChild(element);

			const root = element.children[0];
			const submitter = <HTMLInputElement>root.children[7];
			let submitEvent: Event | null = null;

			element.addEventListener('submit', (event: Event) => (submitEvent = event));

			submitter.formNoValidate = true;
			element.requestSubmit(submitter);

			expect((<SubmitEvent>(<unknown>submitEvent)).type).toBe('submit');
		});

		it('Fallbacks to set location URL when in the main frame of a detached Window.', () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				throw new Error('Request should not be sent.');
			});

			expect(window.location.href).toBe('about:blank');

			element.action = 'https://localhost:3000';
			element.requestSubmit();

			expect(window.location.href).toBe('https://localhost:3000/');
		});

		it('Submits form as query string when method is "GET".', async () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = this.request;
				return Promise.resolve(<Response>{
					url: request?.url,
					text: () =>
						new Promise((resolve) => setTimeout(() => resolve('<html><body>Test</body></html>'), 2))
				});
			});

			const browser = new Browser();
			const page = browser.newPage();
			const oldWindow = page.mainFrame.window;

			page.mainFrame.url = 'http://referrer.example.com';

			oldWindow.document.write(`
                <form action="http://example.com">
                    <input type="text" name="text1" value="value1" pattern="^test$" required>
                    <input type="hidden" name="text2" value="value2">
                    <input type="checkbox" name="checkbox1" value="value1" checked>
                    <input type="checkbox" name="checkbox2" value="value2">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio1" value="value2" checked>
                    <input type="radio" name="radio1" value="value3">
                    <input type="submit" name="button1">
                </form>
            `);

			(<HTMLInputElement>oldWindow.document.querySelector('input[name="text1"]')).value = 'invalid';

			oldWindow.document.body.children[0]['button1'].click();

			await new Promise((resolve) => setTimeout(resolve, 2));

			expect(page.mainFrame.url).toBe('http://referrer.example.com/');

			(<HTMLInputElement>oldWindow.document.querySelector('input[name="text1"]')).value = 'test';

			oldWindow.document.body.children[0]['button1'].click();

			await page.mainFrame.waitForNavigation();

			expect((<Request>(<unknown>request)).referrer).toBe('about:client');
			expect((<Request>(<unknown>request)).referrerPolicy).toBe('origin');
			expect((<Request>(<unknown>request)).method).toBe('GET');

			expect(page.mainFrame.url).toBe(
				'http://example.com/?text1=test&text2=value2&checkbox1=value1&radio1=value2'
			);
			expect(page.mainFrame.window).not.toBe(oldWindow);
			expect(oldWindow.location.href).toBe('http://referrer.example.com/');
			expect(page.mainFrame.window.location.href).toBe(
				'http://example.com/?text1=test&text2=value2&checkbox1=value1&radio1=value2'
			);
			expect(page.mainFrame.window.document.body.innerHTML).toBe('Test');
		});
	});

	describe('reset()', () => {
		it('Resets the form.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" value="Default value">
                    <select>
                        <option value="value1"></option>
                        <option value="value2" selected></option>
                        <option value="value3"></option>
                    </select>
                    <textarea name="textarea1">Default value</textarea>
                    <input type="checkbox" name="checkbox1" value="value1">
                    <input type="checkbox" name="checkbox1" value="value2" checked>
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio1" value="value2" checked>
                    <input type="radio" name="radio1" value="value3">
                </div>
            `;

			document.body.appendChild(element);

			const root = element.children[0];
			let resetEvent: Event | null = null;

			(<HTMLInputElement>root.children[0]).value = 'New value';
			(<HTMLSelectElement>root.children[1]).value = 'value3';
			(<HTMLTextAreaElement>root.children[2]).value = 'New value';
			(<HTMLInputElement>root.children[3]).click();
			(<HTMLInputElement>root.children[5]).click();
			(<HTMLInputElement>root.children[7]).click();

			element.addEventListener('reset', (event: Event) => (resetEvent = event));

			element.reset();

			expect((<Event>(<unknown>resetEvent)).type).toBe('reset');

			expect((<HTMLInputElement>root.children[0]).value).toBe('Default value');
			expect((<HTMLSelectElement>root.children[1]).value).toBe('value2');
			expect((<HTMLTextAreaElement>root.children[2]).value).toBe('Default value');

			expect((<HTMLInputElement>root.children[3]).checked).toBe(false);
			expect((<HTMLInputElement>root.children[4]).checked).toBe(true);
			expect((<HTMLInputElement>root.children[5]).checked).toBe(false);

			expect((<HTMLInputElement>root.children[6]).checked).toBe(false);
			expect((<HTMLInputElement>root.children[7]).checked).toBe(true);
			expect((<HTMLInputElement>root.children[8]).checked).toBe(false);
		});
	});

	for (const method of ['checkValidity', 'reportValidity']) {
		describe(`${method}()`, () => {
			it('Validates the form.', () => {
				element.innerHTML = `
                <div>
                    <input type="text" name="text1" required>
                    <select required>
                        <option></option>
                    </select>
                    <textarea name="textarea1" required></textarea>
                    <input type="checkbox" name="checkbox1" value="value1" required>
                    <input type="checkbox" name="checkbox1" value="value2" required>
                    <input type="checkbox" name="checkbox1" value="value3" required>
                    <input type="radio" name="radio1" value="value1" required>
                    <input type="radio" name="radio1" value="value2" required>
                    <input type="radio" name="radio1" value="value3" required>
                </div>
            `;

				document.body.appendChild(element);

				const root = element.children[0];
				let invalidEvents: Event[] = [];

				element.addEventListener('invalid', (event: Event) => invalidEvents.push(event));

				expect(element[method]()).toBe(false);
				expect(invalidEvents.length).toBe(7);
				invalidEvents = [];

				(<HTMLInputElement>root.children[0]).value = 'value';
				(<HTMLSelectElement>root.children[1]).options[0].value = 'value';
				(<HTMLTextAreaElement>root.children[2]).value = 'value';
				(<HTMLInputElement>root.children[3]).click();
				(<HTMLInputElement>root.children[4]).click();
				(<HTMLInputElement>root.children[5]).click();
				(<HTMLInputElement>root.children[7]).click();

				expect(element[method]()).toBe(true);
				expect(invalidEvents.length).toBe(0);
			});
		});
	}
});
