import { object, string, array, boolean, Schema } from '@hapi/joi';

export function gitHubWebhookPayload(): Schema {
	return object({
		action: string(),
		hook: object({ events: array().items(string()) }).unknown(),
		pull_request: object({
			user: object({ login: string().required() }).unknown(),
			merged: boolean(),
		}).unknown(),
		sender: object({ login: string().required() }).required().unknown(),
		repository: object({ full_name: string().required() }).required().unknown(),
		forkee: object({
			owner: object({
				login: string().required(),
			})
				.required()
				.unknown(),
		}).unknown(),
	}).unknown();
}
