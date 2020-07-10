import { IssuePayload } from '../../../src/schemas/github/issue-payload';
import { random, internet } from 'faker';
import { merge } from 'lodash';

export class IssuePayloadBuilder {
	private payload: IssuePayload = {
		action: random.arrayElement(['opened', 'assigned']),
		repository: {
			full_name: 'streamdevs/webhook',
			html_url: 'https://github.com/streamdevs/webhook',
		},
		sender: { login: internet.userName() },
		assignee: { login: internet.userName() },
		issue: { html_url: internet.url() },
	};

	public with(payload: Partial<IssuePayload>): IssuePayloadBuilder {
		merge(this.payload, payload);

		return this;
	}

	public getInstance(): IssuePayload {
		return this.payload;
	}
}
