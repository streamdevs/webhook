import { SponsorshipPayloadBuilder } from '../../builders/sponsorship-payload-builder';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { SponsorshipCreated } from '../../../src/reactions/github/sponsorship-created';

describe('SponsorshipCreated', () => {
	const streamlabs = new StreamLabsMock();
	const twitchChat = new TwitchChatMock();

	describe('#handle', () => {
		it('sends the expected message to TwitchChat', async () => {
			const payload = new SponsorshipPayloadBuilder().with({ action: 'created' }).getInstance();
			const subject = new SponsorshipCreated(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(twitchChat.send).toHaveBeenCalledWith(
				`🎉 ${payload.sponsorship.sponsor.login} is now a sponsor`,
			);
		});

		it('sends the expected message to StreamLabs', async () => {
			const payload = new SponsorshipPayloadBuilder().with({ action: 'created' }).getInstance();
			const subject = new SponsorshipCreated(twitchChat, streamlabs);

			await subject.handle({ payload });

			expect(streamlabs.alert).toHaveBeenCalledWith({
				message: `🎉 *${payload.sponsorship.sponsor.login}* is now a sponsor`,
			});
		});
	});

	describe('#canHandle', () => {
		it("returns true if the event is 'sponsorship' and the 'action' is 'created'", () => {
			const payload = new SponsorshipPayloadBuilder().with({ action: 'created' }).getInstance();
			const subject = new SponsorshipCreated(twitchChat, streamlabs);

			const result = subject.canHandle({ event: 'sponsorship', payload });

			expect(result).toEqual(true);
		});

		it("returns false if the event is 'fork' and the 'action' is 'created'", () => {
			const payload = new SponsorshipPayloadBuilder().with({ action: 'created' }).getInstance();
			const subject = new SponsorshipCreated(twitchChat, streamlabs);

			const result = subject.canHandle({ event: 'fork', payload });

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'sponsorship' and the 'action' is 'cancelled'", () => {
			const payload = new SponsorshipPayloadBuilder().with({ action: 'cancelled' }).getInstance();
			const subject = new SponsorshipCreated(twitchChat, streamlabs);

			const result = subject.canHandle({ event: 'sponsorship', payload });

			expect(result).toEqual(false);
		});
	});
});
