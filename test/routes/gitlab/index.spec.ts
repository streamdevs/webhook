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

	it('ignores unknown events gracefully', async () => {
		const subject = await initServer(getConfig());

		const { result } = await subject.inject({
			method: 'POST',
			url: '/gitlab',
			headers: { 'X-Gitlab-Event': 'test' },
		});

		expect(result).toEqual({ message: `Ignoring event: 'test'` });
	});

	describe('with GitLab token configured', () => {
		it("rejects any request without the 'X-Gitlab-Token' header", async () => {
			const subject = await initServer({ ...getConfig(), GITLAB_TOKEN: 'patatas' });

			const { statusCode } = await subject.inject({
				method: 'POST',
				url: '/gitlab',
				headers: { 'X-Gitlab-Event': 'test' },
			});

			expect(statusCode).toEqual(403);
		});

		it("rejects request with an invalid 'X-Gitlab-Token' header", async () => {
			const subject = await initServer({ ...getConfig(), GITLAB_TOKEN: 'patatas' });

			const { statusCode } = await subject.inject({
				method: 'POST',
				url: '/gitlab',
				headers: { 'X-Gitlab-Event': 'test', 'X-Gitlab-Token': 'patata' },
			});

			expect(statusCode).toEqual(403);
		});

		it("accepts request with an valid 'X-Gitlab-Token' header", async () => {
			const subject = await initServer({ ...getConfig(), GITLAB_TOKEN: 'patatas' });

			const { statusCode } = await subject.inject({
				method: 'POST',
				url: '/gitlab',
				headers: { 'X-Gitlab-Event': 'test', 'X-Gitlab-Token': 'patatas' },
			});

			expect(statusCode).toEqual(200);
		});
	});
});
