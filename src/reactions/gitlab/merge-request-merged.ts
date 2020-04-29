import { MergeRequestPayload } from '../../schemas/gitlab/merge-request-payload';
import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from '../github/reaction';

export class MergeRequestMerged extends Reaction<MergeRequestPayload> {
	getStreamLabsMessage({ payload }: ReactionHandleOptions<MergeRequestPayload>): string {
		return `The merge request from *${payload.user.username}* has been merged into *${payload.repository.name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<MergeRequestPayload>): string {
		return `The merge request from ${payload.user.username} has been merged into ${payload.repository.homepage}`;
	}

	canHandle({ payload, event }: ReactionCanHandleOptions<MergeRequestPayload>): boolean {
		return event === 'Merge Request Hook' && payload.object_attributes.state === 'merged';
	}
}
