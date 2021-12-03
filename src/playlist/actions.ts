import exp = require("constants");
import { IEpisodeState } from "lib/State";
import { ReducerResponseFn } from "types";
import * as T from "./types";

export const getNext = (): T.GetNext => ({
  action: T.PLAYLIST_EVENTS.GET_NEXT_EPISODE,
});

export const getEpisodes = (): T.GetEpisodes => ({
    action: T.PLAYLIST_EVENTS.GET_EPISODES,
  });

  export const addEpisode = (episode: IEpisodeState, next: boolean = false): T.AddEpisode => ({
    action: T.PLAYLIST_EVENTS.ADD_EPISODE,
    payload: {
        episode,
        next
    }
  });

  export const removeEpisode = (episode: IEpisodeState| string): T.RemoveEpisode => ({
      action: T.PLAYLIST_EVENTS.REMOVE_EPISODE,
      payload: {
          episode
      }
  });

  export const removeLocation = (location: number): T.RemoveLocation => ({
      action: T.PLAYLIST_EVENTS.REMOVE_LOCATION,
      payload: {
          location
      }
  });

  export const swapLocation  = (origin: number, destination: number): T.SwapLocation => ({
    action: T.PLAYLIST_EVENTS.SWAP_LOCATION,
    payload: {
        origin,
        destination
    }
});

export const getNextResponse = (episode: IEpisodeState): T.GetNextEpisodeResponse => ({
    action: T.PLAYLIST_EVENT_RESPONSES.GET_NEXT_EPISODE,
    payload: {
        episode
    }
});

export const getEpisodesResponse = (episodes: IEpisodeState[]): T.GetEpisodesResponse => ({
    action: T.PLAYLIST_EVENT_RESPONSES.GET_EPISODES,
    payload: {
        episodes
    }
}) 

export const playListEventResponse = (status: boolean) => ({
    action: T.PLAYLIST_EVENT_RESPONSES.PLAYLIST_EVENT,
    payload: {
        status
    }
})

export const messagePlaylistAction = (
    action: T.PlaylistRequestActions,
    callback: ReducerResponseFn
  ) => chrome.runtime.sendMessage(action, callback);