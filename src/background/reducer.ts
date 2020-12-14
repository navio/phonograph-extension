import { BACKGROUND_EVENTS, BackgroundEventReducer } from "../types";
import { initializeResponsePopUp } from "../popup/actions";

const reducer: BackgroundEventReducer = (message, sender, sendResponse) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INITIALIZATION:
      sendResponse(initializeResponsePopUp("Welcome to Phonograph"));
    default:
      sendResponse(initializeResponsePopUp("allGood"));
  }
};

export default reducer;
