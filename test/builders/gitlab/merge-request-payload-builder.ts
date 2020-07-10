import { merge } from 'lodash';
import { DeepPartial } from 'utility-types';
import { MergeRequestPayload } from '../../../src/schemas/gitlab/merge-request-payload';

export class MergeRequestPayloadBuilder {
	private payload: MergeRequestPayload = {
		user: {
			name: 'Administrator',
			username: 'root',
			avatar_url:
				'http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon',
		},
		repository: {
			name: 'Gitlab Test',
			url: 'http://example.com/gitlabhq/gitlab-test.git',
			description: 'Aut reprehenderit ut est.',
			homepage: 'http://example.com/gitlabhq/gitlab-test',
		},
		object_attributes: {
			state: 'merged',
			url: 'http://example.com/diaspora/merge_requests/1',
		},
	};

	public with(payload: DeepPartial<MergeRequestPayload>): MergeRequestPayloadBuilder {
		merge(this.payload, payload);

		return this;
	}

	public getInstance(): MergeRequestPayload {
		return this.payload;
	}
}
