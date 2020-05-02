import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { PingPayload } from '../../schemas/github/ping-payload';

export class Ping extends Reaction<PingPayload> {
	canHandle({ payload, event }: ReactionCanHandleOptions<PingPayload>): boolean {
		const compatibleEvents = [
			'star',
			'fork',
			'pull_request',
			'issues',
			'check_run',
			'sponsorship',
			'release',
		];

		return (
			event === 'ping' &&
			payload.hook.events.some((hookEvent) => compatibleEvents.includes(hookEvent))
		);
	}
	getStreamLabsMessage({ payload }: ReactionHandleOptions<PingPayload>): string {
		return `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *${payload.hook.events}* events 🎉`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions<PingPayload>): string {
		return `🎉 Your repo ${payload.repository.full_name} is configured correctly for ${payload.hook.events} events 🎉`;
	}
}
