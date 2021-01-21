import { IEpisode } from "podcastsuite/dist/Format";

const CURRENT_EPISODE = "current_episode";

export default class ApplicationState {
    
  setEpisode(episode: IEpisode) {
    localStorage.setItem(CURRENT_EPISODE, JSON.stringify(episode));
    return true;
  }

  getEpisode() {
    const storedCurrent: string = localStorage.getItem(CURRENT_EPISODE);
    if (storedCurrent) {
      const currentObj: IEpisode = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }
}
