import { PullRequestMerged } from '../../../src/reactions/github/pull-request-merged';
import { PullRequestPayload } from '../../../src/schemas/github/pull-request-payload';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';

describe('PullRequestMerged', () => {
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
				action: 'closed',
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				pull_request: { user: { login: 'SantiMA10' }, merged: true },
				sender: { login: 'pepe' },
			};
		});

		it("returns 'twitchChat.notified' === false if something goes wrong with TwitchChat", async () => {
			twitchChat.send.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'streamlabs.notified' === false if something goes wrong with StreamLabs", async () => {
			streamlabs.alert.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat' with the send message and notified set to true if everything goes well", async () => {
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const { twitchChat: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `The pull request from *${payload.pull_request.user.login}* has been merged into ${payload.repository.html_url}`,
			});
		});

		it("returns 'streamlabs' with the send message and notified set to true if everything goes well", async () => {
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const { streamlabs: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `The pull request from *${payload.pull_request.user.login}* has been merged into *${payload.repository.full_name}*`,
			});
		});
	});

	describe('#canHandle', () => {
		it("returns true when the event is 'pull_request' and the payload contains action 'closed' and 'merged' set to 'true'", () => {
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'pull_request',
				payload: {
					action: 'closed',
					pull_request: { merged: true },
				} as PullRequestPayload,
			});

			expect(result).toEqual(true);
		});

		it("returns false when the event is not 'pull_request'", () => {
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload: {
					action: 'closed',
					pull_request: { merged: true },
				} as PullRequestPayload,
			});

			expect(result).toEqual(false);
		});

		it("returns false when the event is 'pull_request' but is not merged", () => {
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'pull_request',
				payload: {
					action: 'closed',
					pull_request: { merged: false },
				} as PullRequestPayload,
			});

			expect(result).toEqual(false);
		});

		it("returns false when the event is 'pull_request' but the action is not closed", () => {
			const subject = new PullRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'pull_request',
				payload: {
					action: 'opened',
					pull_request: { merged: true },
				} as PullRequestPayload,
			});

			expect(result).toEqual(false);
		});
	});
});
