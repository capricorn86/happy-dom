import Node from '../node/Node';
import CharacterData from '../character-data/CharacterData';
import IText from './IText';

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
