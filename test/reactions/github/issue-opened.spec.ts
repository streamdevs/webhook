import { TwitchChat } from '../../../src/services/TwitchChat';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { IssueOpened } from '../../../src/reactions/github/issue-opened';
import { IssuePayload } from '../../../src/schemas/github/issue-payload';
import { IssuePayloadBuilder } from '../../builders/github/issue-payload-builder';

describe('IssueOpened', () => {
	let twitchChat: TwitchChat;
	let streamlabs: StreamLabs;

	beforeEach(() => {
		twitchChat = ({ send: jest.fn() } as unknown) as TwitchChat;
		streamlabs = ({ alert: jest.fn() } as unknown) as StreamLabs;
	});

	describe('#handle', () => {
		let payload: IssuePayload;

		beforeEach(() => {
			payload = new IssuePayloadBuilder()
				.with({
					action: 'opened',
					repository: {
						html_url: 'https://github.com/streamdevs/webhook',
						full_name: 'streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				})
				.getInstance();
		});

		it('calls StreamLabs with the expected message', async () => {
			const subject = new IssueOpened(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `*${payload.sender.login}* opened a issue in *${payload.repository.full_name}*`,
			});
		});

		it('calls TwitchChat with the expected message', async () => {
			const subject = new IssueOpened(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`${payload.sender.login} opened a issue in ${payload.issue.html_url}`,
			);
		});
	});

	describe('#canHandle', () => {
		it("returns true when the event is 'issues' and action is 'opened'", () => {
			const subject = new IssueOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload: { action: 'opened' } as IssuePayload,
			});

			expect(result).toEqual(true);
		});

		it("returns false when the event is not 'issues'", () => {
			const subject = new IssueOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload: { action: 'opened' } as IssuePayload,
			});

			expect(result).toEqual(false);
		});

		it("returns true when the event is 'issues' and action is 'closed'", () => {
			const subject = new IssueOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload: { action: 'closed' } as IssuePayload,
			});

			expect(result).toEqual(false);
		});
	});
});
