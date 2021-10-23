import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import {
  BackgroundActions,
  ReducerRensposeFn,
  InitializePopUp,
  BACKGROUND_EVENTS,
  BACKGROUND_RESPONSES,
  PODCAST_RESPONSES,
  PODCAST_EVENTS,
  InitializeOptions,
  GetPodcast,
  GetPodcasts,
  DeletePodcast,
  GetPodcastResponse,
  GetPodcastsResponse,
  BackgroundResponse,
  SetEpisode,
  ClearEpisode,
  GetEpisodeResponse,
  GetEpisode,
  PODCAST_EMMITER,
  LibraryUpdate,
  OpenOptionsEvent,
} from "./types";

export const messageBackgroundAction = (
  action: BackgroundActions,
  callback: ReducerRensposeFn
) => chrome.runtime.sendMessage(action, callback);

export const initializePopUp = (): InitializePopUp => ({
  action: BACKGROUND_EVENTS.INIT_POPUP,
});

export const initializeOptions = (id: string): InitializeOptions => ({
  action: BACKGROUND_EVENTS.INIT_OPTIONS,
  payload: { id },
});

// Responses

export const getEpisodeResponse = (
  podcast: IEpisode,
  time: number
): GetEpisodeResponse => ({
  action: PODCAST_RESPONSES.EPISODE,
  payload: { podcast, time },
});

export const backgroundResponse = (payload: any): BackgroundResponse => ({
  action: BACKGROUND_RESPONSES.GENERAL,
  payload,
});

export const getPodcastsResponse = (
  library: IPodcast[]
): GetPodcastsResponse => ({
  action: PODCAST_RESPONSES.PODCASTS,
  payload: { library },
});

export const getPodcastResponse = (podcast: IPodcast): GetPodcastResponse => ({
  action: PODCAST_RESPONSES.PODCAST,
  payload: { podcast },
});

// Podcast

export const getPodcast = (url: string, save: boolean = false): GetPodcast => ({
  action: PODCAST_EVENTS.GET_PODCAST,
  payload: {
    url,
    save,
  },
});

export const setEpisode = (episode: IEpisode, time: number, url?: string): SetEpisode => ({
  action: PODCAST_EVENTS.SET_EPISODE,
  payload: {
    episode,
    time: time || 0,
    url
  },
});

export const clearEpisode = (
  episode: IEpisode,
  time: number
): ClearEpisode => ({
  action: PODCAST_EVENTS.REMOVE_EPISODE,
});

export const getEpisode = (): GetEpisode => ({
  action: PODCAST_EVENTS.GET_EPISODE,
});

export const getPodcasts = (): GetPodcasts => ({
  action: PODCAST_EVENTS.GET_PODCASTS,
});

export const deletePodcast = (url: string): DeletePodcast => ({
  action: PODCAST_EVENTS.DELETE_PODCAST,
  payload: {
    url,
  },
});

export const openOptionsPage = (podcast?: string ): OpenOptionsEvent => {
  return { action: BACKGROUND_EVENTS.OPEN_OPTIONS, payload: { podcast } }
}


export const emitLibraryUpdate = (library: IPodcast[]): LibraryUpdate => ({
  action: PODCAST_EMMITER.LIBRARY_UPDATE,
  payload: {
    library
  }
})

export const listenerLibraryUpdate = (CB: (library: IPodcast[]) => void ) => {
  chrome.runtime.onMessage.addListener((message: LibraryUpdate) => {
    if(message.action === PODCAST_EMMITER.LIBRARY_UPDATE){
      CB(message.payload.library);
    }
  });
}

export const messagePodcastEmission = (
  message: LibraryUpdate,
  callback?: ReducerRensposeFn
) => chrome.runtime.sendMessage(message, callback);