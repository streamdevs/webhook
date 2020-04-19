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

	private async notifyStreamlabs({ payload }: HandleOptions) {
		try {
			const streamlabsMessage = `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
			await this.streamlabs.alert({
				message: streamlabsMessage,
			});

			return {
				notified: true,
				message: streamlabsMessage,
			};
		} catch {
			// TODO: add logging

			return {
				notified: false,
				message: '',
			};
		}
	}

	private async notifyTwitch({ payload }: HandleOptions) {
		try {
			const message = `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
			await this.twitchChat.send(message);

			return {
				notified: true,
				message,
			};
		} catch {
			// TODO: add logging

			return {
				notified: false,
				message: '',
			};
		}
	}

	public async handle({ payload }: HandleOptions) {
		const [streamlabs, twitchChat] = await Promise.all([
			this.notifyStreamlabs({ payload }),
			this.notifyTwitch({ payload }),
		]);

		return {
			twitchChat,
			streamlabs,
		};
	}
}
