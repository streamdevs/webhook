import tmi from 'tmi.js';

export interface TwitchChatConfig {
	channel: string;
	botName: string;
	botToken: string;
}

export class TwitchChat {
	private client: tmi.Client;
	private config: TwitchChatConfig;

	constructor(config: TwitchChatConfig) {
		this.config = config;
		this.client = tmi.client({
			identity: {
				username: this.config.botName,
				password: this.config.botToken,
			},
			channels: [this.config.channel],
		});
	}

	async send(text: string) {
		await this.client.connect();
		await this.client.say(this.config.channel, text);
		await this.client.disconnect();
	}
}
