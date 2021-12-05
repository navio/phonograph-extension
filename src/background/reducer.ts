import {
  BACKGROUND_EVENTS,
  PODCAST_EVENTS,
  BackgroundEventReducer,
} from "./types";
import { initializeResponsePopUp } from "popup/actions";
import { getPlayerStatusResponse, initializeOptionsResponse } from "options/actions";
import Engine from "../lib/Podcast";
import ApplicationState from "../lib/State";
import {
  getPodcastResponse,
  getPodcastsResponse,
  backgroundResponse,
  getEpisodeResponse,
  emitLibraryUpdate,
  messagePodcastEmission,
  getPodcastMetadataResponse,
} from "./actions";
import { IEpisodeState } from "../lib/State";
import AudioElement from "../lib/Audio";
import FetchImage from "ui/utils/imageSaver";
import Memory, {IMemoryPodcast } from "lib/Memory";
import { broadcastMessagePlaylist, emitStatusPlaylist, emitUpdatePlaylist } from "playlist/actions";
import Queue from "lib/Queue";

const background = (
  engine: Engine,
  state: ApplicationState,
  player: AudioElement,
  memory: Memory,
  playlist: Queue,
) => {
  const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PODCAST_EVENTS.SET_EPISODE: {
        const { episode, time, url } = message.payload;
        const episodeState: IEpisodeState = { ...episode, time };
        const podcastObject = url ? engine.getPodcast(url) : undefined;
        state.setEpisode(episodeState, podcastObject);
        return true;
      }

      case PODCAST_EVENTS.REMOVE_EPISODE: {
        state.clearEpisode();
        return true;
      }

      case PODCAST_EVENTS.GET_EPISODE: {
        const episode = state.getEpisode();
        const time = episode ? episode.time : 0;
        sendResponse(getEpisodeResponse(episode, time));
        return true;
      }

      case PODCAST_EVENTS.GET_PODCAST_METADATA: {
        const { url } = message.payload;
        const podcastMemory: IMemoryPodcast = memory.getPodcast(url);
        sendResponse(getPodcastMetadataResponse(podcastMemory))
        return true;
      }

      case PODCAST_EVENTS.GET_PODCAST: {
        const { url, save } = message.payload;
          const podcastMemory: IMemoryPodcast = memory.getPodcast(url);
          engine.getPodcast(url, {save})
          .then((podcast) => sendResponse(getPodcastResponse(podcast, podcastMemory)))
          .then(() => {
            if(save){
              engine.getPodcasts().then( podcasts => {
                messagePodcastEmission(emitLibraryUpdate(podcasts))
              })
            }
          })
          .catch((error) => console.error("Error", error));
        return true;
      }

      case PODCAST_EVENTS.DELETE_PODCAST: {
        const { url } = message.payload;
        engine.deletePodcast(url);
        engine.getPodcasts().then( podcasts => {
          messagePodcastEmission(emitLibraryUpdate(podcasts))
        })
        sendResponse(backgroundResponse(true));
        return true;
      }

      case BACKGROUND_EVENTS.INIT_POPUP: {
        const audioState = player.state;
        const podcastImage = state.getPodcastImage();
        const podcastInfo = state.getSimplePodcast();
        if(!audioState.loaded){
          // if no audio is loaded redirect to library.
          chrome.tabs.create({ 'url': `chrome-extension://${chrome.runtime.id}/options.html#` });
        }
        sendResponse(initializeResponsePopUp(state.getEpisode(), audioState, podcastInfo, podcastImage ));
        return true;
      }

      case BACKGROUND_EVENTS.INIT_OPTIONS: {
        engine.getPodcasts().then((library) => {
          const episode = state.getEpisode();
          const time = episode ? episode.time : 0;
          const playerState = player.state;
          sendResponse(initializeOptionsResponse(library, playerState, episode));
        });
        return true;
      }

      case  BACKGROUND_EVENTS.OPEN_OPTIONS: {
        const { podcast } = message.payload;
        let url = '';
        if (podcast) {
          url = 'podcast/'+ podcast;
        }
        chrome.tabs.create({ 'url': `chrome-extension://${chrome.runtime.id}/options.html#/${url}` });
      }

      case PODCAST_EVENTS.GET_PODCASTS: {
        engine.getPodcasts().then((library) => {
          sendResponse(getPodcastsResponse(library));
          return true;
        });
      }

      case BACKGROUND_EVENTS.GET_PLAYER_STATE: {
        const audioState = player.state;
        
        // BroadCast Playlist
        const currentPlaylist = playlist.getPlaylist();
        broadcastMessagePlaylist(emitStatusPlaylist(currentPlaylist), () => {});

        const episode: IEpisodeState = state.getEpisode();
        
        if(!episode || !episode.url) return;

        const getCurrentEpisode = async (url: string) => {
          const {items, ...podcastInfo} = await engine.getPodcast(url);
          const podcastImage = await FetchImage(podcastInfo.image);
          return {podcastInfo, podcastImage}
        }

        getCurrentEpisode(episode.url).then(({podcastImage, podcastInfo}) => {
          sendResponse(getPlayerStatusResponse(episode, audioState, podcastInfo, podcastImage));
        });
        return true;
      }
    }
  };
  return reducer;
};

export default background;
