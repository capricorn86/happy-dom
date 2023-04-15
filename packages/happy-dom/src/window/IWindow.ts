import CustomElementRegistry from '../custom-element/CustomElementRegistry';
import Document from '../nodes/document/Document';
import HTMLDocument from '../nodes/html-document/HTMLDocument';
import XMLDocument from '../nodes/xml-document/XMLDocument';
import SVGDocument from '../nodes/svg-document/SVGDocument';
import Node from '../nodes/node/Node';
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
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement';
import HTMLBaseElement from '../nodes/html-base-element/HTMLBaseElement';
import HTMLIFrameElement from '../nodes/html-iframe-element/HTMLIFrameElement';
import SVGSVGElement from '../nodes/svg-element/SVGSVGElement';
import SVGElement from '../nodes/svg-element/SVGElement';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import HTMLDialogElement from '../nodes/html-dialog-element/HTMLDialogElement';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement';
import Image from '../nodes/html-image-element/Image';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment';
import CharacterData from '../nodes/character-data/CharacterData';
import NodeIterator from '../tree-walker/NodeIterator';
import TreeWalker from '../tree-walker/TreeWalker';
import Event from '../event/Event';
import CustomEvent from '../event/events/CustomEvent';
import AnimationEvent from '../event/events/AnimationEvent';
import KeyboardEvent from '../event/events/KeyboardEvent';
import ProgressEvent from '../event/events/ProgressEvent';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent';
import EventTarget from '../event/EventTarget';
import { URL, URLSearchParams } from 'url';
import Location from '../location/Location';
import MutationObserver from '../mutation-observer/MutationObserver';
import DOMParser from '../dom-parser/DOMParser';
import XMLSerializer from '../xml-serializer/XMLSerializer';
import ResizeObserver from '../resize-observer/ResizeObserver';
import Blob from '../file/Blob';
import File from '../file/File';
import DOMException from '../exception/DOMException';
import FileReader from '../file/FileReader';
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
import PointerEvent from '../event/events/PointerEvent';
import MouseEvent from '../event/events/MouseEvent';
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
import MessageEvent from '../event/events/MessageEvent';
import MessagePort from '../event/MessagePort';
import Screen from '../screen/Screen';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager';
import Storage from '../storage/Storage';
import NodeFilter from '../tree-walker/NodeFilter';
import HTMLCollection from '../nodes/element/HTMLCollection';
import HTMLFormControlsCollection from '../nodes/html-form-element/HTMLFormControlsCollection';
import NodeList from '../nodes/node/NodeList';
import Selection from '../selection/Selection';
import IEventTarget from '../event/IEventTarget';
import Navigator from '../navigator/Navigator';
import MimeType from '../navigator/MimeType';
import MimeTypeArray from '../navigator/MimeTypeArray';
import Plugin from '../navigator/Plugin';
import PluginArray from '../navigator/PluginArray';
import IResponseInit from '../fetch/types/IResponseInit';
import IRequest from '../fetch/types/IRequest';
import IHeaders from '../fetch/types/IHeaders';
import IRequestInit from '../fetch/types/IRequestInit';
import IResponse from '../fetch/types/IResponse';
import Range from '../range/Range';
import MediaQueryList from '../match-media/MediaQueryList';
import XMLHttpRequest from '../xml-http-request/XMLHttpRequest';
import XMLHttpRequestUpload from '../xml-http-request/XMLHttpRequestUpload';
import XMLHttpRequestEventTarget from '../xml-http-request/XMLHttpRequestEventTarget';
import DOMRect from '../nodes/element/DOMRect';
import Window from './Window';
import Attr from '../nodes/attr/Attr';
import NamedNodeMap from '../named-node-map/NamedNodeMap';
import { Performance } from 'perf_hooks';
import IElement from '../nodes/element/IElement';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction';
import IHappyDOMSettings from './IHappyDOMSettings';
import RequestInfo from '../fetch/types/IRequestInfo';
import FileList from '../nodes/html-input-element/FileList';
import Stream from 'stream';
import FormData from '../form-data/FormData';
import AbortController from '../fetch/AbortController';
import AbortSignal from '../fetch/AbortSignal';
import IResponseBody from '../fetch/types/IResponseBody';
import IRequestInfo from '../fetch/types/IRequestInfo';
import IHeadersInit from '../fetch/types/IHeadersInit';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList';
import ValidityState from '../validity-state/ValidityState';

/**
 * Window without dependencies to server side specific packages.
 */
