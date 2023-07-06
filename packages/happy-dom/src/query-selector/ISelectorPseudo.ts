import SelectorItem from './SelectorItem.js';

export default interface ISelectorPseudo {
	name: string;
	arguments: string | null;
	selectorItem: SelectorItem | null;
	nthFunction: ((n: number) => boolean) | null;
}
