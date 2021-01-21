import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "./audio";
import ApplicationState from "../State";
import { Emitters, messagePlayerEmission } from "./actions";


const state = new ApplicationState();

export default (audioElementInit?: HTMLAudioElement) => {
  const player = new AudioElement(audioElementInit);
  const { audioElement } = player;
  
  player.audioElement.autoplay = true;

  audioElement.addEventListener("pause", () =>
    messagePlayerEmission(Emitters.paused(player.state))
  );
  audioElement.addEventListener("play", () =>
    messagePlayerEmission(Emitters.playing(player.state))
  );
  audioElement.addEventListener("canplay", () =>
    messagePlayerEmission(Emitters.canPlay(player.state))
  );
  audioElement.addEventListener("ended", () =>
    messagePlayerEmission(Emitters.canPlay(player.state))
  );

  

  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PLAYER_EVENTS.LOAD:
        // state.setEpisode()
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
      case PLAYER_EVENTS.STATE:
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
