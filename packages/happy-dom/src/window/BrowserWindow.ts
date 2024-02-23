import CustomElementRegistry from '../custom-element/CustomElementRegistry.js';
import * as PropertySymbol from '../PropertySymbol.js';
import DocumentImplementation from '../nodes/document/Document.js';
import HTMLDocumentImplementation from '../nodes/html-document/HTMLDocument.js';
import XMLDocumentImplementation from '../nodes/xml-document/XMLDocument.js';
import SVGDocumentImplementation from '../nodes/svg-document/SVGDocument.js';
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
import HTMLLinkElementImplementation from '../nodes/html-link-element/HTMLLinkElement.js';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement.js';
import HTMLSlotElement from '../nodes/html-slot-element/HTMLSlotElement.js';
import HTMLLabelElement from '../nodes/html-label-element/HTMLLabelElement.js';
import HTMLMetaElement from '../nodes/html-meta-element/HTMLMetaElement.js';
import HTMLMediaElement from '../nodes/html-media-element/HTMLMediaElement.js';
import HTMLAudioElement from '../nodes/html-audio-element/HTMLAudioElement.js';
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement.js';
import HTMLIFrameElementImplementation from '../nodes/html-iframe-element/HTMLIFrameElement.js';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement.js';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement.js';
import SVGElement from '../nodes/svg-element/SVGElement.js';
import SVGGraphicsElement from '../nodes/svg-element/SVGGraphicsElement.js';
import HTMLScriptElementImplementation from '../nodes/html-script-element/HTMLScriptElement.js';
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
import TouchEvent from '../event/events/TouchEvent.js';
import Touch from '../event/Touch.js';
import EventTarget from '../event/EventTarget.js';
import MessagePort from '../event/MessagePort.js';
import { URLSearchParams } from 'url';
import URL from '../url/URL.js';
import Location from '../url/Location.js';
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
import IResponse from '../fetch/types/IResponse.js';
import IRequestInit from '../fetch/types/IRequestInit.js';
import Storage from '../storage/Storage.js';
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
import { ReadableStream } from 'stream/web';
import FormData from '../form-data/FormData.js';
import AbortController from '../fetch/AbortController.js';
import AbortSignal from '../fetch/AbortSignal.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList.js';
import ValidityState from '../validity-state/ValidityState.js';
import WindowErrorUtility from './WindowErrorUtility.js';
import ICrossOriginBrowserWindow from './ICrossOriginBrowserWindow.js';
import Permissions from '../permissions/Permissions.js';
import PermissionStatus from '../permissions/PermissionStatus.js';
import Clipboard from '../clipboard/Clipboard.js';
import ClipboardItem from '../clipboard/ClipboardItem.js';
import ClipboardEvent from '../event/events/ClipboardEvent.js';
import Headers from '../fetch/Headers.js';
import XMLHttpRequestImplementation from '../xml-http-request/XMLHttpRequest.js';
import WindowBrowserSettingsReader from './WindowBrowserSettingsReader.js';
import DocumentReadyStateManager from '../nodes/document/DocumentReadyStateManager.js';
import DocumentReadyStateEnum from '../nodes/document/DocumentReadyStateEnum.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import HTMLAnchorElement from '../nodes/html-anchor-element/HTMLAnchorElement.js';
import HTMLButtonElement from '../nodes/html-button-element/HTMLButtonElement.js';
import HTMLOptionElement from '../nodes/html-option-element/HTMLOptionElement.js';
import HTMLOptGroupElement from '../nodes/html-opt-group-element/HTMLOptGroupElement.js';
import WindowPageOpenUtility from './WindowPageOpenUtility.js';
import IResponseBody from '../fetch/types/IResponseBody.js';
import IResponseInit from '../fetch/types/IResponseInit.js';
import IRequestInfo from '../fetch/types/IRequestInfo.js';
import IBrowserWindow from './IBrowserWindow.js';
import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import AudioImplementation from '../nodes/html-audio-element/Audio.js';
import ImageImplementation from '../nodes/html-image-element/Image.js';
import DocumentFragmentImplementation from '../nodes/document-fragment/DocumentFragment.js';
import DOMParserImplementation from '../dom-parser/DOMParser.js';
import FileReaderImplementation from '../file/FileReader.js';
import RequestImplementation from '../fetch/Request.js';
import ResponseImplementation from '../fetch/Response.js';
import RangeImplementation from '../range/Range.js';

