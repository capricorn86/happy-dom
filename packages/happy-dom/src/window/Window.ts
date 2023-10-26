import CustomElementRegistry from '../custom-element/CustomElementRegistry.js';
import Document from '../nodes/document/Document.js';
import HTMLDocument from '../nodes/html-document/HTMLDocument.js';
import XMLDocument from '../nodes/xml-document/XMLDocument.js';
import SVGDocument from '../nodes/svg-document/SVGDocument.js';
import Node from '../nodes/node/Node.js';
import NodeFilter from '../tree-walker/NodeFilter.js';
import Text from '../nodes/text/Text.js';
import Comment from '../nodes/comment/Comment.js';
import ShadowRoot from '../nodes/shadow-root/ShadowRoot.js';
import Element from '../nodes/element/Element.js';
import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement.js';
import HTMLFormElement from '../nodes/html-form-element/HTMLFormElement.js';
import HTMLElement from '../nodes/html-element/HTMLElement.js';
import HTMLUnknownElement from '../nodes/html-unknown-element/HTMLUnknownElement.js';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement.js';
import HTMLSelectElement from '../nodes/html-select-element/HTMLSelectElement.js';
import HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement.js';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement.js';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement.js';
import HTMLSlotElement from '../nodes/html-slot-element/HTMLSlotElement.js';
import HTMLLabelElement from '../nodes/html-label-element/HTMLLabelElement.js';
import HTMLMetaElement from '../nodes/html-meta-element/HTMLMetaElement.js';
import HTMLMediaElement from '../nodes/html-media-element/HTMLMediaElement.js';
import HTMLAudioElement from '../nodes/html-audio-element/HTMLAudioElement.js';
import AudioImplementation from '../nodes/html-audio-element/Audio.js';
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement.js';
import HTMLIFrameElement from '../nodes/html-iframe-element/HTMLIFrameElement.js';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement.js';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement.js';
import SVGElement from '../nodes/svg-element/SVGElement.js';
import SVGGraphicsElement from '../nodes/svg-element/SVGGraphicsElement.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import ImageImplementation from '../nodes/html-image-element/Image.js';
import DocumentFragmentImplementation from '../nodes/document-fragment/DocumentFragment.js';
import CharacterData from '../nodes/character-data/CharacterData.js';
import NodeIterator from '../tree-walker/NodeIterator.js';
import TreeWalker from '../tree-walker/TreeWalker.js';
import Event from '../event/Event.js';
import CustomEvent from '../event/events/CustomEvent.js';
import AnimationEvent from '../event/events/AnimationEvent.js';
import KeyboardEvent from '../event/events/KeyboardEvent.js';
import MessageEvent from '../event/events/MessageEvent.js';
import ProgressEvent from '../event/events/ProgressEvent.js';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent.js';
import EventTarget from '../event/EventTarget.js';
import MessagePort from '../event/MessagePort.js';
import { URLSearchParams } from 'url';
import URL from '../url/URL.js';
import Location from '../location/Location.js';
import MutationObserver from '../mutation-observer/MutationObserver.js';
import MutationRecord from '../mutation-observer/MutationRecord.js';
import DOMParserImplementation from '../dom-parser/DOMParser.js';
import XMLSerializer from '../xml-serializer/XMLSerializer.js';
import ResizeObserver from '../resize-observer/ResizeObserver.js';
import Blob from '../file/Blob.js';
import File from '../file/File.js';
import DOMException from '../exception/DOMException.js';
import FileReaderImplementation from '../file/FileReader.js';
import History from '../history/History.js';
import CSSStyleSheet from '../css/CSSStyleSheet.js';
import CSSStyleDeclaration from '../css/declaration/CSSStyleDeclaration.js';
import CSS from '../css/CSS.js';
import CSSUnitValue from '../css/CSSUnitValue.js';
import CSSRule from '../css/CSSRule.js';
import CSSContainerRule from '../css/rules/CSSContainerRule.js';
import CSSFontFaceRule from '../css/rules/CSSFontFaceRule.js';
import CSSKeyframeRule from '../css/rules/CSSKeyframeRule.js';
import CSSKeyframesRule from '../css/rules/CSSKeyframesRule.js';
import CSSMediaRule from '../css/rules/CSSMediaRule.js';
import CSSStyleRule from '../css/rules/CSSStyleRule.js';
import CSSSupportsRule from '../css/rules/CSSSupportsRule.js';
import MouseEvent from '../event/events/MouseEvent.js';
import PointerEvent from '../event/events/PointerEvent.js';
import FocusEvent from '../event/events/FocusEvent.js';
import WheelEvent from '../event/events/WheelEvent.js';
import DataTransfer from '../event/DataTransfer.js';
import DataTransferItem from '../event/DataTransferItem.js';
import DataTransferItemList from '../event/DataTransferItemList.js';
import InputEvent from '../event/events/InputEvent.js';
import UIEvent from '../event/UIEvent.js';
import ErrorEvent from '../event/events/ErrorEvent.js';
import StorageEvent from '../event/events/StorageEvent.js';
import SubmitEvent from '../event/events/SubmitEvent.js';
import Screen from '../screen/Screen.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import IResponse from '../fetch/types/IResponse.js';
import IResponseInit from '../fetch/types/IResponseInit.js';
import IRequest from '../fetch/types/IRequest.js';
import IRequestInit from '../fetch/types/IRequestInit.js';
import IHeaders from '../fetch/types/IHeaders.js';
import IHeadersInit from '../fetch/types/IHeadersInit.js';
import Headers from '../fetch/Headers.js';
import RequestImplementation from '../fetch/Request.js';
import ResponseImplementation from '../fetch/Response.js';
import Storage from '../storage/Storage.js';
import IWindow from './IWindow.js';
import HTMLCollection from '../nodes/element/HTMLCollection.js';
import HTMLFormControlsCollection from '../nodes/html-form-element/HTMLFormControlsCollection.js';
import NodeList from '../nodes/node/NodeList.js';
import MediaQueryList from '../match-media/MediaQueryList.js';
import Selection from '../selection/Selection.js';
import Navigator from '../navigator/Navigator.js';
import MimeType from '../navigator/MimeType.js';
import MimeTypeArray from '../navigator/MimeTypeArray.js';
import Plugin from '../navigator/Plugin.js';
import PluginArray from '../navigator/PluginArray.js';
import Fetch from '../fetch/Fetch.js';
import RangeImplementation from '../range/Range.js';
import DOMRect from '../nodes/element/DOMRect.js';
import VMGlobalPropertyScript from './VMGlobalPropertyScript.js';
import * as PerfHooks from 'perf_hooks';
import VM from 'vm';
import { Buffer } from 'buffer';
import { webcrypto } from 'crypto';
import XMLHttpRequestImplementation from '../xml-http-request/XMLHttpRequest.js';
import XMLHttpRequestUpload from '../xml-http-request/XMLHttpRequestUpload.js';
import XMLHttpRequestEventTarget from '../xml-http-request/XMLHttpRequestEventTarget.js';
import Base64 from '../base64/Base64.js';
import IDocument from '../nodes/document/IDocument.js';
import Attr from '../nodes/attr/Attr.js';
import NamedNodeMap from '../named-node-map/NamedNodeMap.js';
import IElement from '../nodes/element/IElement.js';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction.js';
import RequestInfo from '../fetch/types/IRequestInfo.js';
import FileList from '../nodes/html-input-element/FileList.js';
import Stream from 'stream';
import FormData from '../form-data/FormData.js';
import AbortController from '../fetch/AbortController.js';
import AbortSignal from '../fetch/AbortSignal.js';
import IResponseBody from '../fetch/types/IResponseBody.js';
import IRequestInfo from '../fetch/types/IRequestInfo.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import IHappyDOMOptions from './IHappyDOMOptions.js';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList.js';
import ValidityState from '../validity-state/ValidityState.js';
import WindowErrorUtility from './WindowErrorUtility.js';
import VirtualConsole from '../console/VirtualConsole.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';
import IHappyDOMSettings from './IHappyDOMSettings.js';
import PackageVersion from '../version.js';
import Permissions from '../permissions/Permissions.js';
import PermissionStatus from '../permissions/PermissionStatus.js';
import Clipboard from '../clipboard/Clipboard.js';
import ClipboardItem from '../clipboard/ClipboardItem.js';
import ClipboardEvent from '../event/events/ClipboardEvent.js';

