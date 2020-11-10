import INode from '../node/INode';

export default interface IChildNode extends INode {
	/**
	 * Removes the node from its parent.
	 */
	remove(): void;

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	before(...nodes: (INode | string)[]): void;

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	after(...nodes: (INode | string)[]): void;

	/**
	 * The Node.replaceWith() method replaces this Node in the children list of its parent with a set of Node or DOMString objects.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	replaceWith(...nodes: (INode | string)[]): void;
}
