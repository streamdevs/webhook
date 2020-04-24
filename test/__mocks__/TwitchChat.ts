import { TwitchChat } from '../../src/services/TwitchChat';

export class TwitchChatMock extends TwitchChat {
	public constructor() {
		super({ botName: '', channel: '', botToken: '' });
	}

	public send = jest.fn();
}
