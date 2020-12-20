import { AudioEventsReducer, PLAYER_EVENTS } from "./types";
import AudioElement from "./audio";


export default (audioElement?: HTMLAudioElement) => {
  const player = new AudioElement(audioElement);

  

  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    player.autoplay = true;
    switch (message.action) {
      case PLAYER_EVENTS.LOAD:
        const { url } = message.payload;
        player.src = url;
        return true;
      case PLAYER_EVENTS.PLAY:
        player.play();
        return true;
      case PLAYER_EVENTS.STOP:
        player.pause();
        return true;
      case PLAYER_EVENTS.FORWARD:
        player.currentTime += message.payload.time;
        return true;
      case PLAYER_EVENTS.REWIND:
        player.currentTime -= message.payload.time;
        return true;
    }
  };
  return reducer;
};
