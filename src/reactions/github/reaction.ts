import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { WebhookPayload } from '../../schemas/github/webhook-payload';

export interface ReactionHandleOptions<P = WebhookPayload> {
	payload: P;
}

export interface ReactionCanHandleOptions<P = WebhookPayload> {
	payload: P;
	event: string;
}

export interface ReactionStatus {
	notified: boolean;
	message: string;
}

export abstract class Reaction<P = WebhookPayload> {
	public constructor(private twitchChat: TwitchChat, private streamlabs: StreamLabs) {}

	abstract getStreamLabsMessage({ payload }: ReactionHandleOptions<P>): string;
	abstract getTwitchChatMessage({ payload }: ReactionHandleOptions<P>): string;
	abstract canHandle({ payload, event }: ReactionCanHandleOptions<P>): boolean;

	private async notifyStreamlabs({ payload }: ReactionHandleOptions<P>): Promise<ReactionStatus> {
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

	private async notifyTwitch({ payload }: ReactionHandleOptions<P>): Promise<ReactionStatus> {
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

	public async handle({
		payload,
	}: ReactionHandleOptions<P>): Promise<{
		streamlabs: ReactionStatus;
		twitchChat: ReactionStatus;
	}> {
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
