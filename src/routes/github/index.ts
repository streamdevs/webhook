import { Boom, forbidden } from '@hapi/boom';
import crypto from 'crypto';
import { Request, ResponseObject, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { Config } from '../../config';
import { reactionBuild } from '../../reactions/github';
import { RepositoryWebhookPayload } from '../../schemas/github/repository-webhook-payload';
import { gitHubWebhookHeaders } from '../../schemas/gitHubWebhookHeaders';
import { gitHubWebhookPayload } from '../../schemas/gitHubWebhookPayload';
import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';

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
		handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom> => {
			const { payload, headers } = (request as unknown) as {
				payload: RepositoryWebhookPayload;
				headers: { 'x-github-event': string; 'x-hub-signature': string };
			};

			if (config.GITHUB_SECRET) {
				if (!headers['x-hub-signature']) {
					console.error("missing 'x-hub-signature' header");
					return forbidden();
				}

				const hmac = crypto.createHmac('sha1', config.GITHUB_SECRET);
				const digest = Buffer.from(
					'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex'),
					'utf8',
				);
				const checksum = Buffer.from(headers['x-hub-signature'], 'utf8');
				if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
					console.error('unable to verify request signature');
					return forbidden();
				}
			}

			const event = headers['x-github-event'];

			const streamlabs = new StreamLabs({ token: config.STREAMLABS_TOKEN || '' }, request);
			const twitchChat = new TwitchChat({
				botName: config.TWITCH_BOT_NAME || '',
				botToken: config.TWITCH_BOT_TOKEN || '',
				channel: config.TWITCH_BOT_CHANNEL || '',
			});

			const reactions = reactionBuild({
				twitchChat,
				streamlabs,
			}).filter((reaction) => reaction.canHandle({ event, payload, config }));

			if (reactions.length === 0) {
				return h.response({
					message: `Ignoring event: '${event}'`,
				});
			}

			return h.response({
				messages: await Promise.all(reactions.map((reaction) => reaction.handle({ payload }))),
			});
		},
	},
];
