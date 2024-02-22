import CustomElementRegistry from '../custom-element/CustomElementRegistry.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Document from '../nodes/document/Document.js';
import IDocument from '../nodes/document/IDocument.js';
import HTMLDocument from '../nodes/html-document/HTMLDocument.js';
import XMLDocument from '../nodes/xml-document/XMLDocument.js';
import SVGDocument from '../nodes/svg-document/SVGDocument.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import Node from '../nodes/node/Node.js';
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
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement.js';
import SVGElement from '../nodes/svg-element/SVGElement.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement.js';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import Image from '../nodes/html-image-element/Image.js';
import Audio from '../nodes/html-audio-element/Audio.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import CharacterData from '../nodes/character-data/CharacterData.js';
import NodeIterator from '../tree-walker/NodeIterator.js';
import TreeWalker from '../tree-walker/TreeWalker.js';
import Event from '../event/Event.js';
import CustomEvent from '../event/events/CustomEvent.js';
import AnimationEvent from '../event/events/AnimationEvent.js';
import KeyboardEvent from '../event/events/KeyboardEvent.js';
import ProgressEvent from '../event/events/ProgressEvent.js';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent.js';
import TouchEvent from '../event/events/TouchEvent.js';
import Touch from '../event/Touch.js';
import EventTarget from '../event/EventTarget.js';
import { URLSearchParams } from 'url';
import URL from '../url/URL.js';
import Location from '../url/Location.js';
import MutationObserver from '../mutation-observer/MutationObserver.js';
import MutationRecord from '../mutation-observer/MutationRecord.js';
import DOMParser from '../dom-parser/DOMParser.js';
import XMLSerializer from '../xml-serializer/XMLSerializer.js';
import ResizeObserver from '../resize-observer/ResizeObserver.js';
import Blob from '../file/Blob.js';
import File from '../file/File.js';
import DOMException from '../exception/DOMException.js';
import FileReader from '../file/FileReader.js';
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
import PointerEvent from '../event/events/PointerEvent.js';
import MouseEvent from '../event/events/MouseEvent.js';
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
import MessageEvent from '../event/events/MessageEvent.js';
import MessagePort from '../event/MessagePort.js';
import Screen from '../screen/Screen.js';
import Storage from '../storage/Storage.js';
import NodeFilter from '../tree-walker/NodeFilter.js';
import HTMLCollection from '../nodes/element/HTMLCollection.js';
import HTMLFormControlsCollection from '../nodes/html-form-element/HTMLFormControlsCollection.js';
import NodeList from '../nodes/node/NodeList.js';
import Selection from '../selection/Selection.js';
import IEventTarget from '../event/IEventTarget.js';
import Navigator from '../navigator/Navigator.js';
import MimeType from '../navigator/MimeType.js';
import MimeTypeArray from '../navigator/MimeTypeArray.js';
import Plugin from '../navigator/Plugin.js';
import PluginArray from '../navigator/PluginArray.js';
import IRequestInit from '../fetch/types/IRequestInit.js';
import IResponse from '../fetch/types/IResponse.js';
import Range from '../range/Range.js';
import MediaQueryList from '../match-media/MediaQueryList.js';
import XMLHttpRequest from '../xml-http-request/XMLHttpRequest.js';
import XMLHttpRequestUpload from '../xml-http-request/XMLHttpRequestUpload.js';
import XMLHttpRequestEventTarget from '../xml-http-request/XMLHttpRequestEventTarget.js';
import DOMRect from '../nodes/element/DOMRect.js';
import Attr from '../nodes/attr/Attr.js';
import NamedNodeMap from '../named-node-map/NamedNodeMap.js';
import IElement from '../nodes/element/IElement.js';
import SVGGraphicsElement from '../nodes/svg-element/SVGGraphicsElement.js';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction.js';
import RequestInfo from '../fetch/types/IRequestInfo.js';
import FileList from '../nodes/html-input-element/FileList.js';
import Stream from 'stream';
import { ReadableStream } from 'stream/web';
import { webcrypto } from 'crypto';
import FormData from '../form-data/FormData.js';
import AbortController from '../fetch/AbortController.js';
import AbortSignal from '../fetch/AbortSignal.js';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList.js';
import ValidityState from '../validity-state/ValidityState.js';
import INodeJSGlobal from './INodeJSGlobal.js';
import ICrossOriginBrowserWindow from './ICrossOriginBrowserWindow.js';
import Permissions from '../permissions/Permissions.js';
import PermissionStatus from '../permissions/PermissionStatus.js';
import Clipboard from '../clipboard/Clipboard.js';
import ClipboardItem from '../clipboard/ClipboardItem.js';
import ClipboardEvent from '../event/events/ClipboardEvent.js';
import Headers from '../fetch/Headers.js';
import Request from '../fetch/Request.js';
import Response from '../fetch/Response.js';
import HTMLAnchorElement from '../nodes/html-anchor-element/HTMLAnchorElement.js';
import HTMLButtonElement from '../nodes/html-button-element/HTMLButtonElement.js';
import HTMLOptGroupElement from '../nodes/html-opt-group-element/HTMLOptGroupElement.js';
import HTMLOptionElement from '../nodes/html-option-element/HTMLOptionElement.js';
import IResponseBody from '../fetch/types/IResponseBody.js';
import IResponseInit from '../fetch/types/IResponseInit.js';
import BrowserWindow from './BrowserWindow.js';

