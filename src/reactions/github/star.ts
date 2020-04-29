import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { StarPayload } from '../../schemas/github/star-payload';

export class Star extends Reaction {
	canHandle({ payload, event }: ReactionCanHandleOptions<StarPayload>): boolean {
		return event === 'star' && payload.action === 'created';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<StarPayload>): string {
		return `*${payload.sender.login}* just starred *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<StarPayload>): string {
		return `${payload.sender.login} just starred ${payload.repository.html_url}`;
	}
}
