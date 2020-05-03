import { internet, random } from 'faker';
import { merge } from 'lodash';
import { PullRequestPayload } from '../../../src/schemas/github/pull-request-payload';
import { DeepPartial } from 'utility-types';

export class PullRequestPayloadBuilder {
	private payload: PullRequestPayload = {
		action: random.arrayElement([
			'assigned',
			'unassigned',
			'review_requested',
			'review_request_removed',
			'labeled',
			'unlabeled',
			'opened',
			'edited',
			'closed',
			'ready_for_review',
			'locked',
			'unlocked',
			'reopened',
		]),
		pull_request: { user: { login: internet.userName() }, html_url: internet.url() },
		repository: { html_url: internet.url(), full_name: 'streamdevs/webhook' },
		sender: { login: internet.userName() },
	};

	public with(payload: DeepPartial<PullRequestPayload>): PullRequestPayloadBuilder {
		merge(this.payload, payload);

		return this;
	}

	public getInstance(): PullRequestPayload {
		return this.payload;
	}
}