/**
 * Window without dependencies to server side specific packages.
 */
export default interface IBrowserWindow extends IEventTarget, INodeJSGlobal {
	// Nodes
	readonly Node: typeof Node;
	readonly Attr: typeof Attr;
	readonly SVGSVGElement: typeof SVGSVGElement;
	readonly SVGElement: typeof SVGElement;
	readonly SVGGraphicsElement: typeof SVGGraphicsElement;
	readonly Text: typeof Text;
	readonly Comment: typeof Comment;
	readonly ShadowRoot: typeof ShadowRoot;
	readonly Element: typeof Element;
	readonly DocumentFragment: typeof DocumentFragment;
	readonly CharacterData: typeof CharacterData;
	readonly ProcessingInstruction: typeof ProcessingInstruction;
	readonly Document: new () => Document;
	readonly HTMLDocument: new () => HTMLDocument;
	readonly XMLDocument: new () => XMLDocument;
	readonly SVGDocument: new () => SVGDocument;
	readonly DocumentType: typeof DocumentType;

	// Element classes
	readonly HTMLAnchorElement: typeof HTMLAnchorElement;
	readonly HTMLButtonElement: typeof HTMLButtonElement;
	readonly HTMLOptGroupElement: typeof HTMLOptGroupElement;
	readonly HTMLOptionElement: typeof HTMLOptionElement;
	readonly HTMLElement: typeof HTMLElement;
	readonly HTMLUnknownElement: typeof HTMLUnknownElement;
	readonly HTMLTemplateElement: typeof HTMLTemplateElement;
	readonly HTMLFormElement: typeof HTMLFormElement;
	readonly HTMLInputElement: typeof HTMLInputElement;
	readonly HTMLSelectElement: typeof HTMLSelectElement;
	readonly HTMLTextAreaElement: typeof HTMLTextAreaElement;
	readonly HTMLImageElement: typeof HTMLImageElement;
	readonly HTMLScriptElement: typeof HTMLScriptElement;
	readonly HTMLLinkElement: typeof HTMLLinkElement;
	readonly HTMLStyleElement: typeof HTMLStyleElement;
	readonly HTMLSlotElement: typeof HTMLSlotElement;
	readonly HTMLLabelElement: typeof HTMLLabelElement;
	readonly HTMLMetaElement: typeof HTMLMetaElement;
	readonly HTMLMediaElement: typeof HTMLMediaElement;
	readonly HTMLAudioElement: typeof HTMLAudioElement;
	readonly HTMLVideoElement: typeof HTMLVideoElement;
	readonly HTMLBaseElement: typeof HTMLBaseElement;
	readonly HTMLIFrameElement: typeof HTMLIFrameElement;
	readonly HTMLDialogElement: typeof HTMLDialogElement;

