import nock from 'nock';
import axios from 'axios';
import { StreamLabs } from '../../src/services/StreamLabs';

describe('StreamLabs', () => {
	describe('#constructor', () => {
		it('takes an optional logger argument', () => {
			const subject = new StreamLabs({ token: '' }, { log: jest.fn() });

			expect(subject).toBeInstanceOf(StreamLabs);
		});
	});

	describe('#alert', () => {
		let axiosSpy: jest.SpyInstance<Promise<unknown>>;

		const setupDefaultAxiosSpy = (): void => {
			axiosSpy = jest.spyOn(axios, 'post');
			nock('https://streamlabs.com').post('/api/v1.0/alerts').reply(200);
		};

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it("uses axios to perform a 'POST' to the StreamLabs url", async () => {
			setupDefaultAxiosSpy();

			const config = {
				token: 'token',
			};
			const subject = new StreamLabs(config);

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.any(Object),
			);
		});

		it("uses the given token as 'access_token'", async () => {
			setupDefaultAxiosSpy();

			const config = {
				token: 'token',
			};
			const subject = new StreamLabs(config);

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ access_token: config.token }),
			);
		});

		it('logs the response body for failed HTTP 401 requests', async () => {
			nock('https://streamlabs.com').post('/api/v1.0/alerts').reply(401, { error: 'boom' });

			const spyLogger = { log: jest.fn() };
			const config = {
				token: 'fake-token',
			};

			const subject = new StreamLabs(config, spyLogger);

			await expect(subject.alert({ message: 'hello' })).rejects.toEqual(expect.any(Object));
			expect(spyLogger.log).toHaveBeenLastCalledWith(
				['error', 'streamlabs'],
				expect.objectContaining({ data: { error: 'boom' } }),
			);
		});

		it("uses the text given as an argument as message to 'StreamLabs'", async () => {
			setupDefaultAxiosSpy();

			const subject = new StreamLabs({ token: 'token' });

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ message: 'alert' }),
			);
		});

		it("sends the alerts with the type 'follow'", async () => {
			setupDefaultAxiosSpy();

			const subject = new StreamLabs({ token: 'token' });

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ type: 'follow' }),
			);
		});
	});
});
