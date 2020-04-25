import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { IssuePayload } from '../../../src/schemas/github/issue-payload';

describe('POST /github', () => {
	let payload: IssuePayload;

	beforeEach(() => {
		payload = {
			action: 'assigned',
			assignee: { login: 'SantiMA10' },
			sender: { login: 'SantiMA10' },
			repository: {
				html_url: 'https://github.com/streamdevs/webhook',
				full_name: 'streamdevs/webhook',
			},
		};
	});

	it('returns a 200 OK', async () => {
		const subject = await initServer(getConfig());

		const { statusCode } = await subject.inject({
			method: 'POST',
			url: '/github',
			headers: { 'X-GitHub-Event': 'issues' },
			payload,
		});

		expect(statusCode).toEqual(200);
	});

	it('returns the expected message', async () => {
		const subject = await initServer(getConfig());

		const { result } = await subject.inject({
			method: 'POST',
			url: '/github',
			headers: { 'X-GitHub-Event': 'issues' },
			payload,
		});

		expect(result).toEqual({
			messages: expect.arrayContaining([
				{
					streamlabs: { notified: false, message: '' },
					twitchChat: { notified: false, message: '' },
				},
			]),
		});
	});
});
