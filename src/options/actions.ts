import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { OPTIONS_EVENTS, InitializeOptionsResponse } from "./types";

export const initializeOptionsResponse = (
  library: IPodcast[],
  episode?: IEpisode,
): InitializeOptionsResponse => ({
  action: OPTIONS_EVENTS.INITIALIZATION,
  payload: {
    library,
    episode,
  },
});
