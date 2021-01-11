import {
  PLAYER_EVENTS,
  PLAYER_EMITIONS,
  LoadAudio,
  PlayAudio,
  StopAudio,
  FastForwardAudio,
  RewindAudio,
  NextAudio,
  QueueAudio,
  QueueNextAudio,
  AudioCanPlay,
  AudioLoaded,
  AudioPlaying,
  AudioPaused,
  AudioProgress,
  AudioState,
  AudioRequestEvents,
  AudioEmissionEvents,
  AudioEnded
} from "./types";

import { ReducerRensposeFn } from "../types";


export const loaded = (): AudioLoaded => ({
  action: PLAYER_EMITIONS.loadeddata,
});

export const canPlay = (audioState: AudioState): AudioCanPlay => ({
  action: PLAYER_EMITIONS.canplay,
  payload: audioState,
});

export const playing = (audioState: AudioState): AudioPlaying => ({
  action: PLAYER_EMITIONS.playing,
  payload: audioState,
});

export const paused = (audioState: AudioState): AudioPaused => ({
  action: PLAYER_EMITIONS.paused,
  playload: audioState,
});

export const ended = (): AudioEnded => ({
  action: PLAYER_EMITIONS.ended
});

export const progress = (percentage: number): AudioProgress => ({
  action: PLAYER_EMITIONS.progress,
  payload: {
    percentage,
  },
});

export const load = (url: string): LoadAudio => ({
  action: PLAYER_EVENTS.LOAD,
  payload: { url },
});

export const play = (): PlayAudio => ({
  action: PLAYER_EVENTS.PLAY,
});

export const stop = (): StopAudio => ({
  action: PLAYER_EVENTS.STOP,
});

export const fastforwad = (time: number): FastForwardAudio => ({
  action: PLAYER_EVENTS.FORWARD,
  payload: { time },
});

export const rewind = (time: number): RewindAudio => ({
  action: PLAYER_EVENTS.REWIND,
  payload: { time },
});

export const next = (): NextAudio => ({
  action: PLAYER_EVENTS.NEXT,
});

export const queue = (url: string): QueueAudio => ({
  action: PLAYER_EVENTS.QUEUE,
  payload: { url },
});

export const queuenext = (url: string): QueueNextAudio => ({
  action: PLAYER_EVENTS.QUEUE_NEXT,
  payload: { url },
});

export const Triggers = {
  load,
  play,
  stop,
  next,
  fastforwad,
  rewind,
  queue,
  queuenext,
};


export const messagePlayerAction = (
  action: AudioRequestEvents,
  callback: ReducerRensposeFn
) => chrome.runtime.sendMessage(action, callback);

export const messagePlayerEmission = (
  action: AudioEmissionEvents,
  callback?: ReducerRensposeFn
) => chrome.runtime.sendMessage(action, callback);

export const Emitters = {
  loaded,
  canPlay,
  playing,
  paused,
  progress,
};

export default {
  Triggers,
  Emitters,
};
