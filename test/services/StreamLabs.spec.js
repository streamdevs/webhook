const axios = require('axios');
const { StreamLabs } = require('../../src/services/StreamLabs');

describe('StreamLabs', () => {
	describe('#constructor', () => {
		it('takes an optional logger argument', () => {
			const subject = new StreamLabs({ token: '' }, { log: jest.fn() });

			expect(subject).toBeInstanceOf(StreamLabs);
		});
	});
	describe('#alert', () => {
		let axiosSpy;

		const setupDefaultAxiosSpy = () => {
			axiosSpy = jest.spyOn(axios, 'post');
			axiosSpy.mockImplementationOnce(() => {});
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

			await subject.alert('alert');

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
			axiosSpy = jest.spyOn(axios, 'post');
			const mockAxiosErrorResponse = {
				response: { data: 'Reason for error response', status: 401 },
			};
			axiosSpy.mockImplementationOnce(
				jest.fn().mockRejectedValue(mockAxiosErrorResponse),
			);

			const spyLogger = { log: jest.fn() };
			const config = {
				token: 'fake-token',
			};

			const subject = new StreamLabs(config, spyLogger);

			await expect(subject.alert({ message: 'hello' })).rejects.toEqual(
				expect.any(Object),
			);
			expect(spyLogger.log).toHaveBeenLastCalledWith(
				expect.any(Array),
				expect.objectContaining({data: mockAxiosErrorResponse.response.data}),
			);
		});

		it("uses the text given as an argument as message to 'StreamLabs'", async () => {
			setupDefaultAxiosSpy();

			const subject = new StreamLabs({});

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ message: 'alert' }),
			);
		});

		it("sends the alerts with the type 'follow'", async () => {
			setupDefaultAxiosSpy();

			const subject = new StreamLabs({});

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ type: 'follow' }),
			);
		});
	});
});
