import { PullRequestOpened } from '../../../src/reactions/github/pull-request-opened';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { PullRequestPayload } from '../../../src/schemas/github/pull-request-payload';

describe('PullRequestOpened', () => {
	let streamlabs: StreamLabs;
	let twitchChat: TwitchChat;

	beforeEach(() => {
		twitchChat = ({
			send: jest.fn(),
		} as unknown) as TwitchChat;
		streamlabs = ({
			alert: jest.fn(),
		} as unknown) as StreamLabs;
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
			const twitchChat = ({
				send: jest.fn(async () => {
					throw new Error('boom');
				}),
			} as unknown) as TwitchChat;
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'streamlabs.notified' === false if something goes wrong with StreamLabs", async () => {
			const streamlabs = ({
				alert: jest.fn(async () => {
					throw new Error('boom');
				}),
			} as unknown) as StreamLabs;
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
				payload: { action: 'opened' },
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is not pull request', () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload: { action: 'opened' },
			});

			expect(result).toEqual(false);
		});

		it('returns false if the pull request is closed', () => {
			const subject = new PullRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'pull_request',
				payload: { action: 'closed' },
			});

			expect(result).toEqual(false);
		});
	});
});
