import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';
import { SponsorshipPayloadBuilder } from '../../builders/sponsorship-payload-builder';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';

describe('POST /github', () => {
	describe('Sponsorship created event', () => {
		let spyStreamLabs: jest.SpyInstance<Promise<void>>;
		let spyTwitchChat: jest.SpyInstance<Promise<void>>;

		beforeEach(() => {
			spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
			spyStreamLabs.mockImplementationOnce(jest.fn());

			spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
			spyTwitchChat.mockImplementationOnce(jest.fn());
		});

		it('returns the expected response', async () => {
			const subject = await initServer(getConfig());
			const payload = new SponsorshipPayloadBuilder().with({ action: 'created' }).getInstance();

			const { result } = await subject.inject({
				method: 'POST',
				payload,
				url: '/github',
				headers: { 'x-github-event': 'sponsorship' },
			});

			expect(result).toEqual({ messages: expect.anything() });
		});
	});
});