const TIMER = {
	setTimeout: globalThis.setTimeout.bind(globalThis),
	clearTimeout: globalThis.clearTimeout.bind(globalThis),
	setInterval: globalThis.setInterval.bind(globalThis),
	clearInterval: globalThis.clearInterval.bind(globalThis),
	queueMicrotask: globalThis.queueMicrotask.bind(globalThis),
	setImmediate: globalThis.setImmediate.bind(globalThis),
	clearImmediate: globalThis.clearImmediate.bind(globalThis)
};
const IS_NODE_JS_TIMEOUT_ENVIRONMENT = setTimeout.toString().includes('new Timeout');

/**
 * Browser window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class BrowserWindow extends EventTarget implements IBrowserWindow {
	// Nodes
	public readonly Node: typeof Node = Node;
	public readonly Attr: typeof Attr = Attr;
	public readonly SVGSVGElement: typeof SVGSVGElement = SVGSVGElement;
	public readonly SVGElement: typeof SVGElement = SVGElement;
	public readonly SVGGraphicsElement: typeof SVGGraphicsElement = SVGGraphicsElement;
	public readonly Text: typeof Text = Text;
	public readonly Comment: typeof Comment = Comment;
	public readonly ShadowRoot: typeof ShadowRoot = ShadowRoot;
	public readonly ProcessingInstruction: typeof ProcessingInstruction = ProcessingInstruction;
	public readonly Element: typeof Element = Element;
	public readonly CharacterData: typeof CharacterData = CharacterData;
	public readonly DocumentType: typeof DocumentType = DocumentType;
	public readonly Document: new () => DocumentImplementation;
	public readonly HTMLDocument: new () => HTMLDocumentImplementation;
	public readonly XMLDocument: new () => XMLDocumentImplementation;
	public readonly SVGDocument: new () => SVGDocumentImplementation;

	// Element classes
	public readonly HTMLAnchorElement: typeof HTMLAnchorElement = HTMLAnchorElement;
	public readonly HTMLButtonElement: typeof HTMLButtonElement = HTMLButtonElement;
	public readonly HTMLOptGroupElement: typeof HTMLOptGroupElement = HTMLOptGroupElement;
	public readonly HTMLOptionElement: typeof HTMLOptionElement = HTMLOptionElement;
	public readonly HTMLElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLUnknownElement: typeof HTMLUnknownElement = HTMLUnknownElement;
	public readonly HTMLTemplateElement: typeof HTMLTemplateElement = HTMLTemplateElement;
	public readonly HTMLFormElement: typeof HTMLFormElement = HTMLFormElement;
	public readonly HTMLInputElement: typeof HTMLInputElement = HTMLInputElement;
	public readonly HTMLSelectElement: typeof HTMLSelectElement = HTMLSelectElement;
	public readonly HTMLTextAreaElement: typeof HTMLTextAreaElement = HTMLTextAreaElement;
	public readonly HTMLImageElement: typeof HTMLImageElement = HTMLImageElement;
	public readonly HTMLStyleElement: typeof HTMLStyleElement = HTMLStyleElement;
	public readonly HTMLLabelElement: typeof HTMLLabelElement = HTMLLabelElement;
	public readonly HTMLSlotElement: typeof HTMLSlotElement = HTMLSlotElement;
	public readonly HTMLMetaElement: typeof HTMLMetaElement = HTMLMetaElement;
	public readonly HTMLMediaElement: typeof HTMLMediaElement = HTMLMediaElement;
	public readonly HTMLAudioElement: typeof HTMLAudioElement = HTMLAudioElement;
	public readonly HTMLVideoElement: typeof HTMLVideoElement = HTMLVideoElement;
	public readonly HTMLBaseElement: typeof HTMLBaseElement = HTMLBaseElement;
	public readonly HTMLDialogElement: typeof HTMLDialogElement = HTMLDialogElement;
	public readonly HTMLScriptElement: typeof HTMLScriptElementImplementation;
	public readonly HTMLLinkElement: typeof HTMLLinkElementImplementation;
	public readonly HTMLIFrameElement: typeof HTMLIFrameElementImplementation;

	// Non-implemented element classes
	public readonly HTMLHeadElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTitleElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLBodyElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLHeadingElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLParagraphElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLHRElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLPreElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLUListElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLOListElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLLIElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLMenuElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLDListElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLDivElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLAreaElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLBRElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLCanvasElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLDataElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLDataListElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLDetailsElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLDirectoryElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLFieldSetElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLFontElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLHtmlElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLLegendElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLMapElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLMarqueeElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLMeterElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLModElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLOutputElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLPictureElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLProgressElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLQuoteElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLSourceElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLSpanElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTableCaptionElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTableCellElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTableColElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTableElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTimeElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTableRowElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTableSectionElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLFrameElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLFrameSetElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLEmbedElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLObjectElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLParamElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLTrackElement: typeof HTMLElement = HTMLElement;

	// Event classes
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
	public readonly TouchEvent = TouchEvent;
	public readonly Touch = Touch;

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
	public readonly CSSStyleDeclaration = CSSStyleDeclaration;
	public readonly EventTarget = EventTarget;
	public readonly MessagePort = MessagePort;
	public readonly DataTransfer = DataTransfer;
	public readonly DataTransferItem = DataTransferItem;
	public readonly DataTransferItemList = DataTransferItemList;
	public readonly URL = URL;
	public readonly Location = Location;
	public readonly CustomElementRegistry = CustomElementRegistry;
	public readonly Window = <typeof BrowserWindow>this.constructor;
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
	public readonly Request: new (input: IRequestInfo, init?: IRequestInit) => RequestImplementation;
	public readonly Response: {
		redirect: (url: string, status?: number) => ResponseImplementation;
		error: () => ResponseImplementation;
		json: (data: object, init?: IResponseInit) => ResponseImplementation;
		new (body?: IResponseBody, init?: IResponseInit): ResponseImplementation;
	};
	public readonly XMLHttpRequestUpload = XMLHttpRequestUpload;
	public readonly XMLHttpRequestEventTarget = XMLHttpRequestEventTarget;
	public readonly ReadableStream = ReadableStream;
	public readonly WritableStream = Stream.Writable;
	public readonly TransformStream = Stream.Transform;
	public readonly AbortController = AbortController;
	public readonly AbortSignal = AbortSignal;
	public readonly FormData = FormData;
	public readonly Permissions = Permissions;
	public readonly PermissionStatus = PermissionStatus;
	public readonly Clipboard = Clipboard;
	public readonly ClipboardItem = ClipboardItem;
	public readonly XMLHttpRequest: new () => XMLHttpRequestImplementation;
	public readonly DOMParser: new () => DOMParserImplementation;
	public readonly Range: new () => RangeImplementation;
	public readonly FileReader: new () => FileReaderImplementation;
	public readonly Image: typeof ImageImplementation;
	public readonly DocumentFragment: typeof DocumentFragmentImplementation;
	public readonly Audio: typeof AudioImplementation;

	// Events
	public onload: ((event: Event) => void) | null = null;
	public onerror: ((event: ErrorEvent) => void) | null = null;

	// Public properties.
	public readonly document: DocumentImplementation;
	public readonly customElements: CustomElementRegistry;
	public readonly location: Location;
	public readonly history: History;
	public readonly navigator: Navigator;
	public readonly console: Console;
	public readonly self: IBrowserWindow = this;
	public readonly top: IBrowserWindow = this;
	public readonly parent: IBrowserWindow = this;
	public readonly window: IBrowserWindow = this;
	public readonly globalThis: IBrowserWindow = this;
	public readonly screen: Screen;
	public readonly sessionStorage: Storage;
	public readonly localStorage: Storage;
	public readonly performance: typeof performance = performance;
	public readonly screenLeft: number = 0;
	public readonly screenTop: number = 0;
	public readonly screenX: number = 0;
	public readonly screenY: number = 0;
	public readonly crypto: typeof webcrypto = webcrypto;
	public readonly closed = false;
	public name = '';

	// Node.js Globals
	public Array: typeof Array;
	public ArrayBuffer: typeof ArrayBuffer;
	public Boolean: typeof Boolean;
	public Buffer: typeof Buffer = Buffer;
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
	public [PropertySymbol.captureEventListenerCount]: { [eventType: string]: number } = {};
	public readonly [PropertySymbol.mutationObservers]: MutationObserver[] = [];
	public readonly [PropertySymbol.readyStateManager] = new DocumentReadyStateManager(this);

	// Private properties
	#browserFrame: IBrowserFrame;
	#innerWidth: number | null = null;
	#innerHeight: number | null = null;
	#outerWidth: number | null = null;
	#outerHeight: number | null = null;
	#devicePixelRatio: number | null = null;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 * @param [options] Options.
	 * @param [options.url] URL.
	 */
	constructor(browserFrame: IBrowserFrame, options?: { url?: string }) {
		super();

		this.#browserFrame = browserFrame;

		this.customElements = new CustomElementRegistry();
		this.navigator = new Navigator(this);
		this.history = new History();
		this.screen = new Screen();
		this.sessionStorage = new Storage();
		this.localStorage = new Storage();
		this.location = new Location(this.#browserFrame, options?.url ?? 'about:blank');
		this.console = browserFrame.page.console;

		WindowBrowserSettingsReader.setSettings(this, this.#browserFrame.page.context.browser.settings);

		// Binds all methods to "this", so that it will use the correct context when called globally.
		for (const key of Object.getOwnPropertyNames(BrowserWindow.prototype).concat(
			Object.getOwnPropertyNames(EventTarget.prototype)
		)) {
			if (
				key !== 'constructor' &&
				key[0] !== '_' &&
				key[0] === key[0].toLowerCase() &&
				typeof this[key] === 'function' &&
				!this[key].toString().startsWith('class ')
			) {
				this[key] = this[key].bind(this);
			}
		}

		const window = this;
		const asyncTaskManager = this.#browserFrame[PropertySymbol.asyncTaskManager];

		this[PropertySymbol.setupVMContext]();

		// Class overrides
		// For classes that need to be bound to the correct context.

		/* eslint-disable jsdoc/require-jsdoc */

		class Request extends RequestImplementation {
			constructor(input: IRequestInfo, init?: IRequestInit) {
				super({ window, asyncTaskManager }, input, init);
			}
		}
		class Response extends ResponseImplementation {
			protected static [PropertySymbol.window] = window;
			constructor(body?: IResponseBody, init?: IResponseInit) {
				super({ window, browserFrame }, body, init);
			}
		}
		class XMLHttpRequest extends XMLHttpRequestImplementation {
			constructor() {
				super({ window, browserFrame });
			}
		}
		class FileReader extends FileReaderImplementation {
			constructor() {
				super(window);
			}
		}
		class DOMParser extends DOMParserImplementation {
			constructor() {
				super(window);
			}
		}
		class Range extends RangeImplementation {
			constructor() {
				super(window);
			}
		}
		class HTMLScriptElement extends HTMLScriptElementImplementation {
			constructor() {
				super(browserFrame);
			}
		}
		class HTMLLinkElement extends HTMLLinkElementImplementation {
			constructor() {
				super(browserFrame);
			}
		}
		class HTMLIFrameElement extends HTMLIFrameElementImplementation {
			constructor() {
				super(browserFrame);
			}
		}
		class Document extends DocumentImplementation {
			constructor() {
				super({ window, browserFrame });
			}
		}
		class HTMLDocument extends HTMLDocumentImplementation {
			constructor() {
				super({ window, browserFrame });
			}
		}
		class XMLDocument extends XMLDocumentImplementation {
			constructor() {
				super({ window, browserFrame });
			}
		}
		class SVGDocument extends SVGDocumentImplementation {
			constructor() {
				super({ window, browserFrame });
			}
		}

		class Audio extends AudioImplementation {}
		class Image extends ImageImplementation {}
		class DocumentFragment extends DocumentFragmentImplementation {}

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
		this.HTMLScriptElement = HTMLScriptElement;
		this.HTMLLinkElement = HTMLLinkElement;
		this.HTMLIFrameElement = HTMLIFrameElement;
		this.Document = Document;
		this.HTMLDocument = HTMLDocument;
		this.XMLDocument = XMLDocument;
		this.SVGDocument = SVGDocument;

		// Override owner document
		this.Document[PropertySymbol.ownerDocument] = null;
		this.HTMLDocument[PropertySymbol.ownerDocument] = null;
		this.XMLDocument[PropertySymbol.ownerDocument] = null;
		this.SVGDocument[PropertySymbol.ownerDocument] = null;

		// Document
		this.document = new HTMLDocument();
		this.document[PropertySymbol.defaultView] = this;

		// Override owner document
		this.Audio[PropertySymbol.ownerDocument] = this.document;
		this.Image[PropertySymbol.ownerDocument] = this.document;
		this.DocumentFragment[PropertySymbol.ownerDocument] = this.document;

		// Ready state manager
		this[PropertySymbol.readyStateManager].waitUntilComplete().then(() => {
			this.document[PropertySymbol.readyState] = DocumentReadyStateEnum.complete;
			this.document.dispatchEvent(new Event('readystatechange'));
			this.document.dispatchEvent(new Event('load', { bubbles: true }));
		});
	}

	/**
	 * Returns opener.
	 *
	 * @returns Opener.
	 */
	public get opener(): IBrowserWindow | ICrossOriginBrowserWindow | null {
		return this.#browserFrame[PropertySymbol.openerWindow];
	}

	/**
	 * The number of pixels that the document is currently scrolled horizontally.
	 *
	 * @returns Scroll X.
	 */
	public get scrollX(): number {
		return this.document?.documentElement?.scrollLeft ?? 0;
	}

	/**
	 * The read-only Window property pageXOffset is an alias for scrollX.
	 *
	 * @returns Scroll X.
	 */
	public get pageXOffset(): number {
		return this.scrollX;
	}

	/**
	 * The number of pixels that the document is currently scrolled vertically.
	 *
	 * @returns Scroll Y.
	 */
	public get scrollY(): number {
		return this.document?.documentElement?.scrollTop ?? 0;
	}

	/**
	 * The read-only Window property pageYOffset is an alias for scrollY.
	 *
	 * @returns Scroll Y.
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
	 * Returns inner width.
	 *
	 * @returns Inner width.
	 */
	public get innerWidth(): number {
		if (this.#innerWidth === null) {
			return this.#browserFrame.page.viewport.width;
		}
		return this.#innerWidth;
	}

	/**
	 * Sets inner width.
	 *
	 * @param value Inner width.
	 */
	public set innerWidth(value: number) {
		this.#innerWidth = value;
	}

	/**
	 * Returns inner height.
	 *
	 * @returns Inner height.
	 */
	public get innerHeight(): number {
		// It seems like this value can be defined according to spec, but changing it has no effect on the actual viewport.
		if (this.#innerHeight === null) {
			return this.#browserFrame.page.viewport.height;
		}
		return this.#innerHeight;
	}

	/**
	 * Sets inner height.
	 *
	 * @param value Inner height.
	 */
	public set innerHeight(value: number) {
		this.#innerHeight = value;
	}

	/**
	 * Returns outer width.
	 *
	 * @returns Outer width.
	 */
	public get outerWidth(): number {
		// It seems like this value can be defined according to spec, but changing it has no effect on the actual viewport.
		if (this.#outerWidth === null) {
			return this.#browserFrame.page.viewport.width;
		}
		return this.#outerWidth;
	}

	/**
	 * Sets outer width.
	 *
	 * @param value Outer width.
	 */
	public set outerWidth(value: number) {
		this.#outerWidth = value;
	}

	/**
	 * Returns outer height.
	 *
	 * @returns Outer height.
	 */
	public get outerHeight(): number {
		if (this.#outerHeight === null) {
			return this.#browserFrame.page.viewport.height;
		}
		return this.#outerHeight;
	}

	/**
	 * Sets outer height.
	 *
	 * @param value Outer height.
	 */
	public set outerHeight(value: number) {
		this.#outerHeight = value;
	}

	/**
	 * Returns device pixel ratio.
	 *
	 * @returns Device pixel ratio.
	 */
	public get devicePixelRatio(): number {
		// It seems like this value can be defined according to spec, but changing it has no effect on the actual viewport.
		if (this.#devicePixelRatio === null) {
			return this.#browserFrame.page.viewport.devicePixelRatio;
		}
		return this.#devicePixelRatio;
	}

	/**
	 * Sets device pixel ratio.
	 *
	 * @param value Device pixel ratio.
	 */
	public set devicePixelRatio(value: number) {
		this.#devicePixelRatio = value;
	}

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @param element Element.
	 * @returns CSS style declaration.
	 */
	public getComputedStyle(element: IElement): CSSStyleDeclaration {
		element[PropertySymbol.computedStyle] =
			element[PropertySymbol.computedStyle] || new CSSStyleDeclaration(element, true);
		return element[PropertySymbol.computedStyle];
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
	): IBrowserWindow | ICrossOriginBrowserWindow | null {
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
		// When using a Window instance directly, the Window instance is the main frame and we will close the page and destroy the browser.
		// When using the Browser API we should only close the page when the Window instance is connected to the main frame (we should not close child frames such as iframes).
		if (this.#browserFrame.page?.mainFrame === this.#browserFrame) {
			this[PropertySymbol.destroy]();
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
		const settings = this.#browserFrame.page?.context?.browser?.settings;
		const useTryCatch =
			!settings ||
			!settings.disableErrorCapturing ||
			settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch;
		const id = TIMER.setTimeout(() => {
			if (useTryCatch) {
				WindowErrorUtility.captureError(this, () => callback(...args));
			} else {
				callback(...args);
			}
			this.#browserFrame[PropertySymbol.asyncTaskManager].endTimer(id);
		}, delay);
		this.#browserFrame[PropertySymbol.asyncTaskManager].startTimer(id);
		return id;
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		// We need to make sure that the ID is a Timeout object, otherwise Node.js might throw an error.
		// This is only necessary if we are in a Node.js environment.
		if (IS_NODE_JS_TIMEOUT_ENVIRONMENT && (!id || id.constructor.name !== 'Timeout')) {
			return;
		}
		TIMER.clearTimeout(id);
		this.#browserFrame[PropertySymbol.asyncTaskManager].endTimer(id);
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
		const settings = this.#browserFrame.page?.context?.browser?.settings;
		const useTryCatch =
			!settings ||
			!settings.disableErrorCapturing ||
			settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch;
		const id = TIMER.setInterval(() => {
			if (useTryCatch) {
				WindowErrorUtility.captureError(
					this,
					() => callback(...args),
					() => this.clearInterval(id)
				);
			} else {
				callback(...args);
			}
		}, delay);
		this.#browserFrame[PropertySymbol.asyncTaskManager].startTimer(id);
		return id;
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		// We need to make sure that the ID is a Timeout object, otherwise Node.js might throw an error.
		// This is only necessary if we are in a Node.js environment.
		if (IS_NODE_JS_TIMEOUT_ENVIRONMENT && (!id || id.constructor.name !== 'Timeout')) {
			return;
		}
		TIMER.clearInterval(id);
		this.#browserFrame[PropertySymbol.asyncTaskManager].endTimer(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param callback Callback.
	 * @returns ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Immediate {
		const settings = this.#browserFrame.page?.context?.browser?.settings;
		const useTryCatch =
			!settings ||
			!settings.disableErrorCapturing ||
			settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch;
		const id = TIMER.setImmediate(() => {
			if (useTryCatch) {
				WindowErrorUtility.captureError(this, () => callback(this.performance.now()));
			} else {
				callback(this.performance.now());
			}
			this.#browserFrame[PropertySymbol.asyncTaskManager].endImmediate(id);
		});
		this.#browserFrame[PropertySymbol.asyncTaskManager].startImmediate(id);
		return id;
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param id ID.
	 */
	public cancelAnimationFrame(id: NodeJS.Immediate): void {
		// We need to make sure that the ID is an Immediate object, otherwise Node.js might throw an error.
		// This is only necessary if we are in a Node.js environment.
		if (IS_NODE_JS_TIMEOUT_ENVIRONMENT && (!id || id.constructor.name !== 'Immediate')) {
			return;
		}
		TIMER.clearImmediate(id);
		this.#browserFrame[PropertySymbol.asyncTaskManager].endImmediate(id);
	}

	/**
	 * Queues a microtask to be executed at a safe time prior to control returning to the browser's event loop.
	 *
	 * @param callback Function to be executed.
	 */
	public queueMicrotask(callback: Function): void {
		let isAborted = false;
		const taskId = this.#browserFrame[PropertySymbol.asyncTaskManager].startTask(
			() => (isAborted = true)
		);
		const settings = this.#browserFrame.page?.context?.browser?.settings;
		const useTryCatch =
			!settings ||
			!settings.disableErrorCapturing ||
			settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch;
		TIMER.queueMicrotask(() => {
			if (!isAborted) {
				if (useTryCatch) {
					WindowErrorUtility.captureError(this, <() => unknown>callback);
				} else {
					callback();
				}
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTask(taskId);
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
			browserFrame: this.#browserFrame,
			window: this,
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
	 * Resizes the window.
	 *
	 * @param width Width.
	 * @param height Height.
	 */
	public resizeTo(width: number, height: number): void {
		if (!width || !height) {
			throw new DOMException(
				`Failed to execute 'resizeTo' on 'Window': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		// We can only resize the window if it is a popup.
		if (this.#browserFrame[PropertySymbol.popup]) {
			this.#browserFrame.page.setViewport({ width, height });
		}
	}

	/**
	 * Resizes the current window by a specified amount.
	 *
	 * @param width Width.
	 * @param height Height.
	 */
	public resizeBy(width: number, height: number): void {
		if (!width || !height) {
			throw new DOMException(
				`Failed to execute 'resizeBy' on 'Window': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		// We can only resize the window if it is a popup.
		if (this.#browserFrame[PropertySymbol.popup]) {
			const viewport = this.#browserFrame.page.viewport;
			this.#browserFrame.page.setViewport({
				width: viewport.width + width,
				height: viewport.height + height
			});
		}
	}

	/**
	 * Setup of VM context.
	 */
	protected [PropertySymbol.setupVMContext](): void {
		if (!VM.isContext(this)) {
			VM.createContext(this);

			// Sets global properties from the VM to the Window object.
			// Otherwise "this.Array" will be undefined for example.
			VMGlobalPropertyScript.runInContext(this);
		}
	}

	/**
	 * Destroys the window.
	 */
	public [PropertySymbol.destroy](): void {
		if (!this.Audio[PropertySymbol.ownerDocument]) {
			return;
		}

		(<boolean>this.closed) = true;
		this.Audio[PropertySymbol.ownerDocument] = null;
		this.Image[PropertySymbol.ownerDocument] = null;
		this.DocumentFragment[PropertySymbol.ownerDocument] = null;

		const mutationObservers = this[PropertySymbol.mutationObservers];

		for (const mutationObserver of mutationObservers) {
			mutationObserver.disconnect();
		}

		// Disconnects nodes from the document, so that they can be garbage collected.
		for (const node of this.document[PropertySymbol.childNodes].slice()) {
			// Makes sure that something won't be triggered by the disconnect.
			if (node.disconnectedCallback) {
				delete node.disconnectedCallback;
			}
			this.document.removeChild(node);
		}

		this.document[PropertySymbol.activeElement] = null;
		this.document[PropertySymbol.nextActiveElement] = null;
		this.document[PropertySymbol.currentScript] = null;
		this.document[PropertySymbol.selection] = null;

		WindowBrowserSettingsReader.removeSettings(this);
	}
}
