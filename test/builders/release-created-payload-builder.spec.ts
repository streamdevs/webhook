import { ReleaseCreatedPayloadBuilder } from './release-created-payload-builder';
import { ReleaseCreatedPayload } from '../../src/schemas/github/release-created-payload';

describe('ReleasePayloadBuilder', () => {
	describe('#constructor', () => {
		it('instantiates a builder with a default valid payload', () => {
			const subject = new ReleaseCreatedPayloadBuilder();

			expect(subject.getInstance()).toBeTruthy();
		});
	});

	describe('#with', () => {
		it('merges values correctly', () => {
			const subject = new ReleaseCreatedPayloadBuilder().with({
				repository: { html_url: 'hello' },
			} as Partial<ReleaseCreatedPayload>);

			expect(subject.getInstance()).toEqual(
				expect.objectContaining({
					repository: {
						html_url: 'hello',
						full_name: 'streamdevs/webhook',
					},
				}),
			);
		});
	});
});
