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
});
