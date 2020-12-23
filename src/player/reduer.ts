import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "./audio";
import { Emitters } from "./actions";

export default (audioElement?: HTMLAudioElement) => {
  const player = new AudioElement(audioElement);

  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    player.autoplay = true;
    switch (message.action) {
      case PLAYER_EVENTS.LOAD:
        const { url } = message.payload;
        player.src = url;
        sendResponse(Emitters.loaded());
        return true;
      case PLAYER_EVENTS.PLAY:
        player.play();
        sendResponse(
          Emitters.playing({
            ...player.state,
          })
        );
        return true;
      case PLAYER_EVENTS.STOP:
        player.pause();
        sendResponse(
          Emitters.paused({
            ...player.state,
          })
        );
        return true;
      case PLAYER_EVENTS.FORWARD:
        player.currentTime += message.payload.time;
        sendResponse(
          Emitters.paused({
            ...player.state,
          })
        );
        return true;
      case PLAYER_EVENTS.REWIND:
        player.currentTime -= message.payload.time;
        sendResponse(
          Emitters.paused({
            ...player.state,
          })
        );
        return true;
    }
  };
  return reducer;
};
