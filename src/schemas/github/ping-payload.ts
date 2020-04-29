import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface PingPayload extends RepositoryWebhookPayload {
	hook: {
		events: string[];
	};
}
