import { PullRequestOpened } from '../../../src/reactions/github/pull-request-opened';
import { PullRequestPayload } from '../../../src/schemas/github/pull-request-payload';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';

describe('PullRequestOpened', () => {
	let streamlabs: StreamLabsMock;
	let twitchChat: TwitchChatMock;

	beforeEach(() => {
		twitchChat = new TwitchChatMock();
		streamlabs = new StreamLabsMock();
	});

	describe('#handle', () => {
		let payload: PullRequestPayload;

		beforeEach(() => {
			payload = {
				action: 'opened',
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				pull_request: { user: { login: 'SantiMA10' } },
				sender: { login: 'pepe' },
			};
		});

		it("returns 'twitchChat.notified' === false if something goes wrong with TwitchChat", async () => {
			twitchChat.send.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'streamlabs.notified' === false if something goes wrong with StreamLabs", async () => {
			streamlabs.alert.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat' with the send message and notified set to true if everything goes well", async () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const { twitchChat: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `*${payload.pull_request.user.login}* just opened a pull request in ${payload.repository.html_url}`,
			});
		});

		it("returns 'streamlabs' with the send message and notified set to true if everything goes well", async () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const { streamlabs: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `*${payload.pull_request.user.login}* just opened a pull request in *${payload.repository.full_name}*`,
			});
		});
	});

	describe('#canHandle', () => {
		it('returns true if the pull request is opened', () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'pull_request',
				payload: { action: 'opened' } as PullRequestPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is not pull request', () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload: { action: 'opened' } as PullRequestPayload,
			});

			expect(result).toEqual(false);
		});

		it('returns false if the pull request is closed', () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'pull_request',
				payload: { action: 'closed' } as PullRequestPayload,
			});

			expect(result).toEqual(false);
		});
	});
});
