import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { PingPayload } from '../../schemas/github/ping-payload';

export class Ping extends Reaction<PingPayload> {
	canHandle({ payload, event }: ReactionCanHandleOptions<PingPayload>): boolean {
		return (
			event === 'ping' &&
			(payload.hook.events.includes('star') ||
				payload.hook.events.includes('fork') ||
				payload.hook.events.includes('pull_request'))
		);
	}
	getStreamLabsMessage({ payload }: ReactionHandleOptions<PingPayload>): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions<PingPayload>): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
}