	/**
	 * Non-implemented element classes
	 */
	readonly HTMLHeadElement: typeof HTMLElement;
	readonly HTMLTitleElement: typeof HTMLElement;
	readonly HTMLBodyElement: typeof HTMLElement;
	readonly HTMLHeadingElement: typeof HTMLElement;
	readonly HTMLParagraphElement: typeof HTMLElement;
	readonly HTMLHRElement: typeof HTMLElement;
	readonly HTMLPreElement: typeof HTMLElement;
	readonly HTMLUListElement: typeof HTMLElement;
	readonly HTMLOListElement: typeof HTMLElement;
	readonly HTMLLIElement: typeof HTMLElement;
	readonly HTMLMenuElement: typeof HTMLElement;
	readonly HTMLDListElement: typeof HTMLElement;
	readonly HTMLDivElement: typeof HTMLElement;
	readonly HTMLAreaElement: typeof HTMLElement;
	readonly HTMLBRElement: typeof HTMLElement;
	readonly HTMLCanvasElement: typeof HTMLElement;
	readonly HTMLDataElement: typeof HTMLElement;
	readonly HTMLDataListElement: typeof HTMLElement;
	readonly HTMLDetailsElement: typeof HTMLElement;
	readonly HTMLDirectoryElement: typeof HTMLElement;
	readonly HTMLFieldSetElement: typeof HTMLElement;
	readonly HTMLFontElement: typeof HTMLElement;
	readonly HTMLHtmlElement: typeof HTMLElement;
	readonly HTMLLegendElement: typeof HTMLElement;
	readonly HTMLMapElement: typeof HTMLElement;
	readonly HTMLMarqueeElement: typeof HTMLElement;
	readonly HTMLMeterElement: typeof HTMLElement;
	readonly HTMLModElement: typeof HTMLElement;
	readonly HTMLOutputElement: typeof HTMLElement;
	readonly HTMLPictureElement: typeof HTMLElement;
	readonly HTMLProgressElement: typeof HTMLElement;
	readonly HTMLQuoteElement: typeof HTMLElement;
	readonly HTMLSourceElement: typeof HTMLElement;
	readonly HTMLSpanElement: typeof HTMLElement;
	readonly HTMLTableCaptionElement: typeof HTMLElement;
	readonly HTMLTableCellElement: typeof HTMLElement;
	readonly HTMLTableColElement: typeof HTMLElement;
	readonly HTMLTableElement: typeof HTMLElement;
	readonly HTMLTimeElement: typeof HTMLElement;
	readonly HTMLTableRowElement: typeof HTMLElement;
	readonly HTMLTableSectionElement: typeof HTMLElement;
	readonly HTMLFrameElement: typeof HTMLElement;
	readonly HTMLFrameSetElement: typeof HTMLElement;
	readonly HTMLEmbedElement: typeof HTMLElement;
	readonly HTMLObjectElement: typeof HTMLElement;
	readonly HTMLParamElement: typeof HTMLElement;
	readonly HTMLTrackElement: typeof HTMLElement;

