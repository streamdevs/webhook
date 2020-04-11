const { Server } = require('@hapi/hapi');
const joi = require('@hapi/joi');
const axios = require('axios');
const laabr = require('laabr');

// TODO: Validate arguments before starting

const STREAMLABS_ENDPOINT = 'https://streamlabs.com/api/v1.0/alerts';

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

	server.route([
		{
			method: 'POST',
			path: '/github',
			options: {
				validate: {
					headers: joi
						.object({ 'x-github-event': joi.string().required() })
						.unknown(),
					payload: joi
						.object({
							action: joi.string(),
							hook: joi
								.object({ events: joi.array().items(joi.string()) })
								.unknown(),
							sender: joi
								.object({ login: joi.string().required() })
								.required()
								.unknown(),
							repository: joi
								.object({ full_name: joi.string().required() })
								.required()
								.unknown(),
						})
						.unknown(),
				},
			},
			handler: async (request, h) => {
				const { payload, headers } = request;
				const event = headers['x-github-event'];
				const {
					repository: { full_name: repositoryFullName },
				} = payload;

				if (event === 'ping' && request.payload.hook.events.includes('star')) {
					await axios.post(STREAMLABS_ENDPOINT, {
						access_token: config.STREAMLABS_TOKEN,
						type: 'follow',
						message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *star* events 🎉`,
					});

					return h.response().code(200);
				}

				if (event === 'star' && request.payload.action === 'created') {
					const {
						sender: { login: senderLogin },
					} = payload;

					await axios.post(STREAMLABS_ENDPOINT, {
						access_token: config.STREAMLABS_TOKEN,
						type: 'follow',
						message: `*${senderLogin}* just starred *${repositoryFullName}*`,
					});

					return h.response().code(200);
				}

				return h.response({
					message: `Ignoring event: '${event}'`,
				});
			},
		},
	]);

	return server;
};

module.exports = {
	initServer,
};
