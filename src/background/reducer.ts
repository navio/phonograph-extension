import { BACKGROUND_EVENTS, BackgroundEventReducer } from "./types";
import { initializeResponsePopUp } from "popup/actions";
import { initializeOptionsResponse } from "options/actions";
import PodcastSuite from "podcastsuite";
import { podcast_local } from "./config";

const engine = new PodcastSuite({
  podcasts: podcast_local,
});

const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INIT_POPUP:
      engine.getPodcast(podcast_local[0]).then((podcast) => {
        const { title, author } = podcast;
        const {title: EpisodeTitle } = podcast.items[0];
        sendResponse(
          initializeResponsePopUp(`Phonograph: ${title}: ${author} : ${EpisodeTitle}`)
        );
      });
      return true;
    case BACKGROUND_EVENTS.INIT_OPTIONS:
      sendResponse(initializeOptionsResponse("Welcome to Options"));
      return true;
  }
};

export default reducer;
