import { BACKGROUND_EVENTS, BackgroundEventReducer } from "./types";
import { initializeResponsePopUp } from "popup/actions";
import { initializeOptionsResponse } from "options/actions";
import Engine from "../Podcast";
import { podcasts } from "./config";

const engine = new Engine({
  // podcasts: podcasts,
});

const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INIT_POPUP:
      engine.getPodcasts().then((library) => {
        const podcast = library[0];
        const { title, author } = podcast;
        const { title: EpisodeTitle } = podcast.items[0];
        sendResponse(
          initializeResponsePopUp(
            `Library has ${library.length} podcasts.`
          )
        );
      });
      return true;
    case BACKGROUND_EVENTS.INIT_OPTIONS:
      engine.getPodcasts().then((library) => {
        sendResponse(initializeOptionsResponse(library));
      });
      return true;
  }
};

export default reducer;
