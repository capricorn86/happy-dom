import IElement from '../element/IElement.js';
import Node from '../node/Node.js';
import IAttr from './IAttr.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * Attribute node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Attr.
 */
export default class Attr extends Node implements IAttr {
	public [PropertySymbol.nodeType] = NodeTypeEnum.attributeNode;
	public [PropertySymbol.namespaceURI]: string | null = null;
	public [PropertySymbol.name]: string | null = null;
	public [PropertySymbol.value]: string | null = null;
	public [PropertySymbol.specified] = true;
	public [PropertySymbol.ownerElement]: IElement | null = null;

	/**
	 * Returns specified.
	 *
	 * @returns Specified.
	 */
	public get specified(): boolean {
		return this[PropertySymbol.specified];
	}

	/**
	 * Returns owner element.
	 *
	 * @returns Owner element.
	 */
	public get ownerElement(): IElement | null {
		return this[PropertySymbol.ownerElement];
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this[PropertySymbol.value];
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this[PropertySymbol.value] = value;
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this[PropertySymbol.name];
	}

	/**
	 * Returns local name.
	 *
	 * @returns Local name.
	 */
	public get localName(): string {
		return this[PropertySymbol.name] ? this[PropertySymbol.name].split(':').reverse()[0] : null;
	}

	/**
	 * Returns prefix.
	 *
	 * @returns Prefix.
	 */
	public get prefix(): string {
		return this[PropertySymbol.name] ? this[PropertySymbol.name].split(':')[0] : null;
	}

	/**
	 * @override
	 */
	public get textContent(): string {
		return this[PropertySymbol.value];
	}

	/**
	 * Returns namespace URI.
	 *
	 * @returns Namespace URI.
	 */
	public get namespaceURI(): string | null {
		return this[PropertySymbol.namespaceURI];
	}
}
