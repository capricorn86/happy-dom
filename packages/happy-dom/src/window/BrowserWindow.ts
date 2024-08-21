import { Buffer } from 'buffer';
import { webcrypto } from 'crypto';
import Stream from 'stream';
import { ReadableStream } from 'stream/web';
import { URLSearchParams } from 'url';
import VM from 'vm';
import ClassMethodBinder from '../ClassMethodBinder.js';
import * as PropertySymbol from '../PropertySymbol.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import Base64 from '../base64/Base64.js';
import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import Clipboard from '../clipboard/Clipboard.js';
import ClipboardItem from '../clipboard/ClipboardItem.js';
import CSS from '../css/CSS.js';
import CSSRule from '../css/CSSRule.js';
import CSSStyleSheet from '../css/CSSStyleSheet.js';
import CSSUnitValue from '../css/CSSUnitValue.js';
import CSSStyleDeclaration from '../css/declaration/CSSStyleDeclaration.js';
import CSSContainerRule from '../css/rules/CSSContainerRule.js';
import CSSFontFaceRule from '../css/rules/CSSFontFaceRule.js';
import CSSKeyframeRule from '../css/rules/CSSKeyframeRule.js';
import CSSKeyframesRule from '../css/rules/CSSKeyframesRule.js';
import CSSMediaRule from '../css/rules/CSSMediaRule.js';
import CSSStyleRule from '../css/rules/CSSStyleRule.js';
import CSSSupportsRule from '../css/rules/CSSSupportsRule.js';
import CustomElementRegistry from '../custom-element/CustomElementRegistry.js';
import DOMParserImplementation from '../dom-parser/DOMParser.js';
import DataTransfer from '../event/DataTransfer.js';
import DataTransferItem from '../event/DataTransferItem.js';
import DataTransferItemList from '../event/DataTransferItemList.js';
import Event from '../event/Event.js';
import EventTarget from '../event/EventTarget.js';
import MessagePort from '../event/MessagePort.js';
import Touch from '../event/Touch.js';
import UIEvent from '../event/UIEvent.js';
import AnimationEvent from '../event/events/AnimationEvent.js';
import ClipboardEvent from '../event/events/ClipboardEvent.js';
import CustomEvent from '../event/events/CustomEvent.js';
import ErrorEvent from '../event/events/ErrorEvent.js';
import FocusEvent from '../event/events/FocusEvent.js';
import HashChangeEvent from '../event/events/HashChangeEvent.js';
import InputEvent from '../event/events/InputEvent.js';
import KeyboardEvent from '../event/events/KeyboardEvent.js';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent.js';
import MessageEvent from '../event/events/MessageEvent.js';
import MouseEvent from '../event/events/MouseEvent.js';
import PointerEvent from '../event/events/PointerEvent.js';
import ProgressEvent from '../event/events/ProgressEvent.js';
import StorageEvent from '../event/events/StorageEvent.js';
import SubmitEvent from '../event/events/SubmitEvent.js';
import TouchEvent from '../event/events/TouchEvent.js';
import WheelEvent from '../event/events/WheelEvent.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import AbortController from '../fetch/AbortController.js';
import AbortSignal from '../fetch/AbortSignal.js';
import Fetch from '../fetch/Fetch.js';
import Headers from '../fetch/Headers.js';
import RequestImplementation from '../fetch/Request.js';
import { default as Response, default as ResponseImplementation } from '../fetch/Response.js';
import IRequestInfo from '../fetch/types/IRequestInfo.js';
import IRequestInit from '../fetch/types/IRequestInit.js';
import IResponseBody from '../fetch/types/IResponseBody.js';
import IResponseInit from '../fetch/types/IResponseInit.js';
import Blob from '../file/Blob.js';
import File from '../file/File.js';
import FileReaderImplementation from '../file/FileReader.js';
import FormData from '../form-data/FormData.js';
import History from '../history/History.js';
import IntersectionObserver from '../intersection-observer/IntersectionObserver.js';
import IntersectionObserverEntry from '../intersection-observer/IntersectionObserverEntry.js';
import Location from '../location/Location.js';
import MediaQueryList from '../match-media/MediaQueryList.js';
import MutationObserver from '../mutation-observer/MutationObserver.js';
import MutationRecord from '../mutation-observer/MutationRecord.js';
import MimeType from '../navigator/MimeType.js';
import MimeTypeArray from '../navigator/MimeTypeArray.js';
import Navigator from '../navigator/Navigator.js';
import Plugin from '../navigator/Plugin.js';
import PluginArray from '../navigator/PluginArray.js';
import Attr from '../nodes/attr/Attr.js';
import CharacterData from '../nodes/character-data/CharacterData.js';
import CommentImplementation from '../nodes/comment/Comment.js';
import DocumentFragmentImplementation from '../nodes/document-fragment/DocumentFragment.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import DocumentImplementation from '../nodes/document/Document.js';
import DocumentReadyStateEnum from '../nodes/document/DocumentReadyStateEnum.js';
import DocumentReadyStateManager from '../nodes/document/DocumentReadyStateManager.js';
import DOMRect from '../nodes/element/DOMRect.js';
import DOMRectReadOnly from '../nodes/element/DOMRectReadOnly.js';
import Element from '../nodes/element/Element.js';
import HTMLCollection from '../nodes/element/HTMLCollection.js';
import NamedNodeMap from '../nodes/element/NamedNodeMap.js';
import HTMLAnchorElement from '../nodes/html-anchor-element/HTMLAnchorElement.js';
import HTMLAreaElement from '../nodes/html-area-element/HTMLAreaElement.js';
import AudioImplementation from '../nodes/html-audio-element/Audio.js';
import HTMLAudioElement from '../nodes/html-audio-element/HTMLAudioElement.js';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement.js';
import HTMLBodyElement from '../nodes/html-body-element/HTMLBodyElement.js';
import HTMLBRElement from '../nodes/html-br-element/HTMLBRElement.js';
import HTMLButtonElement from '../nodes/html-button-element/HTMLButtonElement.js';
import HTMLCanvasElement from '../nodes/html-canvas-element/HTMLCanvasElement.js';
import HTMLDListElement from '../nodes/html-d-list-element/HTMLDListElement.js';
import HTMLDataElement from '../nodes/html-data-element/HTMLDataElement.js';
import HTMLDataListElement from '../nodes/html-data-list-element/HTMLDataListElement.js';
import HTMLDetailsElement from '../nodes/html-details-element/HTMLDetailsElement.js';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement.js';
import HTMLDivElement from '../nodes/html-div-element/HTMLDivElement.js';
import HTMLDocumentImplementation from '../nodes/html-document/HTMLDocument.js';
import HTMLElement from '../nodes/html-element/HTMLElement.js';
import HTMLEmbedElement from '../nodes/html-embed-element/HTMLEmbedElement.js';
import HTMLFieldSetElement from '../nodes/html-field-set-element/HTMLFieldSetElement.js';
import HTMLFormControlsCollection from '../nodes/html-form-element/HTMLFormControlsCollection.js';
import HTMLFormElementImplementation from '../nodes/html-form-element/HTMLFormElement.js';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList.js';
import HTMLHeadElement from '../nodes/html-head-element/HTMLHeadElement.js';
import HTMLHeadingElement from '../nodes/html-heading-element/HTMLHeadingElement.js';
import HTMLHRElement from '../nodes/html-hr-element/HTMLHRElement.js';
import HTMLHtmlElement from '../nodes/html-html-element/HTMLHtmlElement.js';
import HTMLIFrameElementImplementation from '../nodes/html-iframe-element/HTMLIFrameElement.js';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import ImageImplementation from '../nodes/html-image-element/Image.js';
import FileList from '../nodes/html-input-element/FileList.js';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement.js';
import HTMLLabelElement from '../nodes/html-label-element/HTMLLabelElement.js';
import HTMLLegendElement from '../nodes/html-legend-element/HTMLLegendElement.js';
import HTMLLIElement from '../nodes/html-li-element/HTMLLIElement.js';
import HTMLLinkElementImplementation from '../nodes/html-link-element/HTMLLinkElement.js';
import HTMLMapElement from '../nodes/html-map-element/HTMLMapElement.js';
import HTMLMediaElement from '../nodes/html-media-element/HTMLMediaElement.js';
import MediaStream from '../nodes/html-media-element/MediaStream.js';
import MediaStreamTrack from '../nodes/html-media-element/MediaStreamTrack.js';
import RemotePlayback from '../nodes/html-media-element/RemotePlayback.js';
import TextTrack from '../nodes/html-media-element/TextTrack.js';
import TextTrackCue from '../nodes/html-media-element/TextTrackCue.js';
import TextTrackCueList from '../nodes/html-media-element/TextTrackCueList.js';
import TextTrackList from '../nodes/html-media-element/TextTrackList.js';
import TimeRanges from '../nodes/html-media-element/TimeRanges.js';
import VTTCueImplementation from '../nodes/html-media-element/VTTCue.js';
import HTMLMenuElement from '../nodes/html-menu-element/HTMLMenuElement.js';
import HTMLMetaElement from '../nodes/html-meta-element/HTMLMetaElement.js';
import HTMLMeterElement from '../nodes/html-meter-element/HTMLMeterElement.js';
import HTMLModElement from '../nodes/html-mod-element/HTMLModElement.js';
import HTMLOListElement from '../nodes/html-o-list-element/HTMLOListElement.js';
import HTMLObjectElement from '../nodes/html-object-element/HTMLObjectElement.js';
import HTMLOptGroupElement from '../nodes/html-opt-group-element/HTMLOptGroupElement.js';
import HTMLOptionElement from '../nodes/html-option-element/HTMLOptionElement.js';
import HTMLOutputElement from '../nodes/html-output-element/HTMLOutputElement.js';
import HTMLParagraphElement from '../nodes/html-paragraph-element/HTMLParagraphElement.js';
import HTMLParamElement from '../nodes/html-param-element/HTMLParamElement.js';
import HTMLPictureElement from '../nodes/html-picture-element/HTMLPictureElement.js';
import HTMLPreElement from '../nodes/html-pre-element/HTMLPreElement.js';
import HTMLProgressElement from '../nodes/html-progress-element/HTMLProgressElement.js';
import HTMLQuoteElement from '../nodes/html-quote-element/HTMLQuoteElement.js';
import HTMLScriptElementImplementation from '../nodes/html-script-element/HTMLScriptElement.js';
import HTMLSelectElement from '../nodes/html-select-element/HTMLSelectElement.js';
import HTMLSlotElement from '../nodes/html-slot-element/HTMLSlotElement.js';
import HTMLSourceElement from '../nodes/html-source-element/HTMLSourceElement.js';
import HTMLSpanElement from '../nodes/html-span-element/HTMLSpanElement.js';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement.js';
import HTMLTableCaptionElement from '../nodes/html-table-caption-element/HTMLTableCaptionElement.js';
import HTMLTableCellElement from '../nodes/html-table-cell-element/HTMLTableCellElement.js';
import HTMLTableColElement from '../nodes/html-table-col-element/HTMLTableColElement.js';
import HTMLTableElement from '../nodes/html-table-element/HTMLTableElement.js';
import HTMLTableRowElement from '../nodes/html-table-row-element/HTMLTableRowElement.js';
import HTMLTableSectionElement from '../nodes/html-table-section-element/HTMLTableSectionElement.js';
import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement.js';
import HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement.js';
import HTMLTimeElement from '../nodes/html-time-element/HTMLTimeElement.js';
import HTMLTitleElement from '../nodes/html-title-element/HTMLTitleElement.js';
import HTMLTrackElement from '../nodes/html-track-element/HTMLTrackElement.js';
import HTMLUListElement from '../nodes/html-u-list-element/HTMLUListElement.js';
import HTMLUnknownElement from '../nodes/html-unknown-element/HTMLUnknownElement.js';
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import Node from '../nodes/node/Node.js';
import NodeList from '../nodes/node/NodeList.js';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction.js';
import ShadowRoot from '../nodes/shadow-root/ShadowRoot.js';
import SVGDocumentImplementation from '../nodes/svg-document/SVGDocument.js';
import SVGElement from '../nodes/svg-element/SVGElement.js';
import SVGGraphicsElement from '../nodes/svg-element/SVGGraphicsElement.js';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement.js';
import TextImplementation from '../nodes/text/Text.js';
import XMLDocumentImplementation from '../nodes/xml-document/XMLDocument.js';
import PermissionStatus from '../permissions/PermissionStatus.js';
import Permissions from '../permissions/Permissions.js';
import RangeImplementation from '../range/Range.js';
import ResizeObserver from '../resize-observer/ResizeObserver.js';
import Screen from '../screen/Screen.js';
import Selection from '../selection/Selection.js';
import Storage from '../storage/Storage.js';
import NodeFilter from '../tree-walker/NodeFilter.js';
import NodeIterator from '../tree-walker/NodeIterator.js';
import TreeWalker from '../tree-walker/TreeWalker.js';
import URL from '../url/URL.js';
import ValidityState from '../validity-state/ValidityState.js';
import XMLHttpRequestImplementation from '../xml-http-request/XMLHttpRequest.js';
import XMLHttpRequestEventTarget from '../xml-http-request/XMLHttpRequestEventTarget.js';
import XMLHttpRequestUpload from '../xml-http-request/XMLHttpRequestUpload.js';
import XMLSerializer from '../xml-serializer/XMLSerializer.js';
import CrossOriginBrowserWindow from './CrossOriginBrowserWindow.js';
import INodeJSGlobal from './INodeJSGlobal.js';
import VMGlobalPropertyScript from './VMGlobalPropertyScript.js';
import WindowBrowserSettingsReader from './WindowBrowserSettingsReader.js';
import WindowErrorUtility from './WindowErrorUtility.js';
import WindowPageOpenUtility from './WindowPageOpenUtility.js';

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
 * Zero Timeout.
 */
