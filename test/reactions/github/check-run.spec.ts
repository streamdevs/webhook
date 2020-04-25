import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { StreamLabs } from '../../../src/services/StreamLabs';

import { CheckRun } from '../../../src/reactions/github';

import { CheckRunPayload } from '../../../src/schemas/github/check-run-payload';

describe('CheckRun', async () => {
	let twitchChat: TwitchChat;
	let streamLabs: StreamLabs;

	beforeEach(() => {
		twitchChat = new TwitchChatMock();
		streamLabs = new StreamLabsMock();
	});
	describe('#canHandle', async () => {
		it('returns true if the action is === completed AND the status is === completed AND conclusion === success', async () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const event = 'check_run';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'success',
					status: 'completed',
				},
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.canHandle({ event, payload })).toEqual(true);
		});
		it('returns true if the action is === completed AND the status is === completed AND conclusion === failure', async () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const event = 'check_run';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'failure',
					status: 'completed',
				},
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.canHandle({ event, payload })).toEqual(true);
		});
		it('returns false if the action is !== completed', async () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const event = 'check_run';
			const payload: CheckRunPayload = {
				action: 'created',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: null,
					status: 'queued',
				},
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.canHandle({ event, payload })).toEqual(false);
		});
	});
	describe('#getStreamLabsMessage', async () => {
		it('generates the appropriate message when the build is successful', () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const repositoryFullName = 'streamdevs/webhook';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'success',
					status: 'completed',
				},
				repository: {
					full_name: repositoryFullName,
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.getStreamLabsMessage({ payload })).toEqual(
				`${repositoryFullName} built successfully ✨!`,
			);
		});
		it('generates the appropriate message when the build fails', () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const repositoryFullName = 'streamdevs/webhook';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'failure',
					status: 'completed',
				},
				repository: {
					full_name: repositoryFullName,
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.getStreamLabsMessage({ payload })).toEqual(
				`The build for ${repositoryFullName} just failed 🙃`,
			);
		});
		it('generates the appropriate message when the build times out', () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const repositoryFullName = 'streamdevs/webhook';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'timed_out',
					status: 'completed',
				},
				repository: {
					full_name: repositoryFullName,
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.getStreamLabsMessage({ payload })).toEqual(
				`The build for ${repositoryFullName} finished with state: 🌰 timed_out`,
			);
		});
	});
	describe('#getTwitchChatMessage', async () => {
		it('generates the appropriate message when the build is successful', () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const repositoryFullName = 'streamdevs/webhook';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'success',
					status: 'completed',
				},
				repository: {
					full_name: repositoryFullName,
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.getTwitchChatMessage({ payload })).toEqual(
				`${repositoryFullName} built successfully ✨!`,
			);
		});
		it('generates the appropriate message when the build fails', () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const repositoryFullName = 'streamdevs/webhook';
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'failure',
					status: 'completed',
				},
				repository: {
					full_name: repositoryFullName,
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.getTwitchChatMessage({ payload })).toEqual(
				`The build for ${repositoryFullName} just failed 🙃. See ${payload.check_run.html_url} for details.`,
			);
		});
		it('generates the appropriate message when the build times out', () => {
			const subject = new CheckRun(twitchChat, streamLabs);
			const repositoryFullName = 'streamdevs/webhook';
			const buildUrl =
				'https://github.com/Codertocat/Hello-World/runs/128620228';

			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: buildUrl,
					conclusion: 'timed_out',
					status: 'completed',
				},
				repository: {
					full_name: repositoryFullName,
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			expect(subject.getTwitchChatMessage({ payload })).toEqual(
				`The build for ${repositoryFullName} finished with state: 🌰 timed_out. See ${buildUrl} for details.`,
			);
		});
	});
});
