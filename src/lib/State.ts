// import { podcasts } from "background/config";
// import PodcastSuite from "podcastsuite";
// import { IColor } from "ui/utils/color";
import { IEpisode } from "podcastsuite/dist/Format";
import { IPodcast } from "ui/app";
import FetchImage, { PodcastImage } from "ui/utils/imageSaver";
import Podcast, { ISimplePodcast } from "./Podcast";

const CURRENT_EPISODE = "current_episode";
const CURRENT_PODCAST_INFO = "current_podcast_info";
const CURRENT_PODCAST_IMAGE = "current_podcast_image";

export interface IEpisodeState extends IEpisode {
  time: number;
}

export default class ApplicationState {
  fetchSimplePodcast(podcast: IPodcast) {
    const { items, ...simplepodcast } = podcast;
    FetchImage(simplepodcast.image).then((data) => {
      this.setPodcast(simplepodcast, data);
    });
  }

  setPodcast(podcastInfo: ISimplePodcast, podcastImage: PodcastImage) {
    localStorage.setItem(CURRENT_PODCAST_INFO, JSON.stringify(podcastInfo));
    localStorage.setItem(CURRENT_PODCAST_IMAGE, JSON.stringify(podcastImage));
    return true;
  }

  clearPodcast() {
    localStorage.removeItem(CURRENT_PODCAST_INFO);
    localStorage.removeItem(CURRENT_PODCAST_IMAGE);
    return true;
  }

  getSimplePodcast(): ISimplePodcast | undefined {
    const storedCurrent: string = localStorage.getItem(CURRENT_PODCAST_INFO);
    if (storedCurrent && storedCurrent.length > 0) {
      const currentObj: ISimplePodcast = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }

  getPodcastImage(): PodcastImage | undefined {
    const storedCurrent: string = localStorage.getItem(CURRENT_PODCAST_IMAGE);
    if (storedCurrent && storedCurrent.length > 0) {
      const currentObj: PodcastImage = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }

  clearEpisode() {
    localStorage.removeItem(CURRENT_EPISODE);
    return true;
  }

  setEpisode(episode: IEpisodeState, podcastPromise?: Promise<IPodcast>) {
    
    localStorage.setItem(CURRENT_EPISODE, JSON.stringify(episode));
    if (podcastPromise) {
      podcastPromise.then((podcast) => this.fetchSimplePodcast(podcast)).then(() => this.clearPodcast());
    }
    return true;
  }

  getEpisode(podcast?: boolean, images?: boolean) {
    const storedCurrent: string = localStorage.getItem(CURRENT_EPISODE);
    if (storedCurrent) {
      const currentObj: IEpisodeState = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }
}
