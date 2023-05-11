import IElement from '../element/IElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IWindow from '../../window/IWindow';
import NodeIterator from '../../tree-walker/NodeIterator';
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
import VisibilityStateEnum from './VisibilityStateEnum';

/**
 * Document.
 */
export default interface IDocument extends IParentNode {
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
	readonly URL: string;
	readonly documentURI: string;
	readonly visibilityState: VisibilityStateEnum;
	readonly hidden: boolean;
	readonly links: IHTMLCollection<IHTMLElement>;
	cookie: string;
	title: string;

	// Events
	onreadystatechange: (event: Event) => void;
	onpointerlockchange: (event: Event) => void;
	onpointerlockerror: (event: Event) => void;
	onbeforecopy: (event: Event) => void;
	onbeforecut: (event: Event) => void;
	onbeforepaste: (event: Event) => void;
	onfreeze: (event: Event) => void;
	onresume: (event: Event) => void;
	onsearch: (event: Event) => void;
	onvisibilitychange: (event: Event) => void;
	onfullscreenchange: (event: Event) => void;
	onfullscreenerror: (event: Event) => void;
	onwebkitfullscreenchange: (event: Event) => void;
	onwebkitfullscreenerror: (event: Event) => void;
	onbeforexrselect: (event: Event) => void;
	onabort: (event: Event) => void;
	onbeforeinput: (event: Event) => void;
	onblur: (event: Event) => void;
	oncancel: (event: Event) => void;
	oncanplay: (event: Event) => void;
	oncanplaythrough: (event: Event) => void;
	onchange: (event: Event) => void;
	onclick: (event: Event) => void;
	onclose: (event: Event) => void;
	oncontextlost: (event: Event) => void;
	oncontextmenu: (event: Event) => void;
	oncontextrestored: (event: Event) => void;
	oncuechange: (event: Event) => void;
	ondblclick: (event: Event) => void;
	ondrag: (event: Event) => void;
	ondragend: (event: Event) => void;
	ondragenter: (event: Event) => void;
	ondragleave: (event: Event) => void;
	ondragover: (event: Event) => void;
	ondragstart: (event: Event) => void;
	ondrop: (event: Event) => void;
	ondurationchange: (event: Event) => void;
	onemptied: (event: Event) => void;
	onended: (event: Event) => void;
	onerror: (event: Event) => void;
	onfocus: (event: Event) => void;
	onformdata: (event: Event) => void;
	oninput: (event: Event) => void;
	oninvalid: (event: Event) => void;
	onkeydown: (event: Event) => void;
	onkeypress: (event: Event) => void;
	onkeyup: (event: Event) => void;
	onload: (event: Event) => void;
	onloadeddata: (event: Event) => void;
	onloadedmetadata: (event: Event) => void;
	onloadstart: (event: Event) => void;
	onmousedown: (event: Event) => void;
	onmouseenter: (event: Event) => void;
	onmouseleave: (event: Event) => void;
	onmousemove: (event: Event) => void;
	onmouseout: (event: Event) => void;
	onmouseover: (event: Event) => void;
	onmouseup: (event: Event) => void;
	onmousewheel: (event: Event) => void;
	onpause: (event: Event) => void;
	onplay: (event: Event) => void;
	onplaying: (event: Event) => void;
	onprogress: (event: Event) => void;
	onratechange: (event: Event) => void;
	onreset: (event: Event) => void;
	onresize: (event: Event) => void;
	onscroll: (event: Event) => void;
	onsecuritypolicyviolation: (event: Event) => void;
	onseeked: (event: Event) => void;
	onseeking: (event: Event) => void;
	onselect: (event: Event) => void;
	onslotchange: (event: Event) => void;
	onstalled: (event: Event) => void;
	onsubmit: (event: Event) => void;
	onsuspend: (event: Event) => void;
	ontimeupdate: (event: Event) => void;
	ontoggle: (event: Event) => void;
	onvolumechange: (event: Event) => void;
	onwaiting: (event: Event) => void;
	onwebkitanimationend: (event: Event) => void;
	onwebkitanimationiteration: (event: Event) => void;
	onwebkitanimationstart: (event: Event) => void;
	onwebkittransitionend: (event: Event) => void;
	onwheel: (event: Event) => void;
	onauxclick: (event: Event) => void;
	ongotpointercapture: (event: Event) => void;
	onlostpointercapture: (event: Event) => void;
	onpointerdown: (event: Event) => void;
	onpointermove: (event: Event) => void;
	onpointerrawupdate: (event: Event) => void;
	onpointerup: (event: Event) => void;
	onpointercancel: (event: Event) => void;
	onpointerover: (event: Event) => void;
	onpointerout: (event: Event) => void;
	onpointerenter: (event: Event) => void;
	onpointerleave: (event: Event) => void;
	onselectstart: (event: Event) => void;
	onselectionchange: (event: Event) => void;
	onanimationend: (event: Event) => void;
	onanimationiteration: (event: Event) => void;
	onanimationstart: (event: Event) => void;
	ontransitionrun: (event: Event) => void;
	ontransitionstart: (event: Event) => void;
	ontransitionend: (event: Event) => void;
	ontransitioncancel: (event: Event) => void;
	oncopy: (event: Event) => void;
	oncut: (event: Event) => void;
	onpaste: (event: Event) => void;
	onbeforematch: (event: Event) => void;

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
	 * Creates a node iterator.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	createNodeIterator(root: INode, whatToShow: number, filter: INodeFilter): NodeIterator;

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
	cloneNode(deep?: boolean): IDocument;

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
