import Node from '../nodes/basic/node/Node';

export default interface INodeFilter {
	acceptNode(node: Node): number;
}
