const joi = require('@hapi/joi');
const axios = require('axios');

/**
 *
 * @param {any} config
 */
const routes = (config) => [
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
				await axios.post(config.STREAMLABS_ENDPOINT, {
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

				await axios.post(config.STREAMLABS_ENDPOINT, {
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
];

module.exports = {
	routes,
};
