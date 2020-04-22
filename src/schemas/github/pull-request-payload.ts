import { WebhookPayload } from './webhook-payload';

export interface PullRequestPayload extends WebhookPayload {
	action: string;
	pull_request: { user: { login: string }; merged?: boolean };
}
