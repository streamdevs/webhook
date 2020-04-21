import { initServer } from './server';
import { getConfig } from './config';

initServer(getConfig()).then(async (server) => {
	await server.start();
});
