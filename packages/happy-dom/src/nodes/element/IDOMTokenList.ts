/**
 * IDOMTokenList.
 */
export default interface IDOMTokenList<T> {
	item(index: number): string;
	contains(token: string): boolean;
	add(...tokens: string[]): void;
	remove(...tokens: string[]): void;
	toggle(token: string, force?: boolean): boolean;
	replace(token: string, newToken: string): boolean;
	supports(token: string): boolean;

	values(): IterableIterator<T>;
	entries(): IterableIterator<[number, T]>;
	forEach(callback: (currentValue, currentIndex, listObj) => void, thisArg?: this): void;
	keys(): IterableIterator<number>;
}
