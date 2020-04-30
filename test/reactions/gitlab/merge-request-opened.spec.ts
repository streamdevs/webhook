import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { MergeRequestOpened } from '../../../src/reactions/gitlab/merge-request-opened';

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
				payload: { object_attributes: { state: 'opened' } },
			});

			expect(result).toEqual(true);
		});

		it("returns false if the event is 'Fork' and 'object_attributes.state' is 'opened'", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Fork',
				payload: { object_attributes: { state: 'opened' } },
			});

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'Merge Request Hook' and 'object_attributes.state' is 'merged'", () => {
			const subject = new MergeRequestOpened(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'Merge Request Hook',
				payload: { object_attributes: { state: 'merged' } },
			});

			expect(result).toEqual(false);
		});
	});
});
