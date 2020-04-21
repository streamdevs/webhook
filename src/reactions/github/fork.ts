import {ForkPayload} from '../../schemas/github/fork-payload';
import {Reaction, ReactionCanHandleOptions} from "./reaction";

export class Fork extends Reaction {
	canHandle({payload, event}: ReactionCanHandleOptions): boolean {
		return event === 'fork';
	}

	getStreamLabsMessage({payload}: { payload: ForkPayload }): string {
		return `*${payload.forkee.owner.login}* just forked 🍴 *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({payload}: { payload: ForkPayload }): string {
		return `*${payload.forkee.owner.login}* just forked 🍴 ${payload.repository.html_url}`;
	}
}
