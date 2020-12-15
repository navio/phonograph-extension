export enum BACKGROUND_EVENTS {
  INIT_POPUP = "INIT_BACKGROUND_POPUP",
  INIT_OPTIONS = "INIT_BACKGROUND_OPTIONS",
}

export enum POPUP_EVENTS {
  INITIALIZATION = "INIT_POPUP",
}

export enum OPTIONS_EVENTS {
  INITIALIZATION = "INIT_OPTIONS",
}

export const EVENTS = {
  POPUP: POPUP_EVENTS,
  OPTIONS: OPTIONS_EVENTS,
  BACKGROUND: BACKGROUND_EVENTS,
};


// Background
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

interface MessageResponse {
  action: POPUP_EVENTS | OPTIONS_EVENTS;
  payload?: {
    [key: string]: any;
  };
}

// PopUp Events
export interface InitializePopUpResponse extends MessageResponse {
  action: POPUP_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

// PopUp Events
export interface InitializeOptionsResponse extends MessageResponse {
  action: OPTIONS_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

// Background Reducer
export type BackgroundEventReducer = (
  message: BackgroundActions,
  sender: chrome.runtime.MessageSender,
  sendResponse: ReducerRensposeFn
) => void;

// Response Types
export type PopupEventFn = (props: PopUpActions) => void;
export type OptionsEventFn = (props: OptionsActions) => void;
export type ReducerRensposeFn = (props: MessageResponse) => void;

// Actions Types
export type BackgroundActions = InitializePopUp | InitializeOptions;
export type PopUpActions = InitializePopUpResponse;
export type OptionsActions = InitializeOptionsResponse;

// All Actions
export type Actions = BackgroundActions | PopUpActions | OptionsActions;
