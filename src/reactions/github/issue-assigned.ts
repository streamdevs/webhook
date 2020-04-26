import {
	Reaction,
	ReactionHandleOptions,
	ReactionCanHandleOptions,
} from './reaction';
import { IssuePayload } from '../../schemas/github/issue-payload';

export class IssueAssigned extends Reaction {
	getStreamLabsMessage({
		payload,
	}: ReactionHandleOptions<IssuePayload>): string {
		return `*${payload.assignee?.login}* has a new assigned issue in *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({
		payload,
	}: ReactionHandleOptions<IssuePayload>): string {
		return `/me ${payload.assignee?.login} has a new assigned issue in ${payload.repository.html_url}`;
	}

	canHandle({
		payload,
		event,
		config,
	}: ReactionCanHandleOptions<IssuePayload>): boolean {
		return (
			event === 'issues' &&
			payload.action === 'assigned' &&
			!!payload.assignee &&
			(!config ||
				config.NOTIFY_ASSIGNED_ISSUES_TO.length === 0 ||
				config.NOTIFY_ASSIGNED_ISSUES_TO.includes(payload.assignee.login))
		);
	}
}
