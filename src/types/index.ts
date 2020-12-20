
import { BACKGROUND_EVENTS, BackgroundActions } from "background/types";
import { POPUP_EVENTS, PopUpActions } from "popup/types";
import { OPTIONS_EVENTS, OptionsActions } from "options/types";


export const EVENTS = {
  POPUP: POPUP_EVENTS,
  OPTIONS: OPTIONS_EVENTS,
  BACKGROUND: BACKGROUND_EVENTS,
};

// Standard Response
export interface MessageResponse {
  action: POPUP_EVENTS | OPTIONS_EVENTS ;
  payload?: {
    [key: string]: any;
  };
}

// Response Types
export type PopupEventFn = (props: PopUpActions) => void;
export type OptionsEventFn = (props: OptionsActions) => void;
export type ReducerRensposeFn = (props: MessageResponse) => void;


// All Actions
export type Actions = BackgroundActions | PopUpActions | OptionsActions;
