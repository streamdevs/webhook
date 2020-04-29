import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';

describe('POST /gitlab', () => {
	it('returns a 200 status ok', async () => {
		const subject = await initServer(getConfig());

		const { statusCode } = await subject.inject({
			method: 'POST',
			url: '/gitlab',
			headers: { 'X-Gitlab-Event': 'test' },
		});

		expect(statusCode).toEqual(200);
	});

	it("returns 400 bad request is the request is missing the 'X-Gitlab-Event' header", async () => {
		const subject = await initServer(getConfig());

		const { statusCode } = await subject.inject({
			method: 'POST',
			url: '/gitlab',
		});

		expect(statusCode).toEqual(400);
	});
});
