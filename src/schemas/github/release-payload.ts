import { WebhookPayload } from './webhook-payload';

export interface ReleasePayload extends WebhookPayload {
	action: 'unpublished' | 'published' | 'created' | 'edited' | 'deleted' | 'prereleased';
	release: {
		html_url: string;
		tag_name: string;
	};
}
