import Window from '../window/Window';
import * as util from 'util';

const window = new Window();
const xhr = new window.XMLHttpRequest();

const chunks = [];

process.stdin.on('data', (chunk) => {
	chunks.push(chunk);
});

process.stdin.on('end', () => {
	const buffer = Buffer.concat(chunks);

	const serials = JSON.parse(buffer.toString());
	if (serials.body && serials.body.type === 'Buffer' && serials.body.data) {
		serials.body = Buffer.from(serials.body.data);
	}
	if (serials.origin) {
		window.location.href = serials.origin;
	}

	if (serials.cookie) {
		window.document.cookie = serials.cookie;
	}

	xhr.overrideMimeType(serials.mimeType);
	xhr.open(serials.method, serials.uri, true, serials.user, serials.password);
	if (serials.headers) {
		Object.keys(serials.headers).forEach((key) => {
			xhr.setRequestHeader(key, serials.headers[key]);
		});
	}


	xhr.timeout = serials.timeout;

	try {
		xhr.addEventListener('loadend', () => {
			if (xhr._syncGetError()) {
				const err = xhr._syncGetError();
				xhr._syncSetErrorString(err.stack || util.inspect(err));
			}

			process.stdout.write(
				JSON.stringify({
					responseURL: xhr.responseUrl,
					responseText: xhr.responseText,
					status: xhr.status,
					statusText: xhr.statusText,
				}),
				() => {
					process.exit(0);
				}
			);
		});

		xhr.send(serials.body);
	} catch (error) {
		// Properties.error += error.stack || util.inspect(error);
		process.stdout.write(
			JSON.stringify({
				responseURL: xhr.responseUrl,
				status: xhr.status,
				statusText: xhr.statusText
			}),
			() => {
				process.exit(0);
			}
		);
	}
});
