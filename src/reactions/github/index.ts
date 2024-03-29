import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { Fork } from './fork';
import { IssueOpened } from './issue-opened';
import { Ping } from './ping';
import { PullRequestMerged } from './pull-request-merged';
import { PullRequestOpened } from './pull-request-opened';
import { Reaction } from './reaction';
import { Star } from './star';
import { CheckRun } from './check-run';
import { IssueAssigned } from './issue-assigned';
import { SponsorshipCreated } from './sponsorship-created';
import { ReleaseCreated } from './release-created';

export {
	Fork,
	Ping,
	PullRequestMerged,
	PullRequestOpened,
	Star,
	CheckRun,
	IssueAssigned,
	IssueOpened,
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
		new CheckRun(twitchChat, streamlabs),
		new IssueOpened(twitchChat, streamlabs),
		new IssueAssigned(twitchChat, streamlabs),
		new SponsorshipCreated(twitchChat, streamlabs),
		new ReleaseCreated(twitchChat, streamlabs),
	];
};
