import type Element from '../element/Element.js';
import type Node from '../node/Node.js';

export default interface INonDocumentTypeChildNode extends Node {
	readonly previousElementSibling: Element;
	readonly nextElementSibling: Element;
}
