import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { OPTIONS_EVENTS, InitializeOptionsResponse } from "./types";

export const initializeOptionsResponse = (
  library: IPodcast[]
): InitializeOptionsResponse => ({
  action: OPTIONS_EVENTS.INITIALIZATION,
  payload: { library },
});
