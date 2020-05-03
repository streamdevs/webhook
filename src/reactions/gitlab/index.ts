import { TwitchChat } from '../../services/TwitchChat';
import { StreamLabs } from '../../services/StreamLabs';
import { MergeRequestMerged } from './merge-request-merged';
import { MergeRequestPayload } from '../../schemas/gitlab/merge-request-payload';
import { MergeRequestOpened } from './merge-request-opened';
import { Reaction } from '../github/reaction';

export const buildGitLabReactions = (
	twitchChat: TwitchChat,
	streamlabs: StreamLabs,
): Reaction<MergeRequestPayload>[] => {
	return [
		new MergeRequestMerged(twitchChat, streamlabs),
		new MergeRequestOpened(twitchChat, streamlabs),
	];
};
