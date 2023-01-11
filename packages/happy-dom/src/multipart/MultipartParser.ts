import EventTarget from '../event/EventTarget';
import MultipartEvent from './MultipartEvent';

enum MultiparParserStateEnum {
	startBoundary = 0,
	headerFieldStart = 1,
	headerField = 2,
	headerValueStart = 3,
	headerValue = 4,
	headerValueAlmostDone = 5,
	headersAlmostDone = 6,
	partDataStart = 7,
	partData = 8,
	end = 9
}
enum MultiparParserMarkEnum {
	headerField = 'headerField',
	headerValue = 'headerValue',
	partData = 'partData'
}
enum MultipartEventTypeEnum {
	headerEnd = 'headerend',
	headerField = 'headerfield',
	headersEnd = 'headersend',
	headerValue = 'headervalue',
	partBegin = 'partbegin',
	partData = 'partbata',
	partEnd = 'partend'
}

const CHARACTER_CODE = {
	lf: 10,
	cr: 13,
	space: 32,
	hyphen: 45,
	colon: 58,
	a: 97,
	z: 122
};

/**
 * Multipart parser.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/utils/multipart-parser.js (MIT)
 */
export default class MultipartParser extends EventTarget {
	public onheaderend: (event: MultipartEvent) => void;
	public onheaderfield: (event: MultipartEvent) => void;
	public onheadersend: (event: MultipartEvent) => void;
	public onheadervalue: (event: MultipartEvent) => void;
	public onpartbegin: (event: MultipartEvent) => void;
	public onpartbata: (event: MultipartEvent) => void;
	public onpartend: (event: MultipartEvent) => void;

	private index = 0;
	private flags = 0;
	private state: MultiparParserStateEnum = MultiparParserStateEnum.startBoundary;
	private marks: Map<MultiparParserMarkEnum, number> = new Map();
	private boundaryChars: { [k: number]: boolean } = {};
	private boundary: Uint8Array;
	private lookbehind: Uint8Array;
	private flagBoundary: { part: number; last: number };

	/**
	 * Constructor.
	 *
	 * @param boundary Boundary.
	 * @param [callback] Callback.
	 */
	constructor(boundary: string) {
		super();

		const parsedBoundary = '\r\n--' + boundary;
		const ui8a = new Uint8Array(boundary.length);

		for (let i = 0; i < parsedBoundary.length; i++) {
			ui8a[i] = parsedBoundary.charCodeAt(i);
			this.boundaryChars[ui8a[i]] = true;
		}

		this.boundary = ui8a;
		this.lookbehind = new Uint8Array(this.boundary.length + 8);

		let flagBoundary = 1;
		this.flagBoundary = { part: flagBoundary, last: (flagBoundary *= 2) };
	}

