import { API, type APIMessageTopLevelComponent, MessageFlags } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";
import type { Events } from "./events/index.js";
import { createProjectComponents } from "./events/project.js";
import { createSuggestionComponents } from "./events/suggestion.js";

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
		let components: APIMessageTopLevelComponent[];

		switch (data.event) {
			case "project.translated":
			case "project.approved":
				components = createProjectComponents(data);
				break;
			case "suggestion.added":
			case "suggestion.updated":
			case "suggestion.deleted":
			case "suggestion.approved":
			case "suggestion.disapproved":
				components = createSuggestionComponents(data);
				break;
		}

		await new API(new REST()).webhooks.execute(env.WEBHOOK_ID, env.WEBHOOK_TOKEN, {
			allowed_mentions: { parse: [] },
			components,
			flags: MessageFlags.IsComponentsV2,
			with_components: true,
		});

		return new Response(null, { status: 204 });
	},
} satisfies ExportedHandler<Env>;
