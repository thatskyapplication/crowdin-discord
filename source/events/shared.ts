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

export interface CrowdinFile {
	id: string;
	name: string;
	title: string;
	type: string;
	revision: string;
}

export interface CrowdinFileWithProject extends CrowdinFile {
	project: CrowdinProject;
}
