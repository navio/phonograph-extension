import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "../lib/Audio";
import ApplicationState from "../lib/State";
import { Emitters, messagePlayerEmission } from "./actions";
import Podcast from "../lib/Podcast";
import Memory from "lib/Memory";

export default (
  engine: Podcast,
  state: ApplicationState,
  player: AudioElement,
  memory: Memory
) => {
  const { audioElement } = player;
  const hard = true;
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
    {
      messagePlayerEmission(Emitters.ended(player.state));
      const currentEpisode = state.getEpisode();
      memory.addEpisode({ ...currentEpisode, time: audioElement.currentTime, duration: audioElement.duration}, {hard});
    }
  );

  audioElement.addEventListener("timeupdate", () => {
    messagePlayerEmission(
      Emitters.progress(audioElement.currentTime, audioElement.duration)
    );
  });
  

  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PLAYER_EVENTS.LOAD: {
        const { episode, podcast: podcastURL } = message.payload;
        const currentEpisode = state.getEpisode();
        

        // If same episode receive play
        if (currentEpisode && episode.guid === currentEpisode.guid) {
          audioElement
            .play()
            .then(() => sendResponse(Emitters.playing(player.state, episode)))
            .then(() => memory.addEpisode({ ...currentEpisode, time: audioElement.currentTime, duration: audioElement.duration}, {hard}));
          return true;
        }
        // If a different episode was selected.
        // save the position of the previous.
        memory.addEpisode({ ...currentEpisode, url: podcastURL, time: audioElement.currentTime, duration: audioElement.duration}, {hard});
        
        // Create the new episode information. 
        // Initializing time from memory.∫
        const initialTime = memory.getEpisodeTime({...episode, url: podcastURL});
        const newEpisode = { ...episode, url: podcastURL, time: initialTime };
        state.setEpisode(newEpisode, engine.getPodcast(podcastURL));
        const url =
          typeof episode.media === "string" ? episode.media : episode.media.url;
        
        // console.log('todo', initialTime, newEpisode);
        audioElement.src = url;
        audioElement.currentTime = initialTime;
        
        // console.log(newEpisode, audioElement.currentTime);
        
        sendResponse(Emitters.loaded());
        audioElement.play()
        .then(() => Emitters.playing(player.state, episode))
        .then(() => memory.addEpisode(newEpisode, {hard}));
        return true;
      }
      case PLAYER_EVENTS.PLAYED: {
        const {episode} = message.payload;
        memory.markEpisodeComplete(episode);
        sendResponse(true);
        return true;
      }
      case PLAYER_EVENTS.PLAY: {
        audioElement.play().then(() => {
          sendResponse(Emitters.playing(player.state, state.getEpisode()));
        })
        .then(() => memory.addEpisode({...state.getEpisode(), time: audioElement.currentTime, duration: audioElement.duration}, {hard}));
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
        memory.addEpisode({...state.getEpisode(), time: audioElement.currentTime, duration: audioElement.duration},{hard});
        return true;
      case PLAYER_EVENTS.FORWARD:
        audioElement.currentTime += message.payload.time;
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        memory.addEpisode({...state.getEpisode(), time: audioElement.currentTime, duration: audioElement.duration});
        return true;
      case PLAYER_EVENTS.REWIND:
        audioElement.currentTime -= message.payload.time;
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        memory.addEpisode({...state.getEpisode(), time: audioElement.currentTime, duration: audioElement.duration});
        return true;
      case PLAYER_EVENTS.SEEK:
        audioElement.currentTime = message.payload.time;
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        memory.addEpisode({...state.getEpisode(), time: audioElement.currentTime, duration: audioElement.duration});
        return true;
      case PLAYER_EVENTS.STATE:
        sendResponse(Emitters.playing(player.state, state.getEpisode()));
        return true;
    }
  };
  return reducer;
};
