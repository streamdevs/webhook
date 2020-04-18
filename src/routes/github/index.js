const { gitHubWebhookPayload } = require('../../schemas/gitHubWebhookPayload');
const { gitHubWebhookHeaders } = require('../../schemas/gitHubWebhookHeaders');
const { StreamLabs } = require('../../services/StreamLabs');
const { TwitchChat } = require('../../services/TwitchChat');

const { Fork } = require('../../reactions/github');

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
			const streamlabs = new StreamLabs(
				{ token: config.STREAMLABS_TOKEN },
				request,
			);
			const twitchChat = new TwitchChat({
				identity: {
					username: config.TWITCH_BOT_NAME,
					password: config.TWITCH_BOT_TOKEN,
				},
				channels: [config.TWITCH_BOT_CHANNEL],
			});

			if (
				event === 'ping' &&
				(request.payload.hook.events.includes('star') ||
					request.payload.hook.events.includes('pull_request') ||
					request.payload.hook.events.includes('fork'))
			) {
				await streamlabs.alert({
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *${request.payload.hook.events}* events 🎉`,
				});
				await twitchChat.send(
					`🎉 Your repo ${repositoryFullName} is configured correctly for ${request.payload.hook.events} events 🎉`,
				);

				return h.response().code(200);
			}

			if (event === 'star' && request.payload.action === 'created') {
				const {
					sender: { login: senderLogin },
					repository: { html_url },
				} = payload;

				await streamlabs.alert({
					message: `*${senderLogin}* just starred *${repositoryFullName}*`,
				});
				await twitchChat.send(`${senderLogin} just starred ${html_url}`);

				return h.response().code(200);
			}

			if (event === 'pull_request' && request.payload.action === 'opened') {
				const {
					repository: { html_url },
					pull_request: {
						user: { login },
					},
				} = payload;

				await streamlabs.alert({
					message: `*${login}* just opened a pull request in *${repositoryFullName}*`,
				});
				await twitchChat.send(
					`${login} just opened a pull request in ${html_url}`,
				);

				return h.response().code(200);
			}

			if (
				event === 'pull_request' &&
				payload.action === 'closed' &&
				payload.pull_request.merged
			) {
				const {
					repository: { html_url },
					pull_request: {
						user: { login },
					},
				} = payload;

				await streamlabs.alert({
					message: `The pull request from *${login}* has been merged into *${repositoryFullName}*`,
				});
				await twitchChat.send(
					`The pull request from ${login} has been merged into ${html_url}`,
				);
			}

			if (event === 'fork') {
				const handler = new Fork({ streamlabs, twitchChat });
				const status = await handler.handle({ payload });

				return h.response({
					message: `Event ${event} handled correctly`,
					status,
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
