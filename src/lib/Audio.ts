type IProperty = string | number | symbol;
type IGetOverwritesFn = (target: any, property: IProperty) => any;
type ISetOverwritesFn = (target: any, property: IProperty, value: any) => any;

export interface AudioState {
  currentTime: number;
  duration: number;
  playing: boolean;
  loaded?: string;
  ended?: boolean;
}

export type TypeEventFn = (event: Event) => void;

export const percentPlayed = (audio: AudioState) =>
  audio.loaded && audio.currentTime > 0 && audio.duration
    ? Number.parseInt(((100 * audio.currentTime) / audio.duration).toFixed(2))
    : 0;

export const timeByPercentage = (percentage, audio: AudioState) =>
  (percentage * audio.duration) / 100;

export default class AudioElement extends Audio {
  public audioElement: HTMLAudioElement;

  public getOverwrites: Map<IProperty, IGetOverwritesFn>;
  public setOverwrites: Map<IProperty, ISetOverwritesFn>;

  private audioState: AudioState = {
    currentTime: 0,
    duration: 0,
    playing: false,
  };

  constructor(audioElement?: HTMLAudioElement) {
    super();
    this.getOverwrites = new Map();
    this.setOverwrites = new Map();
    if (!audioElement) {
      const defaultElement: HTMLAudioElement = document.createElement("audio");
      document.body.appendChild(defaultElement);
      this.audioElement = defaultElement;
    } else {
      this.audioElement = audioElement;
    }
    // return this.generateProxy();
  }

  private generateProxy() {
    return new Proxy(this, {
      get: (target, property) => {
        if (this.getOverwrites.has(property)) {
          return this.getOverwrites.get(property)(this.audioElement, property);
        }
        return Reflect.get(this.audioElement, property);
      },
      set: (target, property, value) => {
        if (this.setOverwrites.has(property)) {
          return this.setOverwrites.get(property)(
            this.audioElement,
            property,
            value
          );
        }
        return Reflect.set(this.audioElement, property, value);
      },
    });
  }

  get state(): AudioState {
    this.audioState = {
      ...this.audioState,
      loaded: this.audioElement.src,
      duration: this.audioElement.duration,
      currentTime: this.audioElement.currentTime,
      ended: this.audioElement.ended,
      playing: !this.audioElement.paused,
    };
    return this.audioState;
  }

  get durationPercentage(): number {
    return percentPlayed(this.audioState);
  }

}
