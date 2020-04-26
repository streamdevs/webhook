import { ForkPayload } from '../../schemas/github/fork-payload';
import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';

export class Fork extends Reaction<ForkPayload> {
	canHandle({ event }: ReactionCanHandleOptions<ForkPayload>): boolean {
		return event === 'fork';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<ForkPayload>): string {
		return `*${payload.forkee.owner.login}* just forked 🍴 *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<ForkPayload>): string {
		return `${payload.forkee.owner.login} just forked 🍴 ${payload.repository.html_url}`;
	}
}
