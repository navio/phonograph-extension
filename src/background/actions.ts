import {
  BackgroundActions,
  ReducerRensposeFn,
  InitializePopUp,
  BACKGROUND_EVENTS,
  InitializeOptions,
} from "../types";

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
