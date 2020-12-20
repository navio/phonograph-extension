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
} from "./types";

export const audioLoaded = (): AudioLoaded => ({
  action: PLAYER_EMITIONS.loadeddata,
});

export const audioCanPlay = (): AudioCanPlay => ({
  action: PLAYER_EMITIONS.canplay,
});

export const audioPlaying = (
  played: number,
  currenTime: number,
  duration: number
): AudioPlaying => ({
  action: PLAYER_EMITIONS.playing,
  payload: {
    played,
    currenTime,
    duration,
  },
});

export const audioPaused = (): AudioPaused => ({
  action: PLAYER_EMITIONS.paused,
});

export const audioProgress = (percentage: number): AudioProgress => ({
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

export default {
  load,
  play,
  stop,
  next,
  fastforwad,
  rewind,
  queue,
  queuenext,
};
