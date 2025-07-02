import type { CrowdinFileUpdated } from "./file.js";
import type { CrowdinProjectEvent } from "./project.js";
import type { CrowdinSuggestionEvent } from "./suggestion.js";

export type Events = CrowdinFileUpdated | CrowdinProjectEvent | CrowdinSuggestionEvent;
