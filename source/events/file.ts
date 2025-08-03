import {
	type APIMessageTopLevelComponent,
	ComponentType,
	SeparatorSpacingSize,
} from "@discordjs/core/http-only";
import { CrowdinEventToString } from "../utility/constants.js";
import type { CrowdinProject, CrowdinUser } from "./shared.js";

interface CrowdinFile {
	id: string;
	name: string;
	title: string;
	type: string;
	revision: string;
	project: CrowdinProject;
}

export interface CrowdinFileUpdated {
	event: "file.updated";
	file: CrowdinFile;
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

export async function createFileUpdatedComponents(
	data: CrowdinFileUpdated,
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

	return [
		{
			type: ComponentType.Container,
			components: [
				{
					type: ComponentType.TextDisplay,
					content: `[${CrowdinEventToString[data.event]}](${data.file.project.url})`,
				},
				{
					type: ComponentType.TextDisplay,
					content: `File: ${data.file.name}\nNew strings: ${addedStrings} (${addedWords})\nDeleted strings: ${deletedStrings} (${deletedWords})\nUpdated strings: ${updatedStrings} (${updatedWords})\nRevision: ${data.file.revision}`,
				},
				{
					type: ComponentType.Separator,
					divider: true,
					spacing: SeparatorSpacingSize.Small,
				},
				{
					type: ComponentType.TextDisplay,
					content: `-# ${data.user.username} | <t:${Math.floor(Date.parse(revision.data.date) / 1000)}:R>`,
				},
			],
		},
	];
}
