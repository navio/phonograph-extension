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
} from "./actions";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";
import { IEpisodeState } from "../State";

const background = (engine: Engine, state: ApplicationState) => {
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
        // const { time , ...episode } = state.getEpisode();
        // sendResponse(getEpisodeReponse(episode, time));
        return true;
      }

      case PODCAST_EVENTS.GET_PODCAST: {
        const { url, save } = message.payload;
        const podcastPromise: Promise<IPodcast> = save
          ? engine.getPodcast(url)
          : Engine.fetch(new URL(url));

        podcastPromise.then((podcast) =>
          sendResponse(getPodcastReponse(podcast))
        );
        return true;
      }

      case PODCAST_EVENTS.DELETE_PODCAST: {
        const { url } = message.payload;
        sendResponse(backgroundReponse(true));
        return true;
      }

      case BACKGROUND_EVENTS.INIT_POPUP: {
        engine.getPodcasts().then((library) => {
          sendResponse(
            initializeResponsePopUp(`Library has ${library.length} podcasts.`)
          );
        });
        return true;
      }

      case BACKGROUND_EVENTS.INIT_OPTIONS: {
        engine.getPodcasts().then((library) => {
          // const { time, ...episode } = state.getEpisode();
          sendResponse(initializeOptionsResponse(library));
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
