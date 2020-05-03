import { RepositoryWebhookPayload } from './repository-webhook-payload';

type url = string;

export interface IssuePayload extends RepositoryWebhookPayload {
	action: string;
	assignee?: { login: string };
	issue: { html_url: url };
}
