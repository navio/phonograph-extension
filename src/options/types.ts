import { AudioState } from "player/types";
import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { MessageResponse } from "../types";

export enum OPTIONS_EVENTS {
  INITIALIZATION = "INIT_OPTIONS",
}

export interface InitializeOptionsResponse extends MessageResponse {
  action: OPTIONS_EVENTS.INITIALIZATION;
  payload: {
    library: IPodcast[];
    episode: IEpisode;
    state: AudioState;
  };
}

export type OptionsActions = InitializeOptionsResponse;
