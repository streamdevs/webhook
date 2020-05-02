import { TwitchChat } from '../../services/TwitchChat';
import { StreamLabs } from '../../services/StreamLabs';
import { MergeRequestMerged } from './merge-request-merged';
import { Reaction } from '../github/reaction';
import { MergeRequestPayload } from '../../schemas/gitlab/merge-request-payload';

export const buildGitLabReactions = (
	twitchChat: TwitchChat,
	streamlabs: StreamLabs,
): Reaction<MergeRequestPayload>[] => {
	return [new MergeRequestMerged(twitchChat, streamlabs)];
};
