interface CrowdinUser {
	id: string;
	username: string;
	fullName: string;
}

interface CrowdinTargetLanguage {
	id: string;
	name: string;
}

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

export interface CrowdinSuggestionAdded {
	event:
		| "suggestion.added"
		| "suggestion.updated"
		| "suggestion.deleted"
		| "suggestion.approved"
		| "suggestion.disapproved";
	translation: CrowdinTranslation;
}
