import { BACKGROUND_EVENTS, BackgroundEventReducer } from "../types";
import { initializeResponsePopUp } from "../popup/actions";
import { initializeOptionsResponse } from "../options/actions";

const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INIT_POPUP:
      sendResponse(initializeResponsePopUp("Welcome to Phonograph"));
      break;
    case BACKGROUND_EVENTS.INIT_OPTIONS:
      sendResponse(initializeOptionsResponse("Welcome to Options"));
      break;
    default:
  }
};

export default reducer;
