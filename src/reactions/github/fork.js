class Fork {
	constructor({ streamlabs }) {
		this.streamlabs = streamlabs;
	}

	async handle({ payload }) {
		const {
			repository: { full_name: repositoryFullName },
			forkee: {
				owner: { login: ownerLogin },
			},
		} = payload;
		await this.streamlabs.alert(
			`*${ownerLogin}* just forked 🍴 *${repositoryFullName}*`,
		);
	}
}

module.exports = {
	Fork,
};
