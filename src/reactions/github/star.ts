import {
	Reaction,
	ReactionCanHandleOptions,
	ReactionHandleOptions,
} from './reaction';

export class Star extends Reaction {
	canHandle({ payload, event }: ReactionCanHandleOptions): boolean {
		return event === 'star' && payload.action === 'created';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions): string {
		return `*${payload.sender.login}* just starred *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions): string {
		return `*${payload.sender.login}* just starred ${payload.repository.html_url}`;
	}
}
