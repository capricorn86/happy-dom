import AudioImplementation from '../nodes/html-audio-element/Audio.js';
import ImageImplementation from '../nodes/html-image-element/Image.js';
import DocumentFragmentImplementation from '../nodes/document-fragment/DocumentFragment.js';
import DOMParserImplementation from '../dom-parser/DOMParser.js';
import FileReaderImplementation from '../file/FileReader.js';
import RequestImplementation from '../fetch/Request.js';
import ResponseImplementation from '../fetch/Response.js';
import RangeImplementation from '../range/Range.js';
import XMLHttpRequestImplementation from '../xml-http-request/XMLHttpRequest.js';
import IBrowserWindow from './IBrowserWindow.js';
import IDocument from '../nodes/document/IDocument.js';
import HTMLElementImplementation from '../nodes/html-element/HTMLElement.js';
import HTMLUnknownElementImplementation from '../nodes/html-unknown-element/HTMLUnknownElement.js';
import HTMLTemplateElementImplementation from '../nodes/html-template-element/HTMLTemplateElement.js';
import HTMLFormElementImplementation from '../nodes/html-form-element/HTMLFormElement.js';
import HTMLInputElementImplementation from '../nodes/html-input-element/HTMLInputElement.js';
import HTMLSelectElementImplementation from '../nodes/html-select-element/HTMLSelectElement.js';
import HTMLTextAreaElementImplementation from '../nodes/html-text-area-element/HTMLTextAreaElement.js';
import HTMLImageElementImplementation from '../nodes/html-image-element/HTMLImageElement.js';
import HTMLScriptElementImplementation from '../nodes/html-script-element/HTMLScriptElement.js';
import HTMLLinkElementImplementation from '../nodes/html-link-element/HTMLLinkElement.js';
import HTMLStyleElementImplementation from '../nodes/html-style-element/HTMLStyleElement.js';
import HTMLLabelElementImplementation from '../nodes/html-label-element/HTMLLabelElement.js';
import HTMLSlotElementImplementation from '../nodes/html-slot-element/HTMLSlotElement.js';
import HTMLMetaElementImplementation from '../nodes/html-meta-element/HTMLMetaElement.js';
import HTMLMediaElementImplementation from '../nodes/html-media-element/HTMLMediaElement.js';
import HTMLAudioElementImplementation from '../nodes/html-audio-element/HTMLAudioElement.js';
import HTMLVideoElementImplementation from '../nodes/html-video-element/HTMLVideoElement.js';
import HTMLBaseElementImplementation from '../nodes/html-base-element/HTMLBaseElement.js';
import HTMLIFrameElementImplementation from '../nodes/html-iframe-element/HTMLIFrameElement.js';
import HTMLDialogElementImplementation from '../nodes/html-dialog-element/HTMLDialogElement.js';
import NodeImplementation from '../nodes/node/Node.js';
import AttrImplementation from '../nodes/attr/Attr.js';
import SVGSVGElementImplementation from '../nodes/svg-element/SVGSVGElement.js';
import SVGElementImplementation from '../nodes/svg-element/SVGElement.js';
import SVGGraphicsElementImplementation from '../nodes/svg-element/SVGGraphicsElement.js';
import TextImplementation from '../nodes/text/Text.js';
import CommentImplementation from '../nodes/comment/Comment.js';
import ShadowRootImplementation from '../nodes/shadow-root/ShadowRoot.js';
import ProcessingInstructionImplementation from '../nodes/processing-instruction/ProcessingInstruction.js';
import ElementImplementation from '../nodes/element/Element.js';
import CharacterDataImplementation from '../nodes/character-data/CharacterData.js';
import DocumentImplementation from '../nodes/document/Document.js';
import HTMLDocumentImplementation from '../nodes/html-document/HTMLDocument.js';
import XMLDocumentImplementation from '../nodes/xml-document/XMLDocument.js';
import SVGDocumentImplementation from '../nodes/svg-document/SVGDocument.js';
import DocumentTypeImplementation from '../nodes/document-type/DocumentType.js';
import HTMLAnchorElementImplementation from '../nodes/html-anchor-element/HTMLAnchorElement.js';
import HTMLButtonElementImplementation from '../nodes/html-button-element/HTMLButtonElement.js';
import HTMLOptGroupElementImplementation from '../nodes/html-opt-group-element/HTMLOptGroupElement.js';
import HTMLOptionElementImplementation from '../nodes/html-option-element/HTMLOptionElement.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import IRequestInfo from '../fetch/types/IRequestInfo.js';
import IRequestInit from '../fetch/types/IRequestInit.js';
import IResponseInit from '../fetch/types/IResponseInit.js';
import IResponseBody from '../fetch/types/IResponseBody.js';

