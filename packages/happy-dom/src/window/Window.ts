import CustomElementRegistry from '../custom-element/CustomElementRegistry';
import Document from '../nodes/document/Document';
import HTMLDocument from '../nodes/html-document/HTMLDocument';
import XMLDocument from '../nodes/xml-document/XMLDocument';
import SVGDocument from '../nodes/svg-document/SVGDocument';
import Node from '../nodes/node/Node';
import NodeFilter from '../tree-walker/NodeFilter';
import Text from '../nodes/text/Text';
import Comment from '../nodes/comment/Comment';
import ShadowRoot from '../nodes/shadow-root/ShadowRoot';
import Element from '../nodes/element/Element';
import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement';
import HTMLFormElement from '../nodes/html-form-element/HTMLFormElement';
import HTMLElement from '../nodes/html-element/HTMLElement';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement';
import HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement';
import SVGElement from '../nodes/svg-element/SVGElement';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment';
import TreeWalker from '../tree-walker/TreeWalker';
import Event from '../event/Event';
import CustomEvent from '../event/events/CustomEvent';
import AnimationEvent from '../event/events/AnimationEvent';
import KeyboardEvent from '../event/events/KeyboardEvent';
import ProgressEvent from '../event/events/ProgressEvent';
import EventTarget from '../event/EventTarget';
import URL from '../location/URL';
import Location from '../location/Location';
import NonImplementedEventTypes from '../event/NonImplementedEventTypes';
import MutationObserver from '../mutation-observer/MutationObserver';
import ElementClass from '../config/ElementClass';
import DOMParser from '../dom-parser/DOMParser';
import XMLSerializer from '../xml-serializer/XMLSerializer';
import ResizeObserver from '../resize-observer/ResizeObserver';
import CSSStyleSheet from '../css/CSSStyleSheet';
import Blob from '../file/Blob';
import File from '../file/File';
import DOMException from '../exception/DOMException';
import FileReader from '../file/FileReader';
import History from '../history/History';
import CSSStyleDeclaration from '../css/CSSStyleDeclaration';
import MouseEvent from '../event/events/MouseEvent';
import FocusEvent from '../event/events/FocusEvent';
import WheelEvent from '../event/events/WheelEvent';
import DataTransfer from '../event/DataTransfer';
import DataTransferItem from '../event/DataTransferItem';
import DataTransferItemList from '../event/DataTransferItemList';
import InputEvent from '../event/events/InputEvent';
import UIEvent from '../event/UIEvent';
import ErrorEvent from '../event/events/ErrorEvent';
import Screen from '../screen/Screen';
import AsyncTaskManager from './AsyncTaskManager';
import IResponse from './IResponse';
import AsyncTaskTypeEnum from './AsyncTaskTypeEnum';
import RelativeURL from '../location/RelativeURL';
import Storage from '../storage/Storage';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement';
import IFetchOptions from './IFetchOptions';
import IWindow from './IWindow';
import URLSearchParams from '../url-search-params/URLSearchParams';

const FETCH_RESPONSE_TYPE_METHODS = ['blob', 'json', 'text'];

/**
 * Handles the Window.
 */
export default class Window extends EventTarget implements IWindow, NodeJS.Global {
	// Public Properties
	public readonly happyDOM = {
		whenAsyncComplete: async (): Promise<void> => {
			return await this.happyDOM.asyncTaskManager.whenComplete();
		},
		cancelAsync: (): void => {
			this.happyDOM.asyncTaskManager.cancelAllTasks();
		},
		asyncTaskManager: new AsyncTaskManager()
	};