	// Event classes
	readonly Event: typeof Event;
	readonly UIEvent: typeof UIEvent;
	readonly CustomEvent: typeof CustomEvent;
	readonly AnimationEvent: typeof AnimationEvent;
	readonly KeyboardEvent: typeof KeyboardEvent;
	readonly PointerEvent: typeof PointerEvent;
	readonly MouseEvent: typeof MouseEvent;
	readonly FocusEvent: typeof FocusEvent;
	readonly WheelEvent: typeof WheelEvent;
	readonly InputEvent: typeof InputEvent;
	readonly ErrorEvent: typeof ErrorEvent;
	readonly StorageEvent: typeof StorageEvent;
	readonly SubmitEvent: typeof SubmitEvent;
	readonly MessageEvent: typeof MessageEvent;
	readonly MessagePort: typeof MessagePort;
	readonly ProgressEvent: typeof ProgressEvent;
	readonly MediaQueryListEvent: typeof MediaQueryListEvent;
	readonly ClipboardEvent: typeof ClipboardEvent;
	readonly TouchEvent: typeof TouchEvent;
	readonly Touch: typeof Touch;

	/**
	 * Non-implemented event classes
	 */
	readonly AudioProcessingEvent: typeof Event;
	readonly BeforeInputEvent: typeof Event;
	readonly BeforeUnloadEvent: typeof Event;
	readonly BlobEvent: typeof Event;
	readonly CloseEvent: typeof Event;
	readonly CompositionEvent: typeof Event;
	readonly CSSFontFaceLoadEvent: typeof Event;
	readonly DeviceLightEvent: typeof Event;
	readonly DeviceMotionEvent: typeof Event;
	readonly DeviceOrientationEvent: typeof Event;
	readonly DeviceProximityEvent: typeof Event;
	readonly DOMTransactionEvent: typeof Event;
	readonly DragEvent: typeof Event;
	readonly EditingBeforeInputEvent: typeof Event;
	readonly FetchEvent: typeof Event;
	readonly GamepadEvent: typeof Event;
	readonly HashChangeEvent: typeof Event;
	readonly IDBVersionChangeEvent: typeof Event;
	readonly MediaStreamEvent: typeof Event;
	readonly MutationEvent: typeof Event;
	readonly OfflineAudioCompletionEvent: typeof Event;
	readonly OverconstrainedError: typeof Event;
	readonly PageTransitionEvent: typeof Event;
	readonly PaymentRequestUpdateEvent: typeof Event;
	readonly PopStateEvent: typeof Event;
	readonly RelatedEvent: typeof Event;
	readonly RTCDataChannelEvent: typeof Event;
	readonly RTCIdentityErrorEvent: typeof Event;
	readonly RTCIdentityEvent: typeof Event;
	readonly RTCPeerConnectionIceEvent: typeof Event;
	readonly SensorEvent: typeof Event;
	readonly SVGEvent: typeof Event;
	readonly SVGZoomEvent: typeof Event;
	readonly TimeEvent: typeof Event;
	readonly TrackEvent: typeof Event;
	readonly TransitionEvent: typeof Event;
	readonly UserProximityEvent: typeof Event;
	readonly WebGLContextEvent: typeof Event;
	readonly TextEvent: typeof Event;

