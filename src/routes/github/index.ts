import { gitHubWebhookPayload } from '../../schemas/gitHubWebhookPayload';
import { gitHubWebhookHeaders } from '../../schemas/gitHubWebhookHeaders';
import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { Config } from '../../config';

import { Fork } from '../../reactions/github';
import { Request, ResponseToolkit } from '@hapi/hapi';

export const routes = (config: Config) => [
	{
		method: 'POST',
		path: '/github',
		options: {
			validate: {
				headers: gitHubWebhookHeaders(),
				payload: gitHubWebhookPayload(),
			},
		},
		handler: async (request: Request, h: ResponseToolkit) => {
			const { payload, headers } = request as { payload: any; headers: any };
			const event = headers['x-github-event'];
			const {
				repository: { full_name: repositoryFullName },
			} = payload;

			const streamlabs = new StreamLabs(
				{ token: config.STREAMLABS_TOKEN || '' },
				request,
			);
			const twitchChat = new TwitchChat({
				botName: config.TWITCH_BOT_NAME || '',
				botToken: config.TWITCH_BOT_TOKEN || '',
				channel: config.TWITCH_BOT_CHANNEL || '',
			});

			if (
				event === 'ping' &&
				(payload.hook.events.includes('star') ||
					payload.hook.events.includes('pull_request') ||
					payload.hook.events.includes('fork'))
			) {
				await streamlabs.alert({
					message: `🎉 Your repo *${repositoryFullName}* is configured correctly for *${payload.hook.events}* events 🎉`,
				});
				await twitchChat.send(
					`🎉 Your repo ${repositoryFullName} is configured correctly for ${payload.hook.events} events 🎉`,
				);

				return h.response().code(200);
			}

			if (event === 'star' && payload.action === 'created') {
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

			if (event === 'pull_request' && payload.action === 'opened') {
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

			if (Fork.canHandle({ event })) {
				const handler = new Fork(streamlabs, twitchChat);
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
