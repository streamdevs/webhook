import { object, string, Schema } from '@hapi/joi';

export function gitlabHeader(): Schema {
	return object({
		'x-gitlab-event': string().required(),
	}).unknown();
}
