import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { ForkPayload } from '../../../src/schemas/github/fork-payload';
import { Fork } from '../../../src/reactions/github/fork';

describe('Fork', () => {
	let payload: ForkPayload;
	let streamlabs: StreamLabs;
	let twitchChat: TwitchChat;

	beforeEach(() => {
		streamlabs = ({ alert: jest.fn() } as unknown) as StreamLabs;
		twitchChat = ({ send: jest.fn() } as unknown) as TwitchChat;
		payload = {
			repository: {
				full_name: 'streamdevs/webhook',
				html_url: 'https://github.com/streamdevs/webhook',
			},
			forkee: {
				owner: {
					login: 'orestes',
				},
			},
			sender: {
				login: 'orestes',
			},
		};
	});

	describe('#handle', () => {
		it('calls StreamLabs with the expected message', async () => {
			const subject = new Fork(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `*${payload.forkee.owner.login}* just forked 🍴 *${payload.repository.full_name}*`,
			});
		});

		it('calls TwitchChat with the expected message', async () => {
			const subject = new Fork(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`*${payload.forkee.owner.login}* just forked 🍴 ${payload.repository.html_url}`,
			);
		});

		it('returns the message that was send to StreamLabs', async () => {
			const subject = new Fork(twitchChat, streamlabs);

			const { streamlabs: response } = await subject.handle({
				payload,
			});

			expect(response).toEqual({
				message: `*${payload.forkee.owner.login}* just forked 🍴 *${payload.repository.full_name}*`,
				notified: true,
			});
		});

		it('returns the message that was send to Twitch', async () => {
			const subject = new Fork(twitchChat, streamlabs);

			const { twitchChat: response } = await subject.handle({
				payload,
			});

			expect(response).toEqual({
				message: `*${payload.forkee.owner.login}* just forked 🍴 ${payload.repository.html_url}`,
				notified: true,
			});
		});

		it("returns 'streamlabs.notified' set to false is something goes wrong with StreamLabs", async () => {
			jest.spyOn(streamlabs, 'alert').mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Fork(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat.notified' set to false is something goes wrong with TwitchChat", async () => {
			jest.spyOn(twitchChat, 'send').mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Fork(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});
	});

	describe('#canHandle', () => {
		it('returns true if the event is fork', () => {
			const subject = new Fork(twitchChat, streamlabs);

			const result = subject.canHandle({ payload, event: 'fork' });

			expect(result).toEqual(true);
		});

		it('returns false if the event is not fork', () => {
			const subject = new Fork(twitchChat, streamlabs);

			const result = subject.canHandle({ payload, event: 'ping' });

			expect(result).toEqual(false);
		});
	});
});
