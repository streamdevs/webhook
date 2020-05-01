import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { ReleaseCreatedPayloadBuilder } from '../../builders/release-created-payload-builder';

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
		const payload = new ReleaseCreatedPayloadBuilder().getInstance();

		const subject = await initServer(getConfig());

		const response = await subject.inject({
			method: 'POST',
			url: '/github',
			payload,
			headers: {
				'x-github-event': 'release',
			},
		});

		expect(response.statusCode).toEqual(200);
	});
});
