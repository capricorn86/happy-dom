import * as PropertySymbol from '../../PropertySymbol.js';
import Text from '../text/Text.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * CDATASection node.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CDATASection
 */
export default class CDATASection extends Text {
	public declare cloneNode: (deep?: boolean) => CDATASection;
	public override [PropertySymbol.nodeType] = NodeTypeEnum.cdataSectionNode;

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public override get nodeName(): string {
		return '#cdata-section';
	}

	/**
	 * Converts to string.
	 *
	 * @returns String.
	 */
	public override toString(): string {
		return '[object CDATASection]';
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): CDATASection {
		return <CDATASection>super[PropertySymbol.cloneNode](deep);
	}
}
