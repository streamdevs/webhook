import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';

interface PingConfig {
	streamlabs: StreamLabs;
	twitchChat: TwitchChat;
}

interface HandleOptions {
	// FIXME: add Payload type
	payload: any;
}

export class Ping {
	private streamlabs: StreamLabs;
	private twitchChat: TwitchChat;

	public constructor({ streamlabs, twitchChat }: PingConfig) {
		this.streamlabs = streamlabs;
		this.twitchChat = twitchChat;
	}

	public async handle({ payload }: HandleOptions) {
		const streamlabsMessage = `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
		await this.streamlabs.alert({
			message: streamlabsMessage,
		});

		const twitchMessage = `🎉 Your repo ${payload.repository.full_name} is configured correctly for ${payload.hook.events} events 🎉`;
		await this.twitchChat.send(twitchMessage);

		return {
			twitchChat: {
				message: twitchMessage,
				notified: true,
			},
			streamlabs: {
				message: streamlabsMessage,
				notified: true,
			},
		};
	}
}
