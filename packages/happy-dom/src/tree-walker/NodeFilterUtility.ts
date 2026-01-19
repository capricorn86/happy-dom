import NodeFilterMask from './NodeFilterMask.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Node from '../nodes/node/Node.js';
import NodeFilter from './NodeFilter.js';
import INodeFilter from './INodeFilter.js';

/**
 *
 */
export default class NodeFilterUtility {
	/**
	 * Filters a node.
	 *
	 * Based on solution:
	 * https://gist.github.com/shawndumas/1132009.
	 *
	 * @param node Node.
	 * @param options Filter options.
	 * @param options.whatToShow What to show.
	 * @param options.filter Filter.
	 * @returns Filter result.
	 */
	public static filterNode(
		node: Node,
		options: {
			whatToShow: number;
			filter: INodeFilter | null;
		}
	): number {
		const mask = NodeFilterMask[node[PropertySymbol.nodeType]];

		if (mask && (options.whatToShow & mask) == 0) {
			return NodeFilter.FILTER_SKIP;
		}
		if (typeof options.filter === 'function') {
			return options.filter(node);
		}
		if (options.filter) {
			return options.filter.acceptNode(node);
		}

		return NodeFilter.FILTER_ACCEPT;
	}
}
