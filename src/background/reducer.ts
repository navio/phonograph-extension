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
// import { podcasts } from "./config";
import { IPodcast } from "podcastsuite/dist/PodcastSuite";

const engine = new Engine({
  //  podcasts: podcasts,
});

const state = new ApplicationState();

const reducer: BackgroundEventReducer = async (
  message,
  sender,
  sendResponse
) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INIT_POPUP:
      engine.getPodcasts().then((library) => {
        const podcast = library[0];
        const { title, author } = podcast;
        const { title: EpisodeTitle } = podcast.items[0];
        sendResponse(
          initializeResponsePopUp(`Library has ${library.length} podcasts.`)
        );
      });
      return true;

    case BACKGROUND_EVENTS.INIT_OPTIONS:
      const library = await engine.getPodcasts();
      const episode = state.getEpisode();
      sendResponse(initializeOptionsResponse(library, episode));
      return true;

    case BACKGROUND_EVENTS.GET_PODCASTS: {
      const library = await engine.getPodcasts();
      sendResponse(getPodcastsReponse(library));
      return true;
    }
    case BACKGROUND_EVENTS.GET_PODCAST: {
      const { url, save } = message.payload;
      const podcast: IPodcast = save
        ? await engine.getPodcast(url)
        : await Engine.fetch(new URL(url));
      sendResponse(getPodcastReponse(podcast));

      return true;
    }
    case BACKGROUND_EVENTS.DELETE_PODCAST: {
      const { url } = message.payload;
      sendResponse(backgroundReponse(true));
      return true;
    }
  }
};

export default reducer;
