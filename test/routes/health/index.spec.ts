import { ServerInjectOptions } from '@hapi/hapi';
import { getConfig } from '../../../src/config';
import { initServer } from '../../../src/server';

describe('/health', () => {
	describe('GET /health', () => {
		it('returns 200 OK if everything is well configured', async () => {
			const subject = await initServer(getConfig());
			const request: ServerInjectOptions = { method: 'GET', url: '/health' };

			const { statusCode } = await subject.inject(request);

			expect(statusCode).toEqual(200);
		});

		describe('Twitch Config', () => {
			it('returns that the Twitch Bot is configured', async () => {
				const subject = await initServer({
					...getConfig(),
					TWITCH_BOT_CHANNEL: 'streamdevs',
					TWITCH_BOT_NAME: 'streamdevs',
					TWITCH_BOT_TOKEN: 'token',
				});
				const request: ServerInjectOptions = { method: 'GET', url: '/health' };

				const { result } = await subject.inject(request);

				expect(result).toEqual(
					expect.objectContaining({ config: expect.objectContaining({ twitch: true }) }),
				);
			});

			it("returns that the Twitch Bot isn't configured", async () => {
				const subject = await initServer({ ...getConfig(), TWITCH_BOT_CHANNEL: undefined });
				const request: ServerInjectOptions = { method: 'GET', url: '/health' };

				const { result } = await subject.inject(request);

				expect(result).toEqual(
					expect.objectContaining({ config: expect.objectContaining({ twitch: false }) }),
				);
			});
		});

		describe('StreamLabs Config', () => {
			it('returns that StreamLabs is configured', async () => {
				const subject = await initServer({
					...getConfig(),
					STREAMLABS_TOKEN: 'token',
				});
				const request: ServerInjectOptions = { method: 'GET', url: '/health' };

				const { result } = await subject.inject(request);

				expect(result).toEqual(
					expect.objectContaining({ config: expect.objectContaining({ streamLabs: true }) }),
				);
			});

			it('returns that StreamLabs is configured', async () => {
				const subject = await initServer({
					...getConfig(),
					STREAMLABS_TOKEN: undefined,
				});
				const request: ServerInjectOptions = { method: 'GET', url: '/health' };

				const { result } = await subject.inject(request);

				expect(result).toEqual(
					expect.objectContaining({ config: expect.objectContaining({ streamLabs: false }) }),
				);
			});
		});
	});
});
