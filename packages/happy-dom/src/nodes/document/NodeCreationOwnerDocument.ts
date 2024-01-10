import IDocument from './IDocument.js';

/**
 * When creating a new node, the ownerDocument property is set to the document object associated with the node's.
 * The ownerDocument property has to be available in the constructor of the node.
 *
 * This is used for setting current ownerDocument state when creating a new node.
 *
 * Another method for achieving this wich is also supported in Node, is to set a static property on the node class.
 * This may be necessary for sub-classes wich are bound to a document, but can cause problems in some cases when Node.js sets this.constructor to Reflect.comnstruct(), which is not the original class.
 */
export default <{ ownerDocument: IDocument | null }>{
	ownerDocument: null
};