export default interface IWindow extends IEventTarget, INodeJSGlobal {
	// Public Properties
	readonly happyDOM: {
		whenAsyncComplete: () => Promise<void>;
		cancelAsync: () => void;
		asyncTaskManager: AsyncTaskManager;
		setInnerWidth: (width: number) => void;
		setInnerHeight: (height: number) => void;
		setURL: (url: string) => void;
		settings: IHappyDOMSettings;
	};

	// Global classes
	readonly Node: typeof Node;
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
	readonly Attr: typeof Attr;
	readonly NamedNodeMap: typeof NamedNodeMap;
	readonly SVGSVGElement: typeof SVGSVGElement;
	readonly SVGElement: typeof SVGElement;
	readonly Image: typeof Image;
	readonly Text: typeof Text;
	readonly Comment: typeof Comment;
	readonly ShadowRoot: typeof ShadowRoot;
	readonly Element: typeof Element;
	readonly DocumentFragment: typeof DocumentFragment;
	readonly CharacterData: typeof CharacterData;
	readonly ProcessingInstruction: typeof ProcessingInstruction;
	readonly NodeFilter: typeof NodeFilter;
	readonly NodeIterator: typeof NodeIterator;
	readonly TreeWalker: typeof TreeWalker;
	readonly DOMParser: typeof DOMParser;
	readonly MutationObserver: typeof MutationObserver;
	readonly Document: typeof Document;
	readonly HTMLDocument: typeof HTMLDocument;
	readonly XMLDocument: typeof XMLDocument;
	readonly SVGDocument: typeof SVGDocument;
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
	readonly EventTarget: typeof EventTarget;
	readonly DataTransfer: typeof DataTransfer;
	readonly DataTransferItem: typeof DataTransferItem;
	readonly DataTransferItemList: typeof DataTransferItemList;
	readonly URL: typeof URL;
	readonly URLSearchParams: typeof URLSearchParams;
	readonly Location: typeof Location;
	readonly CustomElementRegistry: typeof CustomElementRegistry;
	readonly Window: typeof Window;
	readonly XMLSerializer: typeof XMLSerializer;
	readonly ResizeObserver: typeof ResizeObserver;
	readonly CSSStyleSheet: typeof CSSStyleSheet;
	readonly Blob: typeof Blob;
	readonly File: typeof File;
	readonly FileReader: typeof FileReader;
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
	readonly Headers: { new (init?: IHeadersInit): IHeaders };
	readonly Request: {
		new (input: IRequestInfo, init?: IRequestInit): IRequest;
	};
	readonly Response: { new (body?: IResponseBody | null, init?: IResponseInit): IResponse };
	readonly Range: typeof Range;
	readonly DOMRect: typeof DOMRect;
	readonly XMLHttpRequest: typeof XMLHttpRequest;
	readonly XMLHttpRequestUpload: typeof XMLHttpRequestUpload;
	readonly XMLHttpRequestEventTarget: typeof XMLHttpRequestEventTarget;
	readonly FileList: typeof FileList;
	readonly ReadableStream: typeof Stream.Readable;
	readonly WritableStream: typeof Stream.Writable;
	readonly FormData: typeof FormData;
	readonly AbortController: typeof AbortController;
	readonly AbortSignal: typeof AbortSignal;
	readonly RadioNodeList: typeof RadioNodeList;
	readonly ValidityState: typeof ValidityState;

	// Events
	onload: (event: Event) => void;
	onerror: (event: ErrorEvent) => void;

	// Public Properties
	readonly document: Document;
	readonly customElements: CustomElementRegistry;
	readonly location: Location;
	readonly history: History;
	readonly navigator: Navigator;
	readonly console: Console;
	readonly self: IWindow;
	readonly top: IWindow;
	readonly parent: IWindow;
	readonly window: IWindow;
	readonly globalThis: IWindow;
	readonly screen: Screen;
	readonly innerWidth: number;
	readonly innerHeight: number;
	readonly sessionStorage: Storage;
	readonly localStorage: Storage;
	readonly performance: Performance;
	readonly pageXOffset: number;
	readonly pageYOffset: number;
	readonly scrollX: number;
	readonly scrollY: number;

	/**
	 * Evaluates code.
	 *
	 * @param code Code.
	 * @returns Result.
	 */
	eval(code: string): unknown;

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
	 * @returns {NodeJS.Timeout} Timeout ID.
	 */
	requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout;

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {NodeJS.Timeout} id Timeout ID.
	 */
	cancelAnimationFrame(id: NodeJS.Timeout): void;

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
}
