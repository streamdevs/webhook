const { Server } = require('@hapi/hapi');
const { routes } = require('./routes/github');
const laabr = require('laabr');

/**
 *
 * @param config
 * @returns {Promise<Server>}
 */
const initServer = async (config) => {
	const server = new Server({
		port: config.port,
	});

	await server.register({
		plugin: laabr,
		options: {
			formats: {
				'request': 'error.json',
				'request-error': 'error.stackjson',
				'uncaught': 'error.stackjson',
			},
		},
	});

	server.route(routes(config));

	return server;
};

module.exports = {
	initServer,
};
