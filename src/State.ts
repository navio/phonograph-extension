import { podcasts } from "background/config";
import { IEpisode } from "podcastsuite/dist/Format";
import { IColor } from "ui/utils/color";
import { PodcastImage } from "ui/utils/imageSaver";
import Podcast, { ISimplePodcast } from "./Podcast";


const CURRENT_EPISODE = "current_episode";
const CURRENT_PODCAST_INFO = "current_podcast_info";
const CURRENT_PODCAST_IMAGE = "current_podcast_image";
const CURRENT_PODCAST_COLORS = "current_podcast_colors";

export interface IEpisodeState extends IEpisode {
  time: number;
}

export default class ApplicationState {

  fetchSimplePodcast(url:String){

  }
  
  setPodcast(podcastInfo: ISimplePodcast, podcastImage: PodcastImage, podcastColors: IColor){
    localStorage.setItem(CURRENT_PODCAST_INFO, JSON.stringify(podcastInfo));
    localStorage.setItem(CURRENT_PODCAST_IMAGE, JSON.stringify(podcastImage));
    localStorage.setItem(CURRENT_PODCAST_COLORS, JSON.stringify(podcastColors));
    return true;
  }

  getSimplePodcast(): ISimplePodcast | undefined{
    const storedCurrent: string = localStorage.getItem(CURRENT_PODCAST_INFO);
    if (storedCurrent) {
      const currentObj: ISimplePodcast = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }

  getPodcastImage(): PodcastImage | undefined{
    const storedCurrent: string = localStorage.getItem(CURRENT_PODCAST_IMAGE);
    if (storedCurrent) {
      const currentObj: PodcastImage = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }


  getPodcastColors(): IColor | undefined{
    const storedCurrent: string = localStorage.getItem(CURRENT_PODCAST_IMAGE);
    if (storedCurrent) {
      const currentObj: IColor = JSON.parse(storedCurrent);
      return currentObj;
    }
    return;
  }
    
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
