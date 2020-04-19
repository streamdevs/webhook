import {
	Reaction,
	ReactionCanHandleOptions,
	ReactionHandleOptions,
} from './reaction';

export class PullRequestOpened extends Reaction {
	canHandle({ payload, event }: ReactionCanHandleOptions): boolean {
		return event === 'pull_request' && payload.action === 'opened';
	}
	getStreamLabsMessage({ payload }: ReactionHandleOptions): string {
		return `*${payload.pull_request.user.login}* just opened a pull request in *${payload.repository.full_name}*`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions): string {
		return `*${payload.pull_request.user.login}* just opened a pull request in ${payload.repository.html_url}`;
	}
}
