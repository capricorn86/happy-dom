import BrowserFrame from '../browser/BrowserFrame.js';
import DetachedBrowserFrame from '../browser/DetachedBrowserFrame.js';
import AudioImplementation from '../nodes/html-audio-element/Audio.js';
import ImageImplementation from '../nodes/html-image-element/Image.js';
import DocumentFragmentImplementation from '../nodes/document-fragment/DocumentFragment.js';
import DOMParserImplementation from '../dom-parser/DOMParser.js';
import FileReaderImplementation from '../file/FileReader.js';
import RequestImplementation from '../fetch/Request.js';
import ResponseImplementation from '../fetch/Response.js';
import RangeImplementation from '../range/Range.js';
import XMLHttpRequestImplementation from '../xml-http-request/XMLHttpRequest.js';
import IWindow from './IWindow.js';
import IDocument from '../nodes/document/IDocument.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
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
	public static getClasses(properties: {
		window: IWindow;
		browserFrame: BrowserFrame | DetachedBrowserFrame;
	}): {
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
		Document: typeof DocumentImplementation;
		HTMLDocument: typeof HTMLDocumentImplementation;
		XMLDocument: typeof XMLDocumentImplementation;
		SVGDocument: typeof SVGDocumentImplementation;

		// HTML Elements
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
		Response: typeof ResponseImplementation;
		Request: typeof RequestImplementation;
		XMLHttpRequest: typeof XMLHttpRequestImplementation;
		Image: typeof ImageImplementation;
		DocumentFragment: typeof DocumentFragmentImplementation;
		FileReader: typeof FileReaderImplementation;
		DOMParser: typeof DOMParserImplementation;
		Range: typeof RangeImplementation;
		Audio: typeof AudioImplementation;
	} {
		/* eslint-disable jsdoc/require-jsdoc */

		// Nodes
		class Node extends NodeImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class Attr extends AttrImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class SVGSVGElement extends SVGSVGElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class SVGElement extends SVGElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class SVGGraphicsElement extends SVGGraphicsElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class Text extends TextImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class Comment extends CommentImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class ShadowRoot extends ShadowRootImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class ProcessingInstruction extends ProcessingInstructionImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class Element extends ElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class CharacterData extends CharacterDataImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class Document extends DocumentImplementation {
			public readonly ownerDocument: IDocument | null = null;
			public readonly defaultView: IWindow = properties.window;
		}
		class HTMLDocument extends HTMLDocumentImplementation {
			public readonly ownerDocument: IDocument | null = null;
			public readonly defaultView: IWindow = properties.window;
		}
		class XMLDocument extends XMLDocumentImplementation {
			public readonly ownerDocument: IDocument | null = null;
			public readonly defaultView: IWindow = properties.window;
		}
		class SVGDocument extends SVGDocumentImplementation {
			public readonly ownerDocument: IDocument | null = null;
			public readonly defaultView: IWindow = properties.window;
		}

		// HTML Elements
		class Audio extends AudioImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class Image extends ImageImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class DocumentFragment extends DocumentFragmentImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLElement extends HTMLElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLUnknownElement extends HTMLUnknownElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLTemplateElement extends HTMLTemplateElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLFormElement extends HTMLFormElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLInputElement extends HTMLInputElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLSelectElement extends HTMLSelectElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLTextAreaElement extends HTMLTextAreaElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLImageElement extends HTMLImageElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLScriptElement extends HTMLScriptElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLLinkElement extends HTMLLinkElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLStyleElement extends HTMLStyleElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLLabelElement extends HTMLLabelElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLSlotElement extends HTMLSlotElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLMetaElement extends HTMLMetaElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLMediaElement extends HTMLMediaElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLAudioElement extends HTMLAudioElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLVideoElement extends HTMLVideoElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLBaseElement extends HTMLBaseElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLIFrameElement extends HTMLIFrameElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}
		class HTMLDialogElement extends HTMLDialogElementImplementation {
			public readonly ownerDocument: IDocument = properties.window.document;
		}

		// Other Classes
		class Request extends RequestImplementation {
			protected readonly _asyncTaskManager: AsyncTaskManager =
				properties.browserFrame._asyncTaskManager;
			protected readonly _ownerDocument: IDocument = properties.window.document;
		}
		class Response extends ResponseImplementation {
			protected readonly _asyncTaskManager: AsyncTaskManager =
				properties.browserFrame._asyncTaskManager;
		}
		class XMLHttpRequest extends XMLHttpRequestImplementation {
			protected readonly _asyncTaskManager: AsyncTaskManager =
				properties.browserFrame._asyncTaskManager;
			protected readonly _ownerDocument: IDocument = properties.window.document;
		}
		class FileReader extends FileReaderImplementation {
			public readonly _ownerDocument: IDocument = properties.window.document;
		}
		class DOMParser extends DOMParserImplementation {
			public readonly _ownerDocument: IDocument = properties.window.document;
		}
		class Range extends RangeImplementation {
			public readonly _ownerDocument: IDocument = properties.window.document;
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

			// HTML Elements
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
