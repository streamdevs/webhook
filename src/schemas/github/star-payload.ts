import { WebhookPayload } from './webhook-payload';

export interface StarPayload extends WebhookPayload {
	action: string;
}
