import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "../lib/Audio";
import ApplicationState from "../lib/State";
import { Emitters, load, messagePlayerAction, messagePlayerEmission } from "./actions";
import Podcast from "../lib/Podcast";
import Memory from "lib/Memory";
import Queue from "lib/Queue";
import { IEpisode } from "podcastsuite/dist/Format";
import { getPodcastMetadataResponse, messagePodcastMetadataEmission } from "background/actions";

export default (
  engine: Podcast,
  state: ApplicationState,
  player: AudioElement,
  memory: Memory,
  playlist: Queue
) => {
  const { audioElement } = player;
  const hard = true;
  // player.audioElement.autoplay = true;

  // listeners
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
      messagePlayerEmission(Emitters.ended({...player.state, loaded: undefined, ended: true }));
      const currentEpisode = state.getEpisode();
      memory.addEpisode({ ...currentEpisode, time: audioElement.currentTime, duration: audioElement.duration}, {hard});
      // Check if next, and load the next episode queued.
      const episode = playlist.getNext();
      if(episode){
        loadHandler(episode, episode.podcast);
      }else{
        audioElement.src = '';
        state.clearEpisode();
      }
    }
  );
  audioElement.addEventListener("timeupdate", () => {
    messagePlayerEmission(
      Emitters.progress(audioElement.currentTime, audioElement.duration)
    );
  });
  
  // handlers
  const loadHandler = (episode: IEpisode, podcastURL: string, sendResponse? ) => {
    const currentEpisode = state.getEpisode();

    // If same episode receive play
    if (currentEpisode && episode.guid === currentEpisode.guid) {
      audioElement
        .play()
        .then(() => memory.addEpisode({ ...currentEpisode, time: audioElement.currentTime, duration: audioElement.duration}, {hard}))
        .then(() => sendResponse && sendResponse(Emitters.playing(player.state, episode)));
        return true;
    }
    // If a different episode was selected.
    // save the position of the previous.
    const episodeToSave = { ...currentEpisode, url: podcastURL, time: audioElement.currentTime, duration: audioElement.duration};

    // saving playlist
    memory.addEpisode(episodeToSave, {hard});

    // moving episode to playlist only if called by user request.
    sendResponse && player.state.playing &&  playlist.queueEpisode(episodeToSave, true);

    // Create the new episode information. 
    // Initializing time from memory.∫
    const initialTime = memory.getEpisodeTime({...episode, url: podcastURL});
    const newEpisode = { ...episode, url: podcastURL, time: initialTime };
    state.setEpisode(newEpisode, engine.getPodcast(podcastURL));
    const url =
      typeof episode.media === "string" ? episode.media : episode.media.url;
    
    audioElement.src = url;
    audioElement.currentTime = initialTime;

    audioElement.play()
    .then(() => Emitters.playing(player.state, episode))
    .then(() => memory.addEpisode(newEpisode, {hard}));
    
    sendResponse && sendResponse(Emitters.loaded());
    return true;
  }

  // reducer
  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PLAYER_EVENTS.LOAD: {
        const { episode, podcast } = message.payload;
        return loadHandler(episode,podcast, sendResponse);
      }
      case PLAYER_EVENTS.PLAYED: {
        const {episode} = message.payload;
        memory.markEpisodeComplete(episode);
        const podcastMemory = memory.getPodcast(episode.podcast);
        messagePodcastMetadataEmission(getPodcastMetadataResponse(podcastMemory));
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
