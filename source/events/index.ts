import type { CrowdinProjectEvent } from "./project.js";
import type { CrowdinSuggestionEvent } from "./suggestion.js";

export type Events = CrowdinProjectEvent | CrowdinSuggestionEvent;
