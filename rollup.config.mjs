// rollup --config
export default {
	input: './src/index.js',
  
	output: [
		{ // required (can be an array, for multiple outputs)
			file: './dist/dm.js',
			format: 'esm', // required
		},
		{ // required (can be an array, for multiple outputs)
			file: './dist/dm-node.js',
			format: 'cjs', // required
		},
	]
};