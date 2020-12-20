import { MessageResponse } from "../types";

export enum POPUP_EVENTS {
  INITIALIZATION = "INIT_POPUP",
}

export interface InitializePopUpResponse extends MessageResponse {
  action: POPUP_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

export type PopUpActions = InitializePopUpResponse;
