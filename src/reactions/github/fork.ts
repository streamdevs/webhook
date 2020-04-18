import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { ForkPayload } from '../../schemas/github/fork-payload';

export class Fork {
	static canHandle({ event }: { event: string }) {
		return event === 'fork';
	}

	constructor(private streamlabs: StreamLabs, private twitchChat: TwitchChat) {}

	async handle({ payload }: { payload: ForkPayload }) {
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
