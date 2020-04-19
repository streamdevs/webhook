import { Ping } from '../../../src/reactions/github/ping';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';

describe('Ping', () => {
	describe('#handle', () => {
		let streamlabs: StreamLabs;
		let twitchChat: TwitchChat;
		let payload: any;

		beforeEach(() => {
			streamlabs = ({ alert: jest.fn() } as unknown) as StreamLabs;
			twitchChat = ({ send: jest.fn() } as unknown) as TwitchChat;
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
			const subject = new Ping(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *fork* events 🎉`,
			});
		});

		it('calls TwitchChat with the expected message', async () => {
			const subject = new Ping(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`🎉 Your repo *${payload.repository.full_name}* is configured correctly for *fork* events 🎉`,
			);
		});

		it('returns the message that was send to Twitch', async () => {
			const subject = new Ping(twitchChat, streamlabs);

			const { twitchChat: response } = await subject.handle({
				payload: {
					...payload,
					hook: {
						events: ['pull_request'],
					},
				},
			});

			expect(response).toEqual({
				message: `🎉 Your repo *${payload.repository.full_name}* is configured correctly for *pull_request* events 🎉`,
				notified: true,
			});
		});

		it('returns the message that was send to StreamLabs', async () => {
			const subject = new Ping(twitchChat, streamlabs);

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

		it("returns 'streamlabs.notified' set to false is something goes wrong with StreamLabs", async () => {
			jest.spyOn(streamlabs, 'alert').mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Ping(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat.notified' set to false is something goes wrong with TwitchChat", async () => {
			jest.spyOn(twitchChat, 'send').mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Ping(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});
	});
});
