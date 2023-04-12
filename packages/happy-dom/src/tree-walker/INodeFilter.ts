import INode from '../nodes/node/INode';

type INodeFilter = ((node: INode) => number) | { acceptNode(node: INode): number };

export default INodeFilter;
