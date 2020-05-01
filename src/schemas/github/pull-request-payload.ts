import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface PullRequestPayload extends RepositoryWebhookPayload {
	action: string;
	pull_request: { user: { login: string }; merged?: boolean };
}
