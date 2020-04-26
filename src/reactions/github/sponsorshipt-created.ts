import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { SponsorshipPayload } from '../../schemas/github/sponsorship-payload';

export class SponsorshipCreated extends Reaction<SponsorshipPayload> {
	getStreamLabsMessage({ payload }: ReactionHandleOptions<SponsorshipPayload>): string {
		return `🎉 *${payload.sponsorship.sponsor.login}* is now a sponsor`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<SponsorshipPayload>): string {
		return `🎉 ${payload.sponsorship.sponsor.login} is now a sponsor`;
	}

	canHandle({ payload, event }: ReactionCanHandleOptions<SponsorshipPayload>): boolean {
		return event === 'sponsorship' && payload.action === 'created';
	}
}
