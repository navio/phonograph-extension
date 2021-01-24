import { IEpisode } from "podcastsuite/dist/Format";
import {
    POPUP_EVENTS,
    InitializePopUpResponse,
  } from "./types";

  export const initializeResponsePopUp = (
    episode: IEpisode
  ): InitializePopUpResponse => ({
    action: POPUP_EVENTS.INITIALIZATION,
    payload: { episode },
  });
