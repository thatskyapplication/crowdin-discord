import type { CrowdinFileEvent } from "./file.js";
import type { CrowdinProjectEvent } from "./project.js";
import type { CrowdinSuggestionEvent } from "./suggestion.js";

export type Events = CrowdinFileEvent | CrowdinProjectEvent | CrowdinSuggestionEvent;
