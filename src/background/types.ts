import { ReducerRensposeFn } from "../types";

export { ReducerRensposeFn };

export enum BACKGROUND_EVENTS {
  INIT_POPUP = "INIT_BACKGROUND_POPUP",
  INIT_OPTIONS = "INIT_BACKGROUND_OPTIONS",
}

export interface InitializePopUp {
  action: typeof BACKGROUND_EVENTS.INIT_POPUP;
  payload: {
    id: string;
  };
}

export interface InitializeOptions {
  action: typeof BACKGROUND_EVENTS.INIT_OPTIONS;
  payload: {
    id: string;
  };
}

export type BackgroundEventReducer = (
  message: BackgroundActions,
  sender: chrome.runtime.MessageSender,
  sendResponse: ReducerRensposeFn
) => void;

export type BackgroundActions = InitializePopUp | InitializeOptions;
