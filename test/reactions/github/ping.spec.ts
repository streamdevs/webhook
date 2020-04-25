import { Ping } from '../../../src/reactions/github/ping';
import { PingPayload } from '../../../src/schemas/github/ping-payload';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';

describe('Ping', () => {
	let streamlabs: StreamLabsMock;
	let twitchChat: TwitchChatMock;

	beforeEach(() => {
		streamlabs = new StreamLabsMock();
		twitchChat = new TwitchChatMock();
	});

	describe('#handle', () => {
		let payload: PingPayload;

		beforeEach(() => {
			payload = {
				hook: {
					events: ['fork'],
				},
				repository: {
					html_url: 'https://github.com/streamdevs/webhook',
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
			streamlabs.alert.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Ping(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat.notified' set to false is something goes wrong with TwitchChat", async () => {
			twitchChat.send.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Ping(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});
	});

	describe('#canHandle', () => {
		it('returns true if the event is ping and the hook.events array contains star', () => {
			const subject = new Ping(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'ping',
				payload: { hook: { events: ['star'] } } as PingPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is not ping', () => {
			const subject = new Ping(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload: { hook: { events: ['star'] } } as PingPayload,
			});

			expect(result).toEqual(false);
		});

		it('returns false if the hook.events only contains status', () => {
			const subject = new Ping(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'ping',
				payload: { hook: { events: ['status'] } } as PingPayload,
			});

			expect(result).toEqual(false);
		});

		it('returns true if the event is ping and the hook.events array contains fork', () => {
			const subject = new Ping(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'ping',
				payload: { hook: { events: ['fork'] } } as PingPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns true if the event is ping and the hook.events array contains pull_request', () => {
			const subject = new Ping(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'ping',
				payload: { hook: { events: ['pull_request'] } } as PingPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns true if the event is ping and the hook.events array contains issues', () => {
			const subject = new Ping(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'ping',
				payload: { hook: { events: ['issues'] } } as PingPayload,
			});

			expect(result).toEqual(true);
		});
	});
});
