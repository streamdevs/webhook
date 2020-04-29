import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface StarPayload extends RepositoryWebhookPayload {
	action: string;
}
