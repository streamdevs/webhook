import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface PullRequestPayload extends RepositoryWebhookPayload {
	action:
		| 'assigned'
		| 'unassigned'
		| 'review_requested'
		| 'review_request_removed'
		| 'labeled'
		| 'unlabeled'
		| 'opened'
		| 'edited'
		| 'closed'
		| 'ready_for_review'
		| 'locked'
		| 'unlocked'
		| 'reopened';
	pull_request: { user: { login: string }; merged?: boolean; html_url: string };
}
