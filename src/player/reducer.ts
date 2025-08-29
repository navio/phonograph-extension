import { AudioEventsReducer, PLAYER_EVENTS, AudioState } from "./types";
import AudioElement from "../lib/Audio";
import ApplicationState from "../lib/State";
import { Emitters, load, messagePlayerAction, messagePlayerEmission } from "./actions";
import Podcast from "../lib/Podcast";
import Memory from "lib/Memory";
import Queue from "lib/Queue";
import { IEpisode } from "podcastsuite/dist/Format";
import { getPodcastMetadataResponse, messagePodcastMetadataEmission } from "background/actions";
import { broadcastMessagePlaylist, emitStatusPlaylist } from "playlist/actions";

export default (
  engine: Podcast,
  state: ApplicationState,
  player: AudioElement,
  memory: Memory,
  playlist: Queue
) => {
  const hard = true;

  // Set up audio state listeners from offscreen document
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'AUDIO_STATE_UPDATE') {
      const { event, state: audioState } = message;
      
      switch (event) {
        case 'pause':
          messagePlayerEmission(
            Emitters.paused(
              { ...audioState, playing: false },
              state.getEpisode()
            )
          );
          break;
          
        case 'play':
          messagePlayerEmission(Emitters.playing(audioState, state.getEpisode()));
          break;
          
        case 'loadeddata':
          messagePlayerEmission(Emitters.canPlay(audioState));
          break;
          
        case 'ended':
          messagePlayerEmission(Emitters.ended({ ...audioState, loaded: undefined, ended: true }));
          handleAudioEnded();
          break;
          
        case 'timeupdate':
          messagePlayerEmission(
            Emitters.progress(audioState.currentTime, audioState.duration)
          );
          // Periodically save progress
          if (audioState.currentTime % 10 < 0.5) { // Every ~10 seconds
            const currentEpisode = state.getEpisode();
            if (currentEpisode) {
              memory.addEpisode({
                ...currentEpisode, 
                time: audioState.currentTime, 
                duration: audioState.duration
              }, { hard });
            }
          }
          break;
      }
    }
    return false; // Don't send response
  });

  // Handle audio ended event
  const handleAudioEnded = async () => {
    const currentEpisode = state.getEpisode();
    const audioState = await player.updateState();
    
    if (currentEpisode) {
      memory.addEpisode({ 
        ...currentEpisode, 
        time: audioState.currentTime, 
        duration: audioState.duration
      }, { hard });
    }
    
    // Check if next episode is queued
    const episode = playlist.getNext();
    if (episode) {
      loadHandler(episode, episode.podcast);
    } else {
      await player.stop();
      state.clearEpisode();
    }
  };

  // Media session handlers (if supported)
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    console.log('Setting up media session handlers');
    navigator.mediaSession.setActionHandler("previoustrack", async () => {
      const currentTime = player.currentTime;
      await player.setCurrentTime(Math.max(0, currentTime - 30));
      messagePlayerEmission(Emitters.canPlay(player.state));
      const episode = state.getEpisode();
      if (episode) {
        memory.addEpisode({
          ...episode, 
          time: player.currentTime, 
          duration: player.duration
        });
      }
    });
    
    navigator.mediaSession.setActionHandler("nexttrack", async () => {
      const currentTime = player.currentTime;
      await player.setCurrentTime(currentTime + 15);
      messagePlayerEmission(Emitters.canPlay(player.state));
      const episode = state.getEpisode();
      if (episode) {
        memory.addEpisode({
          ...episode, 
          time: player.currentTime, 
          duration: player.duration
        });
      }
    });
  }
  
  // handlers
  const loadHandler = async (episode: IEpisode, podcastURL: string, sendResponse?) => {
    const currentEpisode = state.getEpisode();

    // If same episode receive play
    if (currentEpisode && episode.guid === currentEpisode.guid) {
      try {
        await player.play();
        const audioState = await player.updateState();
        memory.addEpisode({ 
          ...currentEpisode, 
          time: audioState.currentTime, 
          duration: audioState.duration
        }, { hard });
        sendResponse && sendResponse(Emitters.playing(player.state, episode));
      } catch (error) {
        console.error('Error playing current episode:', error);
      }
      return true;
    }
    
    try {
      // If a different episode was selected, save the position of the previous
      const currentState = await player.updateState();
      const episodeToSave = { 
        ...currentEpisode, 
        url: podcastURL, 
        time: currentState.currentTime, 
        duration: currentState.duration
      };

      // Save current episode to memory
      if (currentEpisode) {
        memory.addEpisode(episodeToSave, { hard });
      }

      // Move current episode to playlist only if called by user request
      if (sendResponse && player.state.playing) {
        playlist.queueEpisode(episodeToSave, true);
      }

      // Create the new episode information with time from memory
      const initialTime = memory.getEpisodeTime({...episode, url: podcastURL});
      const newEpisode = { ...episode, url: podcastURL, time: initialTime };
      state.setEpisode(newEpisode, engine.getPodcast(podcastURL));

      const url = typeof episode.media === "string" ? episode.media : episode.media.url;
      
      // Load and set up new audio
      await player.loadAudio(url);
      await player.setCurrentTime(initialTime);

      // Update playlist if episode was dequeued
      if (playlist.dequeueEpisode(episode)) {
        broadcastMessagePlaylist(emitStatusPlaylist(playlist.getPlaylist()), () => true);
      }

      // Start playing
      await player.play();
      memory.addEpisode(newEpisode, { hard });
      
      sendResponse && sendResponse(Emitters.loaded());
      
    } catch (error) {
      console.error('Error loading episode:', error);
      sendResponse && sendResponse({ error: error.message });
    }
    
    return true;
  }

  // metadata updater
  const emitPodcastMetadata = (episode: IEpisode) => {
    const podcastMemory = memory.getPodcast(episode.podcast);
    messagePodcastMetadataEmission(getPodcastMetadataResponse(podcastMemory), () => true);
    return true;
  } 

  // reducer
  const reducer: AudioEventsReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PLAYER_EVENTS.LOAD: {
        const { episode, podcast } = message.payload;
        loadHandler(episode, podcast, sendResponse);
        return true; // Keep message channel open for async response
      }
      case PLAYER_EVENTS.PLAYED: {
        const { episode } = message.payload;
        memory.markEpisodeComplete(episode);
        emitPodcastMetadata(episode);
        sendResponse(true);
        return true;
      }
      case PLAYER_EVENTS.PLAY: {
        const currentEpisode = state.getEpisode();
        player.play()
          .then(async () => {
            const audioState = await player.updateState();
            sendResponse(Emitters.playing(player.state, currentEpisode));
            if (currentEpisode) {
              memory.addEpisode({
                ...currentEpisode, 
                time: audioState.currentTime, 
                duration: audioState.duration
              }, { hard });
            }
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            sendResponse({ error: error.message });
          });
        return true; // Keep message channel open for async response
      }
      case PLAYER_EVENTS.STOP: {
        const currentEpisode = state.getEpisode();
        player.pause()
          .then(async () => {
            const audioState = await player.updateState();
            sendResponse(
              Emitters.paused({ ...player.state }, currentEpisode)
            );
            if (currentEpisode) {
              memory.addEpisode({
                ...currentEpisode, 
                time: audioState.currentTime, 
                duration: audioState.duration
              }, { hard });
              emitPodcastMetadata(currentEpisode);
            }
          })
          .catch(error => {
            console.error('Error pausing audio:', error);
            sendResponse({ error: error.message });
          });
        return true; // Keep message channel open for async response
      }
      case PLAYER_EVENTS.FORWARD: {
        const currentTime = player.currentTime;
        player.setCurrentTime(currentTime + message.payload.time)
          .then(async () => {
            sendResponse(Emitters.playing(player.state, state.getEpisode()));
            const episode = state.getEpisode();
            if (episode) {
              const audioState = await player.updateState();
              memory.addEpisode({
                ...episode, 
                time: audioState.currentTime, 
                duration: audioState.duration
              });
            }
          })
          .catch(error => console.error('Error forwarding:', error));
        return true;
      }
      case PLAYER_EVENTS.REWIND: {
        const currentTime = player.currentTime;
        player.setCurrentTime(Math.max(0, currentTime - message.payload.time))
          .then(async () => {
            sendResponse(Emitters.playing(player.state, state.getEpisode()));
            const episode = state.getEpisode();
            if (episode) {
              const audioState = await player.updateState();
              memory.addEpisode({
                ...episode, 
                time: audioState.currentTime, 
                duration: audioState.duration
              });
            }
          })
          .catch(error => console.error('Error rewinding:', error));
        return true;
      }
      case PLAYER_EVENTS.SEEK: {
        player.setCurrentTime(message.payload.time)
          .then(async () => {
            sendResponse(Emitters.playing(player.state, state.getEpisode()));
            const episode = state.getEpisode();
            if (episode) {
              const audioState = await player.updateState();
              memory.addEpisode({
                ...episode, 
                time: audioState.currentTime, 
                duration: audioState.duration
              });
            }
          })
          .catch(error => console.error('Error seeking:', error));
        return true;
      }
      case PLAYER_EVENTS.STATE: {
        player.updateState()
          .then(() => {
            sendResponse(Emitters.playing(player.state, state.getEpisode()));
          })
          .catch(error => {
            console.error('Error getting state:', error);
            sendResponse(Emitters.playing(player.state, state.getEpisode()));
          });
        return true;
      }
    }
  };
  return reducer;
};
