import { Star } from '../../../src/reactions/github/star';
import { StarPayload } from '../../../src/schemas/github/star-payload';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';

describe('Star', () => {
	let twitchChat: TwitchChatMock;
	let streamlabs: StreamLabsMock;

	beforeEach(() => {
		twitchChat = new TwitchChatMock();
		streamlabs = new StreamLabsMock();
	});

	describe('#handle', () => {
		let payload: StarPayload;

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
		});

		it("returns 'twitchChat.notified' set to false if something goes wrong in TwitchChat ", async () => {
			twitchChat.send.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
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
				message: `${payload.sender.login} just starred ${payload.repository.html_url}`,
				notified: true,
			});
		});

		it("returns 'streamlabs.notified' set to false if something goes wrong with StreamLabs", async () => {
			streamlabs.alert.mockImplementationOnce(async () => {
				throw new Error('boooom');
			});
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
			const subject = new Star(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'created' } as StarPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is star and actions is removed', () => {
			const subject = new Star(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'removed' } as StarPayload,
			});

			expect(result).toEqual(false);
		});
	});
});
