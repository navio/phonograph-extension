import { IEpisode } from "podcastsuite/dist/Format";

const CURRENT_EPISODE = "current_episode";

export interface IEpisodeState extends IEpisode {
  time: number;
}

export default class ApplicationState {
    
  setEpisode(episode: IEpisodeState) {
    localStorage.setItem(CURRENT_EPISODE, JSON.stringify(episode));
    return true;
  }

  getEpisode() {
    const storedCurrent: string = localStorage.getItem(CURRENT_EPISODE);
    if (storedCurrent) {
      const currentObj: IEpisodeState = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }
}
