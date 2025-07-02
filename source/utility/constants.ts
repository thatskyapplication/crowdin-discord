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
	"project.translated": "Project fully translated",
	"project.approved": "Project fully approved",
	"suggestion.added": "Suggestion added",
	"suggestion.updated": "Suggestion updated",
	"suggestion.deleted": "Suggestion deleted",
	"suggestion.approved": "Suggestion approved",
	"suggestion.disapproved": "Suggestion disapproved",
} as const satisfies Readonly<Record<string, string>>;
