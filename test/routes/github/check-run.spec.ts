import { CheckRunPayload } from '../../../src/schemas/github/check-run-payload';
import { getConfig } from '../../../src/config';
import { initServer } from '../../../src/server';
import { StreamLabs } from '../../../src/services/StreamLabs';
import { TwitchChat } from '../../../src/services/TwitchChat';
import { WebhookResponse } from '../../../src/schemas/webhook-response';

describe('/github', () => {
	const endpoint = '/github';
	const event = 'check_run';

	let streamLabsSpy: jest.SpyInstance<Promise<void>>;
	let twitchChatSpy: jest.SpyInstance<Promise<void>>;

	beforeEach(() => {
		streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
		streamLabsSpy.mockImplementationOnce(jest.fn());

		twitchChatSpy = jest.spyOn(TwitchChat.prototype, 'send');
		twitchChatSpy.mockImplementationOnce(jest.fn());
	});

	describe('check_run events', () => {
		it('responds with 200 OK', async () => {
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'success',
					status: 'completed',
					check_suite: {
						head_branch: 'master',
					},
				},
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			const subject = await initServer(getConfig());

			const response = await subject.inject({
				method: 'POST',
				url: endpoint,
				payload,
				headers: {
					'x-github-event': event,
				},
			});

			expect(response.statusCode).toEqual(200);
		});

		it('notifies StreamLabs with the appropriate message', async () => {
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'success',
					status: 'completed',
					check_suite: {
						head_branch: 'master',
					},
				},
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			const subject = await initServer(getConfig());

			const response = await subject.inject({
				method: 'POST',
				url: endpoint,
				payload,
				headers: {
					'x-github-event': event,
				},
			});

			expect((response.result as WebhookResponse).messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						streamlabs: {
							notified: true,
							message: '*streamdevs/webhook* built successfully ✨!',
						},
					}),
				]),
			);
		});
		it('notifies Twitch Chat with the appropriate message', async () => {
			const payload: CheckRunPayload = {
				action: 'completed',
				check_run: {
					html_url: 'https://github.com/Codertocat/Hello-World/runs/128620228',
					conclusion: 'success',
					status: 'completed',
					check_suite: {
						head_branch: 'master',
					},
				},
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			const subject = await initServer(getConfig());

			const response = await subject.inject({
				method: 'POST',
				url: endpoint,
				payload,
				headers: {
					'x-github-event': event,
				},
			});

			expect((response.result as WebhookResponse).messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						twitchChat: {
							notified: true,
							message: 'streamdevs/webhook built successfully ✨!',
						},
					}),
				]),
			);
		});
	});
});
