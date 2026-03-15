import type Node from '../nodes/node/Node.js';
import XPathExpression from './XPathExpression.js';
import XPathResult from './XPathResult.js';

/**
 * XPath evaluator.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XPathEvaluator
 */
export default class XPathEvaluator {
	/**
	 * Creates an XPath expression.
	 *
	 * @param expression XPath expression string.
	 * @param [_resolver] Namespace resolver (unused).
	 * @returns XPath expression.
	 */
	public createExpression(expression: string, _resolver?: unknown): XPathExpression {
		return new XPathExpression(expression);
	}

	/**
	 * Creates a namespace resolver.
	 *
	 * @deprecated Returns the input as-is.
	 * @param node Node.
	 * @returns The node itself.
	 */
	public createNSResolver(node: Node): Node {
		return node;
	}

	/**
	 * Evaluates an XPath expression.
	 *
	 * @param expression XPath expression string.
	 * @param contextNode Context node.
	 * @param [_resolver] Namespace resolver (unused).
	 * @param [type] Result type.
	 * @param [_result] Unused, for spec compatibility.
	 * @returns XPath result.
	 */
	public evaluate(
		expression: string,
		contextNode: Node,
		_resolver?: unknown,
		type: number = XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		_result?: XPathResult | null
	): XPathResult {
		return this.createExpression(expression).evaluate(contextNode, type);
	}
}
