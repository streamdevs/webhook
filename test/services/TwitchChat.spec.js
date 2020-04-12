const tmi = require('tmi.js');
const { TwitchChat } = require('../../src/services/TwitchChat');

describe('TwitchChat', () => {
	let config;

	beforeEach(() => {
		config = {
			identity: {
				username: 'BOT_USERNAME',
				password: 'OAUTH_TOKEN',
			},
			channels: ['CHANNEL_NAME'],
		};
	});

	describe('#constructor', () => {
		it('configures the tmi.js client with the given configuration', async () => {
			const spy = jest.spyOn(tmi, 'client');

			new TwitchChat(config);

			expect(spy).toHaveBeenCalledWith(config);
		});
	});

	describe('#send', () => {
		let fakeClient;

		beforeEach(() => {
			const spy = jest.spyOn(tmi, 'client');
			fakeClient = {
				connect: jest.fn(async () => ({})),
				say: jest.fn(async () => ({})),
				disconnect: jest.fn(async () => ({})),
			};
			spy.mockImplementationOnce(() => fakeClient);
		});

		it('calls connect if not already connected', async () => {
			const subject = new TwitchChat(config);

			await subject.send('Hola');

			expect(fakeClient.connect).toHaveBeenCalled();
		});

		it('calls say with the channel in the configuration and the text given', async () => {
			const subject = new TwitchChat(config);

			await subject.send('Hola');

			expect(fakeClient.say).toHaveBeenCalledWith(config.channels[0], 'Hola');
		});

		it('calls disconnect after send the message', async () => {
			const subject = new TwitchChat(config);

			await subject.send('Hola');

			expect(fakeClient.say).toHaveBeenCalled();
			expect(fakeClient.disconnect).toHaveBeenCalled();
		});
	});
});
