
import reducer from './reducer';
import initPlayer from 'player/reducer';

chrome.browserAction.setTitle({ title: "The Phonograph Extension" });
chrome.browserAction.setPopup({ popup: "popup.html" });

// Initialize Reducer
chrome.runtime.onMessage.addListener(reducer);
chrome.runtime.onMessage.addListener(initPlayer());
