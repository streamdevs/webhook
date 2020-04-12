const { initServer } = require('./server');

// TODO: Validate arguments before starting
const config = {
	STREAMLABS_TOKEN: process.env['STREAMLABS_TOKEN'],
	STREAMLABS_ENDPOINT: 'https://streamlabs.com/api/v1.0/alerts',
	port: process.env['PORT'] || process.env['HTTP_PORT'] || 8080,
};

initServer(config).then(async (server) => {
	await server.start();
});
