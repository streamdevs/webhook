import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';

describe('POST /github', () => {
	it('returns 400 on requests without payload', async () => {
		const subject = await initServer(getConfig());

		const { statusCode } = await subject.inject({
			method: 'POST',
			url: '/github',
			headers: {
				'X-GitHub-Event': 'ping',
			},
		});

		expect(statusCode).toBe(400);
	});

	it("returns 400 on requests without 'X-GitHub-Event' header", async () => {
		const subject = await initServer(getConfig());

		const { statusCode } = await subject.inject({
			method: 'POST',
			url: '/github',
			payload: {
				action: 'created',
				repository: {
					full_name: 'a',
				},
				sender: {
					login: 'b',
				},
			},
		});

		expect(statusCode).toBe(400);
	});

	it('handles unknown actions gracefully', async () => {
		const subject = await initServer(getConfig());

		const { statusCode, result } = await subject.inject({
			method: 'POST',
			url: '/github',
			headers: {
				'Content-Type': 'application/json',
				'X-GitHub-Event': 'project',
			},
			payload: {
				hook: { events: ['created'] },
				sender: {
					login: 'user',
				},
				repository: {
					full_name: 'org/repo',
				},
			},
		});

		expect(statusCode).toBe(200);
		expect(result).toEqual({ message: `Ignoring event: 'project'` });
	});

	describe("with 'GITHUB_SECRET' configured", () => {
		it("rejects requests without 'X-Hub-Signature' header", async () => {
			const subject = await initServer({ ...getConfig(), GITHUB_SECRET: 'patatas' });
			const request = {
				method: 'POST',
				url: '/github',
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'project',
				},
				payload: {
					hook: { events: ['created'] },
					sender: {
						login: 'user',
					},
					repository: {
						full_name: 'org/repo',
					},
				},
			};

			const { statusCode } = await subject.inject(request);

			expect(statusCode).toEqual(403);
		});

		it("rejects requests with invalid 'X-Hub-Signature' header", async () => {
			const subject = await initServer({ ...getConfig(), GITHUB_SECRET: 'patatas' });
			const request = {
				method: 'POST',
				url: '/github',
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'project',
					'X-Hub-Signature': 'patatas',
				},
				payload: {
					hook: { events: ['created'] },
					sender: {
						login: 'user',
					},
					repository: {
						full_name: 'org/repo',
					},
				},
			};

			const { statusCode } = await subject.inject(request);

			expect(statusCode).toEqual(403);
		});

		it("accept requests with valid 'X-Hub-Signature' header", async () => {
			const subject = await initServer({ ...getConfig(), GITHUB_SECRET: 'patatas' });
			const request = {
				method: 'POST',
				url: '/github',
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'project',
					'X-Hub-Signature': 'sha1=7027fb0d07cb42f7c273aa2258f54f6626ca3f3c',
				},
				payload: {
					hook: { events: ['created'] },
					sender: {
						login: 'user',
					},
					repository: {
						full_name: 'org/repo',
					},
				},
			};

			const { statusCode } = await subject.inject(request);

			expect(statusCode).toEqual(200);
		});
	});
});
