import { IEpisodeState } from "./State";

export default class Queue {
  private playlist: IEpisodeState[] = [];
  private map = new Map<string, IEpisodeState>();

  private findEpisodeIndex = (guid): number =>
    this.playlist.findIndex((currentEpisode) => currentEpisode.guid === guid);

  private build(init?: string) {
    try {
      this.playlist = JSON.parse(init) as IEpisodeState[];
      this.playlist.forEach((episode) => {
        this.map.set(episode.guid, episode);
      });
    } catch (error) {}
  }

  constructor(init?: string) {
    if (init) this.build(init);
  }

  public getNext(){
      const episode = this.playlist.pop();
      if(episode){
        this.map.delete(episode.guid);
        return episode;
      }
      return;
  }

  public queueEpisode(episode: IEpisodeState, first = false): boolean {
    if (this.map.get(episode.guid)) return false;
    this.map.set(episode.guid, episode);
    if (first) {
      this.playlist.unshift(episode);
    } else {
      this.playlist.push(episode);
    }
    return true;
  }

  public dequeueEpisode(episode: IEpisodeState | string) {
    const key = typeof episode === "string" ? episode : episode.guid;
    const episodeToErase = this.map.get(key);
    if (episodeToErase) {
      const index = this.findEpisodeIndex(key);
      this.map.delete(key);
      this.playlist.splice(index, 1);
      return episodeToErase;
    }
    return false;
  }

  public getPlaylist(): IEpisodeState[]{
    return this.playlist;
  }

  public getPlayListSize(): number {
    return this.map.size;
  }

  public swapEpisode(origin: number, destination: number) {
    if (
      this.playlist.length > origin ||
      this.playlist.length > destination ||
      origin < 0 ||
      destination < 0
    )
      return false;
    const holder = this.playlist[origin];
    this.playlist[origin] = this.playlist[destination];
    this.playlist[destination] = holder;
  }

  public getEpisode(episodeID: string) {
    return this.map.get(episodeID);
  }

  public removeLocation(location: number) {
    const episode = this.playlist[location];
    const index = this.findEpisodeIndex(this.playlist[location]);
    this.map.delete(episode.guid);
    this.playlist.splice(index, 1);
  }

  public clearPlaylist(){
    this.map.clear();
    this.playlist.length = 0;
    return true;
  }

  public storePlaylist() {
    return JSON.stringify(this.playlist);
  }
}
