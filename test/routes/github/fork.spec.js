const { initServer } = require('../../../src/server');
const { getConfig } = require('../../../src/config');
const { StreamLabs } = require('../../../src/services/StreamLabs');
const { TwitchChat } = require('../../../src/services/TwitchChat');

describe('POST /github', () => {
	describe("GitHub 'fork' event", () => {
		let streamLabsSpy;
		let twitchChatSpy;

		beforeEach(() => {
			streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
			streamLabsSpy.mockImplementationOnce(() => {});

			twitchChatSpy = jest.spyOn(TwitchChat.prototype, 'send');
			twitchChatSpy.mockImplementationOnce(() => {});
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
			expect(twitchChatSpy).toHaveBeenCalledWith(
				`*${forkOwner}* just forked 🍴 ${repositoryUrl}`,
			);
		});
	});
});
