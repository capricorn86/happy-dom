/**
 * Fetch headers.
 */
export default interface IHeaders extends Iterable<[string, string]> {
	forEach(callback: (value: string, name: string) => void): void;
	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string | null;
	has(name: string): boolean;
	raw(): { [k: string]: string[] };
	set(name: string, value: string): void;

	// Iterable methods
	entries(): IterableIterator<[string, string]>;
	keys(): IterableIterator<string>;
	values(): IterableIterator<string>;
	[Symbol.iterator](): Iterator<[string, string]>;
}
