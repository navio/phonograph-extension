import {
  Actions,
  GenericFn,
  InitializePopUp,
  BACKGROUND_EVENTS,
  POPUP_EVENTS,
  InitializePopUpResponse,
} from "./types";

export const messageEvent = (action: Actions, callback: GenericFn) =>
  chrome.runtime.sendMessage(action, callback);

export const initializePopUp = (id: string): InitializePopUp => ({
  action: BACKGROUND_EVENTS.INITIALIZATION,
  payload: { id },
});

export const initializeResponsePopUp = (
    id: string
  ): InitializePopUpResponse => ({
    action: POPUP_EVENTS.INITIALIZATION,
    payload: { id },
  });
