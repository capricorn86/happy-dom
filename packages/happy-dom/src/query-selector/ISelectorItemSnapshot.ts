import type ISelectorAttribute from './ISelectorAttribute.js';
import type ISelectorPseudo from './ISelectorPseudo.js';
import type SelectorCombinatorEnum from './SelectorCombinatorEnum.js';

export default interface ISelectorItemSnapshot {
	readonly attributes?: ISelectorAttribute[];
	readonly classNames?: string[];
	readonly combinator: SelectorCombinatorEnum;
	readonly id?: string;
	readonly isPseudoElement?: boolean;
	readonly pseudos?: ISelectorPseudo[];
	readonly tagName?: string;
}
