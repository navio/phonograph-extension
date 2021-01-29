import { AudioState } from "src/Audio";
import { IEpisode } from "podcastsuite/dist/Format";
import {
    POPUP_EVENTS,
    InitializePopUpResponse,
  } from "./types";
import { ISimplePodcast } from "src/Podcast";
import { PodcastImage } from "ui/utils/imageSaver";

  export const initializeResponsePopUp = (
    episode: IEpisode,
    state: AudioState,
    podcast?: ISimplePodcast,
    podcastImage?: PodcastImage
  ): InitializePopUpResponse => ({
    action: POPUP_EVENTS.INITIALIZATION,
    payload: { episode, state, podcast, podcastImage },
  });
