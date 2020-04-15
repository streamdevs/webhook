class Fork {
	constructor(streamlabs) {
		this.streamlabs = streamlabs;
	}

	async handle(event, payload) {
		const {
			repository: { full_name: repositoryFullName },
			forkee: {
				owner: { login: ownerLogin },
			},
		} = payload;
		this.streamlabs.alert(
			`*${ownerLogin}* just forked 🍴 *${repositoryFullName}*`,
		);
	}
}

module.exports = {
	Fork,
};
