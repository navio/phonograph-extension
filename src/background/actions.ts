import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import {
  BackgroundActions,
  ReducerRensposeFn,
  InitializePopUp,
  BACKGROUND_EVENTS,
  BACKGROUND_RESPONSES,
  InitializeOptions,
  GetPodcast,
  GetPodcasts,
  DeletePodcast,
  GetPodcastResponse,
  GetPodcastsResponse,
  BackgroundResponse,
} from "./types";

export const messageBackgroundAction = (
  action: BackgroundActions,
  callback: ReducerRensposeFn
) => chrome.runtime.sendMessage(action, callback);

export const initializePopUp = (id: string): InitializePopUp => ({
  action: BACKGROUND_EVENTS.INIT_POPUP,
  payload: { id },
});

export const initializeOptions = (id: string): InitializeOptions => ({
  action: BACKGROUND_EVENTS.INIT_OPTIONS,
  payload: { id },
});

// Responses

export const backgroundReponse = (payload: any): BackgroundResponse => ({
  action: BACKGROUND_RESPONSES.GENERAL,
  payload
});

export const getPodcastsReponse = (
  library: IPodcast[]
): GetPodcastsResponse => ({
  action: BACKGROUND_RESPONSES.PODCASTS,
  payload: { library },
});

export const getPodcastReponse = (podcast: IPodcast): GetPodcastResponse => ({
  action: BACKGROUND_RESPONSES.PODCAST,
  payload: { podcast },
});

// Podcast

export const getPodcast = (url: string, save: boolean = false): GetPodcast => ({
  action: BACKGROUND_EVENTS.GET_PODCAST,
  payload: {
    url,
    save,
  },
});

export const getPodcasts = (): GetPodcasts => ({
  action: BACKGROUND_EVENTS.GET_PODCASTS,
});

export const deletePodcast = (url: string): DeletePodcast => ({
  action: BACKGROUND_EVENTS.DELETE_PODCAST,
  payload: {
    url,
  },
});
