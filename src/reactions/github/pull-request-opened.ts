import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { PullRequestPayload } from '../../schemas/github/pull-request-payload';
import { Config } from '../../config';

type CanHandleOptions = ReactionCanHandleOptions<PullRequestPayload>;
type HandleOptions = ReactionHandleOptions<PullRequestPayload>;

type configAllowOptions = {
	config?: Config;
	payload: PullRequestPayload;
};

export class PullRequestOpened extends Reaction<PullRequestPayload> {
	canHandle({ payload, event, config }: CanHandleOptions): boolean {
		return (
			event === 'pull_request' &&
			payload.action === 'opened' &&
			this.configAllowsPRsFromSender({ config, payload })
		);
	}

	private configAllowsPRsFromSender(options: configAllowOptions): boolean {
		const { config, payload } = options;

		return (
			!config ||
			!config.IGNORE_PR_OPENED_BY.includes(payload.sender.login) ||
			config.IGNORE_PR_OPENED_BY.length === 0
		);
	}

	getStreamLabsMessage({ payload }: HandleOptions): string {
		return `*${payload.pull_request.user.login}* just opened a pull request in *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: HandleOptions): string {
		return `*${payload.pull_request.user.login}* just opened a pull request in ${payload.repository.html_url}`;
	}
}