class Timeout {
	public callback: () => void;
	/**
	 * Constructor.
	 * @param callback Callback.
	 */
	constructor(callback: () => void) {
		this.callback = callback;
	}
}

/**
 * Browser window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class BrowserWindow extends EventTarget implements INodeJSGlobal {
	// Nodes
	public readonly Node: typeof Node = Node;
	public readonly Attr: typeof Attr = Attr;
	public readonly SVGSVGElement: typeof SVGSVGElement = SVGSVGElement;
	public readonly SVGElement: typeof SVGElement = SVGElement;
	public readonly SVGGraphicsElement: typeof SVGGraphicsElement = SVGGraphicsElement;
	public readonly ShadowRoot: typeof ShadowRoot = ShadowRoot;
	public readonly ProcessingInstruction: typeof ProcessingInstruction = ProcessingInstruction;
	public readonly Element: typeof Element = Element;
	public readonly CharacterData: typeof CharacterData = CharacterData;
	public readonly DocumentType: typeof DocumentType = DocumentType;
	public readonly Document: new () => DocumentImplementation;
	public readonly HTMLDocument: new () => HTMLDocumentImplementation;
	public readonly XMLDocument: new () => XMLDocumentImplementation;
	public readonly SVGDocument: new () => SVGDocumentImplementation;
	public readonly Text: typeof TextImplementation;
	public readonly Comment: typeof CommentImplementation;
	public readonly Image: typeof ImageImplementation;
	public readonly DocumentFragment: typeof DocumentFragmentImplementation;
	public readonly Audio: typeof AudioImplementation;

	// Element classes
	public readonly HTMLAnchorElement: typeof HTMLAnchorElement = HTMLAnchorElement;
	public readonly HTMLButtonElement: typeof HTMLButtonElement = HTMLButtonElement;
	public readonly HTMLOptGroupElement: typeof HTMLOptGroupElement = HTMLOptGroupElement;
	public readonly HTMLOptionElement: typeof HTMLOptionElement = HTMLOptionElement;
	public readonly HTMLElement: typeof HTMLElement = HTMLElement;
	public readonly HTMLUnknownElement: typeof HTMLUnknownElement = HTMLUnknownElement;
	public readonly HTMLTemplateElement: typeof HTMLTemplateElement = HTMLTemplateElement;
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
	public readonly HTMLFormElement: typeof HTMLFormElementImplementation;
	public readonly HTMLUListElement: typeof HTMLUListElement = HTMLUListElement;
	public readonly HTMLTrackElement: typeof HTMLTrackElement = HTMLTrackElement;
	public readonly HTMLTableRowElement: typeof HTMLTableRowElement = HTMLTableRowElement;
	public readonly HTMLTitleElement: typeof HTMLTitleElement = HTMLTitleElement;
	public readonly HTMLTimeElement: typeof HTMLTimeElement = HTMLTimeElement;
	public readonly HTMLTableSectionElement: typeof HTMLTableSectionElement = HTMLTableSectionElement;
	public readonly HTMLTableCellElement: typeof HTMLTableCellElement = HTMLTableCellElement;
	public readonly HTMLTableElement: typeof HTMLTableElement = HTMLTableElement;
	public readonly HTMLSpanElement: typeof HTMLSpanElement = HTMLSpanElement;
	public readonly HTMLSourceElement: typeof HTMLSourceElement = HTMLSourceElement;
	public readonly HTMLQuoteElement: typeof HTMLQuoteElement = HTMLQuoteElement;
	public readonly HTMLProgressElement: typeof HTMLProgressElement = HTMLProgressElement;
	public readonly HTMLPreElement: typeof HTMLPreElement = HTMLPreElement;
	public readonly HTMLPictureElement: typeof HTMLPictureElement = HTMLPictureElement;
	public readonly HTMLParamElement: typeof HTMLParamElement = HTMLParamElement;
	public readonly HTMLParagraphElement: typeof HTMLParagraphElement = HTMLParagraphElement;
	public readonly HTMLOutputElement: typeof HTMLOutputElement = HTMLOutputElement;
	public readonly HTMLOListElement: typeof HTMLOListElement = HTMLOListElement;
	public readonly HTMLObjectElement: typeof HTMLObjectElement = HTMLObjectElement;
	public readonly HTMLMeterElement: typeof HTMLMeterElement = HTMLMeterElement;
	public readonly HTMLMenuElement: typeof HTMLMenuElement = HTMLMenuElement;
	public readonly HTMLMapElement: typeof HTMLMapElement = HTMLMapElement;
	public readonly HTMLLIElement: typeof HTMLLIElement = HTMLLIElement;
	public readonly HTMLLegendElement: typeof HTMLLegendElement = HTMLLegendElement;
	public readonly HTMLModElement: typeof HTMLModElement = HTMLModElement;
	public readonly HTMLHtmlElement: typeof HTMLHtmlElement = HTMLHtmlElement;
	public readonly HTMLHRElement: typeof HTMLHRElement = HTMLHRElement;
	public readonly HTMLHeadElement: typeof HTMLHeadElement = HTMLHeadElement;
	public readonly HTMLHeadingElement: typeof HTMLHeadingElement = HTMLHeadingElement;
	public readonly HTMLFieldSetElement: typeof HTMLFieldSetElement = HTMLFieldSetElement;
	public readonly HTMLEmbedElement: typeof HTMLEmbedElement = HTMLEmbedElement;
	public readonly HTMLDListElement: typeof HTMLDListElement = HTMLDListElement;
	public readonly HTMLDivElement: typeof HTMLDivElement = HTMLDivElement;
	public readonly HTMLDetailsElement: typeof HTMLDetailsElement = HTMLDetailsElement;
	public readonly HTMLDataListElement: typeof HTMLDataListElement = HTMLDataListElement;
	public readonly HTMLDataElement: typeof HTMLDataElement = HTMLDataElement;
	public readonly HTMLTableColElement: typeof HTMLTableColElement = HTMLTableColElement;
	public readonly HTMLTableCaptionElement: typeof HTMLTableCaptionElement = HTMLTableCaptionElement;
	public readonly HTMLCanvasElement: typeof HTMLCanvasElement = HTMLCanvasElement;
	public readonly HTMLBRElement: typeof HTMLBRElement = HTMLBRElement;
	public readonly HTMLBodyElement: typeof HTMLBodyElement = HTMLBodyElement;
	public readonly HTMLAreaElement: typeof HTMLAreaElement = HTMLAreaElement;

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
	public readonly HashChangeEvent = HashChangeEvent;
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
	public readonly IntersectionObserver = IntersectionObserver;
	public readonly IntersectionObserverEntry = IntersectionObserverEntry;
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
	public readonly DOMRectReadOnly = DOMRectReadOnly;
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
	public readonly VTTCue: new (
		startTime: number,
		endTime: number,
		text: string
	) => VTTCueImplementation;
	public readonly TextTrack = TextTrack;
	public readonly TextTrackCue = TextTrackCue;
	public readonly TextTrackCueList = TextTrackCueList;
	public readonly FileReader: new () => FileReaderImplementation;
	public readonly TimeRanges = TimeRanges;
	public readonly RemotePlayback = RemotePlayback;
	public readonly MediaStream = MediaStream;
	public readonly MediaStreamTrack = MediaStreamTrack;
	public readonly TextTrackList = TextTrackList;

	// Events
	public onload: ((event: Event) => void) | null = null;
	public onerror: ((event: ErrorEvent) => void) | null = null;

	// Public properties.
	public readonly document: DocumentImplementation;
	public readonly customElements: CustomElementRegistry;
	public readonly window: BrowserWindow = this;
	public readonly globalThis: BrowserWindow = this;
	public readonly performance: typeof performance = performance;
	public readonly screenLeft: number = 0;
	public readonly screenTop: number = 0;
	public readonly screenX: number = 0;
	public readonly screenY: number = 0;
	public readonly crypto: typeof webcrypto = webcrypto;
	public readonly closed = false;
	public console: Console;
	public name = '';

	// Node.js Globals
	public declare Array: typeof Array;
	public declare ArrayBuffer: typeof ArrayBuffer;
	public declare Boolean: typeof Boolean;
	public Buffer: typeof Buffer = Buffer;
	public declare DataView: typeof DataView;
	public declare Date: typeof Date;
	public declare Error: typeof Error;
	public declare EvalError: typeof EvalError;
	public declare Float32Array: typeof Float32Array;
	public declare Float64Array: typeof Float64Array;
	public declare Function: typeof Function;
	public declare Infinity: typeof Infinity;
	public declare Int16Array: typeof Int16Array;
	public declare Int32Array: typeof Int32Array;
	public declare Int8Array: typeof Int8Array;
	public declare Intl: typeof Intl;
	public declare JSON: typeof JSON;
	public declare Map: MapConstructor;
	public declare Math: typeof Math;
	public declare NaN: typeof NaN;
	public declare Number: typeof Number;
	public declare Object: typeof Object;
	public declare Promise: typeof Promise;
	public declare RangeError: typeof RangeError;
	public declare ReferenceError: typeof ReferenceError;
	public declare RegExp: typeof RegExp;
	public declare Set: SetConstructor;
	public declare String: typeof String;
	public declare Symbol: Function;
	public declare SyntaxError: typeof SyntaxError;
	public declare TypeError: typeof TypeError;
	public declare URIError: typeof URIError;
	public declare Uint16Array: typeof Uint16Array;
	public declare Uint32Array: typeof Uint32Array;
	public declare Uint8Array: typeof Uint8Array;
	public declare Uint8ClampedArray: typeof Uint8ClampedArray;
	public declare WeakMap: WeakMapConstructor;
	public declare WeakSet: WeakSetConstructor;
	public declare decodeURI: typeof decodeURI;
	public declare decodeURIComponent: typeof decodeURIComponent;
	public declare encodeURI: typeof encodeURI;
	public declare encodeURIComponent: typeof encodeURIComponent;
	public declare eval: typeof eval;
	/**
	 * @deprecated
	 */
	public declare escape: (str: string) => string;
	public declare global: typeof globalThis;
	public declare isFinite: typeof isFinite;
	public declare isNaN: typeof isNaN;
	public declare parseFloat: typeof parseFloat;
	public declare parseInt: typeof parseInt;
	public declare undefined: typeof undefined;
	/**
	 * @deprecated
	 */
	public declare unescape: (str: string) => string;
	public declare gc: () => void;
	public declare v8debug?: unknown;

	// Public internal properties

	// Used for tracking capture event listeners to improve performance when they are not used.
	// See EventTarget class.
	public [PropertySymbol.captureEventListenerCount]: { [eventType: string]: number } = {};
	public [PropertySymbol.mutationObservers]: MutationObserver[] = [];
	public readonly [PropertySymbol.readyStateManager] = new DocumentReadyStateManager(this);
	public [PropertySymbol.asyncTaskManager]: AsyncTaskManager | null = null;
	public [PropertySymbol.location]: Location;
	public [PropertySymbol.history]: History;
	public [PropertySymbol.navigator]: Navigator;
	public [PropertySymbol.screen]: Screen;
	public [PropertySymbol.sessionStorage]: Storage;
	public [PropertySymbol.localStorage]: Storage;
	public [PropertySymbol.self]: BrowserWindow = this;
	public [PropertySymbol.top]: BrowserWindow = this;
	public [PropertySymbol.parent]: BrowserWindow = this;

	// Private properties
	#browserFrame: IBrowserFrame;
	#innerWidth: number | null = null;
	#innerHeight: number | null = null;
	#outerWidth: number | null = null;
	#outerHeight: number | null = null;
	#devicePixelRatio: number | null = null;
	#zeroDelayTimeout: { timeouts: Array<Timeout> | null } = { timeouts: null };

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 * @param [options] Options.
	 * @param [options.url] URL.
	 */
	constructor(browserFrame: IBrowserFrame, options?: { url?: string }) {
		super();

		const asyncTaskManager = browserFrame[PropertySymbol.asyncTaskManager];

		this.#browserFrame = browserFrame;

		this.customElements = new CustomElementRegistry(this);

		this[PropertySymbol.navigator] = new Navigator(this);
		this[PropertySymbol.screen] = new Screen();
		this[PropertySymbol.sessionStorage] = new Storage();
		this[PropertySymbol.localStorage] = new Storage();
		this[PropertySymbol.location] = new Location(this.#browserFrame, options?.url ?? 'about:blank');
		this[PropertySymbol.history] = new History(this.#browserFrame, this);
		this[PropertySymbol.asyncTaskManager] = asyncTaskManager;

		this.console = browserFrame.page.console;

		WindowBrowserSettingsReader.setSettings(this, this.#browserFrame.page.context.browser.settings);

		const window = this;

		this[PropertySymbol.setupVMContext]();

		// Class overrides
		// For classes that need to be bound to the correct context to be instantiable using the "new" keyword.

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
		class VTTCue extends VTTCueImplementation {
			constructor(startTime: number, endTime: number, text: string) {
				super(window, startTime, endTime, text);
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
		class HTMLFormElement extends HTMLFormElementImplementation {
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
		class Text extends TextImplementation {}
		class Comment extends CommentImplementation {}

		/* eslint-enable jsdoc/require-jsdoc */

		this.Response = Response;
		this.Request = Request;
		this.Image = Image;
		this.Text = Text;
		this.Comment = Comment;
		this.DocumentFragment = DocumentFragment;
		this.FileReader = FileReader;
		this.DOMParser = DOMParser;
		this.VTTCue = VTTCue;
		this.XMLHttpRequest = XMLHttpRequest;
		this.Range = Range;
		this.Audio = Audio;
		this.HTMLScriptElement = HTMLScriptElement;
		this.HTMLLinkElement = HTMLLinkElement;
		this.HTMLIFrameElement = HTMLIFrameElement;
		this.HTMLFormElement = HTMLFormElement;
		this.Document = Document;
		this.HTMLDocument = HTMLDocument;
		this.XMLDocument = XMLDocument;
		this.SVGDocument = SVGDocument;

		// Document
		this.document = new HTMLDocument();
		this.document[PropertySymbol.defaultView] = this;

		// Override owner document
		this.Audio[PropertySymbol.ownerDocument] = this.document;
		this.Image[PropertySymbol.ownerDocument] = this.document;
		this.DocumentFragment[PropertySymbol.ownerDocument] = this.document;
		this.Text[PropertySymbol.ownerDocument] = this.document;
		this.Comment[PropertySymbol.ownerDocument] = this.document;

		// Ready state manager
		this[PropertySymbol.readyStateManager].waitUntilComplete().then(() => {
			this.document[PropertySymbol.readyState] = DocumentReadyStateEnum.complete;
			this.document.dispatchEvent(new Event('readystatechange'));
			this.document.dispatchEvent(new Event('load', { bubbles: true }));
		});

		ClassMethodBinder.bindMethods(this, [EventTarget, BrowserWindow]);
	}

	/**
	 * Returns self.
	 *
	 * @returns Self.
	 */
	public get self(): BrowserWindow {
		return this[PropertySymbol.self];
	}

	/**
	 * Returns self.
	 *
	 * @param self Self.
	 */
	public set self(self: BrowserWindow | null) {
		this[PropertySymbol.self] = self;
	}

	/**
	 * Returns top.
	 *
	 * @returns Top.
	 */
	public get top(): BrowserWindow {
		return this[PropertySymbol.top];
	}

	/**
	 * Returns parent.
	 *
	 * @returns Parent.
	 */
	public get parent(): BrowserWindow {
		return this[PropertySymbol.parent];
	}

	/**
	 * Returns parent.
	 *
	 * @param parent Parent.
	 */
	public set parent(parent: BrowserWindow | null) {
		this[PropertySymbol.parent] = parent;
	}

	/**
	 * Returns location.
	 */
	public get location(): Location {
		return this[PropertySymbol.location];
	}

	/**
	 * Returns location.
	 *
	 * @param href Href.
	 */
	public set location(href: string) {
		this[PropertySymbol.location].href = href;
	}

	/**
	 * Returns history.
	 */
	public get history(): History {
		return this[PropertySymbol.history];
	}

	/**
	 * Returns navigator.
	 */
	public get navigator(): Navigator {
		return this[PropertySymbol.navigator];
	}

	/**
	 * Returns screen.
	 */
	public get screen(): Screen {
		return this[PropertySymbol.screen];
	}

	/**
	 * Returns session storage.
	 */
	public get sessionStorage(): Storage {
		return this[PropertySymbol.sessionStorage];
	}

	/**
	 * Returns local storage.
	 */
	public get localStorage(): Storage {
		return this[PropertySymbol.localStorage];
	}

	/**
	 * Returns opener.
	 *
	 * @returns Opener.
	 */
	public get opener(): BrowserWindow | CrossOriginBrowserWindow | null {
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
	public getComputedStyle(element: Element): CSSStyleDeclaration {
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
	): BrowserWindow | CrossOriginBrowserWindow | null {
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
		// We can group timeouts with a delay of 0 into one timeout to improve performance.
		// Grouping timeouts will also improve the performance of the async task manager.
		// It also makes the async task manager more stable as many timeouts may cause waitUntilComplete() to be resolved too early.
		if (!delay) {
			const zeroDelayTimeout = this.#zeroDelayTimeout;

			if (!zeroDelayTimeout.timeouts) {
				const settings = this.#browserFrame.page?.context?.browser?.settings;
				const useTryCatch =
					!settings ||
					(!settings.disableErrorCapturing &&
						settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch);

				const id = TIMER.setTimeout(() => {
					const timeouts = zeroDelayTimeout.timeouts;
					zeroDelayTimeout.timeouts = null;
					for (const timeout of timeouts) {
						if (useTryCatch) {
							WindowErrorUtility.captureError(this, () => timeout.callback());
						} else {
							timeout.callback();
						}
					}
					this.#browserFrame[PropertySymbol.asyncTaskManager].endTimer(id);
				});

				zeroDelayTimeout.timeouts = [];
				this.#browserFrame[PropertySymbol.asyncTaskManager].startTimer(id);
			}

			const timeout = new Timeout(() => callback(...args));

			zeroDelayTimeout.timeouts.push(timeout);

			return <NodeJS.Timeout>(<unknown>timeout);
		}

		const settings = this.#browserFrame.page?.context?.browser?.settings;
		const useTryCatch =
			!settings ||
			(!settings.disableErrorCapturing &&
				settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch);

		const id = TIMER.setTimeout(
			() => {
				if (useTryCatch) {
					WindowErrorUtility.captureError(this, () => callback(...args));
				} else {
					callback(...args);
				}
				this.#browserFrame[PropertySymbol.asyncTaskManager].endTimer(id);
			},
			settings?.timer.maxTimeout !== -1 && delay && delay > settings?.timer.maxTimeout
				? settings?.timer.maxTimeout
				: delay
		);
		this.#browserFrame[PropertySymbol.asyncTaskManager].startTimer(id);
		return id;
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		if (id && id instanceof Timeout) {
			const zeroDelayTimeout = this.#zeroDelayTimeout;
			if (!zeroDelayTimeout.timeouts) {
				return;
			}
			const index = zeroDelayTimeout.timeouts.indexOf(<Timeout>(<unknown>id));
			if (index !== -1) {
				zeroDelayTimeout.timeouts.splice(index, 1);
			}
			return;
		}
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
			(!settings.disableErrorCapturing &&
				settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch);
		let iterations = 0;
		const id = TIMER.setInterval(
			() => {
				if (useTryCatch) {
					WindowErrorUtility.captureError(
						this,
						() => callback(...args),
						() => this.clearInterval(id)
					);
				} else {
					callback(...args);
				}
				if (settings?.timer.maxIntervalIterations !== -1) {
					if (iterations >= settings?.timer.maxIntervalIterations) {
						this.clearInterval(id);
					}
					iterations++;
				}
			},
			settings?.timer.maxIntervalTime !== -1 && delay && delay > settings?.timer.maxIntervalTime
				? settings?.timer.maxIntervalTime
				: delay
		);
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
			(!settings.disableErrorCapturing &&
				settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch);
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
			(!settings.disableErrorCapturing &&
				settings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch);
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
	public async fetch(url: IRequestInfo, init?: IRequestInit): Promise<Response> {
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
		if (<boolean>this.closed) {
			return;
		}

		(<boolean>this.closed) = true;

		const mutationObservers = this[PropertySymbol.mutationObservers];

		for (const mutationObserver of mutationObservers) {
			mutationObserver.disconnect();
		}

		this[PropertySymbol.mutationObservers] = [];
		this[PropertySymbol.asyncTaskManager] = null;
		this[PropertySymbol.mutationObservers] = [];

		this.Audio[PropertySymbol.ownerDocument] = null;
		this.Image[PropertySymbol.ownerDocument] = null;
		this.DocumentFragment[PropertySymbol.ownerDocument] = null;
		this.Text[PropertySymbol.ownerDocument] = null;
		this.Comment[PropertySymbol.ownerDocument] = null;

		// Disconnects nodes from the document, so that they can be garbage collected.
		const childNodes = this.document[PropertySymbol.nodeArray];

		while (childNodes.length > 0) {
			// Makes sure that something won't be triggered by the disconnect.
			if (childNodes[0].disconnectedCallback) {
				delete childNodes[0].disconnectedCallback;
			}
			this.document.removeChild(childNodes[0]);
		}

		if (this.customElements[PropertySymbol.destroy]) {
			this.customElements[PropertySymbol.destroy]();
		}

		if (this.history[PropertySymbol.destroy]) {
			this.history[PropertySymbol.destroy]();
		}

		this.document[PropertySymbol.activeElement] = null;
		this.document[PropertySymbol.nextActiveElement] = null;
		this.document[PropertySymbol.currentScript] = null;
		this.document[PropertySymbol.selection] = null;

		WindowBrowserSettingsReader.removeSettings(this);
	}
}
