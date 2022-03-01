/**
 * IDOMTokenList.
 */
export default interface IDOMTokenList {
	value: string;
	readonly length: number;
	item(index: number | string): string;
	contains(token: string): boolean;
	add(...tokens: string[]): void;
	remove(...tokens: string[]): void;
	toggle(token: string, force?: boolean): boolean;
	replace(token: string, newToken: string): boolean;
	supports(token: string): boolean;

	values(): IterableIterator<string>;
	entries(): IterableIterator<[number, string]>;
	forEach(callback: (currentValue, currentIndex, listObj) => void, thisArg?: this): void;
	keys(): IterableIterator<number>;
}