	/**
	 * Writes data.
	 *
	 * @param data Data.
	 */
	public write(data: Uint8Array): void {
		let i = 0;
		const length_ = data.length;
		let previousIndex = this.index;
		const { lookbehind, boundary, boundaryChars } = this;
		let { index, state, flags } = this;
		const boundaryLength = this.boundary.length;
		const boundaryEnd = boundaryLength - 1;
		const bufferLength = data.length;
		let c;
		let cl;

		for (i = 0; i < length_; i++) {
			c = data[i];

			switch (state) {
				case MultiparParserStateEnum.startBoundary:
					if (index === boundary.length - 2) {
						if (c === CHARACTER_CODE.hyphen) {
							flags |= this.flagBoundary.last;
						} else if (c !== CHARACTER_CODE.cr) {
							return;
						}

						index++;
						break;
					} else if (index - 1 === boundary.length - 2) {
						if (flags & this.flagBoundary.last && c === CHARACTER_CODE.hyphen) {
							state = MultiparParserStateEnum.end;
							flags = 0;
						} else if (!(flags & this.flagBoundary.last) && c === CHARACTER_CODE.lf) {
							index = 0;
							this.onPartBegin();
							state = MultiparParserStateEnum.headerFieldStart;
						} else {
							return;
						}

						break;
					}

					if (c !== boundary[index + 2]) {
						index = -2;
					}

					if (c === boundary[index + 2]) {
						index++;
					}

					break;
				case MultiparParserStateEnum.headerFieldStart:
					state = MultiparParserStateEnum.headerField;
					this.marks.set(MultiparParserMarkEnum.headerField, i);
					index = 0;
				// Falls through
				case MultiparParserStateEnum.headerField:
					if (c === CHARACTER_CODE.cr) {
						this.marks.delete(MultiparParserMarkEnum.headerField);
						state = MultiparParserStateEnum.headersAlmostDone;
						break;
					}

					index++;
					if (c === CHARACTER_CODE.hyphen) {
						break;
					}

					if (c === CHARACTER_CODE.colon) {
						if (index === 1) {
							// Empty header field
							return;
						}

						this.onHeaderField({ data, end: i });
						state = MultiparParserStateEnum.headerValueStart;
						break;
					}

					cl = this.lowerCaseCharacter(c);
					if (cl < CHARACTER_CODE.a || cl > CHARACTER_CODE.z) {
						return;
					}

					break;
				case MultiparParserStateEnum.headerValueStart:
					if (c === CHARACTER_CODE.space) {
						break;
					}

					this.marks.set(MultiparParserMarkEnum.headerValue, i);
					state = MultiparParserStateEnum.headerValue;
				// Falls through
				case MultiparParserStateEnum.headerValue:
					if (c === CHARACTER_CODE.cr) {
						this.onHeaderValue({ data, end: i });
						this.onHeaderEnd();
						state = MultiparParserStateEnum.headerValueAlmostDone;
					}

					break;
				case MultiparParserStateEnum.headerValueAlmostDone:
					if (c !== CHARACTER_CODE.lf) {
						return;
					}

					state = MultiparParserStateEnum.headerFieldStart;
					break;
				case MultiparParserStateEnum.headersAlmostDone:
					if (c !== CHARACTER_CODE.lf) {
						return;
					}

					this.onHeadersEnd();
					state = MultiparParserStateEnum.partDataStart;
					break;
				case MultiparParserStateEnum.partDataStart:
					state = MultiparParserStateEnum.partData;
					this.marks.set(MultiparParserMarkEnum.partData, i);
					break;
				// Falls through
				case MultiparParserStateEnum.partData:
					previousIndex = index;

					if (index === 0) {
						// Boyer-moore derrived algorithm to safely skip non-boundary data
						i += boundaryEnd;
						while (i < bufferLength && !(data[i] in boundaryChars)) {
							i += boundaryLength;
						}

						i -= boundaryEnd;
						c = data[i];
					}

					if (index < boundary.length) {
						if (boundary[index] === c) {
							if (index === 0) {
								this.onPartData({ data, end: i });
							}

							index++;
						} else {
							index = 0;
						}
					} else if (index === boundary.length) {
						index++;
						if (c === CHARACTER_CODE.cr) {
							// CHARACTER_CODE.cr = part boundary
							flags |= this.flagBoundary.part;
						} else if (c === CHARACTER_CODE.hyphen) {
							// CHARACTER_CODE.hyphen = end boundary
							flags |= this.flagBoundary.last;
						} else {
							index = 0;
						}
					} else if (index - 1 === boundary.length) {
						if (flags & this.flagBoundary.part) {
							index = 0;
							if (c === CHARACTER_CODE.lf) {
								// Unset the PART_BOUNDARY flag
								flags &= ~this.flagBoundary.part;
								this.onPartEnd();
								this.onPartBegin();
								state = MultiparParserStateEnum.headerFieldStart;
								break;
							}
						} else if (flags & this.flagBoundary.last) {
							if (c === CHARACTER_CODE.hyphen) {
								this.onPartEnd();
								state = MultiparParserStateEnum.end;
								flags = 0;
							} else {
								index = 0;
							}
						} else {
							index = 0;
						}
					}

					if (index > 0) {
						// When matching a possible boundary, keep a lookbehind reference
						// In case it turns out to be a false lead
						lookbehind[index - 1] = c;
					} else if (previousIndex > 0) {
						// If our boundary turned out to be rubbish, the captured lookbehind
						// Belongs to partData
						this.onPartData({
							data: new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength),
							start: 0,
							end: previousIndex
						});

						previousIndex = 0;
						this.marks.set(MultiparParserMarkEnum.partData, i);

						// Reconsider the current character even so it interrupted the sequence
						// It could be the beginning of a new sequence
						i--;
					}

					break;
				case MultiparParserStateEnum.end:
					break;
				default:
					throw new Error(`Unexpected state entered: ${state}`);
			}
		}

