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
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement.js';
import HTMLIFrameElement from '../nodes/html-iframe-element/HTMLIFrameElement.js';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement.js';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement.js';
import SVGElement from '../nodes/svg-element/SVGElement.js';
import SVGGraphicsElement from '../nodes/svg-element/SVGGraphicsElement.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import CharacterData from '../nodes/character-data/CharacterData.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
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
import XMLSerializer from '../xml-serializer/XMLSerializer.js';
import ResizeObserver from '../resize-observer/ResizeObserver.js';
import Blob from '../file/Blob.js';
import File from '../file/File.js';
import DOMException from '../exception/DOMException.js';
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
import Response from '../fetch/Response.js';
import IResponse from '../fetch/types/IResponse.js';
import IRequestInit from '../fetch/types/IRequestInit.js';
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
import DOMRect from '../nodes/element/DOMRect.js';
import VMGlobalPropertyScript from './VMGlobalPropertyScript.js';
import * as PerfHooks from 'perf_hooks';
import VM from 'vm';
import { Buffer } from 'buffer';
import { webcrypto } from 'crypto';
import XMLHttpRequestUpload from '../xml-http-request/XMLHttpRequestUpload.js';
import XMLHttpRequestEventTarget from '../xml-http-request/XMLHttpRequestEventTarget.js';
import Base64 from '../base64/Base64.js';
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
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList.js';
import ValidityState from '../validity-state/ValidityState.js';
import WindowErrorUtility from './WindowErrorUtility.js';
import ICrossOriginWindow from './ICrossOriginWindow.js';
import Permissions from '../permissions/Permissions.js';
import PermissionStatus from '../permissions/PermissionStatus.js';
import Clipboard from '../clipboard/Clipboard.js';
import ClipboardItem from '../clipboard/ClipboardItem.js';
import ClipboardEvent from '../event/events/ClipboardEvent.js';
import HappyDOMWindowAPI from './HappyDOMWindowAPI.js';
import Headers from '../fetch/Headers.js';
import WindowClassFactory from './WindowClassFactory.js';
import Audio from '../nodes/html-audio-element/Audio.js';
import Image from '../nodes/html-image-element/Image.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import DOMParser from '../dom-parser/DOMParser.js';
import FileReader from '../file/FileReader.js';
import Request from '../fetch/Request.js';
import Range from '../range/Range.js';
import XMLHttpRequest from '../xml-http-request/XMLHttpRequest.js';
import IOptionalBrowserSettings from '../browser/types/IOptionalBrowserSettings.js';
import WindowBrowserSettingsReader from './WindowBrowserSettingsReader.js';
import DocumentReadyStateManager from '../nodes/document/DocumentReadyStateManager.js';
import DocumentReadyStateEnum from '../nodes/document/DocumentReadyStateEnum.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import HTMLAnchorElement from '../nodes/html-anchor-element/HTMLAnchorElement.js';
import HTMLButtonElement from '../nodes/html-button-element/HTMLButtonElement.js';
import HTMLOptionElement from '../nodes/html-option-element/HTMLOptionElement.js';
import HTMLOptGroupElement from '../nodes/html-opt-group-element/HTMLOptGroupElement.js';
import DetachedBrowser from '../browser/detached-browser/DetachedBrowser.js';
import WindowPageOpenUtility from './WindowPageOpenUtility.js';

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
	// Detached Window API.
	public readonly happyDOM: HappyDOMWindowAPI;

	// Nodes
	public readonly Node: typeof Node;
	public readonly Attr: typeof Attr;
	public readonly SVGSVGElement: typeof SVGSVGElement;
	public readonly SVGElement: typeof SVGElement;
	public readonly SVGGraphicsElement: typeof SVGGraphicsElement;
	public readonly Text: typeof Text;
	public readonly Comment: typeof Comment;
	public readonly ShadowRoot: typeof ShadowRoot;
	public readonly ProcessingInstruction: typeof ProcessingInstruction;
	public readonly Element: typeof Element;
	public readonly CharacterData: typeof CharacterData;
	public readonly Document: typeof Document;
	public readonly HTMLDocument: typeof HTMLDocument;
	public readonly XMLDocument: typeof XMLDocument;
	public readonly SVGDocument: typeof SVGDocument;
	public readonly DocumentType: typeof DocumentType;

	// Element classes
	public readonly HTMLAnchorElement: typeof HTMLAnchorElement;
	public readonly HTMLButtonElement: typeof HTMLButtonElement;
	public readonly HTMLOptGroupElement: typeof HTMLOptGroupElement;
	public readonly HTMLOptionElement: typeof HTMLOptionElement;
	public readonly HTMLElement: typeof HTMLElement;
	public readonly HTMLUnknownElement: typeof HTMLUnknownElement;
	public readonly HTMLTemplateElement: typeof HTMLTemplateElement;
	public readonly HTMLFormElement: typeof HTMLFormElement;
	public readonly HTMLInputElement: typeof HTMLInputElement;
	public readonly HTMLSelectElement: typeof HTMLSelectElement;
	public readonly HTMLTextAreaElement: typeof HTMLTextAreaElement;
	public readonly HTMLImageElement: typeof HTMLImageElement;
	public readonly HTMLScriptElement: typeof HTMLScriptElement;
	public readonly HTMLLinkElement: typeof HTMLLinkElement;
	public readonly HTMLStyleElement: typeof HTMLStyleElement;
	public readonly HTMLLabelElement: typeof HTMLLabelElement;
	public readonly HTMLSlotElement: typeof HTMLSlotElement;
	public readonly HTMLMetaElement: typeof HTMLMetaElement;
	public readonly HTMLMediaElement: typeof HTMLMediaElement;
	public readonly HTMLAudioElement: typeof HTMLAudioElement;
	public readonly HTMLVideoElement: typeof HTMLVideoElement;
	public readonly HTMLBaseElement: typeof HTMLBaseElement;
	public readonly HTMLIFrameElement: typeof HTMLIFrameElement;
	public readonly HTMLDialogElement: typeof HTMLDialogElement;

	// Non-implemented element classes
	public readonly HTMLHeadElement: typeof HTMLElement;
	public readonly HTMLTitleElement: typeof HTMLElement;
	public readonly HTMLBodyElement: typeof HTMLElement;
	public readonly HTMLHeadingElement: typeof HTMLElement;
	public readonly HTMLParagraphElement: typeof HTMLElement;
	public readonly HTMLHRElement: typeof HTMLElement;
	public readonly HTMLPreElement: typeof HTMLElement;
	public readonly HTMLUListElement: typeof HTMLElement;
	public readonly HTMLOListElement: typeof HTMLElement;
	public readonly HTMLLIElement: typeof HTMLElement;
	public readonly HTMLMenuElement: typeof HTMLElement;
	public readonly HTMLDListElement: typeof HTMLElement;
	public readonly HTMLDivElement: typeof HTMLElement;
	public readonly HTMLAreaElement: typeof HTMLElement;
	public readonly HTMLBRElement: typeof HTMLElement;
	public readonly HTMLCanvasElement: typeof HTMLElement;
	public readonly HTMLDataElement: typeof HTMLElement;
	public readonly HTMLDataListElement: typeof HTMLElement;
	public readonly HTMLDetailsElement: typeof HTMLElement;
	public readonly HTMLDirectoryElement: typeof HTMLElement;
	public readonly HTMLFieldSetElement: typeof HTMLElement;
	public readonly HTMLFontElement: typeof HTMLElement;
	public readonly HTMLHtmlElement: typeof HTMLElement;
	public readonly HTMLLegendElement: typeof HTMLElement;
	public readonly HTMLMapElement: typeof HTMLElement;
	public readonly HTMLMarqueeElement: typeof HTMLElement;
	public readonly HTMLMeterElement: typeof HTMLElement;
	public readonly HTMLModElement: typeof HTMLElement;
	public readonly HTMLOutputElement: typeof HTMLElement;
	public readonly HTMLPictureElement: typeof HTMLElement;
	public readonly HTMLProgressElement: typeof HTMLElement;
	public readonly HTMLQuoteElement: typeof HTMLElement;
	public readonly HTMLSourceElement: typeof HTMLElement;
	public readonly HTMLSpanElement: typeof HTMLElement;
	public readonly HTMLTableCaptionElement: typeof HTMLElement;
	public readonly HTMLTableCellElement: typeof HTMLElement;
	public readonly HTMLTableColElement: typeof HTMLElement;
	public readonly HTMLTableElement: typeof HTMLElement;
	public readonly HTMLTimeElement: typeof HTMLElement;
	public readonly HTMLTableRowElement: typeof HTMLElement;
	public readonly HTMLTableSectionElement: typeof HTMLElement;
	public readonly HTMLFrameElement: typeof HTMLElement;
	public readonly HTMLFrameSetElement: typeof HTMLElement;
	public readonly HTMLEmbedElement: typeof HTMLElement;
	public readonly HTMLObjectElement: typeof HTMLElement;
	public readonly HTMLParamElement: typeof HTMLElement;
	public readonly HTMLTrackElement: typeof HTMLElement;

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
	public readonly DOMRect = DOMRect;
	public readonly RadioNodeList = RadioNodeList;
	public readonly ValidityState = ValidityState;
	public readonly Headers = Headers;
	public readonly Request: typeof Request;
	public readonly Response: typeof Response;
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
	public readonly XMLHttpRequest: typeof XMLHttpRequest;
	public readonly DOMParser: typeof DOMParser;
	public readonly Range: typeof Range;
	public readonly FileReader: typeof FileReader;
	public readonly Image: typeof Image;
	public readonly DocumentFragment: typeof DocumentFragment;
	public readonly Audio: typeof Audio;

	// Events
	public onload: ((event: Event) => void) | null = null;
	public onerror: ((event: ErrorEvent) => void) | null = null;

	// Public properties.
	public readonly document: Document;
	public readonly customElements: CustomElementRegistry;
	public readonly location: Location;
	public readonly history: History;
	public readonly navigator: Navigator;
	public readonly opener: IWindow | null = null;
	public readonly self: IWindow = this;
	public readonly top: IWindow = this;
	public readonly parent: IWindow = this;
	public readonly window: IWindow = this;
	public readonly globalThis: IWindow = this;
	public readonly screen: Screen;
	public readonly devicePixelRatio = 1;
	public readonly sessionStorage: Storage;
	public readonly localStorage: Storage;
	public readonly performance = PerfHooks.performance;
	public readonly innerWidth: number = 1024;
	public readonly innerHeight: number = 768;
	public readonly outerWidth: number = 1024;
	public readonly outerHeight: number = 768;
	public readonly screenLeft: number = 0;
	public readonly screenTop: number = 0;
	public readonly screenX: number = 0;
	public readonly screenY: number = 0;
	public readonly crypto = webcrypto;
	public readonly closed = false;
	public readonly console: Console;
	public name: string = '';

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
	public readonly _readyStateManager = new DocumentReadyStateManager(this);

	// Private properties
	#setTimeout: (callback: Function, delay?: number, ...args: unknown[]) => NodeJS.Timeout;
	#clearTimeout: (id: NodeJS.Timeout) => void;
	#setInterval: (callback: Function, delay?: number, ...args: unknown[]) => NodeJS.Timeout;
	#clearInterval: (id: NodeJS.Timeout) => void;
	#queueMicrotask: (callback: Function) => void;
	#browserFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.width] Window width. Defaults to "1024".
	 * @param [options.height] Window height. Defaults to "768".
	 * @param [options.innerWidth] Inner width. Deprecated. Defaults to "1024".
	 * @param [options.innerHeight] Inner height. Deprecated. Defaults to "768".
	 * @param [options.url] URL.
	 * @param [options.console] Console.
	 * @param [options.settings] Settings.
	 * @param [options.browserFrame] Browser frame.
	 */
	constructor(options?: {
		width?: number;
		height?: number;
		innerWidth?: number;
		innerHeight?: number;
		url?: string;
		console?: Console;
		settings?: IOptionalBrowserSettings;
		browserFrame?: IBrowserFrame;
	}) {
		super();

		this.customElements = new CustomElementRegistry();
		this.navigator = new Navigator(this);
		this.history = new History();
		this.screen = new Screen();
		this.sessionStorage = new Storage();
		this.localStorage = new Storage();

		if (options?.browserFrame) {
			this.#browserFrame = options.browserFrame;
		} else {
			this.#browserFrame = new DetachedBrowser(Window, this, {
				console: options?.console,
				settings: options?.settings
			}).defaultContext.pages[0].mainFrame;
		}

		WindowBrowserSettingsReader.setSettings(this, this.#browserFrame.page.context.browser.settings);

		this.console = this.#browserFrame.page.console;
		this.location = new Location('about:blank', this.#browserFrame);
		this.happyDOM = new HappyDOMWindowAPI(this.#browserFrame);

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
				this.#browserFrame.url = options.url;
			}
		}

		this.#setTimeout = ORIGINAL_SET_TIMEOUT;
		this.#clearTimeout = ORIGINAL_CLEAR_TIMEOUT;
		this.#setInterval = ORIGINAL_SET_INTERVAL;
		this.#clearInterval = ORIGINAL_CLEAR_INTERVAL;
		this.#queueMicrotask = ORIGINAL_QUEUE_MICROTASK;

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

		this._setupVMContext();

		const classes = WindowClassFactory.getClasses({
			window: this,
			browserFrame: this.#browserFrame
		});

		// Classes that require the window to be injected
		this.Response = classes.Response;
		this.Request = classes.Request;
		this.Image = classes.Image;
		this.DocumentFragment = classes.DocumentFragment;
		this.FileReader = classes.FileReader;
		this.DOMParser = classes.DOMParser;
		this.XMLHttpRequest = classes.XMLHttpRequest;
		this.Range = classes.Range;
		this.Audio = classes.Audio;

		// Nodes
		this.Node = classes.Node;
		this.Attr = classes.Attr;
		this.SVGSVGElement = classes.SVGSVGElement;
		this.SVGElement = classes.SVGElement;
		this.SVGGraphicsElement = classes.SVGGraphicsElement;
		this.Text = classes.Text;
		this.Comment = classes.Comment;
		this.ShadowRoot = classes.ShadowRoot;
		this.ProcessingInstruction = classes.ProcessingInstruction;
		this.Element = classes.Element;
		this.CharacterData = classes.CharacterData;
		this.Document = classes.Document;
		this.HTMLDocument = classes.HTMLDocument;
		this.XMLDocument = classes.XMLDocument;
		this.SVGDocument = classes.SVGDocument;
		this.DocumentType = classes.DocumentType;

		// HTML Element classes
		this.HTMLAnchorElement = classes.HTMLAnchorElement;
		this.HTMLButtonElement = classes.HTMLButtonElement;
		this.HTMLOptGroupElement = classes.HTMLOptGroupElement;
		this.HTMLOptionElement = classes.HTMLOptionElement;
		this.HTMLElement = classes.HTMLElement;
		this.HTMLUnknownElement = classes.HTMLUnknownElement;
		this.HTMLTemplateElement = classes.HTMLTemplateElement;
		this.HTMLFormElement = classes.HTMLFormElement;
		this.HTMLInputElement = classes.HTMLInputElement;
		this.HTMLSelectElement = classes.HTMLSelectElement;
		this.HTMLTextAreaElement = classes.HTMLTextAreaElement;
		this.HTMLImageElement = classes.HTMLImageElement;
		this.HTMLScriptElement = classes.HTMLScriptElement;
		this.HTMLLinkElement = classes.HTMLLinkElement;
		this.HTMLStyleElement = classes.HTMLStyleElement;
		this.HTMLLabelElement = classes.HTMLLabelElement;
		this.HTMLSlotElement = classes.HTMLSlotElement;
		this.HTMLMetaElement = classes.HTMLMetaElement;
		this.HTMLMediaElement = classes.HTMLMediaElement;
		this.HTMLAudioElement = classes.HTMLAudioElement;
		this.HTMLVideoElement = classes.HTMLVideoElement;
		this.HTMLBaseElement = classes.HTMLBaseElement;
		this.HTMLIFrameElement = classes.HTMLIFrameElement;
		this.HTMLDialogElement = classes.HTMLDialogElement;

		// Non-implemented HTML element classes
		this.HTMLHeadElement = classes.HTMLElement;
		this.HTMLTitleElement = classes.HTMLElement;
		this.HTMLBodyElement = classes.HTMLElement;
		this.HTMLHeadingElement = classes.HTMLElement;
		this.HTMLParagraphElement = classes.HTMLElement;
		this.HTMLHRElement = classes.HTMLElement;
		this.HTMLPreElement = classes.HTMLElement;
		this.HTMLUListElement = classes.HTMLElement;
		this.HTMLOListElement = classes.HTMLElement;
		this.HTMLLIElement = classes.HTMLElement;
		this.HTMLMenuElement = classes.HTMLElement;
		this.HTMLDListElement = classes.HTMLElement;
		this.HTMLDivElement = classes.HTMLElement;
		this.HTMLAreaElement = classes.HTMLElement;
		this.HTMLBRElement = classes.HTMLElement;
		this.HTMLCanvasElement = classes.HTMLElement;
		this.HTMLDataElement = classes.HTMLElement;
		this.HTMLDataListElement = classes.HTMLElement;
		this.HTMLDetailsElement = classes.HTMLElement;
		this.HTMLDirectoryElement = classes.HTMLElement;
		this.HTMLFieldSetElement = classes.HTMLElement;
		this.HTMLFontElement = classes.HTMLElement;
		this.HTMLHtmlElement = classes.HTMLElement;
		this.HTMLLegendElement = classes.HTMLElement;
		this.HTMLMapElement = classes.HTMLElement;
		this.HTMLMarqueeElement = classes.HTMLElement;
		this.HTMLMeterElement = classes.HTMLElement;
		this.HTMLModElement = classes.HTMLElement;
		this.HTMLOutputElement = classes.HTMLElement;
		this.HTMLPictureElement = classes.HTMLElement;
		this.HTMLProgressElement = classes.HTMLElement;
		this.HTMLQuoteElement = classes.HTMLElement;
		this.HTMLSourceElement = classes.HTMLElement;
		this.HTMLSpanElement = classes.HTMLElement;
		this.HTMLTableCaptionElement = classes.HTMLElement;
		this.HTMLTableCellElement = classes.HTMLElement;
		this.HTMLTableColElement = classes.HTMLElement;
		this.HTMLTableElement = classes.HTMLElement;
		this.HTMLTimeElement = classes.HTMLElement;
		this.HTMLTableRowElement = classes.HTMLElement;
		this.HTMLTableSectionElement = classes.HTMLElement;
		this.HTMLFrameElement = classes.HTMLElement;
		this.HTMLFrameSetElement = classes.HTMLElement;
		this.HTMLEmbedElement = classes.HTMLElement;
		this.HTMLObjectElement = classes.HTMLElement;
		this.HTMLParamElement = classes.HTMLElement;
		this.HTMLTrackElement = classes.HTMLElement;

		// Document
		this.document = new this.HTMLDocument();
		(<IWindow>this.document.defaultView) = this;

		// Default document elements
		const doctype = this.document.implementation.createDocumentType('html', '', '');
		const documentElement = this.document.createElement('html');
		const bodyElement = this.document.createElement('body');
		const headElement = this.document.createElement('head');

		this.document.appendChild(doctype);
		this.document.appendChild(documentElement);

		documentElement.appendChild(headElement);
		documentElement.appendChild(bodyElement);

		// Ready state manager
		this._readyStateManager.whenComplete().then(() => {
			(<DocumentReadyStateEnum>this.document.readyState) = DocumentReadyStateEnum.complete;
			this.document.dispatchEvent(new Event('readystatechange'));
			this.document.dispatchEvent(new Event('load', { bubbles: true }));
		});
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
	 * Shifts focus away from the window.
	 */
	public blur(): void {
		// TODO: Implement.
	}

	/**
	 * Gives focus to the window.
	 */
	public focus(): void {
		// TODO: Implement.
	}

	/**
	 * Loads a specified resource into a new or existing browsing context (that is, a tab, a window, or an iframe) under a specified name.
	 *
	 * @param [url] URL.
	 * @param [target] Target.
	 * @param [features] Window features.
	 * @returns Window.
	 */
	public open(
		url?: string,
		target?: string,
		features?: string
	): IWindow | ICrossOriginWindow | null {
		if (this.#browserFrame.page.context.browser.settings.disableWindowOpenPageLoading) {
			return null;
		}
		return WindowPageOpenUtility.openPage(this.#browserFrame, {
			url,
			target,
			features
		});
	}

	/**
	 * Closes the window.
	 */
	public close(): void {
		if (this.#browserFrame.page.mainFrame === this.#browserFrame) {
			this.#browserFrame.page.close();
		}
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
		const id = this.#setTimeout(() => {
			if (this.#browserFrame.page.context.browser.settings.disableErrorCapturing) {
				callback(...args);
			} else {
				WindowErrorUtility.captureError(this, () => callback(...args));
			}
			this.#browserFrame._asyncTaskManager.endTimer(id);
		}, delay);
		this.#browserFrame._asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		this.#clearTimeout(id);
		this.#browserFrame._asyncTaskManager.endTimer(id);
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
		const id = this.#setInterval(() => {
			if (this.#browserFrame.page.context.browser.settings.disableErrorCapturing) {
				callback(...args);
			} else {
				WindowErrorUtility.captureError(
					this,
					() => callback(...args),
					() => this.clearInterval(id)
				);
			}
		}, delay);
		this.#browserFrame._asyncTaskManager.startTimer(id);
		return id;
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		this.#clearInterval(id);
		this.#browserFrame._asyncTaskManager.endTimer(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param callback Callback.
	 * @returns ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Immediate {
		const id = global.setImmediate(() => {
			if (this.#browserFrame.page.context.browser.settings.disableErrorCapturing) {
				callback(this.performance.now());
			} else {
				WindowErrorUtility.captureError(this, () => callback(this.performance.now()));
			}
			this.#browserFrame._asyncTaskManager.endImmediate(id);
		});
		this.#browserFrame._asyncTaskManager.startImmediate(id);
		return id;
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param id ID.
	 */
	public cancelAnimationFrame(id: NodeJS.Immediate): void {
		global.clearImmediate(id);
		this.#browserFrame._asyncTaskManager.endImmediate(id);
	}

	/**
	 * Queues a microtask to be executed at a safe time prior to control returning to the browser's event loop.
	 *
	 * @param callback Function to be executed.
	 */
	public queueMicrotask(callback: Function): void {
		let isAborted = false;
		const taskId = this.#browserFrame._asyncTaskManager.startTask(() => (isAborted = true));
		this.#queueMicrotask(() => {
			if (!isAborted) {
				if (this.#browserFrame.page.context.browser.settings.disableErrorCapturing) {
					callback();
				} else {
					WindowErrorUtility.captureError(this, <() => unknown>callback);
				}
				this.#browserFrame._asyncTaskManager.endTask(taskId);
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
		return await new Fetch({
			ownerDocument: this.document,
			asyncTaskManager: this.#browserFrame._asyncTaskManager,
			url,
			init
		}).send();
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

		this.setTimeout(() =>
			this.dispatchEvent(
				new MessageEvent('message', {
					data: message,
					origin: this.#browserFrame.parentFrame
						? this.#browserFrame.parentFrame.window.location.origin
						: this.#browserFrame.window.location.origin,
					source: this.#browserFrame.parentFrame
						? this.#browserFrame.parentFrame.window
						: this.#browserFrame.window,
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
