const joi = require('@hapi/joi');

function gitHubWebhookPayload() {
	return joi
		.object({
			action: joi.string(),
			hook: joi.object({ events: joi.array().items(joi.string()) }).unknown(),
			pull_request: joi
				.object({
					login: joi.string().required(),
					merged: joi.boolean(),
				})
				.unknown(),
			sender: joi
				.object({ login: joi.string().required() })
				.required()
				.unknown(),
			repository: joi
				.object({ full_name: joi.string().required() })
				.required()
				.unknown(),
		})
		.unknown();
}

exports.gitHubWebhookPayload = gitHubWebhookPayload;
