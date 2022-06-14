import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';

const base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Btoa.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/btoa.
 *
 * @param data
 */
export const btoa = (data: unknown): string => {
	const str = (<string>data).toString();
	if (/[^\u0000-\u00ff]/.test(str)) {
		throw new DOMException(
			"Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.",
			DOMExceptionNameEnum.invalidCharacterError
		);
	}

	let t = '';
	let p = -6;
	let a = 0;
	let i = 0;
	let v = 0;
	let c;
	while (i < str.length || p > -6) {
		if (p < 0) {
			if (i < str.length) {
				c = str.charCodeAt(i++);
				v += 8;
			} else {
				c = 0;
			}
			a = ((a & 255) << 8) | (c & 255);
			p += 8;
		}
		t += base64list.charAt(v > 0 ? (a >> p) & 63 : 64);
		p -= 6;
		v -= 6;
	}
	return t;
};

/**
 * Atob.
 *
 * Reference:
 * https://infra.spec.whatwg.org/#forgiving-base64-encode.
 * Https://html.spec.whatwg.org/multipage/webappapis.html#btoa.
 *
 * @param data
 */
export const atob = (data: unknown): string => {
	const str = (<string>data).toString();

	if (/[^\u0000-\u00ff]/.test(str)) {
		throw new DOMException(
			"Failed to execute 'atob' on 'Window': The string to be decoded contains characters outside of the Latin1 range.",
			DOMExceptionNameEnum.invalidCharacterError
		);
	}

	if (/[^A-Za-z\d+/=]/.test(str) || str.length % 4 == 1) {
		throw new DOMException(
			"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
			DOMExceptionNameEnum.invalidCharacterError
		);
	}

	let t = '';
	let p = -8;
	let a = 0;
	let c;
	let d;
	for (let i = 0; i < str.length; i++) {
		if ((c = base64list.indexOf(str.charAt(i))) < 0) {
			continue;
		}
		a = (a << 6) | (c & 63);
		if ((p += 6) >= 0) {
			d = (a >> p) & 255;
			if (c !== 64) {
				t += String.fromCharCode(d);
			}
			a &= 63;
			p -= 8;
		}
	}
	return t;
};

exports = { btoa: btoa, atob: atob };
