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
import MutationObserver from '../mutation-observer/MutationObserver';
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
import Storage from '../storage/Storage';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import HTMLStyleElement from '../nodes/html-style-element/HTMLStyleElement';
import IFetchOptions from './IFetchOptions';
import NodeFilter from '../tree-walker/NodeFilter';
import Window from './Window';

/**
 * Window.
 */
export default interface IWindow {
	// Public Properties
	happyDOM: {
		whenAsyncComplete: () => Promise<void>;
		cancelAsync: () => void;
		asyncTaskManager: AsyncTaskManager;
	};

	// Global classes
	Node: typeof Node;
	HTMLElement: typeof HTMLElement;
	HTMLTemplateElement: typeof HTMLTemplateElement;
	HTMLFormElement: typeof HTMLFormElement;
	HTMLInputElement: typeof HTMLInputElement;
	HTMLTextAreaElement: typeof HTMLTextAreaElement;
	HTMLImageElement: typeof HTMLImageElement;
	HTMLScriptElement: typeof HTMLScriptElement;
	HTMLLinkElement: typeof HTMLLinkElement;
	HTMLStyleElement: typeof HTMLStyleElement;
	SVGSVGElement: typeof SVGSVGElement;
	SVGElement: typeof SVGElement;
	Text: typeof Text;
	Comment: typeof Comment;
	ShadowRoot: typeof ShadowRoot;
	Element: typeof Element;
	DocumentFragment: typeof DocumentFragment;
	NodeFilter: typeof NodeFilter;
	TreeWalker: typeof TreeWalker;
	DOMParser: typeof DOMParser;
	MutationObserver: typeof MutationObserver;
	Document: typeof Document;
	HTMLDocument: typeof HTMLDocument;
	XMLDocument: typeof XMLDocument;
	SVGDocument: typeof SVGDocument;
	Event: typeof Event;
	UIEvent: typeof UIEvent;
	CustomEvent: typeof CustomEvent;
	AnimationEvent: typeof AnimationEvent;
	KeyboardEvent: typeof KeyboardEvent;
	MouseEvent: typeof MouseEvent;
	FocusEvent: typeof FocusEvent;
	WheelEvent: typeof WheelEvent;
	InputEvent: typeof InputEvent;
	ErrorEvent: typeof ErrorEvent;
	ProgressEvent: typeof ProgressEvent;
	EventTarget: typeof EventTarget;
	DataTransfer: typeof DataTransfer;
	DataTransferItem: typeof DataTransferItem;
	DataTransferItemList: typeof DataTransferItemList;
	URL: typeof URL;
	Location: typeof Location;
	CustomElementRegistry: typeof CustomElementRegistry;
	Window: typeof Window;
	Headers: typeof Map;
	XMLSerializer: typeof XMLSerializer;
	ResizeObserver: typeof ResizeObserver;
	CSSStyleSheet: typeof CSSStyleSheet;
	Blob: typeof Blob;
	File: typeof File;
	FileReader: typeof FileReader;
	DOMException: typeof DOMException;
	History: typeof History;
	Screen: typeof Screen;
	Storage: typeof Storage;

	// Events
	onload: (event: Event) => void;
	onerror: (event: ErrorEvent) => void;

	// Public Properties
	document: Document;
	customElements: CustomElementRegistry;
	location: Location;
	history: History;
	navigator: { userAgent: string };
	console: Console;
	self: IWindow;
	top: IWindow;
	window: IWindow;
	screen: Screen;
	readonly innerWidth: number;
	readonly innerHeight: number;
	readonly sessionStorage: Storage;
	readonly localStorage: Storage;

	/**
	 * Evaluates code.
	 *
	 * @param code Code.
	 */
	eval(code: string): void;

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @param element Element.
	 * @returns CSS style declaration.
	 */
	getComputedStyle(element: HTMLElement): CSSStyleDeclaration;

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
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @return Timeout ID.
	 */
	setTimeout(callback: () => void, delay?: number): NodeJS.Timeout;

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @override
	 * @param id ID of the timeout.
	 */
	clearTimeout(id: NodeJS.Timeout): void;

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @override
	 * @param callback Function to be executed.
	 * @param [delay=0] Delay in ms.
	 * @return Interval ID.
	 */
	setInterval(callback: () => void, delay?: number): NodeJS.Timeout;

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @override
	 * @param id ID of the interval.
	 */
	clearInterval(id: NodeJS.Timeout): void;

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @override
	 * @param {function} callback Callback.
	 * @returns {NodeJS.Timeout} Timeout ID.
	 */
	requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout;

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @override
	 * @param {NodeJS.Timeout} id Timeout ID.
	 */
	cancelAnimationFrame(id: NodeJS.Timeout): void;

	/**
	 * Provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network.
	 *
	 * @override
	 * @param url URL to resource.
	 * @param [options] Options.
	 * @returns Promise.
	 */
	fetch(url: string, options?: IFetchOptions): Promise<IResponse>;
}
