import { WebhookPayload } from './webhook-payload';

export interface IssuePayload extends WebhookPayload {
	action: string;
	assignee?: { login: string };
}
