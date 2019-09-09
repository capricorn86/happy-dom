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
import NodeFetch from 'node-fetch';
import Event from './event/Event';
import CustomEvent from './event/CustomEvent';
import EventTarget from './event/EventTarget';
import URL from './location/URL';
import Location from './location/Location';
import ErrorEvent from './event/ErrorEvent';
import EventTypes from './event/EventTypes.json';
import MutationObserver from './mutation-observer/MutationObserver';
import ShadowRootRenderOptions from './shadow-root/ShadowRootRenderOptions';

const TIMER_FUNCTIONS = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];

const ASYNC_DONE_EVENT = 'asyncDone';
const ASYNC_ERROR_EVENT = 'asyncError';
const FETCH_RESPONSE_TYPE_METHODS = ['blob', 'json', 'formData', 'text'];

/**
 * Handles the Window.
 */
export default class Window extends EventTarget {
	// Exposed classes
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

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public self = this;

	// Custom Properties (not part of HTML standard)
	public shadowRootRenderOptions = new ShadowRootRenderOptions();

	// Private Properties
	private asyncTaskCount = 0;
	private hasAsyncError = false;

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
	 * Provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @param {string} url URL to resource.
	 * @param {object} [options] Options.
	 * @return {Promise<NodeFetch.Response>} Promise.
	 */
	public async fetch(url: string, options: object): Promise<NodeFetch.Response> {
		this.startAsyncTask();

		return NodeFetch(url, options)
			.then(response => {
				for (const methodName of FETCH_RESPONSE_TYPE_METHODS) {
					const asyncMethod = response[methodName];
					response[methodName] = () => {
						this.startAsyncTask();
						return asyncMethod.then(this.endAsyncTask.bind(this));
					};
				}

				this.endAsyncTask();
				return response;
			})
			.catch(error => {
				this.endAsyncTask(error);
			});
	}

	/**
	 * Adds an event listener.
	 *
	 * @override
	 * @param {string} type Event type.
	 * @param {function} listener Listener.
	 */
	public addEventListener(type: string, listener: (event: Event) => void): void {
		super.addEventListener(type, listener);
		this.startAsyncTask();
		setTimeout(() => this.endAsyncTask(), 0);
	}

	/**
	 * Starts an async task.
	 */
	private startAsyncTask(): void {
		this.asyncTaskCount++;
	}

	/**
	 * Ends an async task.
	 *
	 * @param {Error} [error] Error.
	 */
	private endAsyncTask(error?: Error): void {
		this.asyncTaskCount--;

		if (error) {
			this.hasAsyncError = true;
			const event = new ErrorEvent();
			event.type = ASYNC_ERROR_EVENT;
			event.error = error;
			this.dispatchEvent(event);
		} else if (this.asyncTaskCount >= 0 && !this.hasAsyncError) {
			const event = new Event();
			event.type = ASYNC_DONE_EVENT;
			this.dispatchEvent(event);
		}
	}
}

for (const timerFunction of TIMER_FUNCTIONS) {
	Window.prototype[timerFunction] = () => {
		throw new Error('Method with name window."' + timerFunction + '"() is not supported.');
	};
}
