import tmi from 'tmi.js';
import { TwitchChat, TwitchChatConfig } from '../../src/services/TwitchChat';

describe('TwitchChat', () => {
	let config: TwitchChatConfig;

	beforeEach(() => {
		config = {
			botName: 'BOT_USERNAME',
			botToken: 'OAUTH_TOKEN',
			channel: 'CHANNEL_NAME',
		};
	});

	describe('#constructor', () => {
		it('configures the tmi.js client with the given configuration', async () => {
			const spy = jest.spyOn(tmi, 'client');

			new TwitchChat(config);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					identity: {
						username: 'BOT_USERNAME',
						password: 'OAUTH_TOKEN',
					},
					channels: ['#channel_name'],
				}),
			);
		});
	});

	describe('#send', () => {
		let fakeClient: tmi.Client;

		beforeEach(() => {
			const spy = jest.spyOn(tmi, 'client');
			fakeClient = ({
				connect: jest.fn(),
				say: jest.fn(),
				disconnect: jest.fn(),
			} as unknown) as tmi.Client;
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

			expect(fakeClient.say).toHaveBeenCalledWith(config.channel, 'Hola');
		});

		it('calls disconnect after send the message', async () => {
			const subject = new TwitchChat(config);

			await subject.send('Hola');

			expect(fakeClient.say).toHaveBeenCalled();
			expect(fakeClient.disconnect).toHaveBeenCalled();
		});
	});
});
