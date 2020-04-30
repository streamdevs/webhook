import { Reaction, ReactionHandleOptions, ReactionCanHandleOptions } from '../github/reaction';

export class MergeRequestOpened extends Reaction<any> {
	getStreamLabsMessage({ payload }: ReactionHandleOptions<any>): string {
		throw new Error('Method not implemented.');
	}
	getTwitchChatMessage({ payload }: ReactionHandleOptions<any>): string {
		throw new Error('Method not implemented.');
	}
	canHandle({ payload, event }: ReactionCanHandleOptions<any>): boolean {
		return true;
	}
}
