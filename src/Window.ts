import CustomElementRegistry from './html-element/CustomElementRegistry';
import Document from './nodes/basic-types/Document';
import Node from './nodes/basic-types/Node';
import NodeFilter from './tree-walker/NodeFilter';
import TextNode from './nodes/basic-types/TextNode';
import CommentNode from './nodes/basic-types/CommentNode';
import ShadowRoot from './nodes/basic-types/ShadowRoot';
import Element from './nodes/basic-types/Element';
import HTMLElement from './nodes/basic-types/HTMLElement';
import HTMLTemplateElement from './nodes/elements/HTMLTemplateElement';
import DocumentFragment from './nodes/basic-types/DocumentFragment';
import TreeWalker from './tree-walker/TreeWalker';
import Event from './event/Event';
import CustomEvent from './event/CustomEvent';
import EventTarget from './event/EventTarget';
import URL from './location/URL';
import Location from './location/Location';
import EventTypes from './event/EventTypes.json';
import MutationObserver from './mutation-observer/MutationObserver';
import ShadowRootRenderOptions from './shadow-root/ShadowRootRenderOptions';

const GLOBAL = window || global;

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

	public Array = typeof GLOBAL !== undefined ? GLOBAL.Array : null;
	public Object = typeof GLOBAL !== undefined ? GLOBAL.Object : null;
	public Number = typeof GLOBAL !== undefined ? GLOBAL.Number : null;
	public Symbol = typeof GLOBAL !== undefined ? GLOBAL.Symbol : null;
	public Function = typeof GLOBAL !== undefined ? GLOBAL.Function : null;
	public RegExp = typeof GLOBAL !== undefined ? GLOBAL.RegExp : null;
	public Date = typeof GLOBAL !== undefined ? GLOBAL.Date : null;
	public JSON = typeof GLOBAL !== undefined ? GLOBAL.JSON : null;
	public Promise = typeof GLOBAL !== undefined ? GLOBAL.Promise : null;
	public Error = typeof GLOBAL !== undefined ? GLOBAL.Error : null;

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public self = this;
	public console = typeof GLOBAL !== undefined ? GLOBAL.console : null;

	// Custom Properties (not part of HTML standard)
	public shadowRootRenderOptions = new ShadowRootRenderOptions();

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
