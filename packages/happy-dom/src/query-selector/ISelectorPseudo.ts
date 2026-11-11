import type SelectorItem from './SelectorItem.js';

export default interface ISelectorPseudo {
	name: string;
	arguments: string | null;
	selectorGroups: Array<Array<SelectorItem>> | null;
	nthFunction: ((n: number) => boolean) | null;
}
