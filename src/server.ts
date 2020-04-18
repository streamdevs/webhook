import { Server } from '@hapi/hapi';
import { routes } from './routes/github';
import laabr from 'laabr';

// FIXME: Add config type
export const initServer = async (config: any) => {
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
