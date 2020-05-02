import { getConfig } from '../../../src/config';
import { initServer } from '../../../src/server';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { MergeRequestPayloadBuilder } from '../../builders/payload/gitlab/merge-request-payload-builder';

describe('POST /gitlab', () => {
	let streamLabsSpy: jest.SpyInstance<Promise<void>>;
	let twitchChatSpy: jest.SpyInstance<Promise<void>>;

	beforeEach(() => {
		streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
		streamLabsSpy.mockImplementationOnce(jest.fn());

		twitchChatSpy = jest.spyOn(TwitchChat.prototype, 'send');
		twitchChatSpy.mockImplementationOnce(jest.fn());
	});

	describe('Merge Request Hook', () => {
		it('handles merge request merged event', async () => {
			const subject = await initServer(getConfig());
			const payload = new MergeRequestPayloadBuilder()
				.with({ object_attributes: { state: 'merged' } })
				.getInstance();

			const { result } = await subject.inject({
				method: 'POST',
				url: '/gitlab',
				payload,
				headers: { 'x-gitlab-event': 'Merge Request Hook' },
			});

			expect(result).toEqual(expect.objectContaining({ messages: expect.anything() }));
		});
	});
});
