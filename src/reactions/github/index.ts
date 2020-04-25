import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { Fork } from './fork';
import { IssueOpened } from './issue-opened';
import { Ping } from './ping';
import { PullRequestMerged } from './pull-request-merged';
import { PullRequestOpened } from './pull-request-opened';
import { Reaction } from './reaction';
import { Star } from './star';

export default {
	Fork,
	Ping,
	PullRequestMerged,
	PullRequestOpened,
	Star,
};

export const reactionBuild = ({
	twitchChat,
	streamlabs,
}: {
	twitchChat: TwitchChat;
	streamlabs: StreamLabs;
}): Reaction[] => {
	return [
		new Fork(twitchChat, streamlabs),
		new Ping(twitchChat, streamlabs),
		new PullRequestMerged(twitchChat, streamlabs),
		new PullRequestOpened(twitchChat, streamlabs),
		new Star(twitchChat, streamlabs),
		new IssueOpened(twitchChat, streamlabs),
	];
};
