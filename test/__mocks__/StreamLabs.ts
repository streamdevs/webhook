import { StreamLabs } from '../../src/services/StreamLabs';

export class StreamLabsMock extends StreamLabs {
	public constructor() {
		super({ token: '' });
	}

	public alert = jest.fn();
}
