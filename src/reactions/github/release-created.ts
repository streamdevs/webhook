import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { ReleaseCreatedPayload } from '../../schemas/github/release-created-payload';

export class ReleaseCreated extends Reaction<ReleaseCreatedPayload> {
	canHandle({ payload, event }: ReactionCanHandleOptions<ReleaseCreatedPayload>): boolean {
		return event === 'release' && payload.action === 'published';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<ReleaseCreatedPayload>): string {
		const {
			repository: { full_name: repositoryFullName },
			release: { tag_name: releaseName },
		} = payload;

		return `*${repositoryFullName}* version *${releaseName}* has just been released 🚀!`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<ReleaseCreatedPayload>): string {
		const {
			repository: { full_name: repositoryFullName },
			release: { tag_name: releaseName, html_url: releaseUrl },
		} = payload;

		return `${repositoryFullName} version ${releaseName} has just been released 🚀! Check it out ${releaseUrl}`;
	}
}
