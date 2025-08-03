import {
	type APIMessageTopLevelComponent,
	ComponentType,
	SeparatorSpacingSize,
} from "@discordjs/core/http-only";
import { CrowdinEventToString, CrowdinLanguageToLanguage } from "../utility/constants.js";
import type { CrowdinFile, CrowdinTargetLanguage, CrowdinUser } from "./shared.js";

interface CrowdinString {
	id: string;
	identifier: string;
	key: string;
	text: string;
	context: string;
	masterStringId: string;
	revision: string;
	hasPlurals: boolean;
	url: string;
	createdAt: string;
	updatedAt: string;
	file: CrowdinFile;
}

interface CrowdinTranslation {
	id: string;
	text: string;
	rating: string;
	createdAt: string;
	user: CrowdinUser;
	targetLanguage: CrowdinTargetLanguage;
	string: CrowdinString;
}

export interface CrowdinSuggestionEvent {
	event:
		| "suggestion.added"
		| "suggestion.updated"
		| "suggestion.deleted"
		| "suggestion.approved"
		| "suggestion.disapproved";
	translation: CrowdinTranslation;
}

export function createSuggestionComponents(
	data: CrowdinSuggestionEvent,
): APIMessageTopLevelComponent[] {
	return [
		{
			type: ComponentType.Container,
			components: [
				{
					type: ComponentType.TextDisplay,
					content: `[${CrowdinEventToString[data.event]}](${data.translation.string.url}) (\`${data.translation.string.key}\`) in ${data.translation.string.file.name}`,
				},
				{
					type: ComponentType.TextDisplay,
					content: `Original:\n>>> ${data.translation.string.text}`,
				},
				{
					type: ComponentType.TextDisplay,
					content: `Suggested:\n>>> ${data.translation.text}`,
				},
				{
					type: ComponentType.Separator,
					divider: true,
					spacing: SeparatorSpacingSize.Small,
				},
				{
					type: ComponentType.TextDisplay,
					content: `-# ${CrowdinLanguageToLanguage[data.translation.targetLanguage.name as keyof typeof CrowdinLanguageToLanguage]} | ${data.translation.user.username} | <t:${Math.floor(Date.parse(data.translation.createdAt) / 1000)}:R>`,
				},
			],
		},
	];
}
