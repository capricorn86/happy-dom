import INode from '../node/INode';
import IChildNode from '../child-node/IChildNode';
import INonDocumentTypeChildNode from '../child-node/INonDocumentTypeChildNode';

export default interface ICharacterData extends INode, IChildNode, INonDocumentTypeChildNode {
	data: string;
	readonly length: number;

	/**
	 * Appends the given DOMString to the CharacterData.data string; when this method returns, data contains the concatenated DOMString.
	 *
	 * @param data Data.
	 */
	appendData(data: string): void;

	/**
	 * Removes the specified amount of characters, starting at the specified offset, from the CharacterData.data string; when this method returns, data contains the shortened DOMString.
	 *
	 * @param offset Offset.
	 * @param count Count.
	 */
	deleteData(offset: number, count: number): void;

	/**
	 * Inserts the specified characters, at the specified offset, in the CharacterData.data string; when this method returns, data contains the modified DOMString.
	 *
	 * @param offset Offset.
	 * @param data Data.
	 */
	insertData(offset: number, data: string): void;

	/**
	 * Replaces the specified amount of characters, starting at the specified offset, with the specified DOMString; when this method returns, data contains the modified DOMString.
	 *
	 * @param offset Offset.
	 * @param count Count.
	 * @param data Data.
	 */
	replaceData(offset: number, count: number, data: string): void;

	/**
	 * Returns a DOMString containing the part of CharacterData.data of the specified length and starting at the specified offset.
	 *
	 * @param offset Offset.
	 * @param count Count.
	 */
	substringData(offset: number, count: number): string;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): ICharacterData;
}
