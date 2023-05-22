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
import HTMLSelectElement from '../nodes/html-select-element/HTMLSelectElement';
import HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement';
import HTMLSlotElement from '../nodes/html-slot-element/HTMLSlotElement';
import HTMLLabelElement from '../nodes/html-label-element/HTMLLabelElement';
import HTMLMetaElement from '../nodes/html-meta-element/HTMLMetaElement';
import HTMLMediaElement from '../nodes/html-media-element/HTMLMediaElement';
import HTMLAudioElement from '../nodes/html-audio-element/HTMLAudioElement';
import AudioImplementation from '../nodes/html-audio-element/Audio';
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement';
import HTMLIFrameElement from '../nodes/html-iframe-element/HTMLIFrameElement';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement';
import SVGElement from '../nodes/svg-element/SVGElement';
import SVGGraphicsElement from '../nodes/svg-element/SVGGraphicsElement';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement';
import ImageImplementation from '../nodes/html-image-element/Image';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment';
import CharacterData from '../nodes/character-data/CharacterData';
import NodeIterator from '../tree-walker/NodeIterator';
import TreeWalker from '../tree-walker/TreeWalker';
import Event from '../event/Event';
import CustomEvent from '../event/events/CustomEvent';
import AnimationEvent from '../event/events/AnimationEvent';
import KeyboardEvent from '../event/events/KeyboardEvent';
import MessageEvent from '../event/events/MessageEvent';
import ProgressEvent from '../event/events/ProgressEvent';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent';
import EventTarget from '../event/EventTarget';
import MessagePort from '../event/MessagePort';
import { URL, URLSearchParams } from 'url';
import Location from '../location/Location';
import NonImplementedEventTypes from '../event/NonImplementedEventTypes';
import MutationObserver from '../mutation-observer/MutationObserver';
import NonImplemenetedElementClasses from '../config/NonImplemenetedElementClasses';
import DOMParserImplementation from '../dom-parser/DOMParser';
import XMLSerializer from '../xml-serializer/XMLSerializer';
import ResizeObserver from '../resize-observer/ResizeObserver';
import Blob from '../file/Blob';
import File from '../file/File';
import DOMException from '../exception/DOMException';
import FileReaderImplementation from '../file/FileReader';
import History from '../history/History';
import CSSStyleSheet from '../css/CSSStyleSheet';
import CSSStyleDeclaration from '../css/declaration/CSSStyleDeclaration';
import CSS from '../css/CSS';
import CSSUnitValue from '../css/CSSUnitValue';
import CSSRule from '../css/CSSRule';
import CSSContainerRule from '../css/rules/CSSContainerRule';
import CSSFontFaceRule from '../css/rules/CSSFontFaceRule';
import CSSKeyframeRule from '../css/rules/CSSKeyframeRule';
import CSSKeyframesRule from '../css/rules/CSSKeyframesRule';
import CSSMediaRule from '../css/rules/CSSMediaRule';
import CSSStyleRule from '../css/rules/CSSStyleRule';
import CSSSupportsRule from '../css/rules/CSSSupportsRule';
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
import SubmitEvent from '../event/events/SubmitEvent';
import Screen from '../screen/Screen';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager';
import IResponse from '../fetch/types/IResponse';
import IResponseInit from '../fetch/types/IResponseInit';
import IRequest from '../fetch/types/IRequest';
import IRequestInit from '../fetch/types/IRequestInit';
import IHeaders from '../fetch/types/IHeaders';
import IHeadersInit from '../fetch/types/IHeadersInit';
import Headers from '../fetch/Headers';
import RequestImplementation from '../fetch/Request';
import ResponseImplementation from '../fetch/Response';
import Storage from '../storage/Storage';
import IWindow from './IWindow';
import HTMLCollection from '../nodes/element/HTMLCollection';
import HTMLFormControlsCollection from '../nodes/html-form-element/HTMLFormControlsCollection';
import NodeList from '../nodes/node/NodeList';
import MediaQueryList from '../match-media/MediaQueryList';
import Selection from '../selection/Selection';
import Navigator from '../navigator/Navigator';
import MimeType from '../navigator/MimeType';
import MimeTypeArray from '../navigator/MimeTypeArray';
import Plugin from '../navigator/Plugin';
import PluginArray from '../navigator/PluginArray';
import Fetch from '../fetch/Fetch';
import RangeImplementation from '../range/Range';
import DOMRect from '../nodes/element/DOMRect';
import VMGlobalPropertyScript from './VMGlobalPropertyScript';
import * as PerfHooks from 'perf_hooks';
import VM from 'vm';
import { Buffer } from 'buffer';
import XMLHttpRequestImplementation from '../xml-http-request/XMLHttpRequest';
import XMLHttpRequestUpload from '../xml-http-request/XMLHttpRequestUpload';
import XMLHttpRequestEventTarget from '../xml-http-request/XMLHttpRequestEventTarget';
import Base64 from '../base64/Base64';
import IDocument from '../nodes/document/IDocument';
import Attr from '../nodes/attr/Attr';
import NamedNodeMap from '../named-node-map/NamedNodeMap';
import IElement from '../nodes/element/IElement';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction';
import RequestInfo from '../fetch/types/IRequestInfo';
import FileList from '../nodes/html-input-element/FileList';
import Stream from 'stream';
import FormData from '../form-data/FormData';
import AbortController from '../fetch/AbortController';
import AbortSignal from '../fetch/AbortSignal';
import IResponseBody from '../fetch/types/IResponseBody';
import IRequestInfo from '../fetch/types/IRequestInfo';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import IHappyDOMOptions from './IHappyDOMOptions';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList';
import ValidityState from '../validity-state/ValidityState';

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
		asyncTaskManager: new AsyncTaskManager(),
		setInnerWidth: (width: number): void => {
			if (this.innerWidth !== width) {
				(<number>this.innerWidth) = width;
				this.dispatchEvent(new Event('resize'));
			}
		},
		setInnerHeight: (height: number): void => {
			if (this.innerHeight !== height) {
				(<number>this.innerHeight) = height;
				this.dispatchEvent(new Event('resize'));
			}
		},
		setURL: (url: string) => {
			this.location.href = url;
		},
		settings: {
			disableJavaScriptEvaluation: false,
			disableJavaScriptFileLoading: false,
			disableCSSFileLoading: false,
			disableIframePageLoading: false,
			disableComputedStyleRendering: false,
			enableFileSystemHttpRequests: false,
			device: {
				prefersColorScheme: 'light',
				mediaType: 'screen'
			}
		}
	};

	// Global classes
	public readonly Node = Node;
	public readonly HTMLElement = HTMLElement;
	public readonly HTMLUnknownElement = HTMLUnknownElement;
	public readonly HTMLTemplateElement = HTMLTemplateElement;
	public readonly HTMLFormElement = HTMLFormElement;
	public readonly HTMLInputElement = HTMLInputElement;
	public readonly HTMLSelectElement = HTMLSelectElement;
	public readonly HTMLTextAreaElement = HTMLTextAreaElement;
	public readonly HTMLImageElement = HTMLImageElement;
	public readonly HTMLScriptElement = HTMLScriptElement;
	public readonly HTMLLinkElement = HTMLLinkElement;
	public readonly HTMLStyleElement = HTMLStyleElement;
	public readonly HTMLLabelElement = HTMLLabelElement;
	public readonly HTMLSlotElement = HTMLSlotElement;
	public readonly HTMLMetaElement = HTMLMetaElement;
	public readonly HTMLMediaElement = HTMLMediaElement;
	public readonly HTMLAudioElement = HTMLAudioElement;
	public readonly HTMLVideoElement = HTMLVideoElement;
	public readonly HTMLBaseElement = HTMLBaseElement;
	public readonly HTMLIFrameElement = HTMLIFrameElement;
	public readonly HTMLDialogElement = HTMLDialogElement;
	public readonly Attr = Attr;
	public readonly NamedNodeMap = NamedNodeMap;
	public readonly SVGSVGElement = SVGSVGElement;
	public readonly SVGElement = SVGElement;
	public readonly SVGGraphicsElement = SVGGraphicsElement;
	public readonly Text = Text;
	public readonly Comment = Comment;
	public readonly ShadowRoot = ShadowRoot;
	public readonly ProcessingInstruction = ProcessingInstruction;
	public readonly Element = Element;
	public readonly DocumentFragment = DocumentFragment;
	public readonly CharacterData = CharacterData;
	public readonly NodeFilter = NodeFilter;
	public readonly NodeIterator = NodeIterator;
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
	public readonly MessageEvent = MessageEvent;
	public readonly MouseEvent = MouseEvent;
	public readonly PointerEvent = PointerEvent;
	public readonly FocusEvent = FocusEvent;
	public readonly WheelEvent = WheelEvent;
	public readonly InputEvent = InputEvent;
	public readonly ErrorEvent = ErrorEvent;
	public readonly StorageEvent = StorageEvent;
	public readonly SubmitEvent = SubmitEvent;
	public readonly ProgressEvent = ProgressEvent;
	public readonly MediaQueryListEvent = MediaQueryListEvent;
	public readonly EventTarget = EventTarget;
	public readonly MessagePort = MessagePort;
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
	public readonly HTMLFormControlsCollection = HTMLFormControlsCollection;
	public readonly NodeList = NodeList;
	public readonly CSSUnitValue = CSSUnitValue;
	public readonly CSSRule = CSSRule;
	public readonly CSSContainerRule = CSSContainerRule;
	public readonly CSSFontFaceRule = CSSFontFaceRule;
	public readonly CSSKeyframeRule = CSSKeyframeRule;
	public readonly CSSKeyframesRule = CSSKeyframesRule;
	public readonly CSSMediaRule = CSSMediaRule;
	public readonly CSSStyleRule = CSSStyleRule;
	public readonly CSSSupportsRule = CSSSupportsRule;
	public readonly Selection = Selection;
	public readonly Navigator = Navigator;
	public readonly MimeType = MimeType;
	public readonly MimeTypeArray = MimeTypeArray;
	public readonly Plugin = Plugin;
	public readonly PluginArray = PluginArray;
	public readonly FileList = FileList;
	public readonly Headers: { new (init?: IHeadersInit): IHeaders } = Headers;
	public readonly DOMRect: typeof DOMRect;
	public readonly RadioNodeList: typeof RadioNodeList;
	public readonly ValidityState: typeof ValidityState;
	public readonly Request: {
		new (input: IRequestInfo, init?: IRequestInit): IRequest;
	};
	public readonly Response: {
		new (body?: IResponseBody, init?: IResponseInit): IResponse;
	};
	public readonly XMLHttpRequestUpload = XMLHttpRequestUpload;
	public readonly XMLHttpRequestEventTarget = XMLHttpRequestEventTarget;
	public readonly ReadableStream = Stream.Readable;
	public readonly WritableStream = Stream.Writable;
	public readonly TransformStream = Stream.Transform;
	public readonly AbortController = AbortController;
	public readonly AbortSignal = AbortSignal;
	public readonly FormData = FormData;
	public readonly XMLHttpRequest;
	public readonly DOMParser: typeof DOMParserImplementation;
	public readonly Range;
	public readonly FileReader;
	public readonly Image;
	public readonly Audio;

	// Events
	public onload: (event: Event) => void = null;
	public onerror: (event: ErrorEvent) => void = null;

	// Public Properties
	public readonly document: Document;
	public readonly customElements: CustomElementRegistry;
	public readonly location: Location;
	public readonly history: History;
	public readonly navigator: Navigator;
	public readonly console = console;
	public readonly self = this;
	public readonly top = this;
	public readonly parent = this;
	public readonly window = this;
	public readonly globalThis = this;
	public readonly screen: Screen;
	public readonly devicePixelRatio = 1;
	public readonly sessionStorage: Storage;
	public readonly localStorage: Storage;
	public readonly performance = PerfHooks.performance;
	public readonly innerWidth: number;
	public readonly innerHeight: number;

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
	/**
	 * @deprecated
	 */
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
	/**
	 * @deprecated
	 */
	public unescape;
	public gc;
	public v8debug;
	public Array;
	public Object;
	public Function;

	// Public internal properties

	// Used for tracking capture event listeners to improve performance when they are not used.
	// See EventTarget class.
	public _captureEventListenerCount: { [eventType: string]: number } = {};

	// Private properties
	private _setTimeout;
	private _clearTimeout;
	private _setInterval;
	private _clearInterval;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.innerWidth] Inner width. Defaults to "1024".
	 * @param [options.innerHeight] Inner height. Defaults to "768".
	 * @param [options.url] URL.
	 * @param [options.settings] Settings.
	 */
	constructor(options?: IHappyDOMOptions) {
		super();

		this.customElements = new CustomElementRegistry();
		this.location = new Location();
		this.navigator = new Navigator();
		this.history = new History();
		this.screen = new Screen();
		this.sessionStorage = new Storage();
		this.localStorage = new Storage();

		this.innerWidth = options?.innerWidth ? options.innerWidth : 1024;
		this.innerHeight = options?.innerHeight ? options.innerHeight : 768;

		if (options?.url) {
			this.location.href = options.url;
		}

		if (options?.settings) {
			this.happyDOM.settings = {
				...this.happyDOM.settings,
				...options.settings,
				device: {
					...this.happyDOM.settings.device,
					...options.settings.device
				}
			};
		}

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
		XMLHttpRequestImplementation._ownerDocument = document;

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
		class XMLHttpRequest extends XMLHttpRequestImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class Range extends RangeImplementation {
			public static _ownerDocument: IDocument = document;
		}
		class Audio extends AudioImplementation {
			public static _ownerDocument: IDocument = document;
		}
		/* eslint-enable jsdoc/require-jsdoc */

		this.Response = Response;
		this.Request = Request;
		this.Image = Image;
		this.FileReader = FileReader;
		this.DOMParser = DOMParser;
		this.XMLHttpRequest = XMLHttpRequest;
		this.Range = Range;
		this.Audio = Audio;

		this._setupVMContext();

		this.document._onWindowReady();
	}

	/**
	 * The number of pixels that the document is currently scrolled horizontally
	 *
	 * @returns number
	 */
	public get scrollX(): number {
		return this.document?.documentElement?.scrollLeft ?? 0;
	}

	/**
	 * The read-only Window property pageXOffset is an alias for scrollX.
	 *
	 * @returns number
	 */
	public get pageXOffset(): number {
		return this.scrollX;
	}

	/**
	 * The number of pixels that the document is currently scrolled vertically
	 *
	 * @returns number
	 */
	public get scrollY(): number {
		return this.document?.documentElement?.scrollTop ?? 0;
	}

	/**
	 * The read-only Window property pageYOffset is an alias for scrollY.
	 *
	 * @returns number
	 */
	public get pageYOffset(): number {
		return this.scrollY;
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
	public getComputedStyle(element: IElement): CSSStyleDeclaration {
		element['_computedStyle'] = element['_computedStyle'] || new CSSStyleDeclaration(element, true);
		return element['_computedStyle'];
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
		return new MediaQueryList({ ownerWindow: this, media: mediaQueryString });
	}

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @param args Arguments passed to the callback function.
	 * @returns Timeout ID.
	 */
	public setTimeout(callback: Function, delay = 0, ...args: unknown[]): NodeJS.Timeout {
		const id = this._setTimeout(() => {
			this.happyDOM.asyncTaskManager.endTimer(id);
			callback(...args);
		}, delay);
		this.happyDOM.asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		this._clearTimeout(id);
		this.happyDOM.asyncTaskManager.endTimer(id);
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @param args Arguments passed to the callback function.
	 * @returns Interval ID.
	 */
	public setInterval(callback: Function, delay = 0, ...args: unknown[]): NodeJS.Timeout {
		const id = this._setInterval(callback, delay, ...args);
		this.happyDOM.asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		this._clearInterval(id);
		this.happyDOM.asyncTaskManager.endTimer(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param callback Callback.
	 * @returns Timeout ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout {
		return this.setTimeout(() => {
			callback(this.performance.now());
		});
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param id Timeout ID.
	 */
	public cancelAnimationFrame(id: NodeJS.Timeout): void {
		this.clearTimeout(id);
	}

	/**
	 * This method provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @param url URL.
	 * @param [init] Init.
	 * @returns Promise.
	 */
	public async fetch(url: RequestInfo, init?: IRequestInit): Promise<IResponse> {
		return await new Fetch({ ownerDocument: this.document, url, init }).send();
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
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param [targetOrigin=*] Target origin.
	 * @param _transfer Transfer. Not implemented.
	 */
	public postMessage(message: unknown, targetOrigin = '*', _transfer?: unknown[]): void {
		// TODO: Implement transfer.

		if (targetOrigin && targetOrigin !== '*' && this.location.origin !== targetOrigin) {
			throw new DOMException(
				`Failed to execute 'postMessage' on 'Window': The target origin provided ('${targetOrigin}') does not match the recipient window\'s origin ('${this.location.origin}').`,
				DOMExceptionNameEnum.securityError
			);
		}

		try {
			JSON.stringify(message);
		} catch (error) {
			throw new DOMException(
				`Failed to execute 'postMessage' on 'Window': The provided message cannot be serialized.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.dispatchEvent(
			new MessageEvent('message', {
				data: message,
				origin: this.parent.location.origin,
				source: this.parent,
				lastEventId: ''
			})
		);
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
