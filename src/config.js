const getConfig = () => {
	if (process.env.NODE_ENV === 'test') {
		return {
			logging: false,
			STREAMLABS_TOKEN: 'token',
			STREAMLABS_ENDPOINT: 'https://streamlabs.com/api/v1.0/alerts', // TODO: remove
			TWITCH_BOT_NAME: '',
			TWITCH_BOT_TOKEN: '',
			TWITCH_BOT_CHANEL: '',
			port: 8080,
		};
	}

	// TODO: Validate arguments before starting
	return {
		logging: true,
		STREAMLABS_TOKEN: process.env['STREAMLABS_TOKEN'],
		STREAMLABS_ENDPOINT: 'https://streamlabs.com/api/v1.0/alerts', // TODO: remove
		TWITCH_BOT_NAME: process.env['TWITCH_BOT_NAME'],
		TWITCH_BOT_TOKEN: process.env['TWITCH_BOT_TOKEN'],
		TWITCH_BOT_CHANEL: process.env['TWITCH_BOT_CHANEL'],
		port: process.env['PORT'] || process.env['HTTP_PORT'] || 8080,
	};
};

module.exports = {
	getConfig,
};
