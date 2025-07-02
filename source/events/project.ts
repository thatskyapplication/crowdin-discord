import {
	type APIMessageTopLevelComponent,
	ComponentType,
	SeparatorSpacingSize,
} from "@discordjs/core/http-only";
import { CrowdinEventToString, CrowdinLanguageToLanguage } from "../utility/constants.js";
import type { CrowdinTargetLanguage } from "./shared.js";

interface CrowdinProject {
	id: string;
	lastActivity: string;
	url: string;
}

export interface CrowdinProjectEvent {
	event: "project.translated" | "project.approved";
	project: CrowdinProject;
	targetLanguage: CrowdinTargetLanguage;
}

export function createProjectComponents(data: CrowdinProjectEvent): APIMessageTopLevelComponent[] {
	return [
		{
			type: ComponentType.Container,
			components: [
				{
					type: ComponentType.TextDisplay,
					content: `[${CrowdinEventToString[data.event]}](${data.project.url}) into ${CrowdinLanguageToLanguage[data.targetLanguage.name as keyof typeof CrowdinLanguageToLanguage]}`,
				},
				{
					type: ComponentType.Separator,
					divider: true,
					spacing: SeparatorSpacingSize.Small,
				},
				{
					type: ComponentType.TextDisplay,
					content: `-# <t:${Math.floor(Date.parse(data.project.lastActivity) / 1000)}:R>`,
				},
			],
		},
	];
}
