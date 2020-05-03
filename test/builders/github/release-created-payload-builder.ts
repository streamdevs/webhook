import { ReleaseCreatedPayload } from '../../../src/schemas/github/release-created-payload';
import { merge } from 'lodash';

export class ReleaseCreatedPayloadBuilder {
	private payload: ReleaseCreatedPayload = {
		sender: {
			login: 'orestes',
		},
		repository: {
			full_name: 'streamdevs/webhook',
			html_url: 'http://github.com/streamdevs/webhook',
		},
		action: 'created',
		release: {
			tag_name: '1.0.0',
			html_url: 'http://github.com/streamdevs/webhook/releases/1.0.0',
		},
	};

	getInstance(): ReleaseCreatedPayload {
		return this.payload;
	}

	with(values: Partial<ReleaseCreatedPayload>): ReleaseCreatedPayloadBuilder {
		this.payload = merge(this.payload, values);

		return this;
	}
}
