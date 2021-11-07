import {
  PLAYER_EVENTS,
  PLAYER_EMITIONS,
  LoadAudio,
  PlayAudio,
  StopAudio,
  FastForwardAudio,
  RewindAudio,
  NextAudio,
  SeekAudio,
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
  AudioEnded,
  PlayableMedia,
} from "./types";

import { ReducerRensposeFn } from "../types";
import { IEpisode } from "podcastsuite/dist/Format";

export const loaded = (): AudioLoaded => ({
  action: PLAYER_EMITIONS.loadeddata,
});

export const canPlay = (state: AudioState): AudioCanPlay => ({
  action: PLAYER_EMITIONS.canplay,
  payload: { state },
});

export const playing = (
  state: AudioState,
  media: PlayableMedia
): AudioPlaying => ({
  action: PLAYER_EMITIONS.playing,
  payload: { state, media },
});

export const paused = (
  state: AudioState,
  media: PlayableMedia
): AudioPaused => ({
  action: PLAYER_EMITIONS.paused,
  payload: { state, media },
});

export const ended = (state: AudioState): AudioEnded => ({
  action: PLAYER_EMITIONS.ended,
  payload: { state },
});

export const progress = (percentage: number, duration: number): AudioProgress => ({
  action: PLAYER_EMITIONS.progress,
  payload: {
    percentage,
    duration
  },
});

export const load = (episode: IEpisode, podcast?: string): LoadAudio => ({
  action: PLAYER_EVENTS.LOAD,
  payload: { episode, podcast },
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

export const seek = (time: number): SeekAudio => ({
  action: PLAYER_EVENTS.SEEK,
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
  seek
};

export const messagePlayerAction = (
  action: AudioRequestEvents,
  callback: ReducerRensposeFn
) => chrome.runtime.sendMessage(action, callback);

export const messagePlayerEmission = (
  action: AudioEmissionEvents,
  callback?: ReducerRensposeFn
) => chrome.runtime.sendMessage(action, callback);

export const playingEmissionListener = (
  callback: (message: AudioPlaying) => void
) => {
  chrome.runtime.onMessage.addListener((message: AudioPlaying) => {
    if (message.action === PLAYER_EMITIONS.playing) {
      callback(message);
    }
  });
};

export const pauseEmissionListener = (
  callback: (message: AudioPaused) => void
) => {
  chrome.runtime.onMessage.addListener((message: AudioPaused) => {
    if (message.action === PLAYER_EMITIONS.paused) {
      callback(message);
    }
  });
};

export const progressEmissionListener = (
  callback: (message: AudioProgress) => void
) => {
  chrome.runtime.onMessage.addListener((message: AudioProgress) => {
    if (message.action === PLAYER_EMITIONS.progress) {
      callback(message);
    }
  });
};

export const endEmissionListener = (
  callback: (message: AudioEnded) => void
) => {
  chrome.runtime.onMessage.addListener((message: AudioEnded) => {
    if (message.action === PLAYER_EMITIONS.ended) {
      callback(message);
    }
  });
};

export const Emitters = {
  loaded,
  canPlay,
  playing,
  paused,
  progress,
  ended,
};

export default {
  Triggers,
  Emitters,
};
