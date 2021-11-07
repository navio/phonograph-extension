import { ReducerRensposeFn } from "background/types";
import { IEpisode } from "podcastsuite/dist/Format";
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
  STATE = "STATEOF_AUDIO",
  SEEK = "SEEK_AUDIO"
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

export type PlayableMedia = IEpisode;

export interface AudioLoaded extends MessageResponse {
  action: PLAYER_EMITIONS.loadeddata;
}

export interface AudioCanPlay extends MessageResponse {
  action: PLAYER_EMITIONS.canplay;
}

export interface AudioPlaying extends MessageResponse {
  action: PLAYER_EMITIONS.playing;
  payload: {
    state: AudioState;
    media: PlayableMedia;
   }
}

export interface AudioPaused extends MessageResponse {
  action: PLAYER_EMITIONS.paused;
  payload: {
    state: AudioState;
    media: PlayableMedia;
   }
}

export interface AudioEnded extends MessageResponse {
  action: PLAYER_EMITIONS.ended;
  payload: {
    state: AudioState;
  }
}

export interface AudioCanPlayThrough extends MessageResponse {
  action: PLAYER_EMITIONS.canplaythrough;
}

export interface AudioProgress extends MessageResponse {
  action: PLAYER_EMITIONS.progress;
  payload: {
    percentage: number;
    duration: number;
  };
}

export type AudioEmissionEvents =
  | AudioPlaying
  | AudioProgress
  | AudioCanPlayThrough
  | AudioCanPlay
  | AudioEnded
  | AudioLoaded
  | AudioPaused;

export interface LoadAudio {
  action: typeof PLAYER_EVENTS.LOAD;
  payload: {
    episode: IEpisode;
    podcast?: string;
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

export interface SeekAudio {
  action: typeof PLAYER_EVENTS.SEEK;
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

export interface StateOfAudio {
  action: typeof PLAYER_EVENTS.STATE;
}

export type AudioRequestEvents =
  | LoadAudio
  | PlayAudio
  | StopAudio
  | FastForwardAudio
  | RewindAudio
  | NextAudio
  | QueueAudio
  | QueueNextAudio
  | SeekAudio
  | StateOfAudio;

export type AudioEventsReducer = (
  message: AudioRequestEvents,
  sender: chrome.runtime.MessageSender,
  sendResponse: ReducerRensposeFn
) => void;
