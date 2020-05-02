import { ReleaseCreated } from '../../../src/reactions/github/release-created';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { ReleaseCreatedPayload } from '../../../src/schemas/github/release-created-payload';
import { ReleaseCreatedPayloadBuilder } from '../../builders/release-created-payload-builder';

describe('ReleaseCreated', () => {
	let twitchChat: TwitchChatMock;
	let streamLabs: StreamLabsMock;

	beforeEach(() => {
		twitchChat = new TwitchChatMock();
		streamLabs = new StreamLabsMock();
	});

	describe('#canHandle', () => {
		it('returns false when the event is not release', () => {
			const subject = new ReleaseCreated(twitchChat, streamLabs);
			const event = 'star';

			const payload: ReleaseCreatedPayload = {} as ReleaseCreatedPayload;

			expect(subject.canHandle({ payload, event })).toEqual(false);
		});
		it('returns false when the release is not published', () => {
			const subject = new ReleaseCreated(twitchChat, streamLabs);
			const event = 'release';

			const payload = new ReleaseCreatedPayloadBuilder().with({ action: 'created' }).getInstance();

			expect(subject.canHandle({ payload, event })).toEqual(false);
		});
		it('returns true when the release is published', () => {
			const subject = new ReleaseCreated(twitchChat, streamLabs);
			const event = 'release';

			const payload = new ReleaseCreatedPayloadBuilder()
				.with({ action: 'published' })
				.getInstance();

			expect(subject.canHandle({ payload, event })).toEqual(true);
		});
	});

	describe('#getTwitchChatMessage', () => {
		it('returns the expected message', () => {
			const subject = new ReleaseCreated(twitchChat, streamLabs);
			const payload = new ReleaseCreatedPayloadBuilder()
				.with({ action: 'published' })
				.getInstance();

			expect(subject.getTwitchChatMessage({ payload })).toEqual(
				`streamdevs/webhook version 1.0.0 has just been released 🚀! Check it out http://github.com/streamdevs/webhook/releases/1.0.0`,
			);
		});
	});

	describe('#getStreamLabsMessage', () => {
		it('returns the expected message', () => {
			const subject = new ReleaseCreated(twitchChat, streamLabs);
			const payload = new ReleaseCreatedPayloadBuilder()
				.with({ action: 'published' })
				.getInstance();

			expect(subject.getStreamLabsMessage({ payload })).toEqual(
				`*streamdevs/webhook* version *1.0.0* has just been released 🚀!`,
			);
		});
	});
});
