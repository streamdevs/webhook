import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface ForkPayload extends RepositoryWebhookPayload {
	forkee: {
		owner: {
			login: string;
		};
	};
}
