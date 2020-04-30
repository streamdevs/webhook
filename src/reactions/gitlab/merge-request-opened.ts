import { Config } from '../../config';
import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from '../github/reaction';

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
			this.isAllowedByConfig(config, payload)
		);
	}

	private isAllowedByConfig(config: Config | undefined, payload: any): boolean {
		return (
			!config ||
			!config.IGNORE_PR_OPENED_BY.includes(payload.user.username) ||
			config.IGNORE_PR_OPENED_BY.length === 0
		);
	}
}
