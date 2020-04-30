import { Reaction } from '../github/reaction';

export class MergeRequestOpened extends Reaction {
	getStreamLabsMessage({
		payload,
	}: import('../github/reaction').ReactionHandleOptions<
		import('../../schemas/github/webhook-payload').WebhookPayload
	>): string {
		throw new Error('Method not implemented.');
	}
	getTwitchChatMessage({
		payload,
	}: import('../github/reaction').ReactionHandleOptions<
		import('../../schemas/github/webhook-payload').WebhookPayload
	>): string {
		throw new Error('Method not implemented.');
	}
	canHandle({
		payload,
		event,
	}: import('../github/reaction').ReactionCanHandleOptions<
		import('../../schemas/github/webhook-payload').WebhookPayload
	>): boolean {
		throw new Error('Method not implemented.');
	}
}
