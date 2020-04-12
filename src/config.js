const getConfig = () => {
	if (process.env.NODE_ENV === 'test') {
		return {
			logging: false,
			STREAMLABS_TOKEN: 'token',
			STREAMLABS_ENDPOINT: 'https://streamlabs.com/api/v1.0/alerts', // TODO: remove
			port: 8080,
		};
	}

	// TODO: Validate arguments before starting
	return {
		logging: true,
		STREAMLABS_TOKEN: process.env['STREAMLABS_TOKEN'],
		STREAMLABS_ENDPOINT: 'https://streamlabs.com/api/v1.0/alerts', // TODO: remove
		port: process.env['PORT'] || process.env['HTTP_PORT'] || 8080,
	};
};

module.exports = {
	getConfig,
};
