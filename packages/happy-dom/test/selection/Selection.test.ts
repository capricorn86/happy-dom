import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import Selection from '../../src/selection/Selection.js';
import SelectionDirectionEnum from '../../src/selection/SelectionDirectionEnum.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import NodeTypeEnum from '../../src/nodes/node/NodeTypeEnum.js';
import { beforeEach, describe, it, expect } from 'vitest';
import Event from '../../src/event/Event.js';

describe('Selection', () => {
	let window: Window;
	let document: Document;
	let selection: Selection;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		selection = new Selection(document);
	});

	describe('get rangeCount()', () => {
		it('Returns 1 if there is a Range added.', () => {
			const range = document.createRange();

			expect(selection.rangeCount).toBe(0);

			selection.addRange(range);
			expect(selection.rangeCount).toBe(1);

			selection.addRange(range);
			expect(selection.rangeCount).toBe(1);
		});
	});

	describe('get isCollapsed()', () => {
		it('Returns "true" if the Range is collapsed.', () => {
			const range = document.createRange();
			selection.addRange(range);
			expect(selection.isCollapsed).toBe(true);
		});
	});

	describe('get type()', () => {
		it('Returns "None" if no Range has been added.', () => {
			expect(selection.type).toBe('None');
		});

		it('Returns "Caret" if an added Range is collapsed.', () => {
			const range = document.createRange();
			selection.addRange(range);
			expect(selection.type).toBe('Caret');
		});

		it('Returns "Range" if an added Range is not collapsed.', () => {
			const range = document.createRange();
			const start = document.createElement('div');
			const end = document.createElement('div');

			document.body.appendChild(start);
			document.body.appendChild(end);

			range.setStart(start, 0);
			range.setEnd(end, 0);

			selection.addRange(range);

			expect(selection.type).toBe('Range');
		});
	});

	for (const property of ['anchorNode', 'baseNode']) {
		describe(`get ${property}()`, () => {
			it('Returns null if no Range has been added.', () => {
				expect(selection[property]).toBe(null);
			});

			it(`Returns start container of Range if direction is "${SelectionDirectionEnum.forwards}".`, () => {
				const range = document.createRange();
				const start = document.createElement('div');
				const end = document.createElement('div');

				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 0);
				range.setEnd(end, 0);

				selection.addRange(range);

				expect(selection[property] === start).toBe(true);
				expect(range.endContainer === end).toBe(true);
			});

			it(`Returns end container of Range if direction is "${SelectionDirectionEnum.backwards}".`, () => {
				const range = document.createRange();
				const extend = document.createElement('div');
				const start = document.createElement('div');
				const end = document.createElement('div');

				document.body.appendChild(extend);
				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 0);
				range.setEnd(end, 0);

				selection.addRange(range);

				selection.extend(extend, 0);

				expect(selection[property] === selection.getRangeAt(0).endContainer).toBe(true);
			});
		});
	}

	for (const property of ['focusNode', 'extentNode']) {
		describe(`get ${property}()`, () => {
			it('Returns null if no Range has been added.', () => {
				expect(selection[property]).toBe(null);
			});

			it(`Returns end container of Range if direction is "${SelectionDirectionEnum.forwards}".`, () => {
				const range = document.createRange();
				const start = document.createElement('div');
				const end = document.createElement('div');

				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 0);
				range.setEnd(end, 0);

				selection.addRange(range);

				expect(selection[property] === end).toBe(true);
				expect(range.startContainer === start).toBe(true);
			});

			it(`Returns start container of Range if direction is "${SelectionDirectionEnum.backwards}".`, () => {
				const range = document.createRange();
				const extend = document.createElement('div');
				const start = document.createElement('div');
				const end = document.createElement('div');

				document.body.appendChild(extend);
				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 0);
				range.setEnd(end, 0);

				selection.addRange(range);

				selection.extend(extend, 0);

				expect(selection[property] === selection.getRangeAt(0).startContainer).toBe(true);
			});
		});
	}

	for (const property of ['anchorOffset', 'baseOffset']) {
		describe(`get ${property}()`, () => {
			it('Returns 0 if no Range has been added.', () => {
				expect(selection[property]).toBe(0);
			});

			it(`Returns start offset of Range if direction is "${SelectionDirectionEnum.forwards}".`, () => {
				const range = document.createRange();
				const start = document.createTextNode('start');
				const end = document.createTextNode('end');

				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 1);
				range.setEnd(end, 2);

				selection.addRange(range);

				expect(selection[property] === 1).toBe(true);
				expect(range.endOffset === 2).toBe(true);
			});

			it(`Returns end offset of Range if direction is "${SelectionDirectionEnum.backwards}".`, () => {
				const range = document.createRange();
				const extend = document.createTextNode('extend');
				const start = document.createTextNode('start');
				const end = document.createTextNode('end');

				document.body.appendChild(extend);
				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 1);
				range.setEnd(end, 2);

				selection.addRange(range);

				selection.extend(extend, 3);

				expect(selection[property] === selection.getRangeAt(0).endOffset).toBe(true);
			});
		});
	}

	for (const property of ['focusOffset', 'extentOffset']) {
		describe(`get ${property}()`, () => {
			it('Returns 0 if no Range has been added.', () => {
				expect(selection[property]).toBe(0);
			});

			it(`Returns end offset of Range if direction is "${SelectionDirectionEnum.forwards}".`, () => {
				const range = document.createRange();
				const start = document.createTextNode('start');
				const end = document.createTextNode('end');

				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 1);
				range.setEnd(end, 2);

				selection.addRange(range);

				expect(selection[property] === 2).toBe(true);
				expect(range.startOffset === 1).toBe(true);
			});

			it(`Returns start offset of Range if direction is "${SelectionDirectionEnum.backwards}".`, () => {
				const range = document.createRange();
				const extend = document.createTextNode('extend');
				const start = document.createTextNode('start');
				const end = document.createTextNode('end');

				document.body.appendChild(extend);
				document.body.appendChild(start);
				document.body.appendChild(end);

				range.setStart(start, 1);
				range.setEnd(end, 2);

				selection.addRange(range);

				selection.extend(extend, 3);

				expect(selection[property] === selection.getRangeAt(0).startOffset).toBe(true);
			});
		});
	}

	describe('addRange()', () => {
		it('Adds a Range.', () => {
			const range = document.createRange();
			selection.addRange(range);
			expect(selection.getRangeAt(0)).toBe(range);
		});

		it('Does not add a new Range if there already is one added.', () => {
			const range1 = document.createRange();
			const range2 = document.createRange();
			selection.addRange(range1);
			selection.addRange(range2);
			expect(selection.rangeCount).toBe(1);
			expect(selection.getRangeAt(0)).toBe(range1);
		});

		it('Does not add a Range from another document.', () => {
			const range = new Window().document.createRange();
			selection.addRange(range);
			expect(selection.rangeCount).toBe(0);
		});

		it('Triggers a "selectionchange" event.', () => {
			let triggeredEvent: Event | null = null;
			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));
			const range = document.createRange();
			selection.addRange(range);
			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});
	});

	describe('getRangeAt()', () => {
		it('Returns an added Range.', () => {
			const range1 = document.createRange();
			selection.addRange(range1);
			expect(selection.getRangeAt(0)).toBe(range1);
		});

		it('Throws error if there is no Range added.', () => {
			expect(() => selection.getRangeAt(0)).toThrowError(
				new window.DOMException('Invalid range index.', DOMExceptionNameEnum.indexSizeError)
			);
		});

		it('Throws error for any other index than 0.', () => {
			const range1 = document.createRange();
			const range2 = document.createRange();
			selection.addRange(range1);
			selection.addRange(range2);
			expect(() => selection.getRangeAt(1)).toThrowError(
				new window.DOMException('Invalid range index.', DOMExceptionNameEnum.indexSizeError)
			);
		});
	});

	describe('removeRange()', () => {
		it('Removes a range.', () => {
			const range = document.createRange();
			selection.addRange(range);
			selection.removeRange(range);
			expect(selection.rangeCount).toBe(0);
		});

		it('Throws error if there is no Range added.', () => {
			const range = document.createRange();
			expect(() => selection.removeRange(range)).toThrowError(
				new window.DOMException('Invalid range.', DOMExceptionNameEnum.notFoundError)
			);
		});

		it("Throws error if there ranges doesn't match.", () => {
			const range1 = document.createRange();
			const range2 = document.createRange();
			selection.addRange(range1);
			expect(() => selection.removeRange(range2)).toThrowError(
				new window.DOMException('Invalid range.', DOMExceptionNameEnum.notFoundError)
			);
		});

		it('Triggers a "selectionchange" event.', () => {
			let triggeredEvent: Event | null = null;
			const range = document.createRange();
			selection.addRange(range);
			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));
			selection.removeRange(range);
			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});
	});

	for (const method of ['removeAllRanges', 'empty']) {
		describe(`${method}()`, () => {
			it('Removes all ranges.', () => {
				const range = document.createRange();
				selection.addRange(range);
				selection[method]();
				expect(selection.rangeCount).toBe(0);
			});

			it('Triggers a "selectionchange" event.', () => {
				let triggeredEvent: Event | null = null;
				const range = document.createRange();
				selection.addRange(range);
				document.addEventListener('selectionchange', (event) => (triggeredEvent = event));
				selection[method]();
				expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
				expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
			});
		});
	}

	for (const method of ['collapse', 'setPosition']) {
		describe(`${method}()`, () => {
			it('Removes all ranges if node is null.', () => {
				const range = document.createRange();
				selection.addRange(range);
				selection[method](null, 0);
				expect(selection.rangeCount).toBe(0);
			});

			it(`Throws error if node type is ${NodeTypeEnum.documentTypeNode}.`, () => {
				const documentType = document.implementation.createDocumentType('', '', '');

				expect(() => selection[method](documentType, 0)).toThrowError(
					new window.DOMException(
						"DocumentType Node can't be used as boundary point.",
						DOMExceptionNameEnum.invalidNodeTypeError
					)
				);
			});

			it('Throws error if offset is greater than the node length.', () => {
				const range = document.createRange();
				const text = document.createTextNode('Text');

				selection.addRange(range);
				expect(() => selection[method](text, 5)).toThrowError(
					new window.DOMException('Invalid range index.', DOMExceptionNameEnum.indexSizeError)
				);
			});

			it('Applies new range collapsed to the given node and offset.', () => {
				const range = document.createRange();
				const text = document.createTextNode('Text');

				selection.addRange(range);
				selection[method](text, 2);

				const newRange = selection.getRangeAt(0);
				expect(range !== newRange).toBe(true);
				expect(newRange.startContainer).toBe(text);
				expect(newRange.startOffset).toBe(2);
				expect(newRange.startContainer).toBe(text);
				expect(newRange.endOffset).toBe(2);
			});

			it('Triggers a "selectionchange" event.', () => {
				const range = document.createRange();
				const text = document.createTextNode('Text');
				let triggeredEvent: Event | null = null;

				selection.addRange(range);

				document.addEventListener('selectionchange', (event) => (triggeredEvent = event));

				selection[method](text, 2);

				expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
				expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
			});

			it('Accepts Document node.', () => {
				selection[method](document, 0);

				expect(selection.rangeCount).toBe(1);

				const newRange = selection.getRangeAt(0);

				expect(newRange.startContainer).toBe(document);
				expect(newRange.startOffset).toBe(0);
				expect(newRange.endContainer).toBe(document);
				expect(newRange.endOffset).toBe(0);
			});
		});
	}

	describe('collapseToEnd()', () => {
		it('Collapses to end.', () => {
			const range = document.createRange();
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');

			document.body.appendChild(start);
			document.body.appendChild(end);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);
			selection.collapseToEnd();

			const newRange = selection.getRangeAt(0);

			expect(newRange !== range).toBe(true);
			expect(newRange.startContainer).toBe(end);
			expect(newRange.startOffset).toBe(2);
			expect(newRange.startContainer).toBe(end);
			expect(newRange.endOffset).toBe(2);
		});

		it('Throws error if there is no Range added.', () => {
			expect(() => selection.collapseToEnd()).toThrowError(
				new window.DOMException(
					'There is no selection to collapse.',
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Triggers a "selectionchange" event.', () => {
			const range = document.createRange();
			let triggeredEvent: Event | null = null;

			selection.addRange(range);

			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));

			selection.collapseToEnd();

			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});
	});

	describe('collapseToStart()', () => {
		it('Collapses to start.', () => {
			const range = document.createRange();
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');

			document.body.appendChild(start);
			document.body.appendChild(end);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);
			selection.collapseToStart();

			const newRange = selection.getRangeAt(0);

			expect(newRange !== range).toBe(true);
			expect(newRange.startContainer).toBe(start);
			expect(newRange.startOffset).toBe(1);
			expect(newRange.endContainer).toBe(start);
			expect(newRange.endOffset).toBe(1);
		});

		it('Throws error if there is no Range added.', () => {
			expect(() => selection.collapseToStart()).toThrowError(
				new window.DOMException(
					'There is no selection to collapse.',
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Triggers a "selectionchange" event.', () => {
			const range = document.createRange();
			let triggeredEvent: Event | null = null;

			selection.addRange(range);

			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));

			selection.collapseToStart();

			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});
	});

	describe('containsNode()', () => {
		it('Returns "true" if the selection range contains a node.', () => {
			const range = document.createRange();
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const node = document.createTextNode('node');

			document.body.appendChild(start);
			document.body.appendChild(node);
			document.body.appendChild(end);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);

			expect(selection.containsNode(node)).toBe(true);
		});

		it('Returns "false" if the selection range does not contain a node.', () => {
			const range = document.createRange();
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const node = document.createTextNode('node');

			document.body.appendChild(start);
			document.body.appendChild(end);
			document.body.appendChild(node);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);

			expect(selection.containsNode(node)).toBe(false);
		});

		it('Returns "true" if the selection range partially contains a node.', () => {
			const range = document.createRange();
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const node = document.createTextNode('node');

			document.body.appendChild(start);
			document.body.appendChild(end);
			document.body.appendChild(node);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);

			expect(selection.containsNode(node, true)).toBe(true);
		});
	});

	describe('deleteFromDocument()', () => {
		it('Does nothing if there is no Range added.', () => {
			selection.deleteFromDocument();
		});

		it('Removes the selection Range from the document.', () => {
			const range = document.createRange();
			const before = document.createTextNode('before');
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const after = document.createTextNode('after');

			document.body.appendChild(before);
			document.body.appendChild(start);
			document.body.appendChild(end);
			document.body.appendChild(after);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);

			selection.deleteFromDocument();

			expect(document.body.innerHTML).toBe('beforesdafter');
		});
	});

	describe('extend()', () => {
		it('Extends the selection with a node and offset.', () => {
			const range = document.createRange();
			const before = document.createTextNode('before');
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const after = document.createTextNode('after');

			document.body.appendChild(before);
			document.body.appendChild(start);
			document.body.appendChild(end);
			document.body.appendChild(after);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);
			selection.extend(after, 3);

			selection.deleteFromDocument();

			expect(document.body.innerHTML).toBe('beforeser');
		});

		it('Throws error if there is no Range added.', () => {
			const node = document.createTextNode('after');
			expect(() => selection.extend(node, 3)).toThrowError(
				new window.DOMException(
					'There is no selection to extend.',
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Triggers a "selectionchange" event.', () => {
			const range = document.createRange();
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const after = document.createTextNode('after');
			let triggeredEvent: Event | null = null;

			document.body.appendChild(start);
			document.body.appendChild(end);
			document.body.appendChild(after);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);

			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));

			selection.extend(after, 3);

			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});

		it('Accepts Document node.', () => {
			const text = document.createTextNode('text');

			document.body.appendChild(text);

			selection.collapse(text, 0);
			selection.extend(document, 0);

			expect(selection.rangeCount).toBe(1);
			expect(selection.focusNode).toBe(document);
			expect(selection.focusOffset).toBe(0);
		});
	});

	describe('selectAllChildren()', () => {
		it('Selects all children of a given Node.', () => {
			const container = document.createElement('div');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');
			const text3 = document.createTextNode('text3');

			container.appendChild(text1);
			container.appendChild(text2);
			container.appendChild(text3);

			selection.selectAllChildren(container);

			const newRange = selection.getRangeAt(0);

			expect(newRange.startContainer).toBe(container);
			expect(newRange.startOffset).toBe(0);
			expect(newRange.endContainer).toBe(container);
			expect(newRange.endOffset).toBe(3);
		});

		it('Accepts Document node.', () => {
			selection.selectAllChildren(document);

			expect(selection.rangeCount).toBe(1);

			const newRange = selection.getRangeAt(0);

			expect(newRange.startContainer).toBe(document);
			expect(newRange.startOffset).toBe(0);
			expect(newRange.endContainer).toBe(document);
			expect(newRange.endOffset).toBe(document.childNodes.length);
		});

		it(`Throws error if node type is ${NodeTypeEnum.documentTypeNode}.`, () => {
			const documentType = document.implementation.createDocumentType('', '', '');

			expect(() => selection.selectAllChildren(documentType)).toThrowError(
				new window.DOMException(
					"DocumentType Node can't be used as boundary point.",
					DOMExceptionNameEnum.invalidNodeTypeError
				)
			);
		});

		it('Triggers a "selectionchange" event.', () => {
			const container = document.createElement('div');
			const child = document.createTextNode('child');
			let triggeredEvent: Event | null = null;

			container.appendChild(child);

			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));

			selection.selectAllChildren(container);

			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});
	});

	describe('setBaseAndExtent()', () => {
		it('Sets the selection to be a Range forward.', () => {
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');

			document.body.appendChild(start);
			document.body.appendChild(end);

			selection.setBaseAndExtent(start, 1, end, 2);

			const newRange = selection.getRangeAt(0);

			expect(newRange.startContainer).toBe(start);
			expect(newRange.startOffset).toBe(1);
			expect(newRange.endContainer).toBe(end);
			expect(newRange.endOffset).toBe(2);

			expect(selection.anchorNode).toBe(newRange.startContainer);
		});

		it('Sets the selection to be a Range backward.', () => {
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');

			document.body.appendChild(start);
			document.body.appendChild(end);

			selection.setBaseAndExtent(end, 2, start, 1);

			const newRange = selection.getRangeAt(0);

			expect(newRange.startContainer).toBe(start);
			expect(newRange.startOffset).toBe(1);
			expect(newRange.endContainer).toBe(end);
			expect(newRange.endOffset).toBe(2);

			expect(selection.anchorNode).toBe(newRange.endContainer);
		});

		it('Accepts Document node as boundary point.', () => {
			const text = document.createTextNode('text');

			document.body.appendChild(text);

			selection.setBaseAndExtent(document, 0, text, 2);

			expect(selection.rangeCount).toBe(1);

			const newRange = selection.getRangeAt(0);

			expect(newRange.startContainer).toBe(document);
			expect(newRange.endContainer).toBe(text);
		});

		it('Throws error if wrong offset.', () => {
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');

			document.body.appendChild(start);
			document.body.appendChild(end);

			expect(() => selection.setBaseAndExtent(start, 6, end, 2)).toThrowError(
				new window.DOMException(
					'Invalid anchor or focus offset.',
					DOMExceptionNameEnum.indexSizeError
				)
			);

			expect(() => selection.setBaseAndExtent(start, 1, end, 4)).toThrowError(
				new window.DOMException(
					'Invalid anchor or focus offset.',
					DOMExceptionNameEnum.indexSizeError
				)
			);
		});

		it('Triggers a "selectionchange" event.', () => {
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			let triggeredEvent: Event | null = null;

			document.body.appendChild(start);
			document.body.appendChild(end);

			document.addEventListener('selectionchange', (event) => (triggeredEvent = event));

			selection.setBaseAndExtent(start, 1, end, 2);

			expect((<Event>(<unknown>triggeredEvent)).bubbles).toBe(false);
			expect((<Event>(<unknown>triggeredEvent)).cancelable).toBe(false);
		});
	});

	describe('toString()', () => {
		it('Returns empty string if there is no Range added.', () => {
			expect(selection.toString()).toBe('');
		});

		it('Returns the text in the selected Range as a string.', () => {
			const range = document.createRange();
			const before = document.createTextNode('before');
			const start = document.createTextNode('start');
			const end = document.createTextNode('end');
			const after = document.createTextNode('after');

			document.body.appendChild(before);
			document.body.appendChild(start);
			document.body.appendChild(end);
			document.body.appendChild(after);

			range.setStart(start, 1);
			range.setEnd(end, 2);

			selection.addRange(range);

			expect(selection.toString()).toBe('tarten');
		});
	});
});
