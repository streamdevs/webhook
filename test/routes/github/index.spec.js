const { initServer } = require('../../../src/server');
const { getConfig } = require('../../../src/config');
const axios = require('axios');

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
					'X-GitHub-Event': 'fork',
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
			expect(result).toEqual({ message: `Ignoring event: 'fork'` });
		});

		describe("GitHub 'ping' event", () => {
			it("sends a webhook configured notification to StreamLabs with 'star' events", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
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
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *star* events 🎉`,
				};

				expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
			});

			it("sends a webhook configured notification to StreamLabs with 'pull_request' events", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
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
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *pull_request* events 🎉`,
				};

				expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
			});

			it("sends a webhook configured notification to StreamLabs with 'pull_request' and 'star' events", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
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
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *pull_request,star* events 🎉`,
				};

				expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
			});
		});

		describe("GitHub 'star' event", () => {
			it('sends a started notification to StreamLabs when a created star event is received', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});

				const repositoryFullName = 'streamdevs/webhook',
					senderLogin = 'orestes';

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
							full_name: repositoryFullName,
						},
						sender: {
							login: senderLogin,
						},
					},
				});

				const expectedPayload = {
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `*${senderLogin}* just starred *${repositoryFullName}*`,
				};

				expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
			});

			it('ignores the deleted star event', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});

				const repositoryFullName = 'streamdevs/webhook',
					senderLogin = 'orestes';

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'star',
					},
					payload: {
						action: 'deleted',
						repository: {
							full_name: repositoryFullName,
						},
						sender: {
							login: senderLogin,
						},
					},
				});

				expect(spy).not.toHaveBeenCalled();
			});
		});

		describe("GitHub 'pull_request' event", () => {
			it('sends the notification to StreamLabs when a pull request was opened', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const senderLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'opened',
						repository: { full_name: repositoryFullName },
						sender: { login: senderLogin },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				const expectedPayload = {
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `*${senderLogin}* just opened a pull request in *${repositoryFullName}*`,
				};
				expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
			});

			it("ignores other 'pull_request' event", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const senderLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'assigned',
						repository: { full_name: repositoryFullName },
						sender: { login: senderLogin },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spy).not.toHaveBeenCalled();
			});
		});

		describe("GitHub 'pull_request' event", () => {
			it("ignores other 'pull_request' event", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const senderLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'assigned',
						repository: { full_name: repositoryFullName },
						sender: { login: senderLogin },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spy).not.toHaveBeenCalled();
			});

			it("ignores other 'closed' event when it is not merged", async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const senderLogin = 'SantiMA10';

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						sender: { login: senderLogin },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				expect(spy).not.toHaveBeenCalled();
				expect(statusCode).toEqual(200);
			});

			it('sends a notification to StreamLabs when a pull request was merged', async () => {
				const subject = await initServer(config);
				const spy = jest.spyOn(axios, 'post');
				spy.mockImplementationOnce(() => {});
				const repositoryFullName = 'streamdevs/webhook';
				const senderLogin = 'SantiMA10';

				await subject.inject({
					method: 'POST',
					url: '/github',
					payload: {
						action: 'closed',
						repository: { full_name: repositoryFullName },
						sender: { login: senderLogin },
						pull_request: { merged: true },
					},
					headers: { 'x-github-event': 'pull_request' },
				});

				const expectedPayload = {
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `The pull request from *${senderLogin}* just merged *${repositoryFullName}*`,
				};

				expect(spy).toHaveBeenCalledWith(expect.any(String), expectedPayload);
			});
		});
	});
});
