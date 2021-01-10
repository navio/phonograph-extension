import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "./audio";
import { Emitters } from "./actions";

export default (audioElementInit?: HTMLAudioElement) => {
  const player = new AudioElement(audioElementInit);
  const { audioElement } = player;
  player.audioElement.autoplay = true;

  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PLAYER_EVENTS.LOAD:
        const { url } = message.payload;
        audioElement.src = url;
        sendResponse(Emitters.loaded());
        return true;
      case PLAYER_EVENTS.PLAY:
        audioElement.play().then(() =>
          sendResponse(
            Emitters.playing({
              ...player.state,
            })
          )
        );
        return true;
      case PLAYER_EVENTS.STOP:
        audioElement.pause();
        sendResponse(
          Emitters.paused({
            ...player.state,
          })
        );
        return true;
      case PLAYER_EVENTS.FORWARD:
        audioElement.currentTime += message.payload.time;
        sendResponse(
          Emitters.playing({
            ...player.state,
          })
        );
        return true;
      case PLAYER_EVENTS.REWIND:
        audioElement.currentTime -= message.payload.time;
        sendResponse(
          Emitters.playing({
            ...player.state,
          })
        );
        return true;
    }
  };
  return reducer;
};
