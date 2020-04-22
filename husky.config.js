module.exports = {
	hooks: {
		'pre-commit': 'yarn run lint:staged ',
		'post-commit': 'git update-index --again'
	},
};
