import { SponsorshipPayload } from '../../../src/schemas/github/sponsorship-payload';
import { internet, random } from 'faker';
import { merge } from 'lodash';

export class SponsorshipPayloadBuilder {
	private payload: SponsorshipPayload = {
		action: random.arrayElement([
			'created',
			'cancelled',
			'edited',
			'tier_changed',
			'pending_cancellation',
			'pending_tier_change',
		]),
		sponsorship: {
			sponsorable: {
				login: internet.userName(),
			},
			sponsor: {
				login: internet.userName(),
			},
		},
		sender: { login: internet.userName() },
	};

	public getInstance(): SponsorshipPayload {
		return this.payload;
	}

	public with(payload: Partial<SponsorshipPayload>): SponsorshipPayloadBuilder {
		merge(this.payload, payload);

		return this;
	}
}
