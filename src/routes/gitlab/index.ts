import { ServerRoute, ResponseObject, Request, ResponseToolkit } from '@hapi/hapi';

export const routes = (): ServerRoute[] => {
	return [
		{
			method: 'POST',
			handler: async (request: Request, h: ResponseToolkit): Promise<ResponseObject> =>
				h.response().code(200),
			path: '/gitlab',
		},
	];
};
