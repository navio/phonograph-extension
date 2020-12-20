import { ReducerRensposeFn } from "background/types";
import { MessageResponse } from "../types";

export { ReducerRensposeFn };

export interface AudioState {
  currentTime: number;
  duration: number;
  playing: boolean;
  loaded?: string;
  ended?: boolean;
}

export enum PLAYER_EVENTS {
  LOAD = "LOAD_AUDIO",
  PLAY = "PLAY_AUDIO",
  STOP = "STOP_AUDIO",
  NEXT = "NEXT_AUDIO",
  FORWARD = "FORWARD_AUDIO",
  REWIND = "REWIND_AUDIO",
  QUEUE = "QUEUE_AUDIO",
  QUEUE_NEXT = "QUEUE_AUDIO_NEXT",
}

export enum PLAYER_EMITIONS {
  loadeddata = "LOADED_AUDIO",
  progress = "PROGRESS_AUDIO",
  canplaythrough = "CANPLAY_THROUGH_AUDIO",
  playing = "PLAYING_AUDIO",
  paused = "PAUSED_AUDIO",
  abort = "ABORT_AUDIO",
  canplay = "CANPLAY_AUDIO",
  ended = "ENDED_AUDIO",
}

export interface AudioLoaded extends MessageResponse {
  action: typeof PLAYER_EMITIONS.loadeddata;
}

export interface AudioProgress extends MessageResponse {
  action: typeof PLAYER_EMITIONS.progress;
}

export interface AudioCanPlay extends MessageResponse {
  action: typeof PLAYER_EMITIONS.canplay;
}

export interface AudioPlaying extends MessageResponse {
  action: PLAYER_EMITIONS.playing;
  payload: AudioState
}

export interface AudioPaused extends MessageResponse {
  action: PLAYER_EMITIONS.paused;
  playload: AudioState;
}

export interface AudioEnded extends MessageResponse {
  action: PLAYER_EMITIONS.ended;
}

export interface AudioCanPlayThrough extends MessageResponse {
  action: PLAYER_EMITIONS.canplaythrough;
}

export interface AudioProgress extends MessageResponse {
  action: PLAYER_EMITIONS.progress;
  payload: {
    percentage: number;
  };
}

export interface LoadAudio {
  action: typeof PLAYER_EVENTS.LOAD;
  payload: {
    url: string;
  };
}
export interface PlayAudio {
  action: typeof PLAYER_EVENTS.PLAY;
}

export interface StopAudio {
  action: typeof PLAYER_EVENTS.STOP;
}

export interface FastForwardAudio {
  action: typeof PLAYER_EVENTS.FORWARD;
  payload: {
    time: number;
  };
}

export interface RewindAudio {
  action: typeof PLAYER_EVENTS.REWIND;
  payload: {
    time: number;
  };
}

export interface NextAudio {
  action: typeof PLAYER_EVENTS.NEXT;
}

export interface QueueAudio {
  action: typeof PLAYER_EVENTS.QUEUE;
  payload: {
    url: string;
  };
}

export interface QueueNextAudio {
  action: typeof PLAYER_EVENTS.QUEUE_NEXT;
  payload: {
    url: string;
  };
}

export type AudioRequestEvents =
  | LoadAudio
  | PlayAudio
  | StopAudio
  | FastForwardAudio
  | RewindAudio
  | NextAudio
  | QueueAudio
  | QueueNextAudio;

export type AudioEventsReducer = (
  message: AudioRequestEvents,
  sender: chrome.runtime.MessageSender,
  sendResponse: ReducerRensposeFn
) => void;
