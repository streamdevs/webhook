import { Config } from '../../config';
import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from '../github/reaction';
import { MergeRequestPayload } from '../../schemas/gitlab/merge-request-payload';

export class MergeRequestOpened extends Reaction<MergeRequestPayload> {
	getStreamLabsMessage({ payload }: ReactionHandleOptions<MergeRequestPayload>): string {
		return `*${payload.user.username}* just opened a merge request in *${payload.repository.name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<MergeRequestPayload>): string {
		return `${payload.user.username} just opened a merge request in ${payload.repository.homepage}`;
	}

	canHandle({ payload, event, config }: ReactionCanHandleOptions<MergeRequestPayload>): boolean {
		return (
			event === 'Merge Request Hook' &&
			payload.object_attributes.state === 'opened' &&
			this.isAllowedByConfig(config, payload)
		);
	}

	private isAllowedByConfig(config: Config | undefined, payload: MergeRequestPayload): boolean {
		return (
			!config ||
			!config.IGNORE_PR_OPENED_BY.includes(payload.user.username) ||
			config.IGNORE_PR_OPENED_BY.length === 0
		);
	}
}
