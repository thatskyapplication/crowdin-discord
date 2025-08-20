import type { Events } from "../events/index.js";

export const CrowdinLanguageToLanguage = {
	"Chinese Simplified": "中文",
	"Chinese Traditional": "繁體中文",
	French: "Français",
	German: "Deutsch",
	Italian: "Italiano",
	Japanese: "日本語",
	Korean: "한국어",
	"Portuguese, Brazilian": "Português do Brasil",
	Russian: "Русский",
	Spanish: "Español",
	"Spanish, Latin America": "Español, LATAM",
	Thai: "ไทย",
	Vietnamese: "Tiếng Việt",
} as const satisfies Readonly<Record<string, string>>;

export const CrowdinEventToString = {
	"file.translated": "File fully translated",
	"file.approved": "File fully approved",
	"file.added": "File added",
	"file.updated": "File updated",
	"file.reverted": "File reverted",
	"file.deleted": "File deleted",
	"project.translated": "Project fully translated",
	"project.approved": "Project fully approved",
	"project.built": "Project built",
	"suggestion.added": "Suggestion added",
	"suggestion.updated": "Suggestion updated",
	"suggestion.deleted": "Suggestion deleted",
	"suggestion.approved": "Suggestion approved",
	"suggestion.disapproved": "Suggestion disapproved",
} as const satisfies Readonly<Record<Events["event"], string>>;

export const CrowdinEventToAccentColour = {
	"file.translated": 0x33be2a,
	"file.approved": 0x33be2a,
	"file.added": 0x299bd8,
	"file.updated": 0xdbb536,
	"file.reverted": 0x954ecf,
	"file.deleted": 0xe63437,
	"project.translated": 0x33be2a,
	"project.approved": 0x33be2a,
	"project.built": 0x3bc8e4,
	"suggestion.added": 0x5b89c6,
	"suggestion.updated": 0xd4b45a,
	"suggestion.deleted": 0xe63437,
	"suggestion.approved": 0xf04ad1,
	"suggestion.disapproved": 0xc79fe4,
} as const satisfies Readonly<Record<Events["event"], number>>;
