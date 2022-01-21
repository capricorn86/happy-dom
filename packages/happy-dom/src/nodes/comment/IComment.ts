import ICharacterData from '../character-data/ICharacterData';

export default interface IComment extends ICharacterData {
	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IComment;
}
