import { MergeRequestMerged } from '../../../src/reactions/gitlab/merge-request-merged';
import { MergeRequestPayloadBuilder } from '../../builders/gitlab/merge-request-payload-builder';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';

describe('MergeRequestMerged', () => {
	const twitchChat = new TwitchChatMock();
	const streamlabs = new StreamLabsMock();

	describe('#canHandle', () => {
		it("returns true if the event is 'Merge Request Hook' and 'object_attributes.state' is 'merged'", () => {
			const payload = new MergeRequestPayloadBuilder()
				.with({ object_attributes: { state: 'merged' } })
				.getInstance();
			const subject = new MergeRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({ event: 'Merge Request Hook', payload });

			expect(result).toEqual(true);
		});

		it("returns false if the event is 'test' and 'object_attributes.state' is 'merged'", () => {
			const payload = new MergeRequestPayloadBuilder()
				.with({ object_attributes: { state: 'merged' } })
				.getInstance();
			const subject = new MergeRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({ event: 'test', payload });

			expect(result).toEqual(false);
		});

		it("returns false if the event is 'Merge Request Hook' and 'object_attributes.state' is 'opened'", () => {
			const payload = new MergeRequestPayloadBuilder()
				.with({ object_attributes: { state: 'opened' } })
				.getInstance();
			const subject = new MergeRequestMerged(twitchChat, streamlabs);

			const result = subject.canHandle({ event: 'Merge Request Hook', payload });

			expect(result).toEqual(false);
		});
	});

	describe('#handle', () => {
		it("sends the proper message to 'TwitchChat'", async () => {
			const payload = new MergeRequestPayloadBuilder()
				.with({ object_attributes: { state: 'merged' } })
				.getInstance();
			const subject = new MergeRequestMerged(twitchChat, streamlabs);

			const result = await subject.handle({ payload });

			expect(result).toEqual(
				expect.objectContaining({
					twitchChat: {
						notified: true,
						message: `The merge request from ${payload.user.username} has been merged into ${payload.repository.homepage}`,
					},
				}),
			);
		});

		it("sends the proper message to 'StreamLabs'", async () => {
			const payload = new MergeRequestPayloadBuilder()
				.with({ object_attributes: { state: 'merged' } })
				.getInstance();
			const subject = new MergeRequestMerged(twitchChat, streamlabs);

			const result = await subject.handle({ payload });

			expect(result).toEqual(
				expect.objectContaining({
					streamlabs: {
						notified: true,
						message: `The merge request from *${payload.user.username}* has been merged into *${payload.repository.name}*`,
					},
				}),
			);
		});
	});
});
