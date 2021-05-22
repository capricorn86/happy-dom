import IElement from './IElement';
import IHTMLCollection from './IHTMLCollection';

/**
 *
 */
export default class HTMLCollectionFactory {
	/**
	 * Creates an HTMLCollection.
	 *
	 * @param nodes Nodes.
	 * @returns HTMLCollection.
	 */
	public static create(nodes?: IElement[]): IHTMLCollection<IElement> {
		nodes = nodes ? nodes.slice() : [];
		Object.defineProperty(nodes, 'item', {
			value: this.getItem.bind(null, nodes)
		});
		return <IHTMLCollection<IElement>>nodes;
	}

	/**
	 * Returns node by index.
	 *
	 * @param nodes
	 * @param index Index.
	 */
	private static getItem(nodes: IElement[], index: number): IElement {
		return nodes[index] || null;
	}
}
