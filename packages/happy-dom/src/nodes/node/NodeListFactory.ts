import INode from './INode';
import INodeList from './INodeList';

/**
 *
 */
export default class NodeListFactory {
	/**
	 * Creates a NodeList.
	 *
	 * @param nodes Nodes.
	 * @returns NodeList.
	 */
	public static create(nodes?: INode[]): INodeList<INode> {
		nodes = nodes ? nodes.slice() : [];
		Object.defineProperty(nodes, 'item', {
			value: this.getItem.bind(null, nodes)
		});
		return <INodeList<INode>>nodes;
	}

	/**
	 * Returns node by index.
	 *
	 * @param nodes
	 * @param index Index.
	 */
	private static getItem(nodes: INode[], index: number): INode {
		return nodes[index] || null;
	}
}
