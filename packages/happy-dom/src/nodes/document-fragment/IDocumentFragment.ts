import IElement from '../element/IElement';
import INode from '../node/INode';
import INodeList from '../node/INodeList';

export default interface IDocumentFragment extends INode {
	readonly childElementCount: number;
	readonly firstElementChild: IElement;
	readonly lastElementChild: IElement;
	readonly children: IElement[];

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	append(...nodes: (INode | string)[]): void;

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	prepend(...nodes: (INode | string)[]): void;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	querySelector(selector: string): IElement;

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	querySelectorAll(selector: string): INodeList<IElement>;

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	replaceChildren(...nodes: (INode | string)[]): void;

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @returns Matching element.
	 */
	getElementById(id: string): IElement;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IDocumentFragment;
}
