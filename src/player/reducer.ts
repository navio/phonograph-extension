import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "../Audio";
import ApplicationState from "../State";
import { Emitters, messagePlayerEmission } from "./actions";
import Podcast from "../Podcast";

export default (
  engine: Podcast,
  state: ApplicationState,
  player: AudioElement
) => {
  const { audioElement } = player;

  // player.audioElement.autoplay = true;

  audioElement.addEventListener("pause", () =>
    messagePlayerEmission(
      Emitters.paused(
        {
          ...player.state,
          playing: false,
        },
        state.getEpisode()
      )
    )
  );
  audioElement.addEventListener("play", () => {
    messagePlayerEmission(Emitters.playing(player.state, state.getEpisode()));
  });
  audioElement.addEventListener("canplay", () =>
    messagePlayerEmission(Emitters.canPlay(player.state))
  );
  audioElement.addEventListener("ended", () =>
    messagePlayerEmission(Emitters.ended(player.state))
  );

  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PLAYER_EVENTS.LOAD:
        const { episode, podcast: podcastURL } = message.payload;
        const currentEpisode = state.getEpisode();

        if (currentEpisode && episode.guid === currentEpisode.guid) {
          audioElement
            .play()
            .then(() => sendResponse(Emitters.playing(player.state, episode)));
          return true;
        }

        const newEpisode = { ...episode, time: 0 };
        state.setEpisode(newEpisode, engine.getPodcast(podcastURL));
        const url =
          typeof episode.media === "string" ? episode.media : episode.media.url;

        audioElement.src = url;
        sendResponse(Emitters.loaded());
        audioElement.play().then(() => Emitters.playing(player.state, episode));
        return true;

      case PLAYER_EVENTS.PLAY: {
          audioElement.play().then(() => {
            sendResponse(Emitters.playing(player.state, state.getEpisode()));
          });
        return true;
      }
      case PLAYER_EVENTS.STOP:
        audioElement.pause();
        sendResponse(
          Emitters.paused(
            {
              ...player.state,
            },
            state.getEpisode()
          )
        );
        return true;
      case PLAYER_EVENTS.FORWARD:
        audioElement.currentTime += message.payload.time;
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        return true;
      case PLAYER_EVENTS.REWIND:
        audioElement.currentTime -= message.payload.time;
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        return true;
      case PLAYER_EVENTS.STATE:
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        return true;
    }
  };
  return reducer;
};
