import {
	type APIMessageTopLevelComponent,
	ButtonStyle,
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

interface CrowdinProjectTranslatedAndApproved {
	event: "project.translated" | "project.approved";
	project: CrowdinProject;
	targetLanguage: CrowdinTargetLanguage;
}

interface CrowdinProjectBuild {
	// "downloadLink" is used on https://support.crowdin.com/developer/webhooks/#project-successfully-built, but it is actually "downloadUrl".
	downloadUrl: string;
	project: CrowdinProject;
}

interface CrowdinProjectBuilt {
	event: "project.built";
	build: CrowdinProjectBuild;
}

export type CrowdinProjectEvent = CrowdinProjectTranslatedAndApproved | CrowdinProjectBuilt;

export function createProjectTranslatedAndApprovedComponents(
	data: CrowdinProjectTranslatedAndApproved,
): APIMessageTopLevelComponent[] {
	return [
		{
			type: ComponentType.Container,
			components: [
				{
					type: ComponentType.TextDisplay,
					content: `[${CrowdinEventToString[data.event]}](${data.project.url}) into ${CrowdinLanguageToLanguage[data.targetLanguage.name as keyof typeof CrowdinLanguageToLanguage]}!`,
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

export function createProjectBuiltComponents(
	data: CrowdinProjectBuilt,
): APIMessageTopLevelComponent[] {
	return [
		{
			type: ComponentType.Container,
			components: [
				{
					type: ComponentType.Section,
					accessory: {
						type: ComponentType.Button,
						style: ButtonStyle.Link,
						url: data.build.downloadUrl,
						label: "Download",
					},
					components: [
						{
							type: ComponentType.TextDisplay,
							content: `[${CrowdinEventToString[data.event]}](${data.build.project.url})`,
						},
					],
				},
				{
					type: ComponentType.Separator,
					divider: true,
					spacing: SeparatorSpacingSize.Small,
				},
				{
					type: ComponentType.TextDisplay,
					content: `-# <t:${Math.floor(Date.parse(data.build.project.lastActivity) / 1000)}:R>`,
				},
			],
		},
	];
}
