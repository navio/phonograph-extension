import { AudioState } from "player/types";
import { ISimplePodcast } from "Podcast";
import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { PodcastImage } from "ui/utils/imageSaver";
import { MessageResponse } from "../types";

export enum OPTIONS_EVENTS {
  INITIALIZATION = "INIT_OPTIONS",
  GET_PLAYER_STATUS = "GET_PLAYER_STATUS"
}

export interface InitializeOptionsResponse extends MessageResponse {
  action: OPTIONS_EVENTS.INITIALIZATION;
  payload: {
    library: IPodcast[];
    episode: IEpisode;
    state: AudioState;
  };
}

export interface GetPlayerStatusResponse extends MessageResponse {
  action: OPTIONS_EVENTS.GET_PLAYER_STATUS;
  payload: {
    episode: IEpisode,
    state: AudioState,
    podcast?: ISimplePodcast,
    podcastImage?: PodcastImage
  };
}

export type OptionsActions = InitializeOptionsResponse;
