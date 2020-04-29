import { ServerRoute, ResponseObject, Request, ResponseToolkit } from '@hapi/hapi';
import { gitlabHeader } from '../../schemas/gitlab/joi/gitlab-headers-schema';

export const routes = (): ServerRoute[] => {
	return [
		{
			method: 'POST',
			options: {
				handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> =>
					h.response().code(200),
				validate: {
					headers: gitlabHeader(),
				},
			},
			path: '/gitlab',
		},
	];
};
