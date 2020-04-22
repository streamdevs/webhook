import {
	Reaction,
	ReactionHandleOptions,
	ReactionCanHandleOptions,
} from './reaction';
import { IssuePayload } from '../../schemas/github/issue-payload';

export class IssueOpened extends Reaction<IssuePayload> {
	getStreamLabsMessage({
		payload,
	}: ReactionHandleOptions<IssuePayload>): string {
		return `*${payload.sender.login}* opened a issue in *${payload.repository.full_name}*`;
	}
	getTwitchChatMessage({
		payload,
	}: ReactionHandleOptions<IssuePayload>): string {
		return `*${payload.sender.login}* opened a issue in ${payload.repository.html_url}`;
	}
	canHandle({
		payload,
		event,
	}: ReactionCanHandleOptions<IssuePayload>): boolean {
		return event === 'issues' && payload.action === 'opened';
	}
}
