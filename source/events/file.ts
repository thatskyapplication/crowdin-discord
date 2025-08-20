import {
	type APIComponentInContainer,
	type APIMessageTopLevelComponent,
	ComponentType,
	SeparatorSpacingSize,
} from "@discordjs/core/http-only";
import {
	CrowdinEventToAccentColour,
	CrowdinEventToString,
	CrowdinLanguageToLanguage,
} from "../utility/constants.js";
import type { CrowdinFileWithProject, CrowdinTargetLanguage, CrowdinUser } from "./shared.js";

interface CrowdinFileFullyTranslatedAndFullyReviewedEvent {
	event: "file.translated" | "file.approved";
	file: CrowdinFileWithProject;
	targetLanguage: CrowdinTargetLanguage;
}

interface CrowdinFileModifiedEvent {
	event: "file.added" | "file.updated" | "file.reverted" | "file.deleted";
	file: CrowdinFileWithProject;
	user: CrowdinUser;
}

interface CrowdinFileRevisionDataInfoData {
	strings: number;
	words: number;
}

interface CrowdinFileRevisionDataInfo {
	added: CrowdinFileRevisionDataInfoData;
	deleted: CrowdinFileRevisionDataInfoData;
	updated: CrowdinFileRevisionDataInfoData;
}

interface CrowdinFileRevisionData {
	info: CrowdinFileRevisionDataInfo;
	date: string;
}

interface CrowdinFileRevision {
	data: CrowdinFileRevisionData;
}

export type CrowdinFileEvent =
	| CrowdinFileFullyTranslatedAndFullyReviewedEvent
	| CrowdinFileModifiedEvent;

export async function createFileComponents(
	data: CrowdinFileEvent,
	token: string,
): Promise<APIMessageTopLevelComponent[]> {
	const revisionData = await fetch(
		`https://thatskyapplication.crowdin.com/api/v2/projects/${data.file.project.id}/files/${data.file.id}/revisions/${data.file.revision}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

	const revision = (await revisionData.json()) as CrowdinFileRevision;
	const { info } = revision.data;
	const addedStrings = info.added.strings;
	const addedWords = info.added.words === 1 ? "1 word" : `${info.added.words} words`;
	const deletedStrings = info.deleted.strings;
	const deletedWords = info.deleted.words === 1 ? "1 word" : `${info.deleted.words} words`;
	const updatedStrings = info.updated.strings;
	const updatedWords = info.updated.words === 1 ? "1 word" : `${info.updated.words} words`;
	const containerComponents: APIComponentInContainer[] = [];

	if (
		data.event === "file.added" ||
		data.event === "file.updated" ||
		data.event === "file.reverted" ||
		data.event === "file.deleted"
	) {
		containerComponents.push(
			{
				type: ComponentType.TextDisplay,
				content: `[${CrowdinEventToString[data.event]}](${data.file.project.url})`,
			},
			{
				type: ComponentType.TextDisplay,
				content: `File: ${data.file.name}\nNew strings: ${addedStrings} (${addedWords})\nDeleted strings: ${deletedStrings} (${deletedWords})\nUpdated strings: ${updatedStrings} (${updatedWords})\nRevision: ${data.file.revision}`,
			},
		);
	}

	if (data.event === "file.translated" || data.event === "file.approved") {
		containerComponents.push({
			type: ComponentType.TextDisplay,
			content: `[${CrowdinEventToString[data.event]}](${data.file.project.url}) (${data.file.name}) into ${CrowdinLanguageToLanguage[data.targetLanguage.name as keyof typeof CrowdinLanguageToLanguage]}!`,
		});
	}

	const relativeTimeMarkdown = `<t:${Math.floor(Date.parse(revision.data.date) / 1000)}:R>`;

	containerComponents.push(
		{
			type: ComponentType.Separator,
			divider: true,
			spacing: SeparatorSpacingSize.Small,
		},
		{
			type: ComponentType.TextDisplay,
			content:
				"user" in data
					? `-# ${data.user.username} | ${relativeTimeMarkdown}`
					: `${relativeTimeMarkdown}`,
		},
	);

	return [
		{
			type: ComponentType.Container,
			components: containerComponents,
			accent_color: CrowdinEventToAccentColour[data.event],
		},
	];
}
