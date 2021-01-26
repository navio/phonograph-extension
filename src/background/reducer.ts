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
  getPodcastReponse,
  getPodcastsReponse,
  backgroundReponse,
  getEpisodeReponse,
  emitLibraryUpdate,
  messagePodcastEmission,
} from "./actions";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { IEpisodeState } from "../State";
import AudioElement from "player/audio";
import { podcasts } from "./config";

const background = (
  engine: Engine,
  state: ApplicationState,
  player: AudioElement
) => {
  const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case PODCAST_EVENTS.SET_EPISODE: {
        const { episode, time } = message.payload;
        const episodeState: IEpisodeState = { ...episode, time };
        state.setEpisode(episodeState);
        return true;
      }

      case PODCAST_EVENTS.REMOVE_EPISODE: {
        state.setEpisode(undefined);
        return true;
      }

      case PODCAST_EVENTS.GET_EPISODE: {
        const episode = state.getEpisode();
        const time = episode ? episode.time : 0;
        sendResponse(getEpisodeReponse(episode, time));
        return true;
      }

      case PODCAST_EVENTS.GET_PODCAST: {
        const { url, save } = message.payload;
          engine.getPodcast(url, {save})
          .then((podcast) => sendResponse(getPodcastReponse(podcast)))
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
        sendResponse(backgroundReponse(true));
        return true;
      }

      case BACKGROUND_EVENTS.INIT_POPUP: {
        const audioState = player.state;
        sendResponse(initializeResponsePopUp(state.getEpisode(), audioState));

        return true;
      }

      case BACKGROUND_EVENTS.INIT_OPTIONS: {
        engine.getPodcasts().then((library) => {
          const episode = state.getEpisode();
          const time = episode ? episode.time : 0;
          sendResponse(initializeOptionsResponse(library, episode));
        });
        return true;
      }

      case PODCAST_EVENTS.GET_PODCASTS: {
        engine.getPodcasts().then((library) => {
          sendResponse(getPodcastsReponse(library));
          return true;
        });
      }
    }
  };
  return reducer;
};

export default background;
