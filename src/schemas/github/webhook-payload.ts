export interface WebhookPayload {
	repository: { html_url: string; full_name: string };
	sender: { login: string };
}
