import reducer from "./reducer";
import initPlayer from "player/reducer";
import playlist from "playlist/reducer";
import Engine from "lib/Podcast";
import ApplicationState from "lib/State";
import { podcasts } from "./config";
import AudioElement from "lib/Audio";
import browser from "lib/Browser";
import Memory from "lib/Memory";


browser.setTitle("The Phonograph Extension");
browser.setClickToPopup();

// Global Objects
const memory = new Memory();
const engine = new Engine({ podcasts: podcasts });
const state = new ApplicationState();
const player = new AudioElement();

// Initialize Reducer
browser.instance.runtime.onMessage.addListener(reducer(engine, state, player));
browser.instance.runtime.onMessage.addListener(initPlayer(engine, state, player));
browser.instance.runtime.onMessage.addListener(playlist(engine, state, player));
