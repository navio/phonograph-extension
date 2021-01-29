import { AudioState } from "src/Audio";
import { IEpisode } from "podcastsuite/dist/Format";
import { MessageResponse } from "../types";
import { ISimplePodcast } from "src/Podcast";
import { PodcastImage } from "ui/utils/imageSaver";

export enum POPUP_EVENTS {
  INITIALIZATION = "INIT_POPUP",
}

export interface InitializePopUpResponse extends MessageResponse {
  action: POPUP_EVENTS.INITIALIZATION;
  payload: {
    episode: IEpisode,
    state: AudioState,
    podcast?: ISimplePodcast,
    podcastImage?: PodcastImage
  };
}

export type PopUpActions = InitializePopUpResponse;
