
import { BACKGROUND_EVENTS,BACKGROUND_RESPONSES, PODCAST_RESPONSES, BackgroundActions } from "background/types";
import {PLAYLIST_EVENT_RESPONSES} from "../playlist/types";
import { POPUP_EVENTS, PopUpActions } from "popup/types";
import { OPTIONS_EVENTS, OptionsActions } from "options/types";
import { PLAYER_EMITIONS } from "player/types";


export const EVENTS = {
  POPUP: POPUP_EVENTS,
  OPTIONS: OPTIONS_EVENTS,
  BACKGROUND: BACKGROUND_EVENTS,
};

// Standard Response
export interface MessageResponse {
  action: POPUP_EVENTS | OPTIONS_EVENTS | PLAYER_EMITIONS | BACKGROUND_RESPONSES | PODCAST_RESPONSES | PLAYLIST_EVENT_RESPONSES ;
  payload?: {
    [key: string]: any;
  };
}

// Response Types
export type PopupEventFn = (props: PopUpActions) => void;
export type OptionsEventFn = (props: OptionsActions) => void;
export type ReducerResponseFn = (props: MessageResponse) => void;


// All Actions
export type Actions = BackgroundActions | PopUpActions | OptionsActions;
