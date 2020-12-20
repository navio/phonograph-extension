import { ReducerRensposeFn } from "background/types";

export { ReducerRensposeFn };

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

export interface AudioLoaded {
  action: typeof PLAYER_EMITIONS.loadeddata
}

export interface AudioProgress {
  action: typeof PLAYER_EMITIONS.progress
}

export interface AudioCanPlay {
  action: typeof PLAYER_EMITIONS.canplay
}

export interface AudioPlaying {
  action: PLAYER_EMITIONS.playing,
  payload: {
    played: number,
    currenTime: number,
    duration: number,
  }
}

export interface AudioPaused {
  action: PLAYER_EMITIONS.paused
}

export interface AudioEnded {
  action: PLAYER_EMITIONS.ended
}

export interface AudioCanPlayThrough {
  action: PLAYER_EMITIONS.canplaythrough
}

export interface AudioProgress {
  action: PLAYER_EMITIONS.progress,
  payload: {
    percentage: number
  }
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
