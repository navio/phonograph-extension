import {
  BackgroundActions,
  PopupEventFn,
  InitializePopUp,
  BACKGROUND_EVENTS,
} from "../types";

export const messageBackgroundAction = (
  action: BackgroundActions,
  callback: PopupEventFn
) => chrome.runtime.sendMessage(action, callback);

export const initializePopUp = (id: string): InitializePopUp => ({
  action: BACKGROUND_EVENTS.INITIALIZATION,
  payload: { id },
});