/**
 * Some classes need to get access to the window object without having a reference to the window in the constructor.
 * This factory will extend classes with a class that has a reference to the window.
 */
export default class WindowClassFactory {
	/**
	 * Returns classes for the given window.
	 *
	 * @param properties Properties.
	 * @param properties.window Window.
	 * @param properties.browserFrame Browser frame.
	 * @returns Classes.
	 */
	public static getClasses(properties: { window: IBrowserWindow; browserFrame: IBrowserFrame }): {
		// Nodes
		Node: typeof NodeImplementation;
		Attr: typeof AttrImplementation;
		SVGSVGElement: typeof SVGSVGElementImplementation;
		SVGElement: typeof SVGElementImplementation;
		SVGGraphicsElement: typeof SVGGraphicsElementImplementation;
		Text: typeof TextImplementation;
		Comment: typeof CommentImplementation;
		ShadowRoot: typeof ShadowRootImplementation;
		ProcessingInstruction: typeof ProcessingInstructionImplementation;
		Element: typeof ElementImplementation;
		CharacterData: typeof CharacterDataImplementation;
		Document: new () => DocumentImplementation;
		HTMLDocument: new () => HTMLDocumentImplementation;
		XMLDocument: new () => XMLDocumentImplementation;
		SVGDocument: new () => SVGDocumentImplementation;
		DocumentType: typeof DocumentTypeImplementation;

		// HTML Elements
		HTMLAnchorElement: typeof HTMLAnchorElementImplementation;
		HTMLButtonElement: typeof HTMLButtonElementImplementation;
		HTMLOptGroupElement: typeof HTMLOptGroupElementImplementation;
		HTMLOptionElement: typeof HTMLOptionElementImplementation;
		HTMLElement: typeof HTMLElementImplementation;
		HTMLUnknownElement: typeof HTMLUnknownElementImplementation;
		HTMLTemplateElement: typeof HTMLTemplateElementImplementation;
		HTMLFormElement: typeof HTMLFormElementImplementation;
		HTMLInputElement: typeof HTMLInputElementImplementation;
		HTMLSelectElement: typeof HTMLSelectElementImplementation;
		HTMLTextAreaElement: typeof HTMLTextAreaElementImplementation;
		HTMLImageElement: typeof HTMLImageElementImplementation;
		HTMLScriptElement: typeof HTMLScriptElementImplementation;
		HTMLLinkElement: typeof HTMLLinkElementImplementation;
		HTMLStyleElement: typeof HTMLStyleElementImplementation;
		HTMLLabelElement: typeof HTMLLabelElementImplementation;
		HTMLSlotElement: typeof HTMLSlotElementImplementation;
		HTMLMetaElement: typeof HTMLMetaElementImplementation;
		HTMLMediaElement: typeof HTMLMediaElementImplementation;
		HTMLAudioElement: typeof HTMLAudioElementImplementation;
		HTMLVideoElement: typeof HTMLVideoElementImplementation;
		HTMLBaseElement: typeof HTMLBaseElementImplementation;
		HTMLIFrameElement: typeof HTMLIFrameElementImplementation;
		HTMLDialogElement: typeof HTMLDialogElementImplementation;

		// Other Classes
		Request: new (input: IRequestInfo, init?: IRequestInit) => RequestImplementation;
		Response: new (body?: IResponseBody, init?: IResponseInit) => ResponseImplementation;
		XMLHttpRequest: new () => XMLHttpRequestImplementation;
		Image: typeof ImageImplementation;
		DocumentFragment: typeof DocumentFragmentImplementation;
		FileReader: new () => FileReaderImplementation;
		DOMParser: new () => DOMParserImplementation;
		Range: new () => RangeImplementation;
		Audio: typeof AudioImplementation;
	} {
		const window = properties.window;
		const asyncTaskManager = properties.browserFrame._asyncTaskManager;

		/* eslint-disable jsdoc/require-jsdoc */

		// Nodes
		class Node extends NodeImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Attr extends AttrImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class SVGSVGElement extends SVGSVGElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class SVGElement extends SVGElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class SVGGraphicsElement extends SVGGraphicsElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Text extends TextImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Comment extends CommentImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class ShadowRoot extends ShadowRootImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class ProcessingInstruction extends ProcessingInstructionImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Element extends ElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class CharacterData extends CharacterDataImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Document extends DocumentImplementation {
			constructor() {
				super(properties);
			}
		}

		class HTMLDocument extends HTMLDocumentImplementation {
			constructor() {
				super(properties);
			}
		}
		class XMLDocument extends XMLDocumentImplementation {
			constructor() {
				super(properties);
			}
		}
		class SVGDocument extends SVGDocumentImplementation {
			constructor() {
				super(properties);
			}
		}
		class DocumentType extends DocumentTypeImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}

