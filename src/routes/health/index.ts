import { ResponseObject, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { Config } from '../../config';

export const routes = (config: Config): ServerRoute[] => {
	return [
		{
			method: 'GET',
			options: {
				handler: (_: Request, h: ResponseToolkit): ResponseObject => {
					const isTwitchConfigOk =
						!!config.TWITCH_BOT_CHANNEL && !!config.TWITCH_BOT_NAME && !!config.TWITCH_BOT_TOKEN;

					const isStreamLabsConfigOk = !!config.STREAMLABS_TOKEN;

					return h
						.response({ config: { twitch: isTwitchConfigOk, streamLabs: isStreamLabsConfigOk } })
						.code(200);
				},
			},
			path: '/health',
		},
	];
};
