const axios = require('axios');

class StreamLabs {
	constructor({ token }) {
		this.base = 'https://streamlabs.com/api/v1.0';
		this.token = token;
	}

	alert({ message }) {
		return axios.post(`${this.base}/alerts`, {
			access_token: this.token,
			message,
			type: 'follow',
		});
	}
}

module.exports = {
	StreamLabs,
};
