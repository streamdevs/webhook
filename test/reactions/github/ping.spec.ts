import { Ping } from '../../../src/reactions/github/ping';

describe('Ping', () => {
	describe('#handle', () => {
		let streamlabs: any;
		let twitchChat: any;
		let payload: any;

		beforeEach(() => {
			streamlabs = { alert: jest.fn() };
			twitchChat = { send: jest.fn() };
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

		it('calls StreamLabs with the expected message', async () => {
			const subject = new Ping({ streamlabs, twitchChat });

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *fork* events 🎉`,
			});
		});

		it('calls TwitchChat with the expected message', async () => {
			const subject = new Ping({ streamlabs, twitchChat });

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`🎉 Your repo ${payload.repository.full_name} is configured correctly for fork events 🎉`,
			);
		});

		it('returns the message that was send to Twitch', async () => {
			const subject = new Ping({ streamlabs, twitchChat });

			const { twitchChat: response } = await subject.handle({
				payload: {
					...payload,
					hook: {
						events: ['pull_request'],
					},
				},
			});

			expect(response).toEqual({
				message: `🎉 Your repo ${payload.repository.full_name} is configured correctly for pull_request events 🎉`,
				notified: true,
			});
		});

		it('returns the message that was send to StreamLabs', async () => {
			const subject = new Ping({ streamlabs, twitchChat });

			const { streamlabs: response } = await subject.handle({
				payload: {
					...payload,
					hook: {
						events: ['star'],
					},
				},
			});

			expect(response).toEqual({
				message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *star* events 🎉`,
				notified: true,
			});
		});
	});
});
