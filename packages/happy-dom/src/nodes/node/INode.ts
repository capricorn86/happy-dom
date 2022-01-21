import IEventTarget from '../../event/IEventTarget';
import IDocument from '../document/IDocument';
import IElement from '../element/IElement';

export default interface INode extends IEventTarget {
	readonly ownerDocument: IDocument;
	readonly parentNode: INode;
	readonly parentElement: IElement;
	readonly nodeType: number;
	readonly childNodes: INode[];
	readonly isConnected: boolean;
	readonly nodeName: string;
	readonly previousSibling: INode;
	readonly nextSibling: INode;
	readonly firstChild: INode;
	readonly lastChild: INode;
	nodeValue: string;
	textContent: string;
	connectedCallback?(): void;
	disconnectedCallback?(): void;
	getRootNode(options?: { composed: boolean }): INode;
	cloneNode(deep: boolean): INode;
	appendChild(node: INode): INode;
	removeChild(node: INode): INode;
	hasChildNodes(): boolean;
	insertBefore(newNode: INode, referenceNode?: INode | null): INode;
	replaceChild(newChild: INode, oldChild: INode): INode;
	toString(): string;
}
