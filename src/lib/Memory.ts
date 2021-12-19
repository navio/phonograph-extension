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

interface IAddEpisodeConfig {
  hard: boolean;
  async?: boolean;
}

export default class Memory {
  public ready: boolean;
  private listened: IMemoryListened;
  private library: IPodcastLibrary;
  private playlist: IEpisodeState[];
  private memory: IMemory;
  private local;

  constructor(props: IMemoryElements = {}) {
    const { podcasts = [], listened = {}, playlist = [] } = props;

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

  async addEpisode(
    episode: IEpisodeState,
    {hard}: IAddEpisodeConfig = { hard: false, async: false }
  ): Promise<boolean> {
    const { podcast: key, time, duration, guid } = episode;
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
    if (!hard) return Promise.resolve(true);
    return this.local.listened
      .set(key, JSON.stringify(podcastMemory))
      .then(() => console.log(podcastMemory))
      .then(true);
  }

  async markEpisodeComplete(
    episode: IEpisodeState | IEpisode
  ): Promise<Boolean> {
    const completeEpisode: IEpisodeState = {
      ...episode,
      time: episode.duration,
    };
    return await this.addEpisode(completeEpisode, { hard: true });
  }

  async erasePodcast(podcast: string | ISimplePodcast) {
    const key = typeof podcast === "string" ? podcast : podcast.url;
    delete this.listened[key];
    await this.local.listened.delete(key);
    return true;
  }

  getEpisode(episode: IEpisodeState | IEpisode): IMemoryState | undefined {
    const { podcast: key, guid } = episode;
    const podcastMemory: IMemoryPodcast = this.listened[key];
    return podcastMemory && podcastMemory.episodes[guid];
  }

  getEpisodeTime(episode: IEpisodeState | IEpisode): number {
    const response = this.getEpisode(episode);
    if(response && response.completed){
      return 0;
    }
    return response ? response.lastPosition : 0;
  }

  getPodcast(podcast: string | ISimplePodcast): IMemoryPodcast | undefined {
    const url = typeof podcast === "string" ? podcast : podcast.url;
    return this.listened[url] || {url};
  }

  isReady() {
    return this.ready;
  }

  private async init() {
    const sync = (await this.getStorageMemory()) || { listened: {}, podcasts: {}, playlist: {} };
    const listenedLocalArray = await this.local.listened.entries();
    const listenedLocal: IMemoryListened = listenedLocalArray.reduce(
      (final, current) => {
        const parsed = JSON.parse(current);
        const currentObj = { [parsed.url]: parsed };
        return { ...currentObj, ...final };
      },
      {}
    );


    this.listened = {
      ...this.listened,
      ...listenedLocal,
      ...sync.listened,
    };
    

    this.ready = true;
    return true;
  }

  private getStorageMemory(): Promise<IMemory> {
    return new Promise((acc) =>
      chrome.storage.sync.get(null, (storage: IMemory) => acc(storage))
    );
  }

  async sync() {
    return await this.setStorageMemory(this.memory);
  }
  
  private setStorageMemory(memory: IMemoryElements): Promise<boolean> {
    return new Promise((acc) =>
      chrome.storage.sync.set(memory, () => acc(true))
    );
  }
}