	// Global classes
	public readonly Node = Node;
	public readonly HTMLElement = HTMLElement;
	public readonly HTMLTemplateElement = HTMLTemplateElement;
	public readonly HTMLFormElement = HTMLFormElement;
	public readonly HTMLInputElement = HTMLInputElement;
	public readonly HTMLTextAreaElement = HTMLTextAreaElement;
	public readonly HTMLImageElement = HTMLImageElement;
	public readonly HTMLScriptElement = HTMLScriptElement;
	public readonly HTMLLinkElement = HTMLLinkElement;
	public readonly HTMLStyleElement = HTMLStyleElement;
	public readonly SVGSVGElement = SVGSVGElement;
	public readonly SVGElement = SVGElement;
	public readonly Text = Text;
	public readonly Comment = Comment;
	public readonly ShadowRoot = ShadowRoot;
	public readonly Element = Element;
	public readonly DocumentFragment = DocumentFragment;
	public readonly NodeFilter = NodeFilter;
	public readonly TreeWalker = TreeWalker;
	public readonly DOMParser = DOMParser;
	public readonly MutationObserver = MutationObserver;
	public readonly Document = Document;
	public readonly HTMLDocument = HTMLDocument;
	public readonly XMLDocument = XMLDocument;
	public readonly SVGDocument = SVGDocument;
	public readonly Event = Event;
	public readonly UIEvent = UIEvent;
	public readonly CustomEvent = CustomEvent;
	public readonly AnimationEvent = AnimationEvent;
	public readonly KeyboardEvent = KeyboardEvent;
	public readonly MouseEvent = MouseEvent;
	public readonly FocusEvent = FocusEvent;
	public readonly WheelEvent = WheelEvent;
	public readonly InputEvent = InputEvent;
	public readonly ErrorEvent = ErrorEvent;
	public readonly ProgressEvent = ProgressEvent;
	public readonly EventTarget = EventTarget;
	public readonly DataTransfer = DataTransfer;
	public readonly DataTransferItem = DataTransferItem;
	public readonly DataTransferItemList = DataTransferItemList;
	public readonly URL = URL;
	public readonly Location = Location;
	public readonly CustomElementRegistry = CustomElementRegistry;
	public readonly Window = Window;
	public readonly Headers = Map;
	public readonly XMLSerializer = XMLSerializer;
	public readonly ResizeObserver = ResizeObserver;
	public readonly CSSStyleSheet = CSSStyleSheet;
	public readonly Blob = Blob;
	public readonly File = File;
	public readonly FileReader = FileReader;
	public readonly DOMException = DOMException;
	public readonly History = History;
	public readonly Screen = Screen;
	public readonly Storage = Storage;
	public readonly URLSearchParams = URLSearchParams;

	// Events
	public onload: (event: Event) => void = null;
	public onerror: (event: ErrorEvent) => void = null;

	// Public Properties
	public readonly document: Document;
	public readonly customElements: CustomElementRegistry = new CustomElementRegistry();
	public readonly location = new Location();
	public readonly history = new History();
	public readonly navigator = { userAgent: 'happy-dom' };
	public readonly console = global ? global.console : null;
	public readonly self = this;
	public readonly top = this;
	public readonly parent = this;
	public readonly window = this;
	public readonly screen = new Screen();
	public readonly innerWidth = 1024;
	public readonly innerHeight = 768;
	public readonly sessionStorage = new Storage();
	public readonly localStorage = new Storage();

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
	public Reflect = global ? global.Reflect : null;
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
	public AbortController = global ? global.AbortController : null;
	public AbortSignal = global ? global.AbortSignal : null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this.document = new HTMLDocument();
		this.document.defaultView = this;
		this.document._readyStateManager.whenComplete().then(() => {
			this.dispatchEvent(new Event('load'));
		});

		DOMParser._ownerDocument = DOMParser._ownerDocument || this.document;
		FileReader._ownerDocument = FileReader._ownerDocument || this.document;

		for (const eventType of NonImplementedEventTypes) {
			if (!this[eventType]) {
				this[eventType] = Event;
			}
		}

		for (const className of Object.keys(ElementClass)) {
			if (!this[className]) {
				this[className] = ElementClass[className];
			}
		}

