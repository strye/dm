// rollup --config
export default {
	input: './src/index.js',
  
	output: [
		{ // required (can be an array, for multiple outputs)
			file: './dist/9dutil.js',
			format: 'esm', // required
		},
		{ // required (can be an array, for multiple outputs)
			file: './dist/9dutil-node.js',
			format: 'cjs', // required
		},
	]
};