const joi = require('@hapi/joi');
function gitHubWebhookHeaders() {
	return joi.object({ 'x-github-event': joi.string().required() }).unknown();
}
exports.gitHubWebhookHeaders = gitHubWebhookHeaders;
