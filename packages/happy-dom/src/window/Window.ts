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
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement';
import SVGElement from '../nodes/svg-element/SVGElement';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement';
import { default as ImageImplementation } from '../nodes/html-image-element/Image';
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
import { default as DOMParserImplementation } from '../dom-parser/DOMParser';
import XMLSerializer from '../xml-serializer/XMLSerializer';
import ResizeObserver from '../resize-observer/ResizeObserver';
import Blob from '../file/Blob';
import File from '../file/File';
import DOMException from '../exception/DOMException';
import { default as FileReaderImplementation } from '../file/FileReader';
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
import { default as RequestImplementation } from '../fetch/Request';
import { default as ResponseImplementation } from '../fetch/Response';
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
import { default as RangeImplementation } from '../range/Range';
import DOMRect from '../nodes/element/DOMRect';
import VMGlobalPropertyScript from './VMGlobalPropertyScript';
import * as PerfHooks from 'perf_hooks';
import VM from 'vm';
import { Buffer } from 'buffer';
import Base64 from '../base64/Base64';
import IDocument from '../nodes/document/IDocument';

const ORIGINAL_SET_TIMEOUT = setTimeout;
const ORIGINAL_CLEAR_TIMEOUT = clearTimeout;
const ORIGINAL_SET_INTERVAL = setInterval;
const ORIGINAL_CLEAR_INTERVAL = clearInterval;

