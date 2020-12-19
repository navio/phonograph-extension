import {
  BACKGROUND_EVENTS,
  BackgroundEventReducer,
} from "../types";
import { initializeResponsePopUp } from "../popup/actions";
import { initializeOptionsResponse } from "../options/actions";
import PodcastSuite from 'podcastsuite';
const engine = new PodcastSuite();
const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INIT_POPUP:
      engine.getPodcast("https://feeds.megaphone.fm/lore");
      sendResponse(initializeResponsePopUp('Phonograph'));
      return true;
    case BACKGROUND_EVENTS.INIT_OPTIONS:
      sendResponse(initializeOptionsResponse("Welcome to Options"));
      break;
    default:
  }
};

export default reducer;
