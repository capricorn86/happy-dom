import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import MutationObserver from '../../src/mutation-observer/MutationObserver.js';
import MutationRecord from '../../src/mutation-observer/MutationRecord.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('MutationObserver', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('observe()', () => {
		it('Observes attributes.', async () => {
			let records: MutationRecord[] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});
			observer.observe(div, { attributes: true });
			div.setAttribute('attr', 'value');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				{
					addedNodes: [],
					attributeName: 'attr',
					attributeNamespace: null,
					nextSibling: null,
					oldValue: null,
					previousSibling: null,
					removedNodes: [],
					target: div,
					type: 'attributes'
				}
			]);
		});

		it('Throws TypeError for invalid options.', async () => {
			const div = document.createElement('div');
			const observer = new window.MutationObserver(() => {});
			expect(() => observer.observe(div, {})).toThrow(
				new TypeError(
					`Failed to execute 'observe' on 'MutationObserver': The options object must set at least one of 'attributes', 'characterData', or 'childList' to true.`
				)
			);
		});

		it('Allows to omit "attributes" if "attributeOldValue" or "attributeFilter" is specified.', async () => {
			const div = document.createElement('div');
			const observer = new window.MutationObserver(() => {});
			expect(() => observer.observe(div, { attributes: false, attributeOldValue: true })).toThrow();
			expect(() =>
				observer.observe(div, { attributes: false, attributeFilter: ['style', 'class'] })
			).toThrow();

			expect(() => observer.observe(div, { attributeOldValue: true })).not.toThrow();
			expect(() => observer.observe(div, { attributeFilter: ['style', 'class'] })).not.toThrow();
		});

		it('Allows to omit "characterData" if "characterDataOldValue" is specified.', async () => {
			const text = document.createTextNode('old');
			const observer = new window.MutationObserver(() => {});
			expect(() =>
				observer.observe(text, { characterData: false, characterDataOldValue: true })
			).toThrow();
			expect(() => observer.observe(text, { characterDataOldValue: true })).not.toThrow();
		});

		it('Observes attributes and old attribute values.', async () => {
			let records: MutationRecord[] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});
			div.setAttribute('attr', 'old');
			observer.observe(div, { attributeOldValue: true, attributes: true });
			div.setAttribute('attr', 'new');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				{
					addedNodes: [],
					attributeName: 'attr',
					attributeNamespace: null,
					nextSibling: null,
					oldValue: 'old',
					previousSibling: null,
					removedNodes: [],
					target: div,
					type: 'attributes'
				}
			]);
		});

		it('Only observes a list of filtered attributes if defined.', async () => {
			const records: MutationRecord[][] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records.push(mutationRecords);
			});
			div.setAttribute('attr1', 'old');
			div.setAttribute('attr2', 'old');
			observer.observe(div, {
				attributeFilter: ['attr1'],
				attributeOldValue: true,
				attributes: true
			});
			div.setAttribute('attr1', 'new');
			div.setAttribute('attr2', 'new');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				[
					{
						addedNodes: [],
						attributeName: 'attr1',
						attributeNamespace: null,
						nextSibling: null,
						oldValue: 'old',
						previousSibling: null,
						removedNodes: [],
						target: div,
						type: 'attributes'
					}
				]
			]);
		});

		it('Observers character data changes on text node.', async () => {
			const records: MutationRecord[][] = [];
			const text = document.createTextNode('old');
			const observer = new window.MutationObserver((mutationRecords) => {
				records.push(mutationRecords);
			});
			observer.observe(text, { characterData: true, characterDataOldValue: true });
			text.textContent = 'new';

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				[
					{
						addedNodes: [],
						attributeName: null,
						attributeNamespace: null,
						nextSibling: null,
						oldValue: 'old',
						previousSibling: null,
						removedNodes: [],
						target: text,
						type: 'characterData'
					}
				]
			]);
		});

		it('Observers character data changes to child text nodes.', async () => {
			const records: MutationRecord[][] = [];
			const div = document.createElement('div');
			const text = document.createTextNode('old');
			const observer = new window.MutationObserver((mutationRecords) => {
				records.push(mutationRecords);
			});
			div.appendChild(text);
			observer.observe(div, { characterData: true, subtree: true, characterDataOldValue: true });
			text.textContent = 'new';

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				[
					{
						addedNodes: [],
						attributeName: null,
						attributeNamespace: null,
						nextSibling: null,
						oldValue: 'old',
						previousSibling: null,
						removedNodes: [],
						target: text,
						type: 'characterData'
					}
				]
			]);
		});

		it('Observers added and removed nodes.', async () => {
			const records: MutationRecord[][] = [];
			const div = document.createElement('div');
			const span = document.createElement('span');
			const article = document.createElement('article');
			const text = document.createTextNode('old');
			const observer = new window.MutationObserver((mutationRecords) => {
				records.push(mutationRecords);
			});
			observer.observe(div, { subtree: true, childList: true });
			div.appendChild(text);
			div.appendChild(span);
			span.appendChild(article);
			span.removeChild(article);

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				[
					{
						addedNodes: [text],
						attributeName: null,
						attributeNamespace: null,
						nextSibling: null,
						oldValue: null,
						previousSibling: null,
						removedNodes: [],
						target: div,
						type: 'childList'
					},
					{
						addedNodes: [span],
						attributeName: null,
						attributeNamespace: null,
						nextSibling: null,
						oldValue: null,
						previousSibling: null,
						removedNodes: [],
						target: div,
						type: 'childList'
					},
					{
						addedNodes: [article],
						attributeName: null,
						attributeNamespace: null,
						nextSibling: null,
						oldValue: null,
						previousSibling: null,
						removedNodes: [],
						target: span,
						type: 'childList'
					},
					{
						addedNodes: [],
						attributeName: null,
						attributeNamespace: null,
						nextSibling: null,
						oldValue: null,
						previousSibling: null,
						removedNodes: [article],
						target: span,
						type: 'childList'
					}
				]
			]);
		});

		it('Can observe document node.', async () => {
			let records: MutationRecord[] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});
			document.body.appendChild(div);
			observer.observe(document, { attributes: true, subtree: true });
			div.setAttribute('attr', 'value');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([
				{
					addedNodes: [],
					attributeName: 'attr',
					attributeNamespace: null,
					nextSibling: null,
					oldValue: null,
					previousSibling: null,
					removedNodes: [],
					target: div,
					type: 'attributes'
				}
			]);
		});
	});

	describe('disconnect()', () => {
		it('Disconnects the observer.', async () => {
			let records: MutationRecord[] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});

			observer.observe(div, { attributes: true });

			observer.disconnect();

			div.setAttribute('attr', 'value');

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([]);
		});

		it('Disconnects the observer when closing window.', async () => {
			let records: MutationRecord[] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});
			const span = document.createElement('span');
			const text = document.createTextNode('old');

			span.appendChild(text);
			div.appendChild(span);

			document.body.appendChild(div);

			observer.observe(div, {
				attributes: true,
				childList: true,
				subtree: true,
				characterData: true,
				attributeOldValue: true,
				characterDataOldValue: true
			});

			text.textContent = 'new1';
			div.setAttribute('attr', 'value1');

			await Promise.all([
				window.happyDOM.close(),
				(async () => {
					text.textContent = 'new2';
					div.setAttribute('attr', 'value2');
				})(),
				new Promise((resolve) => setTimeout(resolve, 10))
			]);

			text.textContent = 'new3';
			div.removeChild(span);
			div.setAttribute('attr', 'value3');

			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(records).toEqual([]);
		});

		it('Ignores if triggered when it is not observing.', () => {
			const observer = new window.MutationObserver(() => {});
			expect(() => observer.disconnect()).not.toThrow();
		});
	});

	describe('takeRecords()', () => {
		it('Returns all records and empties the record queue.', async () => {
			let records: MutationRecord[] = [];
			const div = document.createElement('div');
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});

			observer.observe(div, { attributes: true });

			div.setAttribute('attr', 'value');

			expect(observer.takeRecords()).toEqual([
				{
					addedNodes: [],
					attributeName: 'attr',
					attributeNamespace: null,
					nextSibling: null,
					oldValue: null,
					previousSibling: null,
					removedNodes: [],
					target: div,
					type: 'attributes'
				}
			]);

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records).toEqual([]);
		});
	});
});
