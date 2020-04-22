import { WebhookPayload } from './webhook-payload';

export interface PingPayload extends WebhookPayload {
	hook: {
		events: string[];
	};
}
