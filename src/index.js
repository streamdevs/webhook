const { initServer } = require('./server');
const { getConfig } = require('./config');

initServer(getConfig()).then(async (server) => {
	await server.start();
});
