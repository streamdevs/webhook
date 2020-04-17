const { initServer } = require('../../../src/server');
const { getConfig } = require('../../../src/config');
const { StreamLabs } = require('../../../src/services/StreamLabs');
const { TwitchChat } = require('../../../src/services/TwitchChat');

describe('POST /github', () => {
	describe("GitHub 'pull_request' event", () => {
		let spyStreamLabs;
		let spyTwitchChat;

		beforeEach(() => {
			spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
			spyStreamLabs.mockImplementationOnce(() => {});

			spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
			spyTwitchChat.mockImplementationOnce(() => {});
		});

		describe('StreamLabs alerts', () => {
			it('sends the notification to StreamLabs when a pull request was opened', async () => {
				const subject = await initServer(getConfig());
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'opened',
						repository: { full_name: repositoryFullName },
						pull_request: { user: { login: pullRequestLogin } },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				const expectedPayload = {
					message: `*${pullRequestLogin}* just opened a pull request in *${repositoryFullName}*`,
				};
				expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
			});

			it("ignores other 'pull_request' event", async () => {
				const subject = await initServer(getConfig());
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'assigned',
						repository: { full_name: repositoryFullName },
						pull_request: { user: { login: pullRequestLogin } },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spyStreamLabs).not.toHaveBeenCalled();
				expect(statusCode).toBe(200);
			});

			it("ignores other 'closed' event when it is not merged", async () => {
				const subject = await initServer(getConfig());
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						pull_request: { user: { login: pullRequestLogin } },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spyStreamLabs).not.toHaveBeenCalled();
				expect(statusCode).toEqual(200);
			});

			it('sends a notification to StreamLabs when a pull request was merged', async () => {
				const subject = await initServer(getConfig());
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						pull_request: { user: { login: pullRequestLogin }, merged: true },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				const expectedPayload = {
					message: `The pull request from *${pullRequestLogin}* has been merged into *${repositoryFullName}*`,
				};

				expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
			});
		});

		describe('TwitchChat send', () => {
			it('sends the message to the Twitch chat when a pull request was opened', async () => {
				const subject = await initServer(getConfig());
				const repositoryUrl = 'https://github.com/streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'opened',
						repository: {
							full_name: 'streamdevs/webhook',
							html_url: repositoryUrl,
						},
						pull_request: { user: { login: pullRequestLogin } },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spyTwitchChat).toHaveBeenCalledWith(
					`${pullRequestLogin} just opened a pull request in ${repositoryUrl}`,
				);
			});

			it('sends the message to the Twitch chat when a pull request was merged', async () => {
				const subject = await initServer(getConfig());
				const repositoryUrl = 'https://github.com/streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: {
							full_name: 'streamdevs/webhook',
							html_url: repositoryUrl,
						},
						pull_request: { user: { login: pullRequestLogin }, merged: true },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spyTwitchChat).toHaveBeenCalledWith(
					`The pull request from ${pullRequestLogin} has been merged into ${repositoryUrl}`,
				);
			});

			it("ignores other 'pull_request' event", async () => {
				const subject = await initServer(getConfig());
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'assigned',
						repository: { full_name: repositoryFullName },
						pull_request: { user: { login: pullRequestLogin } },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spyTwitchChat).not.toHaveBeenCalled();
				expect(statusCode).toBe(200);
			});

			it("ignores other 'closed' event when it is not merged", async () => {
				const subject = await initServer(getConfig());
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						pull_request: { user: { login: pullRequestLogin } },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spyTwitchChat).not.toHaveBeenCalled();
				expect(statusCode).toEqual(200);
			});
		});
	});
});
