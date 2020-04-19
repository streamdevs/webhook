import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';

export interface ReactionHandleOptions {
	// FIXME: add Payload type
	payload: any;
}

export abstract class Reaction {
	public constructor(
		private twitchChat: TwitchChat,
		private streamlabs: StreamLabs,
	) {}

	abstract getStreamLabsMessage({ payload }: ReactionHandleOptions): string;
	abstract getTwitchChatMessage({ payload }: ReactionHandleOptions): string;

	private async notifyStreamlabs({ payload }: ReactionHandleOptions) {
		try {
			const message = this.getStreamLabsMessage({ payload });
			await this.streamlabs.alert({
				message,
			});

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

	private async notifyTwitch({ payload }: ReactionHandleOptions) {
		try {
			const message = this.getTwitchChatMessage({ payload });
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

	public async handle({ payload }: ReactionHandleOptions) {
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
