import { getConfig } from '../../../src/config';
import { IssuePayload } from '../../../src/schemas/github/issue-payload';
import { initServer } from '../../../src/server';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { IssuePayloadBuilder } from '../../builders/github/issue-payload-builder';

describe('POST /github', () => {
	let payload: IssuePayload;

	let streamLabsSpy: jest.SpyInstance<Promise<void>>;
	let twitchChatSpy: jest.SpyInstance<Promise<void>>;

	beforeEach(() => {
		streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
		streamLabsSpy.mockImplementationOnce(jest.fn());

		twitchChatSpy = jest.spyOn(TwitchChat.prototype, 'send');
		twitchChatSpy.mockImplementationOnce(jest.fn());

		payload = new IssuePayloadBuilder()
			.with({
				action: 'assigned',
				assignee: { login: 'SantiMA10' },
				sender: { login: 'SantiMA10' },
				repository: {
					html_url: 'https://github.com/streamdevs/webhook',
					full_name: 'streamdevs/webhook',
				},
			})
			.getInstance();
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
					streamlabs: expect.objectContaining({ notified: true }),
					twitchChat: expect.objectContaining({ notified: true }),
				},
			]),
		});
	});
});
