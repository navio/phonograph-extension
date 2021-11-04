import reducer from "./reducer";
import initPlayer from "player/reducer";
import playlist from "playlist/reducer";
import Engine from "../Podcast";
import ApplicationState from "../State";
import { podcasts } from "./config";
import AudioElement from "../Audio";
import browser from "../Browser";


browser.setTitle("The Phonograph Extension");
browser.setClickToPopup();

// Global Objects

const engine = new Engine({ podcasts: podcasts });
const state = new ApplicationState();
const player = new AudioElement();

// Initialize Reducer
chrome.runtime.onMessage.addListener(reducer(engine, state, player));
chrome.runtime.onMessage.addListener(initPlayer(engine, state, player));
chrome.runtime.onMessage.addListener(playlist(engine, state, player));
