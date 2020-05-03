import { Config } from '../../../src/config';
import { IssueAssigned } from '../../../src/reactions/github/issue-assigned';
import { IssuePayload } from '../../../src/schemas/github/issue-payload';
import { IssuePayloadBuilder } from '../../builders/github/issue-payload-builder';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';

describe('IssueAssigned', () => {
	let twitchChat: TwitchChatMock;
	let streamlabs: StreamLabsMock;

	beforeEach(() => {
		twitchChat = new TwitchChatMock();
		streamlabs = new StreamLabsMock();
	});

	describe('#handle', () => {
		let payload: IssuePayload;

		beforeEach(() => {
			payload = new IssuePayloadBuilder().with({ action: 'assigned' }).getInstance();
		});

		it('calls StreamLabs with the expected message', async () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `*${payload.assignee?.login}* has a new assigned issue in *${payload.repository.full_name}*`,
			});
		});

		it('calls TwitchChat with the expected message', async () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`${payload.assignee?.login} has a new assigned issue in ${payload.issue.html_url}`,
			);
		});
	});

	describe('#canHandle', () => {
		it("returns true if the event is 'issues' and the action 'assigned'", () => {
			const payload = new IssuePayloadBuilder()
				.with({
					action: 'assigned',
					assignee: { login: 'SantiMA10' },
				})
				.getInstance();
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload,
			});

			expect(result).toEqual(true);
		});

		it("returns false if the event is 'fork' and the action 'assigned'", () => {
			const payload = new IssuePayloadBuilder()
				.with({
					action: 'assigned',
					assignee: { login: 'SantiMA10' },
				})
				.getInstance();
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload,
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'issues' and the action 'opened'", () => {
			const payload = new IssuePayloadBuilder()
				.with({
					action: 'opened',
					assignee: { login: 'SantiMA10' },
				})
				.getInstance();
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload,
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'issues', the action is 'assigned' but the assignee doesn't match with the notification list", () => {
			const payload = new IssuePayloadBuilder()
				.with({
					action: 'assigned',
					sender: { login: 'SantiMA10' },
					assignee: { login: 'pepe' },
				})
				.getInstance();
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload,
				config: { NOTIFY_ISSUES_ASSIGNED_TO: ['SantiMA10'] } as Config,
			});

			expect(result).toEqual(false);
		});

		it("returns true if the event is 'issues', the action is 'assigned' and the notification list is empty", () => {
			const payload = new IssuePayloadBuilder()
				.with({
					action: 'assigned',
					sender: { login: 'SantiMA10' },
					assignee: { login: 'pepe' },
				})
				.getInstance();
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload,
				config: { NOTIFY_ISSUES_ASSIGNED_TO: [] as string[] } as Config,
			});

			expect(result).toEqual(true);
		});
	});
});
