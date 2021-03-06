import PodcastSuite from "podcastsuite";
import { IPodcast, IPodcastSuiteConfig } from "podcastsuite/dist/PodcastSuite";

export type ILibrary = Map<string, IPodcast>;
export type ISimplePodcast = Omit<IPodcast, "items">

export default class extends PodcastSuite {
  private library: ILibrary = new Map<string, IPodcast>();
  getPodcasts() {
    return this.mapLibraryEntries((podcast) => {
      this.library.set(podcast.url, podcast);
      return podcast;
    });
  }
  getCollection(): ILibrary {
    this.getPodcasts();
    return this.library;
  }

  deletePodcast(podcast: string){
    PodcastSuite.db.del(podcast)
  }
  
}
