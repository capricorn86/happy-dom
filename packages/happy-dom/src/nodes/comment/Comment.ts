import Node from '../node/Node.js';
import CharacterData from '../character-data/CharacterData.js';
import IComment from './IComment.js';

/**
 * Comment node.
 */
export default class Comment extends CharacterData implements IComment {
	public readonly nodeType = Node.COMMENT_NODE;

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return '#comment';
	}

	/**
	 * Converts to string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object Comment]';
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IComment {
		return <Comment>super.cloneNode(deep);
	}
}