/**
 * Browser window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class Window extends EventTarget implements IWindow {
	// The Happy DOM property
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
	public readonly HTMLScriptElement = HTMLScriptElement;
	public readonly HTMLLinkElement = HTMLLinkElement;
	public readonly HTMLStyleElement = HTMLStyleElement;
	public readonly HTMLLabelElement = HTMLLabelElement;
	public readonly HTMLSlotElement = HTMLSlotElement;
	public readonly HTMLMetaElement = HTMLMetaElement;
	public readonly HTMLBaseElement = HTMLBaseElement;
	public readonly HTMLDialogElement = HTMLDialogElement;
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
	public readonly Window = <typeof Window>this.constructor;
	public readonly XMLSerializer = XMLSerializer;
	public readonly ResizeObserver = ResizeObserver;
	public readonly CSSStyleSheet = CSSStyleSheet;
	public readonly Blob = Blob;
	public readonly File = File;
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
	public readonly DOMRect: typeof DOMRect;
	public readonly Request: {
		new (input: string | { href: string } | IRequest, init?: IRequestInit): IRequest;
	};
	public readonly Response: {
		new (body?: NodeJS.ReadableStream | null, init?: IResponseInit): IResponse;
	};
	public readonly DOMParser;
	public readonly Range;
	public readonly FileReader;
	public readonly Image;

	// Events
	public onload: (event: Event) => void = null;
	public onerror: (event: ErrorEvent) => void = null;

	// Public Properties
	public readonly document: Document;
	public readonly customElements: CustomElementRegistry = new CustomElementRegistry();
	public readonly location = new Location();
	public readonly history = new History();
	public readonly navigator = new Navigator();
	public readonly console = console;
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
	public ArrayBuffer;
	public Boolean;
	public Buffer = Buffer;
	public DataView;
	public Date;
	public Error;
	public EvalError;
	public Float32Array;
	public Float64Array;
	public GLOBAL;
	public Infinity;
	public Int16Array;
	public Int32Array;
	public Int8Array;
	public Intl;
	public JSON;
	public Map;
	public Math;
	public NaN;
	public Number;
	public Promise;
	public RangeError;
	public ReferenceError;
	public RegExp;
	public Reflect;
	public Set;
	public Symbol;
	public SyntaxError;
	public String;
	public TypeError;
	public URIError;
	public Uint16Array;
	public Uint32Array;
	public Uint8Array;
	public Uint8ClampedArray;
	public WeakMap;
	public WeakSet;
	public clearImmediate;
	public decodeURI;
	public decodeURIComponent;
	public encodeURI;
	public encodeURIComponent;
	public escape;
	public global;
	public isFinite;
	public isNaN;
	public parseFloat;
	public parseInt;
	public process;
	public root;
	public setImmediate;
	public queueMicrotask;
	public undefined;
	public unescape;
	public gc;
	public v8debug;
	public AbortController;
	public AbortSignal;
	public Array;
	public Object;
	public Function;

	// Private properties
	private _setTimeout;
	private _clearTimeout;
	private _setInterval;
	private _clearInterval;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this._setTimeout = ORIGINAL_SET_TIMEOUT;
		this._clearTimeout = ORIGINAL_CLEAR_TIMEOUT;
		this._setInterval = ORIGINAL_SET_INTERVAL;
		this._clearInterval = ORIGINAL_CLEAR_INTERVAL;

		// Non-implemented event types
		for (const eventType of NonImplementedEventTypes) {
			if (!this[eventType]) {
				this[eventType] = Event;
			}
		}

		// Non implemented element classes
		for (const className of NonImplemenetedElementClasses) {
			if (!this[className]) {
				this[className] = HTMLElement;
			}
		}

		// Binds all methods to "this", so that it will use the correct context when called globally.
		for (const key of Object.getOwnPropertyNames(Window.prototype).concat(
			Object.getOwnPropertyNames(EventTarget.prototype)
		)) {
			if (
				key !== 'constructor' &&
				key[0] !== '_' &&
				key[0] === key[0].toLowerCase() &&
				typeof this[key] === 'function'
			) {
				this[key] = this[key].bind(this);
			}
		}

		HTMLDocument._defaultView = this;

		const document = new HTMLDocument();

		this.document = document;

		// We need to set the correct owner document when the class is constructed.
		// To achieve this we will extend the original implementation with a class that sets the owner document.

		ResponseImplementation._ownerDocument = document;
		RequestImplementation._ownerDocument = document;
		ImageImplementation._ownerDocument = document;
		FileReaderImplementation._ownerDocument = document;
		DOMParserImplementation._ownerDocument = document;
		RangeImplementation._ownerDocument = document;

		/* eslint-disable jsdoc/require-jsdoc */
		class Response extends ResponseImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class Request extends RequestImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class Image extends ImageImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class FileReader extends FileReaderImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class DOMParser extends DOMParserImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class Range extends RangeImplementation {
			public static _ownerDocument: IDocument = document;
		}

		/* eslint-enable jsdoc/require-jsdoc */

		this.Response = Response;
		this.Request = Request;
		this.Image = Image;
		this.FileReader = FileReader;
		this.DOMParser = DOMParser;
		this.Range = Range;

		this._setupVMContext();

		this.document._onWindowReady();
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
	 * @override
	 * @param code Code.
	 * @returns Result.
	 */
	public eval(code: string): unknown {
		if (VM.isContext(this)) {
			return VM.runInContext(code, this);
		}

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
	 * Returns selection.
	 *
	 * @returns Selection.
	 */
	public getSelection(): Selection {
		return this.document.getSelection();
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
		const id = this._setTimeout(() => {
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
		this._clearTimeout(id);
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
		const id = this._setInterval(callback, delay);
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
		this._clearInterval(id);
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

	/**
	 * Creates a Base64-encoded ASCII string from a binary string (i.e., a string in which each character in the string is treated as a byte of binary data).
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/btoa
	 * @param data Binay data.
	 * @returns Base64-encoded string.
	 */
	public btoa(data: unknown): string {
		return Base64.btoa(data);
	}

	/**
	 * Decodes a string of data which has been encoded using Base64 encoding.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/atob
	 * @see https://infra.spec.whatwg.org/#forgiving-base64-encode.
	 * @see Https://html.spec.whatwg.org/multipage/webappapis.html#btoa.
	 * @param data Binay string.
	 * @returns An ASCII string containing decoded data from encodedData.
	 */
	public atob(data: unknown): string {
		return Base64.atob(data);
	}

	/**
	 * Setup of VM context.
	 */
	protected _setupVMContext(): void {
		if (!VM.isContext(this)) {
			VM.createContext(this);

			// Sets global properties from the VM to the Window object.
			// Otherwise "this.Array" will be undefined for example.
			VM.runInContext(VMGlobalPropertyScript, this);
		}
	}
}
