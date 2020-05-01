import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { ReleaseCreatedPayloadBuilder } from '../../builders/release-created-payload-builder';
import { ReleaseCreatedPayload } from '../../../src/schemas/github/release-created-payload';
import { WebhookResponse } from '../../../src/schemas/webhook-response';

describe('/github', () => {
	let streamLabsSpy: jest.SpyInstance<Promise<void>>;
	let twitchChatSpy: jest.SpyInstance<Promise<void>>;

	beforeEach(() => {
		streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
		streamLabsSpy.mockImplementationOnce(jest.fn());

		twitchChatSpy = jest.spyOn(TwitchChat.prototype, 'send');
		twitchChatSpy.mockImplementationOnce(jest.fn());
	});

	it('handles release events', async () => {
		const payload = new ReleaseCreatedPayloadBuilder()
			.with({
				action: 'published',
				release: { tag_name: '1.0.0' },
			} as Partial<ReleaseCreatedPayload>)
			.getInstance();

		const subject = await initServer(getConfig());

		const response = await subject.inject({
			method: 'POST',
			url: '/github',
			payload,
			headers: {
				'x-github-event': 'release',
			},
		});

		expect((response.result as WebhookResponse).messages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					twitchChat: {
						message:
							'streamdevs/webhook version 1.0.0 has just been released 🚀! Check it out http://github.com/streamdevs/webhook/releases/1.0.0',
						notified: true,
					},
				}),
			]),
		);
	});
});
