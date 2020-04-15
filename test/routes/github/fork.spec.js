const { initServer } = require('../../../src/server');
const { getConfig } = require('../../../src/config');
const { StreamLabs } = require('../../../src/services/StreamLabs');

describe('POST /github', () => {
	describe("GitHub 'fork' event", () => {
		it('sends an alert to StreamLabs', async () => {
			const streamLabsSpy = jest.spyOn(StreamLabs.prototype, 'alert');
			const subject = await initServer(getConfig());

			const forkOwner = 'john';
			const repositoryFullName = 'john/repo';

			const response = await subject.inject({
				method: 'POST',
				url: '/github',
				payload: {
					repository: { full_name: repositoryFullName },
					forkee: { owner: { login: forkOwner } },
					sender: { login: 'unknown' },
				},
				headers: { 'x-github-event': 'fork' },
			});

			expect(response.statusCode).toEqual(200);
			expect(streamLabsSpy).toHaveBeenCalledWith(
				`*${forkOwner}* just forked 🍴 *${repositoryFullName}*`,
			);
		});
	});
});
