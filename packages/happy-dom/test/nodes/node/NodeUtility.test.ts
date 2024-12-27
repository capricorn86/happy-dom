import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import NodeUtility from '../../../src/nodes/node/NodeUtility.js';
import NodeTypeEnum from '../../../src/nodes/node/NodeTypeEnum.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('NodeUtility', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('isTextNode()', () => {
		it('Returns "true" for text node.', () => {
			expect(NodeUtility.isTextNode(document.createTextNode('a'))).toBe(true);
		});

		it('Returns "false" for other nodes.', () => {
			expect(NodeUtility.isTextNode(document)).toBe(false);
			expect(NodeUtility.isTextNode(document.createElement('div'))).toBe(false);
			expect(NodeUtility.isTextNode(document.createDocumentFragment())).toBe(false);
			expect(NodeUtility.isTextNode(document.createAttribute('attr'))).toBe(false);
		});

		it('Returns "false" for null.', () => {
			expect(NodeUtility.isTextNode(null)).toBe(false);
		});
	});

	describe('isInclusiveAncestor()', () => {
		it('Returns "true" if referenceNode is the same as ancestorNode.', () => {
			const ancestorNode = document.createElement('div');
			const referenceNode = ancestorNode;
			expect(NodeUtility.isInclusiveAncestor(ancestorNode, referenceNode)).toBe(true);
		});

		it('Returns "true" if ancestorNode is a parent of referenceNode.', () => {
			const ancestorNode = document.createElement('div');
			const ancestorChildNode = document.createElement('div');
			const referenceNode = document.createElement('div');

			ancestorChildNode.appendChild(referenceNode);
			ancestorNode.appendChild(ancestorChildNode);

			expect(NodeUtility.isInclusiveAncestor(ancestorNode, referenceNode)).toBe(true);
		});
	});

	describe('isFollowing()', () => {
		it('Returns "false" if nodeA is the same as nodeB.', () => {
			const nodeA = document.createElement('div');
			const nodeB = nodeA;
			expect(NodeUtility.isFollowing(nodeA, nodeB)).toBe(false);
		});

		it('Returns "true" if nodeA is the next sibling of nodeB.', () => {
			const parent = document.createElement('div');
			const nodeA = document.createElement('div');
			const nodeB = document.createElement('div');

			parent.appendChild(nodeB);
			parent.appendChild(nodeA);

			expect(NodeUtility.isFollowing(nodeA, nodeB)).toBe(true);
		});

		it('Returns "true" if nodeA is child of a parent container that is the next sibling of the parent container of nodeB.', () => {
			const container = document.createElement('div');
			const parentA = document.createElement('div');
			const parentB = document.createElement('div');
			const nodeA = document.createElement('div');
			const nodeB = document.createElement('div');

			parentA.appendChild(nodeA);
			parentB.appendChild(nodeB);

			container.appendChild(parentB);
			container.appendChild(parentA);

			expect(NodeUtility.isFollowing(nodeA, nodeB)).toBe(true);
		});
	});

	describe('getNodeLength()', () => {
		it(`Returns 0 if node type is ${NodeTypeEnum.documentTypeNode}.`, () => {
			const documentType = document.implementation.createDocumentType(
				'qualifiedName',
				'publicId',
				'systemId'
			);
			expect(NodeUtility.getNodeLength(documentType)).toBe(0);
		});

		it(`Returns data length if node type is ${NodeTypeEnum.textNode}.`, () => {
			const textNode = document.createTextNode('text');
			expect(NodeUtility.getNodeLength(textNode)).toBe(4);
		});

		it(`Returns data length if node type is ${NodeTypeEnum.commentNode}.`, () => {
			const comment = document.createComment('text');
			expect(NodeUtility.getNodeLength(comment)).toBe(4);
		});

		it(`Returns childNodes length as default.`, () => {
			const div = document.createComment('div');
			const text1 = document.createTextNode('text');
			const text2 = document.createTextNode('text');
			const text3 = document.createTextNode('text');

			div.appendChild(text1);
			div.appendChild(text2);
			div.appendChild(text3);

			expect(NodeUtility.getNodeLength(div)).toBe(3);
		});
	});

	describe('attributeListsEqual()', () => {
		it('Returns false if lists does not have same length', () => {
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			const attrFoo1 = document.createAttribute('data-foo');
			const attrFoo2 = document.createAttribute('data-foo');
			const attrBar = document.createAttribute('data-bar');

			element1.setAttributeNode(attrFoo1);
			element2.setAttributeNode(attrFoo2);
			element1.setAttributeNode(attrBar);

			expect(NodeUtility.attributeListsEqual(element1, element2)).toEqual(false);
		});

		it('Returns false if lists are not equal', () => {
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			const attrFoo1 = document.createAttribute('data-foo');
			const attrFoo2 = document.createAttribute('data-foo');
			const attrBar = document.createAttribute('data-bar');
			const attrLorem = document.createAttribute('data-lorem');

			element1.setAttributeNode(attrFoo1);
			element1.setAttributeNode(attrBar);
			element2.setAttributeNode(attrFoo2);
			element2.setAttributeNode(attrLorem);

			expect(NodeUtility.attributeListsEqual(element1, element2)).toEqual(false);
		});

		it('Returns true if attribute lists are equal', () => {
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			const attrFoo1 = document.createAttribute('data-foo');
			const attrFoo2 = document.createAttribute('data-foo');

			element1.setAttributeNode(attrFoo1);
			element2.setAttributeNode(attrFoo2);

			expect(NodeUtility.attributeListsEqual(element1, element2)).toEqual(true);
		});
	});

	describe('isEqualNode()', () => {
		it('Returns false if element are not of same node type', () => {
			const element = document.createElement('div');
			const comment = document.createComment('foo');

			expect(NodeUtility.isEqualNode(element, comment)).toEqual(false);
		});

		describe('w/ document type node', () => {
			it('Returns false if name are different', () => {
				const doctype1 = window.document.implementation.createDocumentType('html1', 'foo', 'bar');
				const doctype2 = window.document.implementation.createDocumentType('html2', 'foo', 'bar');

				expect(NodeUtility.isEqualNode(doctype1, doctype2)).toEqual(false);
			});

			it('Returns false if public id are different', () => {
				const doctype1 = window.document.implementation.createDocumentType('html', 'foo1', 'bar');
				const doctype2 = window.document.implementation.createDocumentType('html', 'foo2', 'bar');

				expect(NodeUtility.isEqualNode(doctype1, doctype2)).toEqual(false);
			});

			it('Returns false if system id are different', () => {
				const doctype1 = window.document.implementation.createDocumentType('html', 'foo', 'bar1');
				const doctype2 = window.document.implementation.createDocumentType('html', 'foo', 'bar2');

				expect(NodeUtility.isEqualNode(doctype1, doctype2)).toEqual(false);
			});

			it('Returns true if doctype are equals', () => {
				const doctype1 = window.document.implementation.createDocumentType('html', 'foo', 'bar');
				const doctype2 = window.document.implementation.createDocumentType('html', 'foo', 'bar');

				expect(NodeUtility.isEqualNode(doctype1, doctype2)).toEqual(true);
			});
		});

		describe('w/ element node', () => {
			it('Returns false if local name are different', () => {
				const element1 = document.createElement('span');
				const element2 = document.createElement('div');

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});

			it('Returns false if namespace URI are different', () => {
				const element1 = document.createElementNS('ns1', 'span');
				const element2 = document.createElementNS('ns2', 'span');

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});

			it('Returns false if prefix are different', () => {
				const element1 = document.createElement('span');
				const element2 = document.createElement('span');

				element1[PropertySymbol.prefix] = 'prefix1';
				element2[PropertySymbol.prefix] = 'prefix2';

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});

			it('Returns false if attributes list length are different', () => {
				const element1 = document.createElement('span');
				const element2 = document.createElement('span');
				const attrFoo = document.createAttribute('data-foo');

				element1.setAttributeNode(attrFoo);

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});

			it('Returns false if element attributes are not equal', () => {
				const element1 = document.createElementNS('ns1', 'span');
				const element2 = document.createElementNS('ns1', 'span');
				element1[PropertySymbol.prefix] = 'prefix1';
				element2[PropertySymbol.prefix] = 'prefix1';
				const attrFoo = document.createAttribute('data-foo');
				const attrBar = document.createAttribute('data-bar');
				element1.setAttributeNode(attrFoo);
				element2.setAttributeNode(attrBar);

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});

			it('Returns false if element does not have same amount of children', () => {
				const element1 = document.createElement('span');
				const element2 = document.createElement('span');

				const child1 = document.createElement('span');
				const child2 = document.createElement('span');
				const child3 = document.createElement('span');

				element1.appendChild(child1);
				element1.appendChild(child2);
				element2.appendChild(child3);

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});

			it("Returns false if element's children are not equals", () => {
				const element1 = document.createElement('div');
				const element2 = document.createElement('div');

				const child1 = document.createElement('span');
				const child2 = document.createElement('span');
				const child3 = document.createElement('span');
				const child4 = document.createElement('div');

				element1.appendChild(child1);
				element1.appendChild(child2);
				element2.appendChild(child3);
				element2.appendChild(child4);

				expect(NodeUtility.isEqualNode(element1, element2)).toEqual(false);
			});
		});

		describe('w/ attribute node', () => {
			it('Returns false if local name are different', () => {
				const attr1 = document.createAttribute('foo1');
				const attr2 = document.createAttribute('foo2');

				expect(NodeUtility.isEqualNode(attr1, attr2)).toEqual(false);
			});

			it('Returns false if namespace URI are different', () => {
				const attr1 = document.createAttributeNS('ns1', 'foo');
				const attr2 = document.createAttributeNS('ns2', 'foo');

				expect(NodeUtility.isEqualNode(attr1, attr2)).toEqual(false);
			});

			it('Returns false if value are different', () => {
				const attr1 = document.createAttribute('foo');
				const attr2 = document.createAttribute('foo');

				attr1.value = 'bar1';
				attr2.value = 'bar2';

				expect(NodeUtility.isEqualNode(attr1, attr2)).toEqual(false);
			});

			it('Returns true if elements are equal', () => {
				const attr1 = document.createAttributeNS('ns', 'foo');
				const attr2 = document.createAttributeNS('ns', 'foo');
				attr1.value = 'bar';
				attr2.value = 'bar';

				expect(NodeUtility.isEqualNode(attr1, attr2)).toEqual(true);
			});
		});

		describe('w/ processing instruction node', () => {
			it('Returns false if target are different', () => {
				const instruction1 = document.createProcessingInstruction('target1', 'foo');
				const instruction2 = document.createProcessingInstruction('target2', 'foo');

				expect(NodeUtility.isEqualNode(instruction1, instruction2)).toEqual(false);
			});

			it('Returns false if data are different', () => {
				const instruction1 = document.createProcessingInstruction('target', 'foo1');
				const instruction2 = document.createProcessingInstruction('target', 'foo2');

				expect(NodeUtility.isEqualNode(instruction1, instruction2)).toEqual(false);
			});

			it('Returns true if processing instructions are equal', () => {
				const instruction1 = document.createProcessingInstruction('target', 'foo');
				const instruction2 = document.createProcessingInstruction('target', 'foo');

				expect(NodeUtility.isEqualNode(instruction1, instruction2)).toEqual(true);
			});
		});

		describe('w/ comment node', () => {
			it('Returns false if data are different', () => {
				const comment1 = document.createComment('foo1');
				const comment2 = document.createComment('foo2');

				expect(NodeUtility.isEqualNode(comment1, comment2)).toEqual(false);
			});

			it('Returns true if comments are equal', () => {
				const comment1 = document.createComment('foo');
				const comment2 = document.createComment('foo');

				expect(NodeUtility.isEqualNode(comment1, comment2)).toEqual(true);
			});
		});

		describe('w/ text node', () => {
			it('Returns false if data are different', () => {
				const textNode1 = document.createTextNode('foo1');
				const textNode2 = document.createTextNode('foo2');

				expect(NodeUtility.isEqualNode(textNode1, textNode2)).toEqual(false);
			});

			it('Returns true if text nodes are equal', () => {
				const textNode1 = document.createTextNode('foo');
				const textNode2 = document.createTextNode('foo');

				expect(NodeUtility.isEqualNode(textNode1, textNode2)).toEqual(true);
			});
		});
	});
});
