import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import NodeUtility from '../../../src/nodes/node/NodeUtility';
import NodeTypeEnum from '../../../src/nodes/node/NodeTypeEnum';

describe('NodeUtility', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
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
});
