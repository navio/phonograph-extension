import {
  BACKGROUND_EVENTS,
  PODCAST_EVENTS,
  BackgroundEventReducer,
} from "./types";
import { initializeResponsePopUp } from "popup/actions";
import { initializeOptionsResponse } from "options/actions";
import Engine from "../Podcast";
import ApplicationState from "../State";
import {
  getPodcastResponse,
  getPodcastsResponse,
  backgroundResponse,
  getEpisodeResponse,
  emitLibraryUpdate,
  messagePodcastEmission,
} from "./actions";
import { IEpisodeState } from "../State";
import AudioElement from "../Audio";
import { podcasts } from "./config";

const background = (
  engine: Engine,
  state: ApplicationState,
  player: AudioElement
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

      case PODCAST_EVENTS.GET_PODCAST: {
        const { url, save } = message.payload;
          engine.getPodcast(url, {save})
          .then((podcast) => sendResponse(getPodcastResponse(podcast)))
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
        sendResponse(initializeResponsePopUp(state.getEpisode(), audioState, podcastInfo, podcastImage ));

        return true;
      }

      case BACKGROUND_EVENTS.INIT_OPTIONS: {
        engine.getPodcasts().then((library) => {
          const episode = state.getEpisode();
          const time = episode ? episode.time : 0;
          const playerstate = player.state;
          sendResponse(initializeOptionsResponse(library, playerstate, episode));
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
    }
  };
  return reducer;
};

export default background;
