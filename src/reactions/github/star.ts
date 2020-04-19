import { Reaction, ReactionHandleOptions } from './reaction';

export class Star extends Reaction {
	getStreamLabsMessage({ payload }: ReactionHandleOptions): string {
		return `*${payload.sender.login}* just starred *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions): string {
		return `*${payload.sender.login}* just starred ${payload.repository.html_url}`;
	}
}
