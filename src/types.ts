export enum BACKGROUND_EVENTS {
  INITIALIZATION = "INIT_BACKGROUND",
}

export enum POPUP_EVENTS {
  INITIALIZATION = "INIT_POPUP",
}

export enum OPTIONS_EVENTS {
  INITIALIZATION = "INIT_OPTIONS",
}

// Background
export interface InitializePopUp {
  action: typeof BACKGROUND_EVENTS.INITIALIZATION;
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

export type ReducerRensposeFn = PopupEventFn & OptionsEventFn; 

// Actions Type Exports
export type BackgroundActions = InitializePopUp;
export type PopUpActions = InitializePopUpResponse;
export type OptionsActions = InitializeOptionsResponse;

// All Actions
export type Actions = BackgroundActions | PopUpActions | OptionsActions;