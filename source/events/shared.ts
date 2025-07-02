export interface CrowdinTargetLanguage {
	id: string;
	name: string;
}

export interface CrowdinProject {
	id: string;
	lastActivity: string;
	url: string;
}

export interface CrowdinUser {
	id: string;
	username: string;
	fullName: string;
}
