import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface IssuePayload extends RepositoryWebhookPayload {
	action: string;
	assignee?: { login: string };
}
