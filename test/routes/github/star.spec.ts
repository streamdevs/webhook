import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { StarPayload } from '../../../src/schemas/github/star-payload';

describe("GitHub 'star' event", () => {
	let spyTwitchChat: jest.SpyInstance<Promise<void>>;
	let spyStreamLabs: jest.SpyInstance<Promise<void>>;
	let payload: StarPayload;

	beforeEach(() => {
		spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
		spyTwitchChat.mockImplementationOnce(jest.fn());

		spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
		spyStreamLabs.mockImplementationOnce(jest.fn());

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
			const subject = await initServer(getConfig());

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
			const subject = await initServer(getConfig());

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
			const subject = await initServer(getConfig());

			await subject.inject({
				method: 'POST',
				url: '/github',
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'star',
				},
				payload,
			});

			expect(spyTwitchChat).toHaveBeenCalledWith(
				`${payload.sender.login} just starred ${payload.repository.html_url}`,
			);
		});

		it('ignores the deleted star event', async () => {
			const subject = await initServer(getConfig());

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
