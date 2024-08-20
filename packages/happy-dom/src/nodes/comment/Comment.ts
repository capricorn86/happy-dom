import CharacterData from '../character-data/CharacterData.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Document from '../document/Document.js';

/**
 * Comment node.
 */
export default class Comment extends CharacterData {
	public [PropertySymbol.nodeType] = NodeTypeEnum.commentNode;
	public declare cloneNode: (deep?: boolean) => Comment;

	/**
	 * Constructor.
	 *
	 * @param [ownerDocument] Owner document.
	 * @param [data] Data.
	 */
	constructor(ownerDocument?: Document, data?: string) {
		super(ownerDocument);

		this[PropertySymbol.data] = data !== undefined ? String(data) : '';
	}

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
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): Comment {
		return <Comment>super[PropertySymbol.cloneNode](deep);
	}
}
