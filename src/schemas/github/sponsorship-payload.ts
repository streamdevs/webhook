export interface SponsorshipPayload {
	action:
		| 'created'
		| 'cancelled'
		| 'edited'
		| 'tier_changed'
		| 'pending_cancellation'
		| 'pending_tier_change';
	sponsorship: {
		sponsorable: {
			login: string;
		};
		sponsor: {
			login: string;
		};
	};
	sender: { login: string };
}
