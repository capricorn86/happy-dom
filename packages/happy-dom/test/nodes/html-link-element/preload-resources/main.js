// eslint-disable-next-line no-console
console.log('Resource loaded');

(async () => {
	const data = await fetch('preload/data.json');
	// eslint-disable-next-line no-console
	console.log(await data.json());
})();
