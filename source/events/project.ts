import {
	type APIMessageTopLevelComponent,
	ButtonStyle,
	ComponentType,
	SeparatorSpacingSize,
} from "@discordjs/core/http-only";
import {
	CrowdinEventToAccentColour,
	CrowdinEventToString,
	CrowdinLanguageToLanguage,
} from "../utility/constants.js";
import type { CrowdinProject, CrowdinTargetLanguage } from "./shared.js";

interface CrowdinProjectTranslatedAndApproved {
	event: "project.translated" | "project.approved";
	project: CrowdinProject;
	targetLanguage: CrowdinTargetLanguage;
}

interface CrowdinProjectBuild {
	downloadUrl: string;
	project: CrowdinProject;
}

interface CrowdinProjectBuilt {
	event: "project.built";
	build: CrowdinProjectBuild;
}

interface CrowdinProjectBuiltDownloadData {
	url: string;
	expireIn: string;
}

interface CrowdinProjectBuildDownload {
	data: CrowdinProjectBuiltDownloadData;
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
			accent_color: CrowdinEventToAccentColour[data.event],
		},
	];
}

export async function createProjectBuiltComponents(
	data: CrowdinProjectBuilt,
	token: string,
): Promise<APIMessageTopLevelComponent[]> {
	const downloadData = await fetch(data.build.downloadUrl, {
		headers: { Authorization: `Bearer ${token}` },
	});

	const { data: download } = (await downloadData.json()) as CrowdinProjectBuildDownload;

	return [
		{
			type: ComponentType.Container,
			components: [
				{
					type: ComponentType.Section,
					accessory: {
						type: ComponentType.Button,
						style: ButtonStyle.Link,
						url: download.url,
						label: "Download",
					},
					components: [
						{
							type: ComponentType.TextDisplay,
							content: `[${CrowdinEventToString[data.event]}](${data.build.project.url}) (expires <t:${Math.floor(Date.parse(download.expireIn) / 1000)}:R>)`,
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
			accent_color: CrowdinEventToAccentColour[data.event],
		},
	];
}
