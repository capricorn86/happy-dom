import Node from '../node/Node';
import MutationRecord from '../../mutation-observer/MutationRecord';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum';
import CharacterDataUtility from '../character-data/CharacterDataUtility';
import NonDocumentChildNodeUtility from '../child-node/NonDocumentChildNodeUtility';
import ChildNodeUtility from '../child-node/ChildNodeUtility';
import IElement from '../element/IElement';
import IText from './IText';

/**
 * Text node.
 */
export default class Text extends Node implements IText {
	public readonly nodeType = Node.TEXT_NODE;
	private _data = '';

	/**
	 * Constructor.
	 *
	 * @param [text] Text.
	 */
	constructor(text?: string) {
		super();

		if (text) {
			this._data = text;
		}
	}

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return '#text';
	}

	/**
	 * Returns text content.
	 *
	 * @returns Text content.
	 */
	public get length(): number {
		return this._data.length;
	}

	/**
	 * Returns text content.
	 *
	 * @returns Text content.
	 */
	public get data(): string {
		return this._data;
	}

	/**
	 * Sets text content.
	 *
	 * @param textContent Text content.
	 */
	public set data(data: string) {
		const oldValue = this._data;
		this._data = data;

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (observer.options.characterData) {
					const record = new MutationRecord();
					record.type = MutationTypeEnum.characterData;
					record.oldValue = observer.options.characterDataOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Returns text content.
	 *
	 * @returns Text content.
	 */
	public get textContent(): string {
		return this._data;
	}

	/**
	 * Sets text content.
	 *
	 * @param textContent Text content.
	 */
	public set textContent(textContent: string) {
		this.data = textContent;
	}

	/**
	 * Returns node value.
	 *
	 * @returns Node value.
	 */
	public get nodeValue(): string {
		return this._data;
	}

	/**
	 * Sets node value.
	 *
	 * @param nodeValue Node value.
	 */
	public set nodeValue(nodeValue: string) {
		this.textContent = nodeValue;
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
	 * Previous element sibling.
	 *
	 * @returns Element.
	 */
	public get previousElementSibling(): IElement {
		return NonDocumentChildNodeUtility.previousElementSibling(this);
	}

	/**
	 * Next element sibling.
	 *
	 * @returns Element.
	 */
	public get nextElementSibling(): IElement {
		return NonDocumentChildNodeUtility.nextElementSibling(this);
	}

	/**
	 * Appends the given DOMString to the CharacterData.data string; when this method returns, data contains the concatenated DOMString.
	 *
	 * @param data Data.
	 */
	public appendData(data: string): void {
		CharacterDataUtility.appendData(this, data);
	}

	/**
	 * Removes the specified amount of characters, starting at the specified offset, from the CharacterData.data string; when this method returns, data contains the shortened DOMString.
	 *
	 * @param offset Offset.
	 * @param count Count.
	 */
	public deleteData(offset: number, count: number): void {
		CharacterDataUtility.deleteData(this, offset, count);
	}

	/**
	 * Inserts the specified characters, at the specified offset, in the CharacterData.data string; when this method returns, data contains the modified DOMString.
	 *
	 * @param offset Offset.
	 * @param data Data.
	 */
	public insertData(offset: number, data: string): void {
		CharacterDataUtility.insertData(this, offset, data);
	}

	/**
	 * Removes the object from its parent children list.
	 */
	public remove(): void {
		ChildNodeUtility.remove(this);
	}

	/**
	 * The Node.replaceWith() method replaces this Node in the children list of its parent with a set of Node or DOMString objects.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceWith(...nodes: (Node | string)[]): void {
		ChildNodeUtility.replaceWith(this, ...nodes);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public before(...nodes: (string | Node)[]): void {
		ChildNodeUtility.before(this, ...nodes);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public after(...nodes: (string | Node)[]): void {
		ChildNodeUtility.after(this, ...nodes);
	}

	/**
	 * Replaces the specified amount of characters, starting at the specified offset, with the specified DOMString; when this method returns, data contains the modified DOMString.
	 *
	 * @param offset Offset.
	 * @param count Count.
	 * @param data Data.
	 */
	public replaceData(offset: number, count: number, data: string): void {
		CharacterDataUtility.replaceData(this, offset, count, data);
	}

	/**
	 * Returns a DOMString containing the part of CharacterData.data of the specified length and starting at the specified offset.
	 *
	 * @param offset Offset.
	 * @param count Count.
	 */
	public substringData(offset: number, count: number): string {
		return CharacterDataUtility.substringData(this, offset, count);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IText {
		const clone = <Text>super.cloneNode(deep);
		clone._data = this._data;
		return clone;
	}
}
