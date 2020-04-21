import {
	Reaction,
	ReactionCanHandleOptions,
	ReactionHandleOptions,
} from './reaction';

export class PullRequestMerged extends Reaction {
	getStreamLabsMessage({ payload }: ReactionHandleOptions): string {
		return `The pull request from *${payload.pull_request.user.login}* has been merged into *${payload.repository.full_name}*`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions): string {
		return `The pull request from *${payload.pull_request.user.login}* has been merged into ${payload.repository.html_url}`;
	}
	canHandle({ payload, event }: ReactionCanHandleOptions): boolean {
		return (
			event === 'pull_request' &&
			payload.pull_request.merged &&
			payload.action === 'closed'
		);
	}
}
