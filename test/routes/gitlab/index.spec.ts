import { initServer } from '../../../src/server';
import { getConfig } from '../../../src/config';

describe('POST /gitlab', () => {
	it('returns a 200 status ok', async () => {
		const subject = await initServer(getConfig());

		const { statusCode } = await subject.inject({ method: 'POST', url: '/gitlab' });

		expect(statusCode).toEqual(200);
	});
});
