import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { ReleasePayload } from '../../schemas/github/release-payload';

export class ReleaseCreated extends Reaction<ReleasePayload> {
	canHandle({ payload, event }: ReactionCanHandleOptions<ReleasePayload>): boolean {
		return event === 'release' && payload.action === 'published';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<ReleasePayload>): string {
		const {
			repository: { full_name: repositoryFullName },
			release: { tag_name: releaseName },
		} = payload;

		return `${repositoryFullName} version ${releaseName} has just been released 🚀!`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<ReleasePayload>): string {
		const {
			repository: { full_name: repositoryFullName },
			release: { tag_name: releaseName, html_url: releaseUrl },
		} = payload;

		return `${repositoryFullName} version ${releaseName} has just been released 🚀! Check it out ${releaseUrl}`;
	}
}
