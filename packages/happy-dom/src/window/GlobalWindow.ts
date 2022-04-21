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
import HTMLUnknownElement from '../nodes/html-unknown-element/HTMLUnknownElement';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement';
import HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement';
import HTMLSlotElement from '../nodes/html-slot-element/HTMLSlotElement';
import HTMLLabelElement from '../nodes/html-label-element/HTMLLabelElement';
import HTMLMetaElement from '../nodes/html-meta-element/HTMLMetaElement';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement';
import SVGElement from '../nodes/svg-element/SVGElement';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement';
import Image from '../nodes/html-image-element/Image';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment';
import CharacterData from '../nodes/character-data/CharacterData';
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
import NonImplemenetedElementClasses from '../config/NonImplemenetedElementClasses';
import DOMParser from '../dom-parser/DOMParser';
import XMLSerializer from '../xml-serializer/XMLSerializer';
import ResizeObserver from '../resize-observer/ResizeObserver';
import Blob from '../file/Blob';
import File from '../file/File';
import DOMException from '../exception/DOMException';
import FileReader from '../file/FileReader';
import History from '../history/History';
import CSSStyleSheet from '../css/CSSStyleSheet';
import CSSStyleDeclaration from '../css/CSSStyleDeclaration';
import CSS from '../css/CSS';
import CSSUnitValue from '../css/CSSUnitValue';
import MouseEvent from '../event/events/MouseEvent';
import PointerEvent from '../event/events/PointerEvent';
import FocusEvent from '../event/events/FocusEvent';
import WheelEvent from '../event/events/WheelEvent';
import DataTransfer from '../event/DataTransfer';
import DataTransferItem from '../event/DataTransferItem';
import DataTransferItemList from '../event/DataTransferItemList';
import InputEvent from '../event/events/InputEvent';
import UIEvent from '../event/UIEvent';
import ErrorEvent from '../event/events/ErrorEvent';
import StorageEvent from '../event/events/StorageEvent';
import Screen from '../screen/Screen';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager';
import IResponse from '../fetch/IResponse';
import IResponseInit from '../fetch/IResponseInit';
import IRequest from '../fetch/IRequest';
import IRequestInit from '../fetch/IRequestInit';
import IHeaders from '../fetch/IHeaders';
import IHeadersInit from '../fetch/IHeadersInit';
import Headers from '../fetch/Headers';
import Request from '../fetch/Request';
import Response from '../fetch/Response';
import Storage from '../storage/Storage';
import IWindow from './IWindow';
import HTMLCollection from '../nodes/element/HTMLCollection';
import NodeList from '../nodes/node/NodeList';
import MediaQueryList from '../match-media/MediaQueryList';
import Selection from '../selection/Selection';
import Navigator from '../navigator/Navigator';
import MimeType from '../navigator/MimeType';
import MimeTypeArray from '../navigator/MimeTypeArray';
import Plugin from '../navigator/Plugin';
import PluginArray from '../navigator/PluginArray';
import { URLSearchParams } from 'url';
import FetchHandler from '../fetch/FetchHandler';
import * as PerfHooks from 'perf_hooks';

