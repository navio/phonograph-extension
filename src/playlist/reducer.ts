import Engine from "../lib/Podcast";
import ApplicationState from "lib/State";
import AudioElement from "lib/Audio";
import * as T from "./types";
import {
  emitUpdatePlaylist,
  getNextResponse,
  broadcastMessagePlaylist,
  playListEventResponse,
  emitClearPlaylist,
  getEpisodesResponse,
} from "./actions";
import Queue from "lib/Queue";

export default (
  engine: Engine,
  state: ApplicationState,
  player: AudioElement,
  playlist: Queue
) => {
  const reducer: T.PlaylistEventReducer = (message, sender, sendResponse) => {
    switch (message.action) {
      case T.PLAYLIST_EVENTS.GET_EPISODES: {
        sendResponse(getEpisodesResponse(playlist.getPlaylist()));
        return true;
      }
      case T.PLAYLIST_EVENTS.ADD_EPISODE: {
        const status = playlist.queueEpisode(message.payload.episode);
        sendResponse(playListEventResponse(status));
        broadcastMessagePlaylist(
          emitUpdatePlaylist(message.payload.episode, playlist.getPlaylist()),
          () => true
        );
        return status;
      }
      case T.PLAYLIST_EVENTS.GET_NEXT_EPISODE: {
        const episode = playlist.getNext();
        const status = sendResponse(getNextResponse(episode));
        broadcastMessagePlaylist(
          emitUpdatePlaylist(episode, playlist.getPlaylist()),
          () => true
        );
        return status;
      }
      case T.PLAYLIST_EVENTS.REMOVE_EPISODE: {
        const episode = playlist.dequeueEpisode(message.payload.episode);
        sendResponse(playListEventResponse(!!episode));
        if (episode) {
          broadcastMessagePlaylist(
            emitUpdatePlaylist(episode, playlist.getPlaylist()),
            () => true
          );
        }
        return !!episode;
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
        broadcastMessagePlaylist(emitClearPlaylist(), () => true);
        return status;
      }
    }
  };
  return reducer;
};
