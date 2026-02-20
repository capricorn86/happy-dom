import type Node from '../nodes/node/Node.js';

export type TNodeFilter = ((node: Node) => number) | { acceptNode(node: Node): number };
