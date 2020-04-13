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

		beforeEach(() => {
			jest.restoreAllMocks();
			axiosSpy = jest.spyOn(axios, 'post');
			axiosSpy.mockImplementationOnce(() => {});
		});

		it("uses axios to perform a 'POST' to the StreamLabs url", async () => {
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

		it("uses the text given as an argument as message to 'StreamLabs'", async () => {
			const subject = new StreamLabs({});

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ message: 'alert' }),
			);
		});

		it("sends the alerts with the type 'follow'", async () => {
			const subject = new StreamLabs({});

			await subject.alert({ message: 'alert' });

			expect(axiosSpy).toHaveBeenCalledWith(
				'https://streamlabs.com/api/v1.0/alerts',
				expect.objectContaining({ type: 'follow' }),
			);
		});
	});
});
