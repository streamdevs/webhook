class Fork {
	constructor({ streamlabs, twitchChat }) {
		this.streamlabs = streamlabs;
		this.twitchChat = twitchChat;
	}

	async handle({ payload }) {
		const {
			repository: { full_name: repositoryFullName, html_url: repositoryUrl },
			forkee: {
				owner: { login: ownerLogin },
			},
		} = payload;
		await this.streamlabs.alert({
			message: `*${ownerLogin}* just forked 🍴 *${repositoryFullName}*`,
		});
		this.twitchChat.send(`*${ownerLogin}* just forked 🍴 ${repositoryUrl}`);
	}
}

module.exports = {
	Fork,
};
