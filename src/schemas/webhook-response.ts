export interface WebhookResponse {
	messages: { [key: string]: { message: string; notified: boolean } }[];
}
