import { BACKGROUND_EVENTS, BackgroundEventReducer } from "./types";
import { initializeResponsePopUp } from "popup/actions";
import { initializeOptionsResponse } from "options/actions";
import Engine from "../Podcast";
import ApplicationState from "../State";
import {
  getPodcastReponse,
  getPodcastsReponse,
  backgroundReponse,
} from "./actions";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";

const background = (engine: Engine, state: ApplicationState) => {
  const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
    
    switch (message.action) {

      case BACKGROUND_EVENTS.GET_PODCAST: {
        const { url, save } = message.payload;
        const podcastPromise: Promise<IPodcast> = save
          ? engine.getPodcast(url)
          : Engine.fetch(new URL(url));

        podcastPromise.then((podcast) =>
          sendResponse(getPodcastReponse(podcast))
        );
        return true;
      }

      case BACKGROUND_EVENTS.DELETE_PODCAST: {
        const { url } = message.payload;
        sendResponse(backgroundReponse(true));
        return true;
      }

      case BACKGROUND_EVENTS.INIT_POPUP: {
        engine.getPodcasts().then((library) => {
          const podcast = library[0];
          const { title, author } = podcast;
          const { title: EpisodeTitle } = podcast.items[0];
          sendResponse(
            initializeResponsePopUp(`Library has ${library.length} podcasts.`)
          );
        });
        return true;
      }

      case BACKGROUND_EVENTS.INIT_OPTIONS: {
        engine.getPodcasts().then((library) => {
          const episode = state.getEpisode();
          sendResponse(initializeOptionsResponse(library, episode));
        });
        return true;
      }

      case BACKGROUND_EVENTS.GET_PODCASTS: {
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