		this.onHeaderField();
		this.onHeaderValue();
		this.onPartData();

		// Update properties for the next call
		this.index = index;
		this.state = state;
		this.flags = flags;
	}

	/**
	 * Ends the stream.
	 */
	public end(): void {
		if (
			(this.state === MultiparParserStateEnum.headerFieldStart && this.index === 0) ||
			(this.state === MultiparParserStateEnum.partData && this.index === this.boundary.length)
		) {
			this.onPartEnd();
		} else if (this.state !== MultiparParserStateEnum.end) {
			throw new Error('MultipartParser.end(): stream ended unexpectedly');
		}
	}

	/**
	 * Returns character in lower case.
	 *
	 * @param char Character.
	 * @returns Character in lower case.
	 */
	private lowerCaseCharacter(char: number): number {
		return char | 0x20;
	}

	/**
	 * Event handler.
	 */
	private onHeaderEnd(): void {
		this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.headerEnd));
	}

	/**
	 * Event handler.
	 *
	 * @param [options] Options.
	 * @param [options.data] Data.
	 * @param [options.end] End.
	 */
	private onHeaderField(options?: { data: Uint8Array; end?: number }): void {
		if (options?.data) {
			const { data } = options;
			let { end } = options;
			let start;

			if (end !== undefined) {
				start = this.marks.get(MultiparParserMarkEnum.headerField);
			} else if (this.marks.has(MultiparParserMarkEnum.headerField)) {
				start = this.marks.get(MultiparParserMarkEnum.headerField);
				end = data.length;
				this.marks.set(MultiparParserMarkEnum.headerField, 0);
			}

			if (start !== undefined && start !== end) {
				this.dispatchEvent(
					new MultipartEvent(MultipartEventTypeEnum.headerField, {
						data: data && data.subarray(start, end)
					})
				);
			}
		} else {
			this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.headerField));
		}
	}

	/**
	 * Event handler.
	 */
	private onHeadersEnd(): void {
		this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.headersEnd));
	}

	/**
	 * Event handler.
	 *
	 * @param [options] Options.
	 * @param [options.data] Data.
	 * @param [options.end] End.
	 */
	private onHeaderValue(options?: { data: Uint8Array; end?: number }): void {
		if (options?.data) {
			const { data } = options;
			let { end } = options;
			let start;

			if (!this.marks.has(MultiparParserMarkEnum.headerValue)) {
				return;
			}

			if (end !== undefined) {
				start = this.marks.get(MultiparParserMarkEnum.headerValue);
			} else if (this.marks.has(MultiparParserMarkEnum.headerValue)) {
				start = this.marks.get(MultiparParserMarkEnum.headerValue);
				end = data.length;
				this.marks.set(MultiparParserMarkEnum.headerValue, 0);
			}

			if (start !== undefined && start !== end) {
				this.dispatchEvent(
					new MultipartEvent(MultipartEventTypeEnum.headerValue, {
						data: data && data.subarray(start, end)
					})
				);
			}
		} else {
			this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.headerValue));
		}
	}

	/**
	 * Event handler.
	 */
	private onPartBegin(): void {
		this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.partBegin));
	}

	/**
	 * Event handler.
	 *
	 * @param [options] Options.
	 * @param [options.data] Data.
	 * @param [options.end] End index.
	 * @param [options.start] Start index.
	 */
	private onPartData(options?: { data: Uint8Array; end?: number; start?: number }): void {
		if (options?.data) {
			const { data } = options;
			let { end, start } = options;

			if (end !== undefined && start === undefined) {
				start = this.marks.get(MultiparParserMarkEnum.partData);
			} else if (
				end === undefined &&
				start === undefined &&
				this.marks.has(MultiparParserMarkEnum.partData)
			) {
				start = this.marks.get(MultiparParserMarkEnum.partData);
				end = data.length;
				this.marks.set(MultiparParserMarkEnum.partData, 0);
			}

			if (start !== undefined && start !== end) {
				this.dispatchEvent(
					new MultipartEvent(MultipartEventTypeEnum.partData, {
						data: data && data.subarray(start, end)
					})
				);
			}
		} else {
			this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.partData));
		}
	}

	/**
	 * Event handler.
	 */
	private onPartEnd(): void {
		this.dispatchEvent(new MultipartEvent(MultipartEventTypeEnum.partEnd));
	}
}
