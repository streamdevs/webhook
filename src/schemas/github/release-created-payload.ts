import { RepositoryWebhookPayload } from './repository-webhook-payload';

export interface ReleaseCreatedPayload extends RepositoryWebhookPayload {
	action: 'unpublished' | 'published' | 'created' | 'edited' | 'deleted' | 'prereleased';
	release: {
		html_url: string;
		tag_name: string;
	};
}
