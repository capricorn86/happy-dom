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
	readonly happyDOM: {
		whenAsyncComplete: () => Promise<void>;
		cancelAsync: () => void;
		asyncTaskManager: AsyncTaskManager;
	};

	// Global classes
	readonly Node: typeof Node;
	readonly HTMLElement: typeof HTMLElement;
	readonly HTMLTemplateElement: typeof HTMLTemplateElement;
	readonly HTMLFormElement: typeof HTMLFormElement;
	readonly HTMLInputElement: typeof HTMLInputElement;
	readonly HTMLTextAreaElement: typeof HTMLTextAreaElement;
	readonly HTMLImageElement: typeof HTMLImageElement;
	readonly HTMLScriptElement: typeof HTMLScriptElement;
	readonly HTMLLinkElement: typeof HTMLLinkElement;
	readonly HTMLStyleElement: typeof HTMLStyleElement;
	readonly SVGSVGElement: typeof SVGSVGElement;
	readonly SVGElement: typeof SVGElement;
	readonly Text: typeof Text;
	readonly Comment: typeof Comment;
	readonly ShadowRoot: typeof ShadowRoot;
	readonly Element: typeof Element;
	readonly DocumentFragment: typeof DocumentFragment;
	readonly NodeFilter: typeof NodeFilter;
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
	readonly MouseEvent: typeof MouseEvent;
	readonly FocusEvent: typeof FocusEvent;
	readonly WheelEvent: typeof WheelEvent;
	readonly InputEvent: typeof InputEvent;
	readonly ErrorEvent: typeof ErrorEvent;
	readonly ProgressEvent: typeof ProgressEvent;
	readonly EventTarget: typeof EventTarget;
	readonly DataTransfer: typeof DataTransfer;
	readonly DataTransferItem: typeof DataTransferItem;
	readonly DataTransferItemList: typeof DataTransferItemList;
	readonly URL: typeof URL;
	readonly Location: typeof Location;
	readonly CustomElementRegistry: typeof CustomElementRegistry;
	readonly Window: typeof Window;
	readonly Headers: typeof Map;
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

	// Events
	onload: (event: Event) => void;
	onerror: (event: ErrorEvent) => void;

	// Public Properties
	readonly document: Document;
	readonly customElements: CustomElementRegistry;
	readonly location: Location;
	readonly history: History;
	readonly navigator: { userAgent: string };
	readonly console: Console;
	readonly self: IWindow;
	readonly top: IWindow;
	readonly parent: IWindow;
	readonly window: IWindow;
	readonly screen: Screen;
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
	 * @returns Timeout ID.
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
	 * @returns Interval ID.
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
	 * @param {Function} callback Callback.
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
