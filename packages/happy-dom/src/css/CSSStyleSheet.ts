import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import CSSParser from './CSSParser';
import CSSRule from './CSSRule';
import MediaList from './MediaList';

/**
 * Attr node interface.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.
 */
export default class CSSStyleSheet {
	public value: string = null;
	public name: string = null;
	public namespaceURI: string = null;
	public readonly cssRules: CSSRule[] = [];

	// Constructable Stylesheets is a new feature that only Blink supports:
	// https://wicg.github.io/construct-stylesheets/
	// TODO: Not fully implemented.
	public media: MediaList | string;
	public title: string;
	public alternate: boolean;
	public disabled: boolean;

	/**
	 * Constructor.
	 *
	 * Constructable Stylesheets is a new feature that only Blink supports:
	 * https://wicg.github.io/construct-stylesheets/.
	 *
	 * @param [options] Options.
	 * @param [options.media] Media.
	 * @param [options.title] Title.
	 * @param [options.alternate] Alternate.
	 * @param [options.disabled] Disabled.
	 */
	constructor(options?: {
		media?: MediaList | string;
		title?: string;
		alternate?: boolean;
		disabled?: boolean;
	}) {
		this.media = options && options.media ? options.media : '';
		this.title = options && options.title ? options.title : '';
		this.alternate = options && options.alternate ? options.alternate : false;
		this.disabled = options && options.disabled ? options.disabled : false;
	}

	/**
	 * Inserts a rule.
	 *
	 * Constructable Stylesheets is a new feature that only Blink supports:
	 * https://wicg.github.io/construct-stylesheets/.
	 *
	 * @param rule Rule.
	 * @param [index] Index.
	 * @returns The newly inserterted rule's index.
	 */
	public insertRule(rule: string, index?: number): number {
		const rules = CSSParser.parseFromString(this, rule);

		if (rules.length === 0) {
			throw new DOMException('Invalid CSS rule.', DOMExceptionNameEnum.hierarchyRequestError);
		}

		if (rules.length > 1) {
			throw new DOMException(
				'Only one rule is allowed to be added.',
				DOMExceptionNameEnum.syntaxError
			);
		}

		if (index !== undefined) {
			if (index > this.cssRules.length) {
				throw new DOMException(
					'Index is more than the length of CSSRuleList.',
					DOMExceptionNameEnum.indexSizeError
				);
			}
			this.cssRules.splice(index, 0);
			this.cssRules.push(rules[0]);
			return index;
		}

		const newIndex = this.cssRules.length;

		this.cssRules.push(rules[0]);

		return newIndex;
	}

	/**
	 * Removes a rule.
	 *
	 * Constructable Stylesheets is a new feature that only Blink supports:
	 * https://wicg.github.io/construct-stylesheets/.
	 *
	 * @param index Index.
	 */
	public deleteRule(index: number): void {
		delete this.cssRules[index];
	}

	/**
	 * Replaces all CSS rules.
	 *
	 * Constructable Stylesheets is a new feature that only Blink supports:
	 * https://wicg.github.io/construct-stylesheets/.
	 *
	 * @param text CSS text.
	 * @returns Promise.
	 */
	public async replace(text: string): Promise<void> {
		this.replaceSync(text);
	}

	/**
	 * Replaces all CSS rules.
	 *
	 * Constructable Stylesheets is a new feature that only Blink supports:
	 * https://wicg.github.io/construct-stylesheets/.
	 *
	 * @param text CSS text.
	 */
	public replaceSync(text: string): void {
		(<CSSRule[]>this.cssRules) = CSSParser.parseFromString(this, text);
	}
}
