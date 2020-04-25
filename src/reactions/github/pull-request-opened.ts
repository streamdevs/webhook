import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { PullRequestPayload } from '../../schemas/github/pull-request-payload';

export class PullRequestOpened extends Reaction<PullRequestPayload> {
	canHandle({ payload, event, config }: ReactionCanHandleOptions<PullRequestPayload>): boolean {
		return (
			event === 'pull_request' &&
			payload.action === 'opened' &&
			!(!!config && config.IGNORE_PR_OPENED_BY.includes(payload.sender.login))
		);
	}
	getStreamLabsMessage({ payload }: ReactionHandleOptions<PullRequestPayload>): string {
		return `*${payload.pull_request.user.login}* just opened a pull request in *${payload.repository.full_name}*`;
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions<PullRequestPayload>): string {
		return `*${payload.pull_request.user.login}* just opened a pull request in ${payload.repository.html_url}`;
	}
}
