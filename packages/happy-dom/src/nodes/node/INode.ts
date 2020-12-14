import IEventTarget from '../../event/IEventTarget';
import IDocument from '../document/IDocument';

export default interface INode extends IEventTarget {
	readonly ownerDocument: IDocument;
	readonly parentNode: INode;
	readonly nodeType: number;
	readonly childNodes: INode[];
	isConnected: boolean;
	readonly nodeValue: string;
	readonly nodeName: string;
	readonly previousSibling: INode;
	readonly nextSibling: INode;
	readonly firstChild: INode;
	readonly lastChild: INode;
	textContent: string;
	connectedCallback?(): void;
	disconnectedCallback?(): void;
	cloneNode(deep: boolean): INode;
	appendChild(node: INode): INode;
	removeChild(node: INode): void;
	insertBefore(newNode: INode, referenceNode?: INode): INode;
	replaceChild(newChild: INode, oldChild: INode): INode;
	toString(): string;
}
