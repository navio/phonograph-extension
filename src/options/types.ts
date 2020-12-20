import { MessageResponse } from "../types"

export enum OPTIONS_EVENTS {
  INITIALIZATION = "INIT_OPTIONS",
}

export interface InitializeOptionsResponse extends MessageResponse {
  action: OPTIONS_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

export type OptionsActions = InitializeOptionsResponse;