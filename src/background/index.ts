
import reducer from './reducer';

chrome.browserAction.setTitle({ title: "The Phonograph Extension" });
chrome.browserAction.setPopup({ popup: "popup.html" });

// Initialize Reducer
chrome.runtime.onMessage.addListener(reducer);
