import INode from '../nodes/node/INode.js';

type INodeFilter = ((node: INode) => number) | { acceptNode(node: INode): number };

export default INodeFilter;