const ORIGINAL_SET_TIMEOUT = setTimeout;
const ORIGINAL_CLEAR_TIMEOUT = clearTimeout;
const ORIGINAL_SET_INTERVAL = setInterval;
const ORIGINAL_CLEAR_INTERVAL = clearInterval;
const ORIGINAL_QUEUE_MICROTASK = queueMicrotask;

/**
 * Browser window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class Window extends EventTarget implements IWindow {
	// Happy DOM property.
	public readonly happyDOM: {
		whenAsyncComplete: () => Promise<void>;
		cancelAsync: () => void;
		asyncTaskManager: AsyncTaskManager;
		setWindowSize: (options: { width?: number; height?: number }) => void;
		setURL: (url: string) => void;
		virtualConsolePrinter: VirtualConsolePrinter | null;
		settings: IHappyDOMSettings;

		/**
		 * @deprecated
		 */
		setInnerWidth: (width: number) => void;

		/**
		 * @deprecated
		 */
		setInnerHeight: (height: number) => void;
	} = {
		whenAsyncComplete: async (): Promise<void> => {
			return await this.happyDOM.asyncTaskManager.whenComplete();
		},
		cancelAsync: (): void => {
			this.happyDOM.asyncTaskManager.cancelAll();
		},
		asyncTaskManager: new AsyncTaskManager(),
		setWindowSize: (options: { width?: number; height?: number }): void => {
			if (
				(options.width !== undefined && this.innerWidth !== options.width) ||
				(options.height !== undefined && this.innerHeight !== options.height)
			) {
				if (options.width !== undefined && this.innerWidth !== options.width) {
					(<number>this.innerWidth) = options.width;
					(<number>this.outerWidth) = options.width;
				}

				if (options.height !== undefined && this.innerHeight !== options.height) {
					(<number>this.innerHeight) = options.height;
					(<number>this.outerHeight) = options.height;
				}

				this.dispatchEvent(new Event('resize'));
			}
		},
		virtualConsolePrinter: null,
		setURL: (url: string) => {
			this.location.href = url;
		},
		settings: {
			disableJavaScriptEvaluation: false,
			disableJavaScriptFileLoading: false,
			disableCSSFileLoading: false,
			disableIframePageLoading: false,
			disableComputedStyleRendering: false,
			disableErrorCapturing: false,
			enableFileSystemHttpRequests: false,
			navigator: {
				userAgent: `Mozilla/5.0 (X11; ${
					process.platform.charAt(0).toUpperCase() + process.platform.slice(1) + ' ' + process.arch
				}) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/${PackageVersion.version}`
			},
			device: {
				prefersColorScheme: 'light',
				mediaType: 'screen'
			}
		},
		setInnerWidth: (width: number): void => this.happyDOM.setWindowSize({ width }),
		setInnerHeight: (height: number): void => this.happyDOM.setWindowSize({ height })
	};

	// Nodes
	public readonly Node = Node;
	public readonly Attr = Attr;
	public readonly SVGSVGElement = SVGSVGElement;
	public readonly SVGElement = SVGElement;
	public readonly SVGGraphicsElement = SVGGraphicsElement;
	public readonly Text = Text;
	public readonly Comment = Comment;
	public readonly ShadowRoot = ShadowRoot;
	public readonly ProcessingInstruction = ProcessingInstruction;
	public readonly Element = Element;
	public readonly CharacterData = CharacterData;
	public readonly Document = Document;
	public readonly HTMLDocument = HTMLDocument;
	public readonly XMLDocument = XMLDocument;
	public readonly SVGDocument = SVGDocument;

	// Element classes
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

	// Non-implemented element classes
	public readonly HTMLHeadElement = HTMLElement;
	public readonly HTMLTitleElement = HTMLElement;
	public readonly HTMLBodyElement = HTMLElement;
	public readonly HTMLHeadingElement = HTMLElement;
	public readonly HTMLParagraphElement = HTMLElement;
	public readonly HTMLHRElement = HTMLElement;
	public readonly HTMLPreElement = HTMLElement;
	public readonly HTMLUListElement = HTMLElement;
	public readonly HTMLOListElement = HTMLElement;
	public readonly HTMLLIElement = HTMLElement;
	public readonly HTMLMenuElement = HTMLElement;
	public readonly HTMLDListElement = HTMLElement;
	public readonly HTMLDivElement = HTMLElement;
	public readonly HTMLAnchorElement = HTMLElement;
	public readonly HTMLAreaElement = HTMLElement;
	public readonly HTMLBRElement = HTMLElement;
	public readonly HTMLButtonElement = HTMLElement;
	public readonly HTMLCanvasElement = HTMLElement;
	public readonly HTMLDataElement = HTMLElement;
	public readonly HTMLDataListElement = HTMLElement;
	public readonly HTMLDetailsElement = HTMLElement;
	public readonly HTMLDirectoryElement = HTMLElement;
	public readonly HTMLFieldSetElement = HTMLElement;
	public readonly HTMLFontElement = HTMLElement;
	public readonly HTMLHtmlElement = HTMLElement;
	public readonly HTMLLegendElement = HTMLElement;
	public readonly HTMLMapElement = HTMLElement;
	public readonly HTMLMarqueeElement = HTMLElement;
	public readonly HTMLMeterElement = HTMLElement;
	public readonly HTMLModElement = HTMLElement;
	public readonly HTMLOutputElement = HTMLElement;
	public readonly HTMLPictureElement = HTMLElement;
	public readonly HTMLProgressElement = HTMLElement;
	public readonly HTMLQuoteElement = HTMLElement;
	public readonly HTMLSourceElement = HTMLElement;
	public readonly HTMLSpanElement = HTMLElement;
	public readonly HTMLTableCaptionElement = HTMLElement;
	public readonly HTMLTableCellElement = HTMLElement;
	public readonly HTMLTableColElement = HTMLElement;
	public readonly HTMLTableElement = HTMLElement;
	public readonly HTMLTimeElement = HTMLElement;
	public readonly HTMLTableRowElement = HTMLElement;
	public readonly HTMLTableSectionElement = HTMLElement;
	public readonly HTMLFrameElement = HTMLElement;
	public readonly HTMLFrameSetElement = HTMLElement;
	public readonly HTMLEmbedElement = HTMLElement;
	public readonly HTMLObjectElement = HTMLElement;
	public readonly HTMLParamElement = HTMLElement;
	public readonly HTMLTrackElement = HTMLElement;

	// Events classes
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
	public readonly ClipboardEvent = ClipboardEvent;

	// Non-implemented event classes
	public readonly AudioProcessingEvent = Event;
	public readonly BeforeInputEvent = Event;
	public readonly BeforeUnloadEvent = Event;
	public readonly BlobEvent = Event;
	public readonly CloseEvent = Event;
	public readonly CompositionEvent = Event;
	public readonly CSSFontFaceLoadEvent = Event;
	public readonly DeviceLightEvent = Event;
	public readonly DeviceMotionEvent = Event;
	public readonly DeviceOrientationEvent = Event;
	public readonly DeviceProximityEvent = Event;
	public readonly DOMTransactionEvent = Event;
	public readonly DragEvent = Event;
	public readonly EditingBeforeInputEvent = Event;
	public readonly FetchEvent = Event;
	public readonly GamepadEvent = Event;
	public readonly HashChangeEvent = Event;
	public readonly IDBVersionChangeEvent = Event;
	public readonly MediaStreamEvent = Event;
	public readonly MutationEvent = Event;
	public readonly OfflineAudioCompletionEvent = Event;
	public readonly OverconstrainedError = Event;
	public readonly PageTransitionEvent = Event;
	public readonly PaymentRequestUpdateEvent = Event;
	public readonly PopStateEvent = Event;
	public readonly RelatedEvent = Event;
	public readonly RTCDataChannelEvent = Event;
	public readonly RTCIdentityErrorEvent = Event;
	public readonly RTCIdentityEvent = Event;
	public readonly RTCPeerConnectionIceEvent = Event;
	public readonly SensorEvent = Event;
	public readonly SVGEvent = Event;
	public readonly SVGZoomEvent = Event;
	public readonly TimeEvent = Event;
	public readonly TouchEvent = Event;
	public readonly TrackEvent = Event;
	public readonly TransitionEvent = Event;
	public readonly UserProximityEvent = Event;
	public readonly WebGLContextEvent = Event;
	public readonly TextEvent = Event;

	// Other classes
	public readonly NamedNodeMap = NamedNodeMap;
	public readonly NodeFilter = NodeFilter;
	public readonly NodeIterator = NodeIterator;
	public readonly TreeWalker = TreeWalker;
	public readonly MutationObserver = MutationObserver;
	public readonly MutationRecord = MutationRecord;
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
	public readonly Permissions = Permissions;
	public readonly PermissionStatus = PermissionStatus;
	public readonly Clipboard = Clipboard;
	public readonly ClipboardItem = ClipboardItem;
	public readonly XMLHttpRequest;
	public readonly DOMParser: typeof DOMParserImplementation;
	public readonly Range;
	public readonly FileReader;
	public readonly Image;
	public readonly DocumentFragment;
	public readonly Audio;
	public readonly CSSStyleDeclaration = CSSStyleDeclaration;

	// Events
	public onload: (event: Event) => void = null;
	public onerror: (event: ErrorEvent) => void = null;

	// Public properties.
	public readonly document: Document;
	public readonly customElements: CustomElementRegistry;
	public readonly location: Location;
	public readonly history: History;
	public readonly navigator: Navigator;
	public readonly console: Console;
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
	public readonly innerWidth: number = 1024;
	public readonly innerHeight: number = 768;
	public readonly outerWidth: number = 1024;
	public readonly outerHeight: number = 768;
	public readonly crypto = webcrypto;

	// Node.js Globals
	public Array: typeof Array;
	public ArrayBuffer: typeof ArrayBuffer;
	public Boolean: typeof Boolean;
	public Buffer = Buffer;
	public DataView: typeof DataView;
	public Date: typeof Date;
	public Error: typeof Error;
	public EvalError: typeof EvalError;
	public Float32Array: typeof Float32Array;
	public Float64Array: typeof Float64Array;
	public Function: typeof Function;
	public Infinity: typeof Infinity;
	public Int16Array: typeof Int16Array;
	public Int32Array: typeof Int32Array;
	public Int8Array: typeof Int8Array;
	public Intl: typeof Intl;
	public JSON: typeof JSON;
	public Map: MapConstructor;
	public Math: typeof Math;
	public NaN: typeof NaN;
	public Number: typeof Number;
	public Object: typeof Object;
	public Promise: typeof Promise;
	public RangeError: typeof RangeError;
	public ReferenceError: typeof ReferenceError;
	public RegExp: typeof RegExp;
	public Set: SetConstructor;
	public String: typeof String;
	public Symbol: Function;
	public SyntaxError: typeof SyntaxError;
	public TypeError: typeof TypeError;
	public URIError: typeof URIError;
	public Uint16Array: typeof Uint16Array;
	public Uint32Array: typeof Uint32Array;
	public Uint8Array: typeof Uint8Array;
	public Uint8ClampedArray: typeof Uint8ClampedArray;
	public WeakMap: WeakMapConstructor;
	public WeakSet: WeakSetConstructor;
	public decodeURI: typeof decodeURI;
	public decodeURIComponent: typeof decodeURIComponent;
	public encodeURI: typeof encodeURI;
	public encodeURIComponent: typeof encodeURIComponent;
	public eval: typeof eval;
	/**
	 * @deprecated
	 */
	public escape: (str: string) => string;
	public global: typeof globalThis;
	public isFinite: typeof isFinite;
	public isNaN: typeof isNaN;
	public parseFloat: typeof parseFloat;
	public parseInt: typeof parseInt;
	public undefined: typeof undefined;
	/**
	 * @deprecated
	 */
	public unescape: (str: string) => string;
	public gc: () => void;
	public v8debug?: unknown;

	// Public internal properties

	// Used for tracking capture event listeners to improve performance when they are not used.
	// See EventTarget class.
	public _captureEventListenerCount: { [eventType: string]: number } = {};

	// Private properties
	private _setTimeout: (callback: Function, delay?: number, ...args: unknown[]) => NodeJS.Timeout;
	private _clearTimeout: (id: NodeJS.Timeout) => void;
	private _setInterval: (callback: Function, delay?: number, ...args: unknown[]) => NodeJS.Timeout;
	private _clearInterval: (id: NodeJS.Timeout) => void;
	private _queueMicrotask: (callback: Function) => void;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.width] Window width. Defaults to "1024".
	 * @param [options.height] Window height. Defaults to "768".
	 * @param [options.innerWidth] Inner width. Deprecated. Defaults to "1024".
	 * @param [options.innerHeight] Inner height. Deprecated. Defaults to "768".
	 * @param [options.url] URL.
	 * @param [options.settings] Settings.
	 */
	constructor(options?: IHappyDOMOptions) {
		super();

		this.customElements = new CustomElementRegistry();
		this.location = new Location();
		this.navigator = new Navigator(this);
		this.history = new History();
		this.screen = new Screen();
		this.sessionStorage = new Storage();
		this.localStorage = new Storage();

		if (options) {
			if (options.width !== undefined) {
				this.innerWidth = options.width;
				this.outerWidth = options.width;
			} else if (options.innerWidth !== undefined) {
				this.innerWidth = options.innerWidth;
				this.outerWidth = options.innerWidth;
			}

			if (options.height !== undefined) {
				this.innerHeight = options.height;
				this.outerHeight = options.height;
			} else if (options.innerHeight !== undefined) {
				this.innerHeight = options.innerHeight;
				this.outerHeight = options.innerHeight;
			}

			if (options.url !== undefined) {
				this.location.href = options.url;
			}

			if (options.settings) {
				this.happyDOM.settings = {
					...this.happyDOM.settings,
					...options.settings,
					navigator: {
						...this.happyDOM.settings.navigator,
						...options.settings.navigator
					},
					device: {
						...this.happyDOM.settings.device,
						...options.settings.device
					}
				};
			}
		}

		if (options && options.console) {
			this.console = options.console;
		} else {
			this.happyDOM.virtualConsolePrinter = new VirtualConsolePrinter();
			this.console = new VirtualConsole(this.happyDOM.virtualConsolePrinter);
		}

		this._setTimeout = ORIGINAL_SET_TIMEOUT;
		this._clearTimeout = ORIGINAL_CLEAR_TIMEOUT;
		this._setInterval = ORIGINAL_SET_INTERVAL;
		this._clearInterval = ORIGINAL_CLEAR_INTERVAL;
		this._queueMicrotask = ORIGINAL_QUEUE_MICROTASK;

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
		HTMLDocument._windowClass = Window;

		const document = new HTMLDocument();

		this.document = document;

		// We need to set the correct owner document when the class is constructed.
		// To achieve this we will extend the original implementation with a class that sets the owner document.

		ResponseImplementation._ownerDocument = document;
		RequestImplementation._ownerDocument = document;
		ImageImplementation._ownerDocument = document;
		DocumentFragmentImplementation._ownerDocument = document;
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
		class DocumentFragment extends DocumentFragmentImplementation {
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
		this.DocumentFragment = DocumentFragment;
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
			if (this.happyDOM.settings.disableErrorCapturing) {
				callback(...args);
			} else {
				WindowErrorUtility.captureError(this, () => callback(...args));
			}
			this.happyDOM.asyncTaskManager.endTimer(id);
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
		const id = this._setInterval(() => {
			if (this.happyDOM.settings.disableErrorCapturing) {
				callback(...args);
			} else {
				WindowErrorUtility.captureError(
					this,
					() => callback(...args),
					() => this.clearInterval(id)
				);
			}
		}, delay);
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
	 * @returns ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Immediate {
		const id = global.setImmediate(() => {
			if (this.happyDOM.settings.disableErrorCapturing) {
				callback(this.performance.now());
			} else {
				WindowErrorUtility.captureError(this, () => callback(this.performance.now()));
			}
			this.happyDOM.asyncTaskManager.endImmediate(id);
		});
		this.happyDOM.asyncTaskManager.startImmediate(id);
		return id;
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param id ID.
	 */
	public cancelAnimationFrame(id: NodeJS.Immediate): void {
		global.clearImmediate(id);
		this.happyDOM.asyncTaskManager.endImmediate(id);
	}

	/**
	 * Queues a microtask to be executed at a safe time prior to control returning to the browser's event loop.
	 *
	 * @param callback Function to be executed.
	 */
	public queueMicrotask(callback: Function): void {
		let isAborted = false;
		const taskId = this.happyDOM.asyncTaskManager.startTask(() => (isAborted = true));
		this._queueMicrotask(() => {
			if (!isAborted) {
				if (this.happyDOM.settings.disableErrorCapturing) {
					callback();
				} else {
					WindowErrorUtility.captureError(this, <() => unknown>callback);
				}
				this.happyDOM.asyncTaskManager.endTask(taskId);
			}
		});
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

		this.window.setTimeout(() =>
			this.dispatchEvent(
				new MessageEvent('message', {
					data: message,
					origin: this.parent.location.origin,
					source: this.parent,
					lastEventId: ''
				})
			)
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
			VMGlobalPropertyScript.runInContext(this);
		}
	}
}
