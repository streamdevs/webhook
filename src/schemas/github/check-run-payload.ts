import { WebhookPayload } from './webhook-payload';

export interface CheckRunPayload extends WebhookPayload {
	action: 'created' | 'completed' | 'rerequested' | 'requested_action';
	check_run: {
		html_url: string;
		conclusion:
			| 'success'
			| 'failure'
			| 'neutral'
			| 'cancelled'
			| 'timed_out'
			| 'action_required'
			| 'stale'
			| null;
		status: 'queued' | 'in_progress' | 'completed';
		check_suite: {
			head_branch: string;
		};
	};
}
