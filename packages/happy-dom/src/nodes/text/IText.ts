import ICharacterData from '../character-data/ICharacterData.js';

export default interface IText extends ICharacterData {
	/**
	 * Breaks the Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-text-splittext
	 * @see https://dom.spec.whatwg.org/#dom-text-splittext
	 * @param offset Offset.
	 * @returns New text node.
	 */
	splitText(offset: number): IText;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IText;
}
