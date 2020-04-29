import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';

describe('POST /github', () => {
	describe("GitHub 'fork' event", () => {
		let streamLabsSpy: jest.SpyInstance<Promise<void>>;
		let twitchChatSpy: jest.SpyInstance<Promise<void>>;

		beforeEach(() => {
			streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
			streamLabsSpy.mockImplementationOnce(jest.fn());

			twitchChatSpy = jest.spyOn(TwitchChat.prototype, 'send');
			twitchChatSpy.mockImplementationOnce(jest.fn());
		});

		it('sends an alert to StreamLabs', async () => {
			const subject = await initServer(getConfig());

			const forkOwner = 'john';
			const repositoryFullName = 'john/repo';

			const response = await subject.inject({
				method: 'POST',
				url: '/github',
				payload: {
					repository: { full_name: repositoryFullName },
					forkee: { owner: { login: forkOwner } },
					sender: { login: 'unknown' },
				},
				headers: { 'x-github-event': 'fork' },
			});

			expect(response.statusCode).toEqual(200);
			expect(streamLabsSpy).toHaveBeenCalledWith({
				message: `*${forkOwner}* just forked 🍴 *${repositoryFullName}*`,
			});
		});

		it('sends a message to Twitch Chat', async () => {
			const subject = await initServer(getConfig());

			const forkOwner = 'john';
			const repositoryFullName = 'john/repo';
			const repositoryUrl = 'https://github.com/streamdevs/webhook';

			const response = await subject.inject({
				method: 'POST',
				url: '/github',
				payload: {
					repository: {
						full_name: repositoryFullName,
						html_url: repositoryUrl,
					},
					forkee: { owner: { login: forkOwner } },
					sender: { login: 'unknown' },
				},
				headers: { 'x-github-event': 'fork' },
			});

			expect(response.statusCode).toEqual(200);
			expect(twitchChatSpy).toHaveBeenCalledWith(`${forkOwner} just forked 🍴 ${repositoryUrl}`);
		});
	});
});
