import { object, Schema, string } from '@hapi/joi';

export function gitHubWebhookHeaders(): Schema {
	return object({ 'x-github-event': string().required() }).unknown();
}
