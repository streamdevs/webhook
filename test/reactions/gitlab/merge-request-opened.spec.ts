import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { MergeRequestOpened } from '../../../src/reactions/gitlab/merge-request-opened';
import { Config } from '../../../src/config';
import { MergeRequestPayload } from '../../../src/schemas/gitlab/merge-request-payload';

describe('MergeRequestOpened', () => {
	const twitchChat = new TwitchChatMock();
	const streamlabs = new StreamLabsMock();

	describe('#canHandle', () => {
		it("creates a new 'MergeRequestOpened' reaction", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			expect(subject).not.toBeNull();
		});

		it("returns true if the event is 'Merge Request Hook' and 'object_attributes.state' is 'opened'", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Merge Request Hook',
				payload: { object_attributes: { state: 'opened' } } as MergeRequestPayload,
			});

			expect(result).toEqual(true);
		});

		it("returns false if the event is 'Fork' and 'object_attributes.state' is 'opened'", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Fork',
				payload: { object_attributes: { state: 'opened' } } as MergeRequestPayload,
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'Merge Request Hook' and 'object_attributes.state' is 'merged'", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Merge Request Hook',
				payload: { object_attributes: { state: 'merged' } } as MergeRequestPayload,
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'Merge Request Hook', 'object_attributes.state' is 'opened' but the opener is in the ignore list", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Merge Request Hook',
				payload: {
					object_attributes: { state: 'opened' },
					user: { username: 'SantiMA10' },
				} as MergeRequestPayload,
				config: { IGNORE_PR_OPENED_BY: ['SantiMA10'] } as Config,
			});

			expect(result).toEqual(false);
		});

		it("returns true if the event is 'Merge Request Hook', 'object_attributes.state' is 'opened' and the 'IGNORE_PR_OPENED_BY' is empty", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Merge Request Hook',
				payload: {
					object_attributes: { state: 'opened' },
					user: { username: 'SantiMA10' },
				} as MergeRequestPayload,
				config: { IGNORE_PR_OPENED_BY: [] as string[] } as Config,
			});

			expect(result).toEqual(true);
		});
	});

	describe('#handle', () => {
		it('sends the expected message to TwitchChat', async () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);
			const payload = {
				object_attributes: { state: 'opened' },
				user: { username: 'SantiMA10' },
				repository: { homepage: 'https://gitlab.com/streamlabs/webhook' },
			} as MergeRequestPayload;

			const { twitchChat: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `${payload.user.username} just opened a merge request in ${payload.object_attributes.url}`,
			});
		});

		it('sends the expected message to StreamLabs', async () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);
			const payload = {
				user: { username: 'SantiMA10' },
				repository: { name: 'streamdevs/webhook' },
			} as MergeRequestPayload;

			const { streamlabs: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `*${payload.user.username}* just opened a merge request in *${payload.repository.name}*`,
			});
		});
	});
});
