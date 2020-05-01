import { ServerRoute, ResponseObject, Request, ResponseToolkit } from '@hapi/hapi';
import { gitlabHeader } from '../../schemas/gitlab/joi/gitlab-headers-schema';

export const routes = (): ServerRoute[] => {
	return [
		{
			method: 'POST',
			options: {
				validate: {
					headers: gitlabHeader(),
				},
			},
			handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
				const { headers } = request;
				const event = headers['x-gitlab-event'];

				return h.response({ message: `Ignoring event: '${event}'` }).code(200);
			},
			path: '/gitlab',
		},
	];
};
