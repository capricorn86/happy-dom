import Node from '../node/Node';
import CharacterData from '../character-data/CharacterData';
import IText from './IText';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';

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
	 * Breaks the Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-text-splittext
	 * @see https://dom.spec.whatwg.org/#dom-text-splittext
	 * @param offset Offset.
	 * @returns New text node.
	 */
	public splitText(offset: number): IText {
		const length = this._data.length;

		if (offset > length) {
			new DOMException(
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
}
