import reducer from "./reducer";
import initPlayer from "player/reducer";
import Engine from "../Podcast";
import ApplicationState from "../State";
import { podcasts } from "./config";

chrome.browserAction.setTitle({ title: "The Phonograph Extension" });
chrome.browserAction.setPopup({ popup: "popup.html" });

// Global Objects

const engine = new Engine({ podcasts: podcasts});
const state = new ApplicationState();

// Initialize Reducer
chrome.runtime.onMessage.addListener(reducer(engine, state));
chrome.runtime.onMessage.addListener(initPlayer(engine, state));
