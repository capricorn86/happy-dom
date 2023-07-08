import Node from '../node/Node.js';
import CharacterData from '../character-data/CharacterData.js';
import IText from './IText.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';
import INode from '../node/INode.js';

/**
 * Text node.
 */
export default class Text extends CharacterData implements IText {
	public readonly nodeType = Node.TEXT_NODE;

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
		return this._data;
	}

	/**
	 * @override
	 */
	public override set data(data: string) {
		super.data = data;

		if (this._textAreaNode) {
			(<HTMLTextAreaElement>this._textAreaNode)._resetSelection();
		}
	}

	/**
	 * Breaks the Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-text-splittext
	 * @param offset Offset.
	 * @returns New text node.
	 */
	public splitText(offset: number): IText {
		const length = this._data.length;

		if (offset < 0 || offset > length) {
			throw new DOMException(
				'The index is not in the allowed range.',
				DOMExceptionNameEnum.indexSizeError
			);
		}

		const count = length - offset;
		const newData = this.substringData(offset, count);
		const newNode = <IText>this.ownerDocument.createTextNode(newData);

		if (this.parentNode !== null) {
			this.parentNode.insertBefore(newNode, this.nextSibling);
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
	public cloneNode(deep = false): IText {
		return <Text>super.cloneNode(deep);
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const oldTextAreaNode = <HTMLTextAreaElement>this._textAreaNode;

		super._connectToNode(parentNode);

		if (oldTextAreaNode !== this._textAreaNode) {
			if (oldTextAreaNode) {
				oldTextAreaNode._resetSelection();
			}
			if (this._textAreaNode) {
				(<HTMLTextAreaElement>this._textAreaNode)._resetSelection();
			}
		}
	}
}