	// Other classes
	readonly Image: typeof Image;
	readonly Audio: typeof Audio;
	readonly NamedNodeMap: typeof NamedNodeMap;
	readonly EventTarget: typeof EventTarget;
	readonly DataTransfer: typeof DataTransfer;
	readonly DataTransferItem: typeof DataTransferItem;
	readonly DataTransferItemList: typeof DataTransferItemList;
	readonly URL: typeof URL;
	readonly URLSearchParams: typeof URLSearchParams;
	readonly Location: typeof Location;
	readonly CustomElementRegistry: typeof CustomElementRegistry;
	readonly Window: typeof BrowserWindow;
	readonly XMLSerializer: typeof XMLSerializer;
	readonly ResizeObserver: typeof ResizeObserver;
	readonly CSSStyleSheet: typeof CSSStyleSheet;
	readonly Blob: typeof Blob;
	readonly File: typeof File;
	readonly FileReader: new () => FileReader;
	readonly DOMException: typeof DOMException;
	readonly History: typeof History;
	readonly Screen: typeof Screen;
	readonly Storage: typeof Storage;
	readonly HTMLCollection: typeof HTMLCollection;
	readonly HTMLFormControlsCollection: typeof HTMLFormControlsCollection;
	readonly NodeList: typeof NodeList;
	readonly CSSUnitValue: typeof CSSUnitValue;
	readonly CSS: CSS;
	readonly CSSRule: typeof CSSRule;
	readonly CSSContainerRule: typeof CSSContainerRule;
	readonly CSSFontFaceRule: typeof CSSFontFaceRule;
	readonly CSSKeyframeRule: typeof CSSKeyframeRule;
	readonly CSSKeyframesRule: typeof CSSKeyframesRule;
	readonly CSSMediaRule: typeof CSSMediaRule;
	readonly CSSStyleRule: typeof CSSStyleRule;
	readonly CSSSupportsRule: typeof CSSSupportsRule;
	readonly Selection: typeof Selection;
	readonly Navigator: typeof Navigator;
	readonly MimeType: typeof MimeType;
	readonly MimeTypeArray: typeof MimeTypeArray;
	readonly Plugin: typeof Plugin;
	readonly PluginArray: typeof PluginArray;
	readonly Headers: typeof Headers;
	readonly Request: new (input: RequestInfo, init?: IRequestInit) => Request;
	readonly Response: {
		redirect: (url: string, status?: number) => Response;
		error: () => Response;
		json: (data: object, init?: IResponseInit) => Response;
		new (body?: IResponseBody, init?: IResponseInit): Response;
	};
	readonly Range: new () => Range;
	readonly DOMRect: typeof DOMRect;
	readonly XMLHttpRequest: new () => XMLHttpRequest;
	readonly XMLHttpRequestUpload: typeof XMLHttpRequestUpload;
	readonly XMLHttpRequestEventTarget: typeof XMLHttpRequestEventTarget;
	readonly FileList: typeof FileList;
	readonly ReadableStream: typeof ReadableStream;
	readonly WritableStream: typeof Stream.Writable;
	readonly TransformStream: typeof Stream.Transform;
	readonly FormData: typeof FormData;
	readonly AbortController: typeof AbortController;
	readonly AbortSignal: typeof AbortSignal;
	readonly RadioNodeList: typeof RadioNodeList;
	readonly ValidityState: typeof ValidityState;
	readonly Permissions: typeof Permissions;
	readonly PermissionStatus: typeof PermissionStatus;
	readonly Clipboard: typeof Clipboard;
	readonly ClipboardItem: typeof ClipboardItem;

	readonly NodeFilter: typeof NodeFilter;
	readonly NodeIterator: typeof NodeIterator;
	readonly TreeWalker: typeof TreeWalker;
	readonly DOMParser: new () => DOMParser;
	readonly MutationObserver: typeof MutationObserver;
	readonly MutationRecord: typeof MutationRecord;
	readonly CSSStyleDeclaration: typeof CSSStyleDeclaration;

	// Events
	onload: ((event: Event) => void) | null;
	onerror: ((event: ErrorEvent) => void) | null;

	// Public Properties
	readonly document: IDocument;
	readonly customElements: CustomElementRegistry;
	readonly location: Location;
	readonly history: History;
	readonly navigator: Navigator;
	readonly console: Console;
	readonly self: IBrowserWindow;
	readonly top: IBrowserWindow | ICrossOriginBrowserWindow;
	readonly opener: IBrowserWindow | ICrossOriginBrowserWindow | null;
	readonly parent: IBrowserWindow | ICrossOriginBrowserWindow;
	readonly window: IBrowserWindow;
	readonly globalThis: IBrowserWindow;
	readonly screen: Screen;
	innerWidth: number;
	innerHeight: number;
	outerWidth: number;
	outerHeight: number;
	devicePixelRatio: number;
	readonly screenLeft: number;
	readonly screenTop: number;
	readonly screenX: number;
	readonly screenY: number;
	readonly sessionStorage: Storage;
	readonly localStorage: Storage;
	readonly performance: typeof performance;
	readonly pageXOffset: number;
	readonly pageYOffset: number;
	readonly scrollX: number;
	readonly scrollY: number;
	readonly crypto: typeof webcrypto;
	readonly closed: boolean;
	name: string;

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @param element Element.
	 * @returns CSS style declaration.
	 */
	getComputedStyle(element: IElement): CSSStyleDeclaration;

