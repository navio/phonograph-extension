import PodcastSuite from "podcastsuite";
import { IEpisodeState } from "./State";

export default class Memory {
  private episodes;
  constructor() {
    this.episodes = PodcastSuite.createDatabase("episode", "listened");
  }
  async addEpisode(episode: IEpisodeState) {
    await this.episodes.set(episode.guid, {
      time: episode.time,
      complete: false,
    });
    return true;
  }

  async getEpisode(episode: IEpisodeState | string) {
    let id = typeof episode === "string" ? episode : episode.guid;
    return await this.episodes.get(id);
  }
}
