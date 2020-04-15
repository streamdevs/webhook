const { initServer } = require('../../../src/server');
const { getConfig } = require('../../../src/config');
const { StreamLabs } = require('../../../src/services/StreamLabs');
const { TwitchChat } = require('../../../src/services/TwitchChat');

describe('server', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /github', () => {
		let config;

		beforeEach(() => {
			config = getConfig();
		});

		it('returns 400 on requests without payload', async () => {
			const subject = await initServer(config);

			const { statusCode } = await subject.inject({
				method: 'POST',
				url: '/github',
				headers: {
					'X-GitHub-Event': 'ping',
				},
			});

			expect(statusCode).toBe(400);
		});

		it("returns 400 on requests without 'X-GitHub-Event' header", async () => {
			const subject = await initServer(config);

			const { statusCode } = await subject.inject({
				method: 'POST',
				url: '/github',
				payload: {
					action: 'created',
					repository: {
						full_name: 'a',
					},
					sender: {
						login: 'b',
					},
				},
			});

			expect(statusCode).toBe(400);
		});

		it('handles unknown actions gracefully', async () => {
			const subject = await initServer(config);

			const { statusCode, result } = await subject.inject({
				method: 'POST',
				url: '/github',
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'project',
				},
				payload: {
					hook: { events: ['created'] },
					sender: {
						login: 'user',
					},
					repository: {
						full_name: 'org/repo',
					},
				},
			});

			expect(statusCode).toBe(200);
			expect(result).toEqual({ message: `Ignoring event: 'project'` });
		});

		describe("GitHub 'ping' event", () => {
			it('calls the alert method with the expected message', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});

				const repositoryFullName = 'streamdevs/webhook',
					senderLogin = 'orestes';

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload: {
						hook: {
							events: ['star'],
						},
						repository: {
							full_name: repositoryFullName,
						},
						sender: {
							login: senderLogin,
						},
					},
				});

				const expectedPayload = {
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *star* events 🎉`,
				};

				expect(spy).toHaveBeenCalledWith(expectedPayload);
			});

			it("sends a webhook configured notification to StreamLabs with 'pull_request' events", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});

				const repositoryFullName = 'streamdevs/webhook',
					senderLogin = 'orestes';

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload: {
						hook: {
							events: ['pull_request'],
						},
						repository: {
							full_name: repositoryFullName,
						},
						sender: {
							login: senderLogin,
						},
					},
				});

				const expectedPayload = {
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *pull_request* events 🎉`,
				};

				expect(spy).toHaveBeenCalledWith(expectedPayload);
			});

			it("sends a webhook configured notification to StreamLabs with 'pull_request' and 'star' events", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});

				const repositoryFullName = 'streamdevs/webhook',
					senderLogin = 'orestes';

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload: {
						hook: {
							events: ['pull_request', 'star'],
						},
						repository: {
							full_name: repositoryFullName,
						},
						sender: {
							login: senderLogin,
						},
					},
				});

				const expectedPayload = {
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *pull_request,star* events 🎉`,
				};

				expect(spy).toHaveBeenCalledWith(expectedPayload);
			});
		});

		describe("GitHub 'star' event", () => {
			let spyTwitchChat;
			let spyStreamLabs;
			let payload;

			beforeEach(() => {
				spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
				spyTwitchChat.mockImplementationOnce(async () => ({}));

				spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
				spyStreamLabs.mockImplementationOnce(() => {});

				payload = {
					action: 'created',
					repository: {
						full_name: 'streamdevs/webhook',
						html_url: 'https://github.com/streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				};
			});

			describe('StreamLabs events', () => {
				it('sends a started notification to StreamLabs when a created star event is received', async () => {
					const subject = await initServer(config);

					await subject.inject({
						method: 'POST',
						url: '/github',
						headers: {
							'Content-Type': 'application/json',
							'X-GitHub-Event': 'star',
						},
						payload,
					});

					const expectedPayload = {
						message: `*${payload.sender.login}* just starred *${payload.repository.full_name}*`,
					};

					expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
				});

				it('ignores the deleted star event', async () => {
					const subject = await initServer(config);

					await subject.inject({
						method: 'POST',
						url: '/github',
						headers: {
							'Content-Type': 'application/json',
							'X-GitHub-Event': 'star',
						},
						payload: {
							...payload,
							action: 'deleted',
						},
					});

					expect(spyStreamLabs).not.toHaveBeenCalled();
				});
			});

			describe('TwitchChat messages', () => {
				it('send a started message to Twitch Chat when the start event is received', async () => {
					const subject = await initServer(config);

					const repositoryUrl = 'https://github.com/streamdevs/webhook';
					const senderLogin = 'orestes';

					await subject.inject({
						method: 'POST',
						url: '/github',
						headers: {
							'Content-Type': 'application/json',
							'X-GitHub-Event': 'star',
						},
						payload: {
							action: 'created',
							repository: {
								full_name: 'blablabla',
								html_url: repositoryUrl,
							},
							sender: {
								login: senderLogin,
							},
						},
					});

					expect(spyTwitchChat).toHaveBeenCalledWith(
						`${senderLogin} just starred ${repositoryUrl}`,
					);
				});

				it('ignores the deleted star event', async () => {
					const subject = await initServer(config);

					await subject.inject({
						method: 'POST',
						url: '/github',
						headers: {
							'Content-Type': 'application/json',
							'X-GitHub-Event': 'star',
						},
						payload: {
							...payload,
							action: 'deleted',
						},
					});

					expect(spyTwitchChat).not.toHaveBeenCalled();
				});
			});
		});

		describe("GitHub 'pull_request' event", () => {
			it('sends the notification to StreamLabs when a pull request was opened', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'opened',
						repository: { full_name: repositoryFullName },
						pull_request: { login: pullRequestLogin },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				const expectedPayload = {
					message: `*${pullRequestLogin}* just opened a pull request in *${repositoryFullName}*`,
				};
				expect(spy).toHaveBeenCalledWith(expectedPayload);
			});

			it("ignores other 'pull_request' event", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'assigned',
						repository: { full_name: repositoryFullName },
						pull_request: { login: pullRequestLogin },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spy).not.toHaveBeenCalled();
				expect(statusCode).toBe(200);
			});

			it("ignores other 'closed' event when it is not merged", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						pull_request: { login: pullRequestLogin },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spy).not.toHaveBeenCalled();
				expect(statusCode).toEqual(200);
			});

			it('sends a notification to StreamLabs when a pull request was merged', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(StreamLabs.prototype, 'alert');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const pullRequestLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						pull_request: { login: pullRequestLogin, merged: true },
						sender: { login: 'pepe' },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				const expectedPayload = {
					message: `The pull request from *${pullRequestLogin}* has been merged into *${repositoryFullName}*`,
				};

				expect(spy).toHaveBeenCalledWith(expectedPayload);
			});
		});

		describe("GitHub 'fork' event", () => {
			it('sends an alert to StreamLabs', async () => {
				const streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');

				const config = {};
				const subject = await initServer(config);

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
				expect(streamLabsSpy).toHaveBeenCalledWith(
					`*${forkOwner}* just forked 🍴 *${repositoryFullName}*`,
				);
			});
		});
	});
});
