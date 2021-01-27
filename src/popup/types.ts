import { AudioState } from "src/Audio";
import { IEpisode } from "podcastsuite/dist/Format";
import { MessageResponse } from "../types";

export enum POPUP_EVENTS {
  INITIALIZATION = "INIT_POPUP",
}

export interface InitializePopUpResponse extends MessageResponse {
  action: POPUP_EVENTS.INITIALIZATION;
  payload: {
    episode: IEpisode,
    state: AudioState,
  };
}

export type PopUpActions = InitializePopUpResponse;
