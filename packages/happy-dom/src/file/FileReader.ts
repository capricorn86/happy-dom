import WhatwgMIMEType from 'whatwg-mimetype';
import WhatwgEncoding from 'whatwg-encoding';
import IDocument from '../nodes/document/IDocument.js';
import ProgressEvent from '../event/events/ProgressEvent.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import Blob from './Blob.js';
import FileReaderReadyStateEnum from './FileReaderReadyStateEnum.js';
import FileReaderFormatEnum from './FileReaderFormatEnum.js';
import EventTarget from '../event/EventTarget.js';
import FileReaderEventTypeEnum from './FileReaderEventTypeEnum.js';

/**
 * Reference:
 * https://developer.mozilla.org/sv-SE/docs/Web/API/FileReader.
 *
 * Based on:
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/file-api/FileReader-impl.js (MIT licensed).
 */
export default class FileReader extends EventTarget {
	// Owner document is set by a sub-class in the Window constructor
	public static _ownerDocument: IDocument = null;
	public readonly error: Error = null;
	public readonly result: Buffer | ArrayBuffer | string = null;
	public readonly readyState: number = FileReaderReadyStateEnum.empty;
	public readonly onabort: (event: ProgressEvent) => void = null;
	public readonly onerror: (event: ProgressEvent) => void = null;
	public readonly onload: (event: ProgressEvent) => void = null;
	public readonly onloadstart: (event: ProgressEvent) => void = null;
	public readonly onloadend: (event: ProgressEvent) => void = null;
	public readonly onprogress: (event: ProgressEvent) => void = null;
	public readonly _ownerDocument: IDocument = null;
	private _isTerminated = false;
	private _loadTimeout: NodeJS.Timeout = null;
	private _parseTimeout: NodeJS.Timeout = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this._ownerDocument = (<typeof FileReader>this.constructor)._ownerDocument;
	}

	/**
	 * Reads as ArrayBuffer.
	 *
	 * @param blob Blob.
	 */
	public readAsArrayBuffer(blob: Blob): void {
		this._readFile(blob, FileReaderFormatEnum.buffer);
	}

	/**
	 * Reads as binary string.
	 *
	 * @param blob Blob.
	 */
	public readAsBinaryString(blob: Blob): void {
		this._readFile(blob, FileReaderFormatEnum.binaryString);
	}

	/**
	 * Reads as data URL.
	 *
	 * @param blob Blob.
	 */
	public readAsDataURL(blob: Blob): void {
		this._readFile(blob, FileReaderFormatEnum.dataURL);
	}

	/**
	 * Reads as text.
	 *
	 * @param blob Blob.
	 * @param [encoding] Encoding.
	 */
	public readAsText(blob: Blob, encoding: string = null): void {
		this._readFile(
			blob,
			FileReaderFormatEnum.text,
			WhatwgEncoding.labelToName(encoding) || 'UTF-8'
		);
	}

	/**
	 * Aborts the file reader.
	 */
	public abort(): void {
		const window = this._ownerDocument.defaultView;

		window.clearTimeout(this._loadTimeout);
		window.clearTimeout(this._parseTimeout);

		if (
			this.readyState === FileReaderReadyStateEnum.empty ||
			this.readyState === FileReaderReadyStateEnum.done
		) {
			(<Buffer | ArrayBuffer | string>this.result) = null;
			return;
		}

		if (this.readyState === FileReaderReadyStateEnum.loading) {
			(<number>this.readyState) = FileReaderReadyStateEnum.done;
			(<Buffer | ArrayBuffer | string>this.result) = null;
		}

		this._isTerminated = true;
		this.dispatchEvent(new ProgressEvent(FileReaderEventTypeEnum.abort));
		this.dispatchEvent(new ProgressEvent(FileReaderEventTypeEnum.loadend));
	}

	/**
	 * Reads a file.
	 *
	 * @param blob Blob.
	 * @param format Format.
	 * @param [encoding] Encoding.
	 */
	private _readFile(blob: Blob, format: FileReaderFormatEnum, encoding: string = null): void {
		const window = this._ownerDocument.defaultView;

		if (this.readyState === FileReaderReadyStateEnum.loading) {
			throw new DOMException(
				'The object is in an invalid state.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		(<number>this.readyState) = FileReaderReadyStateEnum.loading;

		this._loadTimeout = window.setTimeout(() => {
			if (this._isTerminated) {
				this._isTerminated = false;
				return;
			}

			this.dispatchEvent(new ProgressEvent(FileReaderEventTypeEnum.loadstart));

			let data = blob._buffer;
			if (!data) {
				data = Buffer.alloc(0);
			}

			this.dispatchEvent(
				new ProgressEvent(FileReaderEventTypeEnum.loadstart, {
					lengthComputable: !isNaN(blob.size),
					total: blob.size,
					loaded: data.length
				})
			);

			this._parseTimeout = window.setTimeout(() => {
				if (this._isTerminated) {
					this._isTerminated = false;
					return;
				}

				switch (format) {
					default:
					case FileReaderFormatEnum.buffer: {
						(<Buffer | ArrayBuffer | string>this.result) = new Uint8Array(data).buffer;
						break;
					}
					case FileReaderFormatEnum.binaryString: {
						(<Buffer | ArrayBuffer | string>this.result) = data.toString('binary');
						break;
					}
					case FileReaderFormatEnum.dataURL: {
						// Spec seems very unclear here; see https://github.com/w3c/FileAPI/issues/104.
						const contentType = WhatwgMIMEType.parse(blob.type) || 'application/octet-stream';
						(<Buffer | ArrayBuffer | string>(
							this.result
						)) = `data:${contentType};base64,${data.toString('base64')}`;
						break;
					}
					case FileReaderFormatEnum.text: {
						(<Buffer | ArrayBuffer | string>this.result) = WhatwgEncoding.decode(data, encoding);
						break;
					}
				}
				(<number>this.readyState) = FileReaderReadyStateEnum.done;
				this.dispatchEvent(new ProgressEvent(FileReaderEventTypeEnum.load));
				this.dispatchEvent(new ProgressEvent(FileReaderEventTypeEnum.loadend));
			});
		});
	}
}