/**
 * Browser window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class GlobalWindow extends EventTarget implements IWindow {
	// Public Properties
	public readonly happyDOM = {
		whenAsyncComplete: async (): Promise<void> => {
			return await this.happyDOM.asyncTaskManager.whenComplete();
		},
		cancelAsync: (): void => {
			this.happyDOM.asyncTaskManager.cancelAll();
		},
		asyncTaskManager: new AsyncTaskManager()
	};

	// Global classes
	public readonly Node = Node;
	public readonly HTMLElement = HTMLElement;
	public readonly HTMLUnknownElement = HTMLUnknownElement;
	public readonly HTMLTemplateElement = HTMLTemplateElement;
	public readonly HTMLFormElement = HTMLFormElement;
	public readonly HTMLInputElement = HTMLInputElement;
	public readonly HTMLTextAreaElement = HTMLTextAreaElement;
	public readonly HTMLImageElement = HTMLImageElement;
	public readonly Image = Image;
	public readonly HTMLScriptElement = HTMLScriptElement;
	public readonly HTMLLinkElement = HTMLLinkElement;
	public readonly HTMLStyleElement = HTMLStyleElement;
	public readonly HTMLLabelElement = HTMLLabelElement;
	public readonly HTMLSlotElement = HTMLSlotElement;
	public readonly HTMLMetaElement = HTMLMetaElement;
	public readonly HTMLBaseElement = HTMLBaseElement;
	public readonly SVGSVGElement = SVGSVGElement;
	public readonly SVGElement = SVGElement;
	public readonly Text = Text;
	public readonly Comment = Comment;
	public readonly ShadowRoot = ShadowRoot;
	public readonly Element = Element;
	public readonly DocumentFragment = DocumentFragment;
	public readonly CharacterData = CharacterData;
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
	public readonly PointerEvent = PointerEvent;
	public readonly FocusEvent = FocusEvent;
	public readonly WheelEvent = WheelEvent;
	public readonly InputEvent = InputEvent;
	public readonly ErrorEvent = ErrorEvent;
	public readonly StorageEvent = StorageEvent;
	public readonly ProgressEvent = ProgressEvent;
	public readonly EventTarget = EventTarget;
	public readonly DataTransfer = DataTransfer;
	public readonly DataTransferItem = DataTransferItem;
	public readonly DataTransferItemList = DataTransferItemList;
	public readonly URL = URL;
	public readonly Location = Location;
	public readonly CustomElementRegistry = CustomElementRegistry;
	public readonly Window = <typeof GlobalWindow>this.constructor;
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
	public readonly HTMLCollection = HTMLCollection;
	public readonly NodeList = NodeList;
	public readonly MediaQueryList = MediaQueryList;
	public readonly CSSUnitValue = CSSUnitValue;
	public readonly Selection = Selection;
	public readonly Navigator = Navigator;
	public readonly MimeType = MimeType;
	public readonly MimeTypeArray = MimeTypeArray;
	public readonly Plugin = Plugin;
	public readonly PluginArray = PluginArray;
	public readonly Headers: { new (init?: IHeadersInit): IHeaders } = Headers;
	public readonly Request: {
		new (input: string | { href: string } | IRequest, init?: IRequestInit): IRequest;
	} = Request;
	public readonly Response: {
		new (body?: NodeJS.ReadableStream | null, init?: IResponseInit): IResponse;
	} = Response;

	// Events
	public onload: (event: Event) => void = null;
	public onerror: (event: ErrorEvent) => void = null;

	// Public Properties
	public readonly document: Document;
	public readonly customElements: CustomElementRegistry = new CustomElementRegistry();
	public readonly location = new Location();
	public readonly history = new History();
	public readonly navigator = new Navigator();
	public readonly console = globalThis.console;
	public readonly self = this;
	public readonly top = this;
	public readonly parent = this;
	public readonly window = this;
	public readonly globalThis = this;
	public readonly screen = new Screen();
	public readonly innerWidth = 1024;
	public readonly innerHeight = 768;
	public readonly devicePixelRatio = 1;
	public readonly sessionStorage = new Storage();
	public readonly localStorage = new Storage();
	public readonly performance = PerfHooks.performance;

	// Node.js Globals
	public ArrayBuffer = globalThis.ArrayBuffer;
	public Boolean = globalThis.Boolean;
	public Buffer = globalThis.global ? globalThis.global.Buffer : Buffer;
	public DataView = globalThis.DataView;
	public Date = globalThis.Date;
	public Error = globalThis.Error;
	public EvalError = globalThis.EvalError;
	public Float32Array = globalThis.Float32Array;
	public Float64Array = globalThis.Float64Array;
	public GLOBAL = globalThis.GLOBAL;
	public Infinity = globalThis.Infinity;
	public Int16Array = globalThis.Int16Array;
	public Int32Array = globalThis.Int32Array;
	public Int8Array = globalThis.Int8Array;
	public Intl = globalThis.Intl;
	public JSON = globalThis.JSON;
	public Map = globalThis.Map;
	public Math = globalThis.Math;
	public NaN = globalThis.NaN;
	public Number = globalThis.Number;
	public Promise = globalThis.Promise;
	public RangeError = globalThis.RangeError;
	public ReferenceError = globalThis.ReferenceError;
	public RegExp = globalThis.RegExp;
	public Reflect = globalThis.ArrayBuffer;
	public Set = globalThis.Set;
	public Symbol = globalThis.Symbol;
	public SyntaxError = globalThis.SyntaxError;
	public String = globalThis.String;
	public TypeError = globalThis.TypeError;
	public URIError = globalThis.URIError;
	public Uint16Array = globalThis.Uint16Array;
	public Uint32Array = globalThis.Uint32Array;
	public Uint8Array = globalThis.Uint8Array;
	public Uint8ClampedArray = globalThis.Uint8ClampedArray;
	public WeakMap = globalThis.WeakMap;
	public WeakSet = globalThis.WeakSet;
	public clearImmediate = globalThis.clearImmediate;
	public decodeURI = globalThis.decodeURI;
	public decodeURIComponent = globalThis.decodeURIComponent;
	public encodeURI = globalThis.encodeURI;
	public encodeURIComponent = globalThis.encodeURIComponent;
	public escape = globalThis.escape;
	public global = globalThis.global;
	public isFinite = globalThis.isFinite;
	public isNaN = globalThis.isNaN;
	public parseFloat = globalThis.parseFloat;
	public parseInt = globalThis.parseInt;
	public process = globalThis.process;
	public root = globalThis.ArrayBuffer;
	public setImmediate = globalThis.setImmediate;
	public queueMicrotask = globalThis.queueMicrotask;
	public undefined = globalThis.ArrayBuffer;
	public unescape = globalThis.unescape;
	public gc = globalThis.gc;
	public v8debug = globalThis.v8debug;
	public AbortController = globalThis.AbortController;
	public AbortSignal = globalThis.AbortSignal;
	public Array = globalThis.Array;
	public Object = globalThis.Object;
	public Function = globalThis.Function;

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

		DOMParser._ownerDocument = this.document;
		FileReader._ownerDocument = this.document;
		Image.ownerDocument = this.document;
		Request._ownerDocument = this.document;
		Response._ownerDocument = this.document;

		for (const eventType of NonImplementedEventTypes) {
			if (!this[eventType]) {
				this[eventType] = Event;
			}
		}

		for (const className of NonImplemenetedElementClasses) {
			if (!this[className]) {
				this[className] = HTMLElement;
			}
		}

		// Binds all methods to "this", so that it will use the correct context when called globally.
		for (const key of Object.keys(GlobalWindow.prototype)) {
			if (typeof this[key] === 'function') {
				this[key] = this[key].bind(this);
			}
		}
	}

	/**
	 * The CSS interface holds useful CSS-related methods.
	 *
	 * @returns CSS interface.
	 */
	public get CSS(): CSS {
		return new CSS();
	}

	/**
	 * Evaluates code.
	 *
	 * @param code Code.
	 * @returns Result.
	 */
	public eval(code: string): unknown {
		return eval(code);
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
	 * Returns a new MediaQueryList object that can then be used to determine if the document matches the media query string.
	 *
	 * @param mediaQueryString A string specifying the media query to parse into a MediaQueryList.
	 * @returns A new MediaQueryList.
	 */
	public matchMedia(mediaQueryString: string): MediaQueryList {
		const mediaQueryList = new MediaQueryList();
		mediaQueryList._media = mediaQueryString;
		return mediaQueryList;
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
		const id = globalThis.setTimeout(() => {
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
		globalThis.clearTimeout(id);
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
		const id = globalThis.setInterval(callback, delay);
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
		globalThis.clearInterval(id);
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
	 * This method provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @override
	 * @param url URL.
	 * @param [init] Init.
	 * @returns Promise.
	 */
	public async fetch(url: string, init?: IRequestInit): Promise<IResponse> {
		return await FetchHandler.fetch(this.document, url, init);
	}
}
