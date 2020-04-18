import { WebhookPayload } from './webhook-payload';

export interface ForkPayload extends WebhookPayload {
	forkee: {
		owner: {
			login: string;
		};
	};
}
