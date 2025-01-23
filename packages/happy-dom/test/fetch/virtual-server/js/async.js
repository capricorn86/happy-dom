/* eslint-disable no-undef */
function main() {
	document.querySelector('#async-1').textContent = 'true';
	setTimeout(() => {
		document.querySelector('#async-2').textContent = 'true';
	}, 10);
}

main();
