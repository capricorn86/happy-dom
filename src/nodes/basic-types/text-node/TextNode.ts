import Node from '../node/Node';
import NodeType from '../node/NodeType';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';

/**
 * TextNode.
 */
export default class TextNode extends Node {
	public readonly nodeType = NodeType.TEXT_NODE;
	protected _textContent: string;

	/**
	 * Converts to string.
	 *
	 * @return {string} String.
	 */
	public toString(): string {
		return this._textContent;
	}

	/**
	 * Node name.
	 *
	 * @return {string} Node name.
	 */
	public get nodeName(): string {
		return '#text';
	}

	/**
	 * Returns text content.
	 *
	 * @return {string} Text content.
	 */
	public get textContent(): string {
		return this._textContent;
	}

	/**
	 * Sets text content.
	 *
	 * @param {string} textContent Text content.
	 */
	public set textContent(textContent: string) {
		const oldValue = this._textContent;
		this._textContent = textContent;

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (observer.options.characterData) {
					const record = new MutationRecord();
					record.type = MutationTypeConstant.characterData;
					record.oldValue = observer.options.characterDataOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Returns node value.
	 *
	 * @return {string} Node value.
	 */
	public get nodeValue(): string {
		return this._textContent;
	}

	/**
	 * Sets node value.
	 *
	 * @param {string} nodeValue Node value.
	 */
	public set nodeValue(nodeValue: string) {
		this.textContent = nodeValue;
	}

	/**
	 * Returns data.
	 *
	 * @return {string} Data.
	 */
	public get data(): string {
		return this._textContent;
	}

	/**
	 * Sets data.
	 *
	 * @param {string} data Data.
	 */
	public set data(nodeValue: string) {
		this.textContent = nodeValue;
	}
}
