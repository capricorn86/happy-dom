import INode from '../nodes/node/INode';

export default interface INodeFilter {
	acceptNode(node: INode): number;
}
