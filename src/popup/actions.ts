import { AudioState } from "src/Audio";
import { IEpisode } from "podcastsuite/dist/Format";
import {
    POPUP_EVENTS,
    InitializePopUpResponse,
  } from "./types";

  export const initializeResponsePopUp = (
    episode: IEpisode,
    state: AudioState
  ): InitializePopUpResponse => ({
    action: POPUP_EVENTS.INITIALIZATION,
    payload: { episode, state },
  });
