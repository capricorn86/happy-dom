import * as PropertySymbol from '../../PropertySymbol.js';
import CharacterData from '../character-data/CharacterData.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';
import Node from '../node/Node.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * Text node.
 */
export default class Text extends CharacterData {
	public override [PropertySymbol.nodeType] = NodeTypeEnum.textNode;

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return '#text';
	}

	/**
	 * @override
	 */
	public override get data(): string {
		return this[PropertySymbol.data];
	}

	/**
	 * @override
	 */
	public override set data(data: string) {
		super.data = data;

		if (this[PropertySymbol.textAreaNode]) {
			(<HTMLTextAreaElement>this[PropertySymbol.textAreaNode])[PropertySymbol.resetSelection]();
		}
	}

	/**
	 * Breaks the Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-text-splittext
	 * @param offset Offset.
	 * @returns New text node.
	 */
	public splitText(offset: number): Text {
		const length = this[PropertySymbol.data].length;

		if (offset < 0 || offset > length) {
			throw new DOMException(
				'The index is not in the allowed range.',
				DOMExceptionNameEnum.indexSizeError
			);
		}

		const count = length - offset;
		const newData = this.substringData(offset, count);
		const newNode = <Text>this[PropertySymbol.ownerDocument].createTextNode(newData);

		if (this[PropertySymbol.parentNode] !== null) {
			this[PropertySymbol.parentNode].insertBefore(newNode, this.nextSibling);
		}

		this.replaceData(offset, count, '');

		return newNode;
	}

	/**
	 * Converts to string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object Text]';
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): Text {
		return <Text>super.cloneNode(deep);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectToNode](parentNode: Node = null): void {
		const oldTextAreaNode = <HTMLTextAreaElement>this[PropertySymbol.textAreaNode];

		super[PropertySymbol.connectToNode](parentNode);

		if (oldTextAreaNode !== this[PropertySymbol.textAreaNode]) {
			if (oldTextAreaNode) {
				oldTextAreaNode[PropertySymbol.resetSelection]();
			}
			if (this[PropertySymbol.textAreaNode]) {
				(<HTMLTextAreaElement>this[PropertySymbol.textAreaNode])[PropertySymbol.resetSelection]();
			}
		}
	}
}
