import PodcastSuite from "podcastsuite";
import { IEpisode } from "podcastsuite/dist/Format";
import { DBInstance } from "podcastsuite/dist/DB";
import { ISimplePodcast } from "./Podcast";
import { IEpisodeState } from "./State";

export interface IMemory {
  podcasts: IPodcastLibrary;
  listened: IMemoryListened;
  playlist: IEpisodeState[];
}

export type IMemoryElements = Partial<IMemory>;

export type IPodcastLibrary = string[];

export interface IMemoryListened {
  [key: string]: IMemoryPodcast;
}

export interface IMemoryPodcast {
  url: string;
  episodes?: IMemoryEpisodes;
}

export interface IMemoryEpisodes {
  [key: string]: IMemoryState;
}

export interface IMemoryState {
  guid: string;
  lastPosition: number;
  completed: boolean;
}

const DBNAME = "memory";
const LISTENED = "LISTENED";
const LIBRARY = "LIBRARY";
const PLAYLIST = "PLAYLIST";

export default class Memory {
  private listened: IMemoryListened;
  private library: IPodcastLibrary;
  private playlist: IEpisodeState[];
  private memory: IMemory;
  private local;

  constructor({
    podcasts = [],
    listened = {},
    playlist = [],
  }: IMemoryElements) {
    this.listened = listened;
    this.library = podcasts;
    this.playlist = playlist;

    this.memory = {
      listened: this.listened,
      podcasts: this.library,
      playlist: this.playlist,
    };

    this.local = {
      listened: PodcastSuite.createDatabase(LISTENED, DBNAME),
      podcasts: PodcastSuite.createDatabase(LIBRARY, DBNAME),
      playlist: PodcastSuite.createDatabase(PLAYLIST, DBNAME),
    };
    this.init();
  }

  async addEpisode(episode: IEpisodeState): Promise<boolean> {
    const { link: key, time, duration, guid } = episode;
    const episodeState: IMemoryState = {
      guid,
      lastPosition: time,
      completed: duration === time,
    };
    const podcastMemory: IMemoryPodcast = this.listened[key] || {
      url: key,
      episodes: {},
    };
    podcastMemory.episodes[guid] = episodeState;
    this.listened[key] = podcastMemory;
    return this.local.set(key, JSON.stringify(podcastMemory)).then(true);
  }

  async markEpisodeComplete(
    episode: IEpisodeState | IEpisode
  ): Promise<Boolean> {
    const completeEpisode: IEpisodeState = {
      ...episode,
      time: episode.duration,
    };
    return await this.addEpisode(completeEpisode);
  }

  async erasePodcast(podcast: string | ISimplePodcast) {
    const key = typeof podcast === "string" ? podcast : podcast.url;
    delete this.listened[key];
    await this.local.listened.delete(key);
    return true;
  }

  getEpisode(episode: IEpisodeState | IEpisode): IMemoryState | undefined {
    const { link: key, guid } = episode;
    const podcastMemory: IMemoryPodcast = this.listened[key];
    return podcastMemory && podcastMemory[guid];
  }

  getPodcast(podcast: string | ISimplePodcast): IMemoryPodcast | undefined {
    const key = typeof podcast === "string" ? podcast : podcast.url;
    return this.listened[key];
  }

  async sync(){
    return await this.setStorageMemory(this.memory);
  }

  private async init() {
    const sync = await this.getStorageMemory();

    this.listened = {
      ...sync.listened,
      ...JSON.parse((await this.local.listened) || {}),
      ...this.listened,
    };
    this.library = {
      ...sync.podcasts,
      ...JSON.parse((await this.local.podcasts) || {}),
      ...this.library,
    };
    this.playlist = {
      ...sync.playlist,
      ...JSON.parse((await this.local.playlist) || {}),
      ...this.playlist,
    };
    return true;
  }

  private getStorageMemory(): Promise<IMemory> {
    return new Promise((acc) =>
      chrome.storage.sync.get(null, (storage: IMemory) => acc(storage))
    );
  }

  private setStorageMemory(memory: IMemoryElements): Promise<boolean> {
    return new Promise((acc) =>
      chrome.storage.sync.set(memory, () => acc(true))
    );
  }
}
