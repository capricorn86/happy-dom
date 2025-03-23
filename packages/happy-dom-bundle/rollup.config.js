import dts from 'rollup-plugin-dts';

export default [
	{
		input: '../happy-dom/lib/index.js',
		output: {
			file: 'lib/index.js',
			sourcemap: true,
			format: 'esm'
		}
	},
	{
		input: '../happy-dom/lib/index.d.ts',
		output: {
			file: 'lib/index.d.ts',
			format: 'es'
		},
		plugins: [dts()]
	}
];
