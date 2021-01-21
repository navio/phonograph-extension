import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { MessageResponse, ReducerRensposeFn } from "../types";

export { ReducerRensposeFn };

export enum BACKGROUND_EVENTS {
  INIT_POPUP = "BACKGROUND_INIT_POPUP",
  INIT_OPTIONS = "BACKGROUND_INIT_OPTIONS",
  ADD_PODCAST = "BACKGROUND_PODCAST_ADD",
  GET_PODCAST = "BACKGROUND_PODCAST_GET",
  GET_PODCASTS = "BACKGROUND_PODCAST_ALL",
  DELETE_PODCAST = "BACKGROUND_PODCAST_DELETE",
}

export enum BACKGROUND_RESPONSES {
  PODCAST = "BACKGROUND_PODCAST_RESPONSE",
  PODCASTS = "BACKGROUND_PODCASTS_RESPONSES",
  GENERAL = "BACKGROUND_RESPONSE",
}

// RESPONSES

export interface GetPodcastsResponse extends MessageResponse {
  action: BACKGROUND_RESPONSES.PODCASTS,
  payload: {
    library: IPodcast[];
  };
}

export interface GetPodcastResponse extends MessageResponse {
  action: BACKGROUND_RESPONSES.PODCAST,
  payload: {
    podcast: IPodcast;
  };
}

export interface BackgroundResponse extends MessageResponse {
  action: BACKGROUND_RESPONSES.GENERAL,
  payload: any
}


// REQUEST

export interface InitializePopUp {
  action: typeof BACKGROUND_EVENTS.INIT_POPUP;
  payload: {
    id: string;
  };
}

export interface InitializeOptions {
  action: typeof BACKGROUND_EVENTS.INIT_OPTIONS;
  payload: {
    id: string;
  };
}

export interface GetPodcast {
  action: typeof BACKGROUND_EVENTS.GET_PODCAST;
  payload: {
    url: string;
    save?: boolean;
  };
}

export interface GetPodcasts {
  action: typeof BACKGROUND_EVENTS.GET_PODCASTS;
}

export interface DeletePodcast {
  action: typeof BACKGROUND_EVENTS.DELETE_PODCAST;
  payload: {
    url: string;
  };
}

export type BackgroundEventReducer = (
  message: BackgroundActions,
  sender: chrome.runtime.MessageSender,
  sendResponse: ReducerRensposeFn
) => void;

export type BackgroundActions =
  | InitializePopUp
  | InitializeOptions
  | GetPodcast
  | GetPodcasts
  | DeletePodcast;
