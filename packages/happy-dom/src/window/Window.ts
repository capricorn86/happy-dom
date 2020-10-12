import CustomElementRegistry from '../custom-element/CustomElementRegistry';
import Document from '../nodes/basic/document/Document';
import Node from '../nodes/basic/node/Node';
import NodeFilter from '../tree-walker/NodeFilter';
import TextNode from '../nodes/basic/text-node/TextNode';
import CommentNode from '../nodes/basic/comment-node/CommentNode';
import ShadowRoot from '../nodes/basic/shadow-root/ShadowRoot';
import Element from '../nodes/basic/element/Element';
import HTMLElement from '../nodes/basic/html-element/HTMLElement';
import DocumentFragment from '../nodes/basic/document-fragment/DocumentFragment';
import TreeWalker from '../tree-walker/TreeWalker';
import Event from '../event/Event';
import CustomEvent from '../event/CustomEvent';
import EventTarget from '../event/EventTarget';
import URL from '../location/URL';
import Location from '../location/Location';
import EventTypes from '../event/EventTypes.json';
import MutationObserver from '../mutation-observer/MutationObserver';
import HTMLElementClass from '../html-config/HTMLElementClass';
import DOMParser from '../dom-parser/DOMParser';
import XMLSerializer from '../xml-serializer/XMLSerializer';

/**
 * Handles the Window.
 */
export default class Window extends EventTarget implements NodeJS.Global {
	// Global classes
	public Node = Node;
	public TextNode = TextNode;
	public CommentNode = CommentNode;
	public ShadowRoot = ShadowRoot;
	public Element = Element;
	public DocumentFragment = DocumentFragment;
	public NodeFilter = NodeFilter;
	public TreeWalker = TreeWalker;
	public DOMParser = DOMParser;
	public MutationObserver = MutationObserver;
	public Document = Document;
	public Event = Event;
	public CustomEvent = CustomEvent;
	public URL = URL;
	public Location = Location;
	public CustomElementRegistry = CustomElementRegistry;
	public Window = Window;
	public Headers = Map;
	public XMLSerializer = XMLSerializer;

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public console = global ? global.console : null;
	public self: Window = this;
	public top: Window = this;
	public window: Window = this;

	// Node.js Globals
	public Array = global ? global.Array : null;
	public ArrayBuffer = global ? global.ArrayBuffer : null;
	public Boolean = global ? global.Boolean : null;
	public Buffer = null;
	public DataView = global ? global.DataView : null;
	public Date = global ? global.Date : null;
	public Error = global ? global.Error : null;
	public EvalError = global ? global.EvalError : null;
	public Float32Array = global ? global.Float32Array : null;
	public Float64Array = global ? global.Float64Array : null;
	public Function = global ? global.Function : null;
	public GLOBAL = null;
	public Infinity = global ? global.Infinity : null;
	public Int16Array = global ? global.Int16Array : null;
	public Int32Array = global ? global.Int32Array : null;
	public Int8Array = global ? global.Int8Array : null;
	public Intl = global ? global.Intl : null;
	public JSON = global ? global.JSON : null;
	public Map = global ? global.Map : null;
	public Math = global ? global.Math : null;
	public NaN = global ? global.NaN : null;
	public Object = global ? global.Object : null;
	public Number = global ? global.Number : null;
	public Promise = global ? global.Promise : null;
	public RangeError = global ? global.RangeError : null;
	public ReferenceError = global ? global.ReferenceError : null;
	public RegExp = global ? global.RegExp : null;
	public Set = global ? global.Set : null;
	public Symbol = global ? global.Symbol : null;
	public SyntaxError = global ? global.SyntaxError : null;
	public String = global ? global.String : null;
	public TypeError = global ? global.TypeError : null;
	public URIError = global ? global.URIError : null;
	public Uint16Array = global ? global.Uint16Array : null;
	public Uint32Array = global ? global.Uint32Array : null;
	public Uint8Array = global ? global.Uint8Array : null;
	public Uint8ClampedArray = global ? global.Uint8ClampedArray : null;
	public WeakMap = global ? global.WeakMap : null;
	public WeakSet = global ? global.WeakSet : null;
	public clearImmediate = null;
	public decodeURI = global ? global.decodeURI : null;
	public decodeURIComponent = global ? global.decodeURIComponent : null;
	public encodeURI = global ? global.encodeURI : null;
	public encodeURIComponent = global ? global.encodeURIComponent : null;
	public escape = global ? global.escape : null;
	public eval = global ? global.eval : null;
	public global = null;
	public isFinite = global ? global.isFinite : null;
	public isNaN = global ? global.isNaN : null;
	public parseFloat = global ? global.parseFloat : null;
	public parseInt = global ? global.parseInt : null;
	public process = null;
	public root = null;
	public setImmediate = null;
	public queueMicrotask = global ? global.queueMicrotask : null;
	public undefined = global ? global.undefined : null;
	public unescape = global ? global.unescape : null;
	public gc = null;
	public v8debug = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this.document = new Document(this);

		DOMParser.ownerDocument = DOMParser.ownerDocument || this.document;
		HTMLElement.ownerDocument = HTMLElement.ownerDocument || this.document;
		Node.ownerDocument = Node.ownerDocument || this.document;
		TextNode.ownerDocument = TextNode.ownerDocument || this.document;

		for (const eventType of EventTypes) {
			this[eventType] = Event;
		}

		for (const className of Object.keys(HTMLElementClass)) {
			this[className] = HTMLElementClass[className];
		}
	}

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 * @returns Empty object.
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

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @param callback Function to be executed.
	 * @param [delay] Delay in ms.
	 * @return Timeout ID.
	 */
	public setTimeout(callback: () => void, delay?: number): NodeJS.Timeout {
		return global.setTimeout(callback, delay);
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		global.clearTimeout(id);
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @param callback Function to be executed.
	 * @param [delay] Delay in ms.
	 * @return Interval ID.
	 */
	public setInterval(callback: () => void, delay?: number): NodeJS.Timeout {
		return global.setInterval(callback, delay);
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		global.clearInterval(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {function} callback Callback.
	 * @returns {NodeJS.Timeout} Timeout ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout {
		return this.setTimeout(() => {
			callback(2);
		}, 0);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {NodeJS.Timeout} id Timeout ID.
	 */
	public cancelAnimationFrame(id): void {
		this.clearTimeout(id);
	}

	/**
	 * Fetch is not supported by the synchronous "Window". Use "AsyncWindow" instead to get support for fetch.
	 *
	 * @throws Error.
	 * @param _url URL to resource.
	 * @param [_options] Options.
	 * @returns Promise.
	 */
	public async fetch(_url: string, _options: object): Promise<void> {
		throw new Error(
			'Fetch is not supported by the synchronous "Window" from Happy DOM. Use "AsyncWindow" instead to get support for fetch.'
		);
	}
}
