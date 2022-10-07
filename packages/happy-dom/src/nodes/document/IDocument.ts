import IElement from '../element/IElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IWindow from '../../window/IWindow';
import TreeWalker from '../../tree-walker/TreeWalker';
import Event from '../../event/Event';
import DOMImplementation from '../../dom-implementation/DOMImplementation';
import INodeFilter from '../../tree-walker/INodeFilter';
import IAttr from '../attr/IAttr';
import IDocumentType from '../document-type/IDocumentType';
import IParentNode from '../parent-node/IParentNode';
import INode from '../node/INode';
import ICharacterData from '../character-data/ICharacterData';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import Selection from '../../selection/Selection';
import IHTMLCollection from '../element/IHTMLCollection';
import IHTMLScriptElement from '../html-script-element/IHTMLScriptElement';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import Location from '../../location/Location';
import DocumentReadyStateEnum from './DocumentReadyStateEnum';
import INodeList from '../node/INodeList';
import Range from '../../range/Range';
import IProcessingInstruction from '../processing-instruction/IProcessingInstruction';

/**
 * Document.
 */
export default interface IDocument extends IParentNode {
	onreadystatechange: (event: Event) => void;
	readonly defaultView: IWindow;
	readonly implementation: DOMImplementation;
	readonly documentElement: IHTMLElement;
	readonly doctype: IDocumentType;
	readonly body: IHTMLElement;
	readonly head: IHTMLElement;
	readonly scripts: IHTMLCollection<IHTMLScriptElement>;
	readonly activeElement: IHTMLElement;
	readonly styleSheets: CSSStyleSheet[];
	readonly scrollingElement: IHTMLElement;
	readonly location: Location;
	readonly readyState: DocumentReadyStateEnum;
	readonly charset: string;
	readonly characterSet: string;
	cookie: string;

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
	 * @returns Element.
	 */
	createElement(tagName: string, options?: { is: string }): IElement;

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param tagName Tag name.
	 * @param [options] Options.
	 * @returns Element.
	 */
	createElementNS(namespaceURI: string, qualifiedName: string, options?: { is: string }): IElement;

	/**
	 * Creates a text node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	createTextNode(data?: string): ICharacterData;

	/**
	 * Creates a comment node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	createComment(data?: string): ICharacterData;

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
	 * @deprecated
	 * @param _type Type.
	 * @returns Event.
	 */
	createEvent(_type: string): Event;

	/**
	 * Creates an Attr node.
	 *
	 * @param name Name.
	 * @returns Attribute.
	 */
	createAttribute(name: string): IAttr;

	/**
	 * Creates a namespaced Attr node.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Qualified name.
	 * @returns Element.
	 */
	createAttributeNS(namespaceURI: string, qualifiedName: string): IAttr;

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param Imported Node.
	 */
	importNode(node: INode): INode;

	/**
	 * Creates a range.
	 *
	 * @returns Range.
	 */
	createRange(): Range;

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @returns Matching element.
	 */
	getElementById(id: string): IElement;

	/**
	 * Returns an elements by name.
	 *
	 * @param name Name.
	 * @returns Matching element.
	 */
	getElementsByName(name: string): INodeList<IElement>;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep: boolean): IDocument;

	/**
	 * Adopts a node.
	 *
	 * @param node Node to adopt.
	 * @returns Adopted node.
	 */
	adoptNode(node: INode): INode;

	/**
	 * Returns selection.
	 *
	 * @returns Selection.
	 */
	getSelection(): Selection;

	/**
	 * Returns a boolean value indicating whether the document or any element inside the document has focus.
	 *
	 * @returns "true" if the document has focus.
	 */
	hasFocus(): boolean;

	/**
	 * Creates a Processing Instruction node.
	 *
	 * @returns IProcessingInstruction.
	 * @param target
	 * @param data
	 */
	createProcessingInstruction(target: string, data: string): IProcessingInstruction;
}
