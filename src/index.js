const { initServer } = require('./server');

const config = {
	STREAMLABS_TOKEN: process.env['STREAMLABS_TOKEN'],
	port: process.env['PORT'] || process.env['HTTP_PORT'] || 8080,
};

initServer(config).then(async (server) => {
	await server.start();
});