	/**
	 * Returns selection.
	 *
	 * @returns Selection.
	 */
	getSelection(): Selection;

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	scroll(x: { top?: number; left?: number; behavior?: string } | number, y?: number): void;

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	scrollTo(x: { top?: number; left?: number; behavior?: string } | number, y?: number): void;

	/**
	 * Shifts focus away from the window.
	 */
	blur(): void;

	/**
	 * Gives focus to the window.
	 */
	focus(): void;

	/**
	 * Loads a specified resource into a new or existing browsing context (that is, a tab, a window, or an iframe) under a specified name.
	 *
	 * @param [url] URL.
	 * @param [target] Target.
	 * @param [windowFeatures] Window features.
	 */
	open(
		url?: string,
		target?: string,
		windowFeatures?: string
	): IBrowserWindow | ICrossOriginBrowserWindow | null;

	/**
	 * Closes the window.
	 */
	close(): void;

	/**
	 * Returns a new MediaQueryList object that can then be used to determine if the document matches the media query string.
	 *
	 * @param mediaQueryString A string specifying the media query to parse into a MediaQueryList.
	 * @returns A new MediaQueryList.
	 */
	matchMedia(mediaQueryString: string): MediaQueryList;

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @param args Arguments passed to the callback function.
	 * @returns Timeout ID.
	 */
	setTimeout(callback: Function, delay?: number, ...args: unknown[]): NodeJS.Timeout;

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	clearTimeout(id: NodeJS.Timeout): void;

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @param args Arguments passed to the callback function.
	 * @returns Interval ID.
	 */
	setInterval(callback: Function, delay?: number, ...args: unknown[]): NodeJS.Timeout;

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param id ID of the interval.
	 */
	clearInterval(id: NodeJS.Timeout): void;

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {Function} callback Callback.
	 * @returns {NodeJS.Timeout} ID.
	 */
	requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Immediate;

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {NodeJS.Timeout} id ID.
	 */
	cancelAnimationFrame(id: NodeJS.Immediate): void;

	/**
	 * This method provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @param url URL.
	 * @param [init] Init.
	 * @returns Promise.
	 */
	fetch(url: RequestInfo, init?: IRequestInit): Promise<IResponse>;

	/**
	 * Creates a Base64-encoded ASCII string from a binary string (i.e., a string in which each character in the string is treated as a byte of binary data).
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/btoa
	 * @param data Binary data.
	 * @returns Base64-encoded string.
	 */
	btoa(data: unknown): string;

	/**
	 * Decodes a string of data which has been encoded using Base64 encoding.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/atob
	 * @see https://infra.spec.whatwg.org/#forgiving-base64-encode.
	 * @see Https://html.spec.whatwg.org/multipage/webappapis.html#btoa.
	 * @param data Binary string.
	 * @returns An ASCII string containing decoded data from encodedData.
	 */
	atob(data: unknown): string;

	/**
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param listener Listener.
	 */
	postMessage(message: unknown, targetOrigin?: string, transfer?: unknown[]): void;

	/**
	 * Resizes the window.
	 *
	 * @param width Width.
	 * @param height Height.
	 */
	resizeTo(width: number, height: number): void;

	/**
	 * Resizes the current window by a specified amount.
	 */
	resizeBy(width: number, height: number): void;

	/**
	 * Destroys the window.
	 */
	[PropertySymbol.destroy](): void;
}
