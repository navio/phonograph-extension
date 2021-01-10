import { url } from "inspector";
import { extname } from "path";

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



export default class AudioElement extends Audio {
  private audioElement: HTMLAudioElement;

  public getOvewritres: Map<IProperty, IGetOverwritesFn>;
  public setOvewritres: Map<IProperty, ISetOverwritesFn>;

  private audioState: AudioState = {
    currentTime: 0,
    duration: 0,
    playing: false,
  };

  constructor(audioElement?: HTMLAudioElement) {
    super();
    this.getOvewritres = new Map();
    this.setOvewritres = new Map();
    if (!audioElement) {
      const defaultElement: HTMLAudioElement = document.createElement("audio");
      document.body.appendChild(defaultElement);
      this.audioElement = defaultElement;
    } else {
      this.audioElement = audioElement;
    }
    return this.generateProxy();
  }

  private generateProxy() {
    return new Proxy(this, {
      get: (target, property, receiver) => {
        if (this.getOvewritres.has(property)) {
          return this.getOvewritres.get(property)(target, property);
        }
        return Reflect.get(target, property, receiver);
      },
      set: (target, property, value, receiver) => {
        if (this.setOvewritres.has(property)) {
          return this.setOvewritres.get(property)(target, property, value);
        }
        return Reflect.set(target, property, value, receiver);
      },
    });
  }
  get state() {
    this.audioState = {
      ...this.audioState,
      loaded: this.audioElement.src,
      duration: this.audioElement.duration,
      currentTime: this.audioElement.currentTime,
      ended: this.audioElement.ended,
    };
    return this.audioState;
  }
  get durationPercentage(): number {
    return (100 * this.audioElement.currentTime) / this.audioElement.duration;
  }
}
