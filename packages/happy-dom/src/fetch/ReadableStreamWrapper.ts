/**
 * Creating a ReadableStream initiates the stream and creates a Promise internally in Node.js.
 * This Promise is not accessible and cannot be awaited.
 *
 * This class provides a way to wrap a ReadableStream and consume it when needed.
 */
export class ReadableStreamWrapper {
	#read: () => ReadableStream;
	#readableStream: ReadableStream | null = null;
	/**
	 * Constructor.
	 *
	 * @param read Function that returns a ReadableStream when called.
	 */
	constructor(read: () => ReadableStream) {
		this.#read = read;
	}

	/**
	 * Returns the ReadableStream. If the stream has already been created, it returns the existing instance.
	 *
	 * @returns ReadableStream instance
	 */
	public get readableStream(): ReadableStream {
		if (!this.#readableStream) {
			this.#readableStream = this.#read();
		}
		return this.#readableStream;
	}
}
