import { Reaction, ReactionHandleOptions } from './reaction';

export class Ping extends Reaction {
	getStreamLabsMessage({ payload }: ReactionHandleOptions): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
}
