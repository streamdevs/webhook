import { gitHubWebhookPayload } from '../../schemas/gitHubWebhookPayload';
import { gitHubWebhookHeaders } from '../../schemas/gitHubWebhookHeaders';
import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { Config } from '../../config';

import { reactionBuild } from '../../reactions/github';
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

			const streamlabs = new StreamLabs(
				{ token: config.STREAMLABS_TOKEN || '' },
				request,
			);
			const twitchChat = new TwitchChat({
				botName: config.TWITCH_BOT_NAME || '',
				botToken: config.TWITCH_BOT_TOKEN || '',
				channel: config.TWITCH_BOT_CHANNEL || '',
			});

			const reactions = reactionBuild({
				twitchChat,
				streamlabs,
			}).filter((reaction) => reaction.canHandle({ event, payload }));

			if (reactions.length === 0) {
				return h.response({
					message: `Ignoring event: '${event}'`,
				});
			}

			return h.response({
				messages: await Promise.all(
					reactions.map((reaction) => reaction.handle({ payload })),
				),
			});
		},
	},
];
