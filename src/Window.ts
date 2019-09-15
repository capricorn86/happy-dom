import CustomElementRegistry from './html-element/CustomElementRegistry';
import Document from './nodes/Document';
import Node from './nodes/Node';
import NodeFilter from './tree-walker/NodeFilter';
import TextNode from './nodes/TextNode';
import CommentNode from './nodes/CommentNode';
import ShadowRoot from './nodes/ShadowRoot';
import Element from './nodes/Element';
import HTMLElement from './nodes/HTMLElement';
import HTMLTemplateElement from './nodes/HTMLTemplateElement';
import DocumentFragment from './nodes/DocumentFragment';
import TreeWalker from './tree-walker/TreeWalker';
import Event from './event/Event';
import CustomEvent from './event/CustomEvent';
import EventTarget from './event/EventTarget';
import URL from './location/URL';
import Location from './location/Location';
import EventTypes from './event/EventTypes.json';
import MutationObserver from './mutation-observer/MutationObserver';
import ShadowRootRenderOptions from './shadow-root/ShadowRootRenderOptions';

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

	// @ts-ignore
	public Array = typeof global !== undefined ? global.Array : null;
	// @ts-ignore
	public Object = typeof global !== undefined ? global.Object : null;
	// @ts-ignore
	public Number = typeof global !== undefined ? global.Number : null;
	// @ts-ignore
	public Symbol = typeof global !== undefined ? global.Symbol : null;
	// @ts-ignore
	public Function = typeof global !== undefined ? global.Function : null;
	// @ts-ignore
	public RegExp = typeof global !== undefined ? global.RegExp : null;
	// @ts-ignore
	public Date = typeof global !== undefined ? global.Date : null;
	// @ts-ignore
	public JSON = typeof global !== undefined ? global.JSON : null;
	// @ts-ignore
	public Promise = typeof global !== undefined ? global.Promise : null;
	// @ts-ignore
	public Error = typeof global !== undefined ? global.Error : null;

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public self = this;

	// @ts-ignore
	public console = typeof global !== undefined ? global.console : null;

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
