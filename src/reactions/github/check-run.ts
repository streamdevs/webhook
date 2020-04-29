import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { CheckRunPayload } from '../../schemas/github/check-run-payload';
import { Config } from '../../config';

export class CheckRun extends Reaction<CheckRunPayload> {
	canHandle({ event, payload }: ReactionCanHandleOptions<CheckRunPayload>): boolean {
		return (
			event === 'check_run' &&
			payload.check_run.status === 'completed' &&
			this.isBranchAllowedInConfig(payload.check_run.check_suite.head_branch, this.config)
		);
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<CheckRunPayload>): string {
		const {
			check_run: { conclusion },
			repository: { full_name: repositoryFullName },
		} = payload;

		if (conclusion === 'failure') {
			return `The build for *${repositoryFullName}* just failed 🙃`;
		}

		if (conclusion === 'success') {
			return `*${repositoryFullName}* built successfully ✨!`;
		}

		return `The build for *${repositoryFullName}* finished with state: 🌰 *${conclusion}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<CheckRunPayload>): string {
		const {
			check_run: { conclusion, html_url: resultUrl },
			repository: { full_name: repositoryFullName },
		} = payload;

		if (conclusion === 'failure') {
			return `The build for ${repositoryFullName} just failed 🙃. See ${resultUrl} for details.`;
		}

		if (conclusion === 'success') {
			return `${repositoryFullName} built successfully ✨!`;
		}

		return `The build for ${repositoryFullName} finished with state: 🌰 ${conclusion}. See ${resultUrl} for details.`;
	}

	private isBranchAllowedInConfig(branch: string, config: Config): boolean {
		if (config.NOTIFY_CHECK_RUNS_FOR.length === 0) {
			return true; // Allow from any branch
		}

		return config.NOTIFY_CHECK_RUNS_FOR.includes(branch); // Allow if branch is listed
	}
}
