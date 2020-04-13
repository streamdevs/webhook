const axios = require('axios');

class StreamLabs {
	constructor({ token }, logger) {
		this.base = 'https://streamlabs.com/api/v1.0';
		this.token = token;
		this.logger = logger;
	}

	async alert({ message }) {
		try {
			await axios.post(`${this.base}/alerts`, {
				access_token: this.token,
				message,
				type: 'follow',
			});
		} catch (error) {
			if (this.logger) {
				this.logger.log('error', 'StreamLabs API error', error);
			}

			throw error;
		}
	}
}

module.exports = {
	StreamLabs,
};
