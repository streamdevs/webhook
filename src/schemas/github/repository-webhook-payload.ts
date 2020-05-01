import { WebhookPayload } from './webhook-payload';

export interface RepositoryWebhookPayload extends WebhookPayload {
	repository: { html_url: string; full_name: string };
}
