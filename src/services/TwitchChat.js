const tmi = require('tmi.js');

class TwitchChat {
	constructor(config) {
		this.config = config;
		/** @type {tmi.Client} */
		this.client = new tmi.client(this.config);
	}

	async send(text) {
		await this.client.connect();
		await this.client.say(this.config.channels[0], text);
		await this.client.disconnect();
	}
}

module.exports = {
	TwitchChat,
};
