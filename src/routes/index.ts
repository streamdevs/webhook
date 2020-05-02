import { ServerRoute } from '@hapi/hapi';
import { routes as gitlab } from './gitlab';
import { routes as github } from './github';
import { Config } from '../config';

export const routes = (config: Config): ServerRoute[] => {
	return [...github(config), ...gitlab(config)];
};
