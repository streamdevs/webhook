import { gitHubWebhookPayload } from '../../schemas/gitHubWebhookPayload';
import { gitHubWebhookHeaders } from '../../schemas/gitHubWebhookHeaders';
import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { Config } from '../../config';

import { reactionBuild } from '../../reactions/github';
import {
	Request,
	ResponseObject,
	ResponseToolkit,
	ServerRoute,
} from '@hapi/hapi';
import { WebhookPayload } from '../../schemas/github/webhook-payload';

export const routes = (config: Config): ServerRoute[] => [
	{
		method: 'POST',
		path: '/github',
		options: {
			validate: {
				headers: gitHubWebhookHeaders(),
				payload: gitHubWebhookPayload(),
			},
		},
		handler: async (
			request: Request,
			h: ResponseToolkit,
		): Promise<ResponseObject> => {
			const { payload, headers } = (request as unknown) as {
				payload: WebhookPayload;
				headers: { 'x-github-event': string };
			};
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
