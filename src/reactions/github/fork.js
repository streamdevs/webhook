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


		const streamLabsMessage = `*${ownerLogin}* just forked 🍴 *${repositoryFullName}*`;
		const twitchChatMessage = `*${ownerLogin}* just forked 🍴 ${repositoryUrl}`;

		await this.streamlabs.alert({
			message: streamLabsMessage,
		});
		await this.twitchChat.send(
			`*${ownerLogin}* just forked 🍴 ${repositoryUrl}`,
		);

		return {
			twitchChat: {
				message: twitchChatMessage,
				notified: true,
			},
			streamLabs: {
				message: streamLabsMessage,
				notified: true,
			},
		};
	}
}

module.exports = {
	Fork,
};
