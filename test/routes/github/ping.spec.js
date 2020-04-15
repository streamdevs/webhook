const { initServer } = require('../../../src/server');
const { getConfig } = require('../../../src/config');
const { StreamLabs } = require('../../../src/services/StreamLabs');
const { TwitchChat } = require('../../../src/services/TwitchChat');

describe('POST /github', () => {
	describe("GitHub 'ping' event", () => {
		let spyStreamLabs;
		let spyTwitchChat;

		beforeEach(() => {
			spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
			spyStreamLabs.mockImplementationOnce(() => {});

			spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
			spyTwitchChat.mockImplementationOnce(() => {});
		});

		describe("with 'fork' events", () => {
			let payload;

			beforeEach(() => {
				payload = {
					hook: {
						events: ['fork'],
					},
					repository: {
						full_name: 'streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				};
			});

			it('sends a notification to StreamLabs', async () => {
				const subject = await initServer(getConfig());

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				const expectedPayload = {
					message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *fork* events 🎉`,
				};

				expect(statusCode).toBe(200);
				expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
			});

			it('sends a notification to TwitchChat', async () => {
				const subject = await initServer(getConfig());

				const { statusCode } = await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				expect(statusCode).toBe(200);
				expect(spyTwitchChat).toHaveBeenCalledWith(
					`🎉 Your repo ${payload.repository.full_name} is configured correctly for fork events 🎉`,
				);
			});
		});

		describe("with 'pull_request' events", () => {
			let payload;

			beforeEach(() => {
				payload = {
					hook: {
						events: ['pull_request'],
					},
					repository: {
						full_name: 'streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				};
			});

			it('sends a notification to StreamLabs', async () => {
				const subject = await initServer(getConfig());

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				const expectedPayload = {
					message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *pull_request* events 🎉`,
				};

				expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
			});

			it('sends a message to TwitchChat', async () => {
				const subject = await initServer(getConfig());

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				expect(spyTwitchChat).toHaveBeenCalledWith(
					`🎉 Your repo ${payload.repository.full_name} is configured correctly for pull_request events 🎉`,
				);
			});
		});

		describe("with 'star' events", () => {
			let payload;

			beforeEach(() => {
				payload = {
					hook: {
						events: ['star'],
					},
					repository: {
						full_name: 'streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				};
			});

			it('sends a notification to StreamLabs', async () => {
				const subject = await initServer(getConfig());

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				const expectedPayload = {
					message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *star* events 🎉`,
				};

				expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
			});

			it('sends a message to TwitchChat', async () => {
				const subject = await initServer(getConfig());

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				expect(spyTwitchChat).toHaveBeenCalledWith(
					`🎉 Your repo ${payload.repository.full_name} is configured correctly for star events 🎉`,
				);
			});
		});

		describe("with 'fork', 'star' and 'pull_request' events", () => {
			let payload;

			beforeEach(() => {
				payload = {
					hook: {
						events: ['star', 'fork', 'pull_request'],
					},
					repository: {
						full_name: 'streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				};
			});

			it('sends a notification to StreamLabs', async () => {
				const subject = await initServer(getConfig());

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				const expectedPayload = {
					message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *star,fork,pull_request* events 🎉`,
				};

				expect(spyStreamLabs).toHaveBeenCalledWith(expectedPayload);
			});

			it('sends a message to TwitchChat', async () => {
				const subject = await initServer(getConfig());

				await subject.inject({
					method: 'POST',
					url: '/github',
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'ping',
					},
					payload,
				});

				expect(spyTwitchChat).toHaveBeenCalledWith(
					`🎉 Your repo ${payload.repository.full_name} is configured correctly for star,fork,pull_request events 🎉`,
				);
			});
		});
	});
});
