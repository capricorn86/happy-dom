import IElement from '../element/IElement';
import IHTMLElement from '../html-element/IHTMLElement';
import Window from '../../window/Window';
import TreeWalker from '../../tree-walker/TreeWalker';
import Event from '../../event/Event';
import DOMImplementation from '../../dom-implementation/DOMImplementation';
import INodeFilter from '../../tree-walker/INodeFilter';
import Attr from '../../attribute/Attr';
import IDocumentType from '../document-type/IDocumentType';
import IParentNode from '../parent-node/IParentNode';
import INode from '../node/INode';
import ICharacterData from '../character-data/ICharacterData';
import IDocumentFragment from '../document-fragment/IDocumentFragment';

/**
 * Document.
 */
export default interface IDocument extends IParentNode {
	readonly defaultView: Window;
	readonly implementation: DOMImplementation;
	readonly documentElement: IHTMLElement;
	readonly doctype: IDocumentType;
	readonly body: IHTMLElement;
	readonly head: IHTMLElement;

	/**
	 * Replaces the document HTML with new HTML.
	 *
	 * @param html HTML.
	 */
	write(html: string): void;

	/**
	 * Opens the document.
	 *
	 * @returns Document.
	 */
	open(): IDocument;

	/**
	 * Closes the document.
	 */
	close(): void;

	/**
	 * Creates an element.
	 *
	 * @param tagName Tag name.
	 * @param [options] Options.
	 * @return Element.
	 */
	createElement(tagName: string, options?: { is: string }): IElement;

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param tagName Tag name.
	 * @param [options] Options.
	 * @return Element.
	 */
	createElementNS(namespaceURI: string, qualifiedName: string, options?: { is: string }): IElement;

	/**
	 * Creates a text node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	createTextNode(data: string): ICharacterData;

	/**
	 * Creates a comment node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	createComment(data: string): ICharacterData;

	/**
	 * Creates a document fragment.
	 *
	 * @returns Document fragment.
	 */
	createDocumentFragment(): IDocumentFragment;

	/**
	 * Creates a Tree Walker.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	createTreeWalker(root: INode, whatToShow: number, filter: INodeFilter): TreeWalker;

	/**
	 * Creates an event.
	 *
	 * @legacy
	 * @param _type Type.
	 * @returns Event.
	 */
	createEvent(_type: string): Event;

	/**
	 * Creates an Attr node.
	 *
	 * @param name Name.
	 * @return Attribute.
	 */
	createAttribute(name: string): Attr;

	/**
	 * Creates a namespaced Attr node.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Qualified name.
	 * @return Element.
	 */
	createAttributeNS(namespaceURI: string, qualifiedName: string): Attr;

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param Imported node.
	 */
	importNode(node: INode): INode;

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @return Matching element.
	 */
	getElementById(id: string): IElement;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	cloneNode(deep: boolean): IDocument;
}
