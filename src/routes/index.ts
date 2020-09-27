import { ServerRoute } from '@hapi/hapi';
import { routes as gitlab } from './gitlab';
import { routes as github } from './github';
import { routes as health } from './health';
import { Config } from '../config';

export const routes = (config: Config): ServerRoute[] => {
	return [...github(config), ...gitlab(config), ...health(config)];
};
