import {
	Reaction,
	ReactionCanHandleOptions,
	ReactionHandleOptions,
} from './reaction';

export class Ping extends Reaction {
	canHandle({ payload, event }: ReactionCanHandleOptions): boolean {
		return (
			event === 'ping' &&
			(payload.hook.events.includes('star') ||
				payload.hook.events.includes('fork') ||
				payload.hook.events.includes('pull_request'))
		);
	}
	getStreamLabsMessage({ payload }: ReactionHandleOptions): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
}
