import CharacterData from '../character-data/CharacterData.js';
import IComment from './IComment.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * Comment node.
 */
export default class Comment extends CharacterData implements IComment {
	public [PropertySymbol.nodeType] = NodeTypeEnum.commentNode;

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
