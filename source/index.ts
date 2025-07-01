import { API, ComponentType, MessageFlags, SeparatorSpacingSize } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";
import type { Events } from "./events/index.js";

interface Env {
	CROWDIN_TOKEN: string;
	WEBHOOK_ID: string;
	WEBHOOK_TOKEN: string;
}

export default {
	async fetch(request, env) {
		if (request.method !== "POST") {
			return new Response("Method not allowed.", { status: 405 });
		}

		const authorisation = request.headers.get("Authorization");

		if (authorisation !== env.CROWDIN_TOKEN) {
			return new Response("Unauthorized", { status: 401 });
		}

		const data = (await request.json()) as Events;

		await new API(new REST()).webhooks.execute(env.WEBHOOK_ID, env.WEBHOOK_TOKEN, {
			allowed_mentions: { parse: [] },
			components: [
				{
					type: ComponentType.Container,
					components: [
						{
							type: ComponentType.TextDisplay,
							content: `[Suggestion added](${data.translation.string.url}) (\`${data.translation.string.key}\`)`,
						},
						{
							type: ComponentType.TextDisplay,
							content: `Original:\n>>> ${data.translation.text}`,
						},
						{
							type: ComponentType.TextDisplay,
							content: `Suggested:\n>>> ${data.translation.string.text}`,
						},
						{
							type: ComponentType.Separator,
							divider: true,
							spacing: SeparatorSpacingSize.Small,
						},
						{
							type: ComponentType.TextDisplay,
							content: `-# ${data.translation.targetLanguage.name} | ${data.translation.user.username} | <t:${Math.floor(Date.parse(data.translation.createdAt) / 1000)}:R>`,
						},
					],
				},
			],
			flags: MessageFlags.IsComponentsV2,
			with_components: true,
		});

		return new Response(null, { status: 204 });
	},
} satisfies ExportedHandler<Env>;
