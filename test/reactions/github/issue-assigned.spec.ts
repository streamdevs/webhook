import { Config } from '../../../src/config';
import { IssueAssigned } from '../../../src/reactions/github/issue-assigned';
import { IssuePayload } from '../../../src/schemas/github/issue-payload';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';

describe('IssueAssigned', () => {
	let twitchChat: TwitchChat;
	let streamlabs: StreamLabs;

	beforeEach(() => {
		twitchChat = ({ send: jest.fn() } as unknown) as TwitchChat;
		streamlabs = ({ alert: jest.fn() } as unknown) as StreamLabs;
	});

	describe('#handle', () => {
		let payload: IssuePayload;

		beforeEach(() => {
			payload = {
				action: 'assigned',
				repository: {
					html_url: 'https://github.com/streamdevs/webhook',
					full_name: 'streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
				assignee: {
					login: 'SantiMA10',
				},
			};
		});

		it('calls StreamLabs with the expected message', async () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `*${payload.sender.login}* has a new assigned issue in *${payload.repository.full_name}*`,
			});
		});

		it('calls TwitchChat with the expected message', async () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`*${payload.sender.login}*  has a new assigned issue in ${payload.repository.html_url}`,
			);
		});
	});

	describe('#canHandle', () => {
		it("returns true if the event is 'issues' and the action 'assigned'", () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload: { action: 'assigned' } as IssuePayload,
			});

			expect(result).toEqual(true);
		});

		it("returns false if the event is 'fork' and the action 'assigned'", () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'fork',
				payload: { action: 'assigned' } as IssuePayload,
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'issues' and the action 'opened'", () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload: { action: 'opened' } as IssuePayload,
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'issues', the action is 'assigned' but the sender doesn't match with the notification list", () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload: {
					action: 'assigned',
					sender: { login: 'SantiMA10' },
					assignee: { login: 'pepe' },
				} as IssuePayload,
				config: { NOTIFY_ASSIGNED_ISSUES_TO: ['SantiMA10'] } as Config,
			});

			expect(result).toEqual(false);
		});

		it("returns true if the event is 'issues', the action is 'assigned' and the notification list is empty", () => {
			const subject = new IssueAssigned(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'issues',
				payload: {
					action: 'assigned',
					sender: { login: 'SantiMA10' },
					assignee: { login: 'pepe' },
				} as IssuePayload,
				config: { NOTIFY_ASSIGNED_ISSUES_TO: [] as string[] } as Config,
			});

			expect(result).toEqual(true);
		});
	});
});
