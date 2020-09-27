import { ServerRoute, ResponseObject, Request, ResponseToolkit } from '@hapi/hapi';
import { gitlabHeader } from '../../schemas/gitlab/joi/gitlab-headers-schema';
import { buildGitLabReactions } from '../../reactions/gitlab';
import { TwitchChat } from '../../services/TwitchChat';
import { Config } from '../../config';
import { StreamLabs } from '../../services/StreamLabs';
import { MergeRequestPayload } from '../../schemas/gitlab/merge-request-payload';
import { Boom, forbidden } from '@hapi/boom';

export const routes = (config: Config): ServerRoute[] => {
	return [
		{
			method: 'POST',
			options: {
				validate: {
					headers: gitlabHeader(),
				},
			},
			handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom> => {
				const { headers, payload } = (request as unknown) as {
					headers: { 'x-gitlab-event': string; 'x-gitlab-token': string };
					payload: MergeRequestPayload;
				};

				if (config.GITLAB_TOKEN) {
					if (!headers['x-gitlab-token']) {
						console.error("Missing 'X-GitLab-Token' header");
						return forbidden();
					}

					if (config.GITLAB_TOKEN !== headers['x-gitlab-token']) {
						console.error("'X-GitLab-Token' mismatch");
						return forbidden();
					}
				}

				const event = headers['x-gitlab-event'];

				const twitchChat = new TwitchChat({
					botName: config?.TWITCH_BOT_NAME || '',
					botToken: config?.TWITCH_BOT_TOKEN || '',
					channel: config?.TWITCH_BOT_CHANNEL || '',
				});
				const streamlabs = new StreamLabs({ token: config?.STREAMLABS_TOKEN || '' });

				const reactions = buildGitLabReactions(twitchChat, streamlabs).filter((reaction) =>
					reaction.canHandle({ event, payload, config }),
				);

				if (reactions.length > 0) {
					const messages = await Promise.all(
						reactions.map((reaction) => reaction.handle({ payload })),
					);

					return h.response({ messages }).code(200);
				}

				return h.response({ message: `Ignoring event: '${event}'` }).code(200);
			},
			path: '/gitlab',
		},
	];
};
