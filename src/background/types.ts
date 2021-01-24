import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { MessageResponse, ReducerRensposeFn } from "../types";

export { ReducerRensposeFn };

export enum BACKGROUND_EVENTS {
  INIT_POPUP = "BACKGROUND_INIT_POPUP",
  INIT_OPTIONS = "BACKGROUND_INIT_OPTIONS",
}

export enum PODCAST_EVENTS {
  ADD_PODCAST = "BACKGROUND_PODCAST_ADD",
  GET_PODCAST = "BACKGROUND_PODCAST_GET",
  GET_PODCASTS = "BACKGROUND_PODCAST_ALL",
  DELETE_PODCAST = "BACKGROUND_PODCAST_DELETE",
  SET_EPISODE = "SET_EPISODE",
  REMOVE_EPISODE = "REMOVE_EPISODE",
  GET_EPISODE = "GET_EPISODE"
}

export enum PODCAST_RESPONSES {
  PODCAST = "BACKGROUND_PODCAST_RESPONSE",
  PODCASTS = "BACKGROUND_PODCASTS_RESPONSES",
  EPISODE = "BACKGROUND_EPISODE_RESPONSE"
}

export enum BACKGROUND_RESPONSES {
  GENERAL = "BACKGROUND_RESPONSE",
}

// RESPONSES

export interface GetEpisodeReponse extends MessageResponse {
  action: PODCAST_RESPONSES.EPISODE,
  payload: {
    podcast?: IEpisode,
    time?: number,
  }
}

export interface GetPodcastsResponse extends MessageResponse {
  action: PODCAST_RESPONSES.PODCASTS,
  payload: {
    library: IPodcast[];
  };
}

export interface GetPodcastResponse extends MessageResponse {
  action: PODCAST_RESPONSES.PODCAST,
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
}

export interface InitializeOptions {
  action: typeof BACKGROUND_EVENTS.INIT_OPTIONS;
  payload: {
    id: string;
  };
}

export interface GetEpisode {
  action: typeof PODCAST_EVENTS.GET_EPISODE
}

export interface GetPodcast {
  action: typeof PODCAST_EVENTS.GET_PODCAST;
  payload: {
    url: string;
    save?: boolean;
  };
}

export interface GetPodcasts {
  action: typeof PODCAST_EVENTS.GET_PODCASTS;
}

export interface SetEpisode {
  action: typeof PODCAST_EVENTS.SET_EPISODE;
  payload: {
    episode: IEpisode,
    time?: number
  }
}

export interface ClearEpisode {
  action: typeof PODCAST_EVENTS.REMOVE_EPISODE;
}

export interface DeletePodcast {
  action: typeof PODCAST_EVENTS.DELETE_PODCAST;
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
  | SetEpisode
  | ClearEpisode
  | GetEpisode
  | GetPodcast
  | GetPodcasts
  | DeletePodcast;
