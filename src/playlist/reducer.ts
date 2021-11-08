import Engine from "../lib/Podcast";
import ApplicationState from "lib/State";
import AudioElement from "lib/Audio";
import * as T from "./types";
import { getNextResponse, playListEventResponse } from "./actions";
import { Queue } from "lib/Queue";

const playlist = new Queue();
export default (
  engine: Engine,
  state: ApplicationState,
  player: AudioElement
) => {
  const reducer: T.PlaylistEventReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case T.PLAYLIST_EVENTS.ADD_EPISODE: {
        const episode = playlist.queueEpisode(message.payload.episode);
        const status = sendResponse(playListEventResponse(episode));
        return status;
      }
      case T.PLAYLIST_EVENTS.GET_NEXT_EPISODE: {
        const episode = playlist.getNext();
        const status = sendResponse(getNextResponse(episode));
        return status;
      }
      case T.PLAYLIST_EVENTS.REMOVE_EPISODE: {
        const status = playlist.dequeueEpisode(message.payload.episode);
        sendResponse(playListEventResponse(status));
        return status;
      }
      case T.PLAYLIST_EVENTS.SWAP_LOCATION: {
        const { origin, destination } = message.payload;
        const status = playlist.swapEpisode(origin, destination);
        sendResponse(playListEventResponse(status));
        return status;
      }
      case T.PLAYLIST_EVENTS.CLEAR_EPISODES: {
          const status = playlist.clearPlaylist();
          sendResponse(playListEventResponse(status));
          return status;
      }
    }
  };
  return reducer;
};
