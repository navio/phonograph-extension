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

// PopUp Events
export interface InitializePopUpResponse {
  action: typeof POPUP_EVENTS.INITIALIZATION;
  payload: {
    id: string;
  };
}

// PopUp Events
export interface InitializeOptionsResponse {
  action: typeof OPTIONS_EVENTS.INITIALIZATION;
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



export type PopupEventFn = (props: PopUpActions) => void;
export type OptionsEventFn = (props: OptionsActions) => void;

export type ReducerRensposeFn = any;
//    InitializePopUpResponse \ InitializeOptionsResponse

// Actions Type Exports
export type BackgroundActions = InitializePopUp | InitializeOptions;
export type PopUpActions = InitializePopUpResponse;
export type OptionsActions = InitializeOptionsResponse;

// All Actions
export type Actions = BackgroundActions | PopUpActions | OptionsActions;