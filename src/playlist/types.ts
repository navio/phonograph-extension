import { IEpisodeState } from "lib/State";
import { MessageResponse, ReducerResponseFn } from "../types";

export enum PLAYLIST_EVENTS {
  GET_EPISODES = "PLAYLIST_GET_EPISODES",
  GET_NEXT_EPISODE = "PLAYLIST_GET_NEXT_EPISODE",
  REMOVE_EPISODE = "PLAYLIST_REMOVE_EPISODE",
  ADD_EPISODE = "PLAYLIST_ADD_EPISODE",
  REMOVE_LOCATION = "PLAYLIST_REMOVE_LOCATION",
  SWAP_LOCATION = "PLAYLIST_SWAP_LOCATION",
  CLEAR_EPISODES = "PLAYLIST_CLEAR_EPISODES",
}

export enum PLAYLIST_EVENT_RESPONSES {
  GET_EPISODES = "PLAYLIST_GET_EPISODES_RESPONSE",
  GET_NEXT_EPISODE = "PLAYLIST_GET_NEXT_EPISODE_RESPONSE",
  PLAYLIST_EVENT = "PLAYLIST_EVENT_RESPONSE",
}

// Requests
export interface GetEpisodes {
  action: typeof PLAYLIST_EVENTS.GET_EPISODES;
}

export interface GetNext {
  action: typeof PLAYLIST_EVENTS.GET_NEXT_EPISODE;
}

export interface AddEpisode {
  action: typeof PLAYLIST_EVENTS.ADD_EPISODE;
  payload: {
    episode: IEpisodeState;
    next: boolean
  };
}

export interface RemoveEpisode {
  action: typeof PLAYLIST_EVENTS.REMOVE_EPISODE;
  payload: {
    episode: IEpisodeState | string;
  };
}

export interface RemoveLocation {
  action: typeof PLAYLIST_EVENTS.REMOVE_LOCATION;
  payload: {
    location: number;
  };
}

export interface SwapLocation {
  action: typeof PLAYLIST_EVENTS.SWAP_LOCATION;
  payload: {
    origin: number;
    destination: number;
  };
}

export interface ClearEpisodes {
    action: typeof PLAYLIST_EVENTS.CLEAR_EPISODES;
}

export type PlaylistRequestActions =
  | GetNext
  | GetEpisodes
  | RemoveEpisode
  | RemoveLocation
  | SwapLocation
  | ClearEpisodes
  | AddEpisode;

// Response

export interface GetEpisodesResponse extends MessageResponse {
  action: PLAYLIST_EVENT_RESPONSES.GET_EPISODES;
  payload: {
    episodes: IEpisodeState[];
  };
}

export interface GetNextEpisodeResponse extends MessageResponse {
  action: PLAYLIST_EVENT_RESPONSES.GET_NEXT_EPISODE;
  payload: {
    episode: IEpisodeState;
  };
}

export interface PlayListResponse extends MessageResponse {
  action: PLAYLIST_EVENT_RESPONSES.PLAYLIST_EVENT;
  payload: {
    status: boolean;
  };
}

export type PlaylistEventReducer = (
    message: PlaylistRequestActions,
    sender: chrome.runtime.MessageSender,
    sendResponse: ReducerResponseFn
  ) => void;