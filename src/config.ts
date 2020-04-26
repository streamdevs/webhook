export interface Config {
	logging: boolean;
	STREAMLABS_TOKEN?: string;
	TWITCH_BOT_NAME?: string;
	TWITCH_BOT_TOKEN?: string;
	TWITCH_BOT_CHANNEL?: string;
	port: number | string;
	NOTIFY_CHECK_RUNS_FOR: string[];
}

export const getConfig = (): Config => {
	if (process.env.NODE_ENV === 'test') {
		return {
			logging: false,
			STREAMLABS_TOKEN: 'token',
			TWITCH_BOT_NAME: '',
			TWITCH_BOT_TOKEN: '',
			TWITCH_BOT_CHANNEL: '',
			port: 8080,
			NOTIFY_CHECK_RUNS_FOR: [],
		};
	}

	return {
		logging: true,
		STREAMLABS_TOKEN: process.env['STREAMLABS_TOKEN'],
		TWITCH_BOT_NAME: process.env['TWITCH_BOT_NAME'],
		TWITCH_BOT_TOKEN: process.env['TWITCH_BOT_TOKEN'],
		TWITCH_BOT_CHANNEL: process.env['TWITCH_BOT_CHANNEL'],
		port: process.env['PORT'] || process.env['HTTP_PORT'] || 8080,
		NOTIFY_CHECK_RUNS_FOR: (process.env['NOTIFY_CHECK_RUNS_FOR'] || '').split(','),
	};
};
