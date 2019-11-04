import CustomElementRegistry from './custom-element/CustomElementRegistry';
import Document from './nodes/basic-types/document/Document';
import Node from './nodes/basic-types/node/Node';
import NodeFilter from './tree-walker/NodeFilter';
import TextNode from './nodes/basic-types/text-node/TextNode';
import CommentNode from './nodes/basic-types/comment-node/CommentNode';
import ShadowRoot from './nodes/basic-types/shadow-root/ShadowRoot';
import Element from './nodes/basic-types/element/Element';
import HTMLElement from './nodes/basic-types/html-element/HTMLElement';
import HTMLTemplateElement from './nodes/elements/template/HTMLTemplateElement';
import HTMLFormElement from './nodes/elements/form/HTMLFormElement';
import HTMLInputElement from './nodes/elements/input/HTMLInputElement';
import HTMLTextAreaElement from './nodes/elements/text-area/HTMLTextAreaElement';
import DocumentFragment from './nodes/basic-types/document-fragment/DocumentFragment';
import TreeWalker from './tree-walker/TreeWalker';
import Event from './event/Event';
import CustomEvent from './event/CustomEvent';
import EventTarget from './event/EventTarget';
import URL from './location/URL';
import Location from './location/Location';
import EventTypes from './event/EventTypes.json';
import MutationObserver from './mutation-observer/MutationObserver';

/**
 * Handles the Window.
 */
export default class Window extends EventTarget {
	// Global classes
	public Node = Node;
	public TextNode = TextNode;
	public CommentNode = CommentNode;
	public ShadowRoot = ShadowRoot;
	public HTMLElement = HTMLElement;
	public HTMLInputElement = HTMLInputElement;
	public HTMLFormElement = HTMLFormElement;
	public HTMLTextAreaElement = HTMLTextAreaElement;
	public HTMLTemplateElement = HTMLTemplateElement;
	public Element = Element;
	public DocumentFragment = DocumentFragment;
	public NodeFilter = NodeFilter;
	public TreeWalker = TreeWalker;
	public MutationObserver = MutationObserver;
	public Document = Document;
	public Event = Event;
	public CustomEvent = CustomEvent;
	public URL = URL;
	public Location = Location;
	public CustomElementRegistry = CustomElementRegistry;
	public Window = Window;

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public console = typeof global !== undefined ? global.console : null;
	public self: Window = this;
	public window: Window = this;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this.document = new Document(this);

		HTMLElement.ownerDocument = this.document;
		Node.ownerDocument = this.document;
		TextNode.ownerDocument = this.document;

		for (const eventType of EventTypes) {
			this[eventType] = Event;
		}

		// Copies functionality from global (like eval, String, Array, Object etc.)
		if (global !== undefined) {
			const descriptors = Object.getOwnPropertyDescriptors(global);
			Object.defineProperties(this, descriptors);
		}
	}

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 * @return {object} Empty object.
	 */
	public getComputedStyle(): {} {
		return {};
	}

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 */
	public scrollTo(): void {}

	/**
	 * Disposes the window.
	 */
	public dispose(): void {}
}
