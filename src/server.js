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

	if (config.logging) {
		await server.register({
			plugin: laabr,
			options: {
				formats: {
					'request':
						'{ timestamp::time, level::level, tags::tags, message::message  }',
					'request-error':
						'{ timestamp::time, level::level, tags::tags, message::message, error::error, environment::environment, stack::error[stack] }',
					'uncaught':
						'{ timestamp::time, level::level, tags::tags, message::message, error::error, environment::environment, stack::error[stack] }',
				},
			},
		});
	}

	server.route(routes(config));

	return server;
};

module.exports = {
	initServer,
};
