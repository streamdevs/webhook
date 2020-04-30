import { Reaction, ReactionHandleOptions, ReactionCanHandleOptions } from '../github/reaction';

export class MergeRequestOpened extends Reaction<any> {
	getStreamLabsMessage({ payload }: ReactionHandleOptions<any>): string {
		throw new Error('Method not implemented.');
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions<any>): string {
		throw new Error('Method not implemented.');
	}
	canHandle({ payload, event, config }: ReactionCanHandleOptions<any>): boolean {
		return (
			event === 'Merge Request Hook' &&
			payload.object_attributes.state === 'opened' &&
			(!config ||
				!config.IGNORE_PR_OPENED_BY.includes(payload.user.username) ||
				config.IGNORE_PR_OPENED_BY.length === 0)
		);
	}
}