		// HTML Elements
		class HTMLAnchorElement extends HTMLAnchorElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLButtonElement extends HTMLButtonElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLOptGroupElement extends HTMLOptGroupElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLOptionElement extends HTMLOptionElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Audio extends AudioImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class Image extends ImageImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class DocumentFragment extends DocumentFragmentImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLElement extends HTMLElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLUnknownElement extends HTMLUnknownElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLTemplateElement extends HTMLTemplateElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLFormElement extends HTMLFormElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLInputElement extends HTMLInputElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLSelectElement extends HTMLSelectElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLTextAreaElement extends HTMLTextAreaElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLImageElement extends HTMLImageElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLScriptElement extends HTMLScriptElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLLinkElement extends HTMLLinkElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLStyleElement extends HTMLStyleElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLLabelElement extends HTMLLabelElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLSlotElement extends HTMLSlotElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLMetaElement extends HTMLMetaElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLMediaElement extends HTMLMediaElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLAudioElement extends HTMLAudioElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLVideoElement extends HTMLVideoElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLBaseElement extends HTMLBaseElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLIFrameElement extends HTMLIFrameElementImplementation {
			constructor() {
				super(properties.browserFrame);
			}
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}
		class HTMLDialogElement extends HTMLDialogElementImplementation {
			public get ownerDocument(): IDocument {
				return window.document;
			}
		}

		// Other Classes
		class Request extends RequestImplementation {
			constructor(input: IRequestInfo, init?: IRequestInit) {
				super({ window, asyncTaskManager }, input, init);
			}
		}
		class Response extends ResponseImplementation {
			protected static _window = window;
			constructor(body?: IResponseBody, init?: IResponseInit) {
				super({ window, asyncTaskManager }, body, init);
			}
		}
		class XMLHttpRequest extends XMLHttpRequestImplementation {
			constructor() {
				super(properties);
			}
		}
		class FileReader extends FileReaderImplementation {
			constructor() {
				super(properties.window);
			}
		}
		class DOMParser extends DOMParserImplementation {
			constructor() {
				super(properties.window);
			}
		}
		class Range extends RangeImplementation {
			constructor() {
				super(properties.window);
			}
		}

		/* eslint-enable jsdoc/require-jsdoc */

		return {
			// Nodes
			Node,
			Attr,
			SVGSVGElement,
			SVGElement,
			SVGGraphicsElement,
			Text,
			Comment,
			ShadowRoot,
			ProcessingInstruction,
			Element,
			CharacterData,
			Document,
			HTMLDocument,
			XMLDocument,
			SVGDocument,
			DocumentType,

			// HTML Elements
			HTMLAnchorElement,
			HTMLButtonElement,
			HTMLOptGroupElement,
			HTMLOptionElement,
			HTMLElement,
			HTMLUnknownElement,
			HTMLTemplateElement,
			HTMLFormElement,
			HTMLInputElement,
			HTMLSelectElement,
			HTMLTextAreaElement,
			HTMLImageElement,
			HTMLScriptElement,
			HTMLLinkElement,
			HTMLStyleElement,
			HTMLLabelElement,
			HTMLSlotElement,
			HTMLMetaElement,
			HTMLMediaElement,
			HTMLAudioElement,
			HTMLVideoElement,
			HTMLBaseElement,
			HTMLIFrameElement,
			HTMLDialogElement,

			// Other Classes
			Response,
			Request,
			Image,
			DocumentFragment,
			FileReader,
			DOMParser,
			XMLHttpRequest,
			Range,
			Audio
		};
	}
}
