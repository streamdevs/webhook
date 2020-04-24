module.exports = {
	hooks: {
		'pre-commit': 'yarn run lint-format-staged',
		'post-commit': 'git update-index --again',
	},
};
