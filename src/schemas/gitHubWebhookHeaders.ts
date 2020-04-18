import { object, string } from '@hapi/joi';

export function gitHubWebhookHeaders() {
	return object({ 'x-github-event': string().required() }).unknown();
}
