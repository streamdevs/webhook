type url = string;

export interface MergeRequestPayload {
	user: {
		name: string;
		username: string;
		avatar_url: url;
	};
	repository: {
		name: string;
		url: url;
		description: string;
		homepage: url;
	};
	object_attributes: {
		state: 'merged' | 'created' | 'updated' | 'closed' | 'opened';
		url: url;
	};
}