		// Binds all methods to "this", so that it will use the correct context when called globally.
		for (const key of Object.keys(Window.prototype)) {
			if (typeof this[key] === 'function') {
				this[key] = this[key].bind(this);
			}
		}
	}

	/**
	 * Evaluates code.
	 *
	 * @param code Code.
	 */
	public eval(code: string): void {
		let vmExists = false;
		let vm = null;

		try {
			vmExists = !!require.resolve('vm');
		} catch (error) {
			// Ignore error;
		}

		if (vmExists) {
			vm = require('vm');
		}

		if (global && vm && vm.isContext(this)) {
			vm.runInContext(code, this);
		} else if (global && global.eval) {
			global.eval(code);
		}
	}

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @param element Element.
	 * @returns CSS style declaration.
	 */
	public getComputedStyle(element: HTMLElement): CSSStyleDeclaration {
		return new CSSStyleDeclaration(element._attributes, element);
	}

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	public scroll(x: { top?: number; left?: number; behavior?: string } | number, y?: number): void {
		if (typeof x === 'object') {
			if (x.behavior === 'smooth') {
				this.setTimeout(() => {
					if (x.top !== undefined) {
						(<number>this.document.documentElement.scrollTop) = x.top;
					}
					if (x.left !== undefined) {
						(<number>this.document.documentElement.scrollLeft) = x.left;
					}
				});
			} else {
				if (x.top !== undefined) {
					(<number>this.document.documentElement.scrollTop) = x.top;
				}
				if (x.left !== undefined) {
					(<number>this.document.documentElement.scrollLeft) = x.left;
				}
			}
		} else if (x !== undefined && y !== undefined) {
			(<number>this.document.documentElement.scrollLeft) = x;
			(<number>this.document.documentElement.scrollTop) = y;
		}
	}

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	public scrollTo(
		x: { top?: number; left?: number; behavior?: string } | number,
		y?: number
	): void {
		this.scroll(x, y);
	}

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @returns Timeout ID.
	 */
	public setTimeout(callback: () => void, delay = 0): NodeJS.Timeout {
		const id = global.setTimeout(() => {
			this.happyDOM.asyncTaskManager.endTimer(id);
			callback();
		}, delay);
		this.happyDOM.asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @override
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		global.clearTimeout(id);
		this.happyDOM.asyncTaskManager.endTimer(id);
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @returns Interval ID.
	 */
	public setInterval(callback: () => void, delay = 0): NodeJS.Timeout {
		const id = global.setInterval(callback, delay);
		this.happyDOM.asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @override
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		global.clearInterval(id);
		this.happyDOM.asyncTaskManager.endTimer(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @override
	 * @param callback Callback.
	 * @returns Timeout ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout {
		return this.setTimeout(() => {
			callback(2);
		});
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @override
	 * @param id Timeout ID.
	 */
	public cancelAnimationFrame(id: NodeJS.Timeout): void {
		this.clearTimeout(id);
	}

	/**
	 * Provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @override
	 * @param url URL to resource.
	 * @param [options] Options.
	 * @returns Promise.
	 */
	public async fetch(url: string, options?: IFetchOptions): Promise<IResponse> {
		return new Promise((resolve, reject) => {
			let fetch = null;

			try {
				fetch = require('node-fetch');
			} catch (error) {
				throw new Error('Failed to perform fetch. "node-fetch" could not be loaded.');
			}

			this.happyDOM.asyncTaskManager.startTask(AsyncTaskTypeEnum.fetch);

			fetch(RelativeURL.getAbsoluteURL(this.location, url), options)
				.then(response => {
					if (this.happyDOM.asyncTaskManager.getRunningCount(AsyncTaskTypeEnum.fetch) === 0) {
						reject(new Error('Failed to complete fetch request. Task was canceled.'));
					} else {
						for (const methodName of FETCH_RESPONSE_TYPE_METHODS) {
							const asyncMethod = response[methodName];
							response[methodName] = () => {
								return new Promise((resolve, reject) => {
									this.happyDOM.asyncTaskManager.startTask(AsyncTaskTypeEnum.fetch);

									asyncMethod
										.call(response)
										.then(response => {
											if (
												this.happyDOM.asyncTaskManager.getRunningCount(AsyncTaskTypeEnum.fetch) ===
												0
											) {
												reject(new Error('Failed to complete fetch request. Task was canceled.'));
											} else {
												resolve(response);
												this.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch);
											}
										})
										.catch(error => {
											reject(error);
											this.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch, error);
										});
								});
							};
						}

						resolve(response);
						this.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch);
					}
				})
				.catch(error => {
					reject(error);
					this.happyDOM.asyncTaskManager.endTask(AsyncTaskTypeEnum.fetch, error);
				});
		});
	}
}
