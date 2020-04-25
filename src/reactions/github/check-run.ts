import {
	Reaction,
	ReactionCanHandleOptions,
	ReactionHandleOptions,
} from './reaction';
import { CheckRunPayload } from '../../schemas/github/check-run-payload';

export class CheckRun extends Reaction<CheckRunPayload> {
	canHandle({
		event,
		payload,
	}: ReactionCanHandleOptions<CheckRunPayload>): boolean {
		return event === 'check_run' && payload.check_run.status === 'completed';
	}

	getStreamLabsMessage({
		payload,
	}: ReactionHandleOptions<CheckRunPayload>): string {
		const conclusion = payload.check_run.conclusion;
		const repositoryFullName = payload.repository.full_name;

		if (conclusion === 'failure') {
			return `The build for *${repositoryFullName}* just failed 🙃`;
		}

		if (conclusion === 'success') {
			return `*${repositoryFullName}* built successfully ✨!`;
		}

		return `The build for *${repositoryFullName}* finished with state: 🌰 *${conclusion}*`;
	}

	getTwitchChatMessage({
		payload,
	}: ReactionHandleOptions<CheckRunPayload>): string {
		const conclusion = payload.check_run.conclusion;
		const repositoryFullName = payload.repository.full_name;
		const resultUrl = payload.check_run.html_url;

		if (conclusion === 'failure') {
			return `The build for ${repositoryFullName} just failed 🙃. See ${resultUrl} for details.`;
		}

		if (conclusion === 'success') {
			return `${repositoryFullName} built successfully ✨!`;
		}

		return `The build for ${repositoryFullName} finished with state: 🌰 ${conclusion}. See ${resultUrl} for details.`;
	}
}
