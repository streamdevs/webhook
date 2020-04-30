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
	});
});
