import { Star } from '../../../src/reactions/github/star';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { StreamLabs } from '../../../src/services/StreamLabs';

describe('Star', () => {
	describe('#handle', () => {
		let payload: any;
		let twitchChat: TwitchChat;
		let streamlabs: StreamLabs;

		beforeEach(() => {
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

			twitchChat = ({
				send: jest.fn(),
			} as unknown) as TwitchChat;

			streamlabs = ({
				alert: jest.fn(),
			} as unknown) as StreamLabs;
		});

		it("returns 'twitchChat.notified' set to false if something goes wrong in TwitchChat ", async () => {
			twitchChat = ({
				send: jest.fn(async () => {
					throw new Error('boom');
				}),
			} as unknown) as TwitchChat;
			const subject = new Star(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat' with the message send to Twitch and notified set to true", async () => {
			const subject = new Star(twitchChat, streamlabs);

			const { twitchChat: response } = await subject.handle({ payload });

			expect(response).toEqual({
				message: `*${payload.sender.login}* just starred ${payload.repository.html_url}`,
				notified: true,
			});
		});

		it("returns 'streamlabs.notified' set to false if something goes wrong with StreamLabs", async () => {
			streamlabs = ({
				alert: jest.fn(async () => {
					throw new Error('boooom');
				}),
			} as unknown) as StreamLabs;
			const subject = new Star(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'streamlabs' with the message send to StreamLabs and notified set to true", async () => {
			const subject = new Star(twitchChat, streamlabs);

			const { streamlabs: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `*${payload.sender.login}* just starred *${payload.repository.full_name}*`,
			});
		});
	});

	describe('#canHandle', () => {
		it('returns true if the event is star and actions is created', () => {
			const subject = new Star(null as any, null as any);

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'created' },
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is star and actions is removed', () => {
			const subject = new Star(null as any, null as any);

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'removed' },
			});

			expect(result).toEqual(false);
		});
	});
});
