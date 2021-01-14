import PodcastSuite from "podcastsuite";

export default class extends PodcastSuite {
  getPodcasts() {
    return this.mapLibraryEntries((_) => _);
  }
}
