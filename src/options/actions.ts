import { ISimplePodcast } from "Podcast";
import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { AudioState } from "src/Audio";
import { PodcastImage } from "ui/utils/imageSaver";
import { OPTIONS_EVENTS, InitializeOptionsResponse, GetPlayerStatusResponse } from "./types";

export const initializeOptionsResponse = (
  library: IPodcast[],
  state: AudioState,
  episode?: IEpisode,
): InitializeOptionsResponse => ({
  action: OPTIONS_EVENTS.INITIALIZATION,
  payload: {
    library,
    episode,
    state
  },
});

export const getPlayerStatusResponse = (
  episode: IEpisode,
  state: AudioState,
  podcast?: ISimplePodcast,
  podcastImage?: PodcastImage
): GetPlayerStatusResponse => ({
  action: OPTIONS_EVENTS.GET_PLAYER_STATUS,
  payload: {
    episode,
    state,
    podcast,
    podcastImage
  }
})
