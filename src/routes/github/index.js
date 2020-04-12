const { gitHubWebhookPayload } = require('../../schemas/gitHubWebhookPayload');
const { gitHubWebhookHeaders } = require('../../schemas/gitHubWebhookHeaders');
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
				headers: gitHubWebhookHeaders(),
				payload: gitHubWebhookPayload(),
			},
		},
		handler: async (request, h) => {
			const { payload, headers } = request;
			const event = headers['x-github-event'];
			const {
				repository: { full_name: repositoryFullName },
			} = payload;

			if (
				event === 'ping' &&
				(request.payload.hook.events.includes('star') ||
					request.payload.hook.events.includes('pull_request'))
			) {
				await axios.post(config.STREAMLABS_ENDPOINT, {
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *${request.payload.hook.events}* events 🎉`,
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

			if (event === 'pull_request' && request.payload.action === 'opened') {
				const {
					sender: { login: senderLogin },
				} = payload;

				await axios.post(config.STREAMLABS_ENDPOINT, {
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `*${senderLogin}* just opened a pull request in *${repositoryFullName}*`,
				});

				return h.response().code(200);
			}

			if (
				event === 'pull_request' &&
				payload.action === 'closed' &&
				payload.pull_request &&
				payload.pull_request.merged
			) {
				const {
					sender: { login: senderLogin },
				} = payload;

				await axios.post(config.STREAMLABS_ENDPOINT, {
					access_token: config.STREAMLABS_TOKEN,
					type: 'follow',
					message: `The pull request from *${senderLogin}* just merged *${repositoryFullName}*`,
				});
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
