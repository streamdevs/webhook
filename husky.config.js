module.exports = {
	hooks: {
		'pre-commit': 'yarn lint-staged',
		'post-commit': 'git update-index --again'
	},
};
