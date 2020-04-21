import axios from 'axios';

interface StreamLabsConfig {
	token: string;
}

interface StreamLabsLogger {
	log: (levels: string[], log: any) => void;
}

interface StreamLabsAlert {
	message: string;
}

export class StreamLabs {
	private base: string;
	private token: string;
	private logger?: StreamLabsLogger;

	constructor({ token }: StreamLabsConfig, logger?: StreamLabsLogger) {
		this.base = 'https://streamlabs.com/api/v1.0';
		this.token = token;
		this.logger = logger;
	}

	async alert({ message }: StreamLabsAlert): Promise<void> {
		try {
			await axios.post(`${this.base}/alerts`, {
				access_token: this.token,
				message,
				type: 'follow',
			});
		} catch (error) {
			if (this.logger) {
				this.logger.log(['error', 'streamlabs'], { data: error.response.data });
			}

			throw error;
		}
	}
}
