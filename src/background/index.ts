import { BACKGROUND_EVENTS, Actions, IState, IMessage } from "../types";
import { initializeResponsePopUp } from "../actions";

chrome.browserAction.setTitle({ title: "The Phonograph Extension" });
chrome.browserAction.setPopup({ popup: "popup.html" });

const reducer = (
  message: Actions,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.action) {
    case BACKGROUND_EVENTS.INITIALIZATION:
      sendResponse(initializeResponsePopUp("Welcome"));
    default:
      sendResponse({});
  }
};

chrome.runtime.onMessage.addListener(reducer);
