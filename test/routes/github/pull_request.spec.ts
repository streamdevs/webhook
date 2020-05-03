import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { PullRequestPayloadBuilder } from '../../builders/github/pull-request-payload-builder';

describe('POST /github', () => {
	describe("GitHub 'pull_request' event", () => {
		let spyStreamLabs: jest.SpyInstance<Promise<void>>;
		let spyTwitchChat: jest.SpyInstance<Promise<void>>;

		beforeEach(() => {
			spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
			spyStreamLabs.mockImplementationOnce(jest.fn());

			spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
			spyTwitchChat.mockImplementationOnce(jest.fn());
		});

		it('handles the pull request opened event', async () => {
			const subject = await initServer(getConfig());
			const payload = new PullRequestPayloadBuilder().with({ action: 'opened' }).getInstance();

			const { result } = await subject.inject({
				method: 'POST',
				url: '/github',
				payload,
				headers: { 'x-github-event': 'pull_request' },
			});

			expect(result).toEqual(
				expect.objectContaining({
					messages: [
						expect.objectContaining({
							twitchChat: expect.anything(),
							streamlabs: expect.anything(),
						}),
					],
				}),
			);
		});

		it('handles the pull request merged event', async () => {
			const subject = await initServer(getConfig());
			const payload = new PullRequestPayloadBuilder()
				.with({ action: 'closed', pull_request: { merged: true } })
				.getInstance();

			const { result } = await subject.inject({
				method: 'POST',
				url: '/github',
				payload,
				headers: { 'x-github-event': 'pull_request' },
			});

			expect(result).toEqual(
				expect.objectContaining({
					messages: [
						expect.objectContaining({
							twitchChat: expect.anything(),
							streamlabs: expect.anything(),
						}),
					],
				}),
			);
		});

		it('ignores other pull request events', async () => {
			const subject = await initServer(getConfig());
			const payload = new PullRequestPayloadBuilder()
				.with({ action: 'edited', pull_request: { merged: true } })
				.getInstance();

			const { result } = await subject.inject({
				method: 'POST',
				url: '/github',
				payload,
				headers: { 'x-github-event': 'pull_request' },
			});

			expect(result).toEqual(
				expect.objectContaining({
					message: expect.anything(),
				}),
			);
		});
	});
});
