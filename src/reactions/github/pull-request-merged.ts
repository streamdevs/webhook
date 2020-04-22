import {
	Reaction,
	ReactionCanHandleOptions,
	ReactionHandleOptions,
} from './reaction';
import { PullRequestPayload } from '../../schemas/github/pull-request-payload';

export class PullRequestMerged extends Reaction<PullRequestPayload> {
	getStreamLabsMessage({
		payload,
	}: ReactionHandleOptions<PullRequestPayload>): string {
		return `The pull request from *${payload.pull_request.user.login}* has been merged into *${payload.repository.full_name}*`;
	}
	getTwitchChatMessage({
		payload,
	}: ReactionHandleOptions<PullRequestPayload>): string {
		return `The pull request from *${payload.pull_request.user.login}* has been merged into ${payload.repository.html_url}`;
	}
	canHandle({
		payload,
		event,
	}: ReactionCanHandleOptions<PullRequestPayload>): boolean {
		return (
			event === 'pull_request' &&
			!!payload.pull_request.merged &&
			payload.action === 'closed'
		);
	}
}
