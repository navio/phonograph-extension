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

// Service Worker compatible AudioElement that uses offscreen documents
export default class AudioElement {
  private audioState: AudioState = {
    currentTime: 0,
    duration: 0,
    playing: false,
  };

  private offscreenReady = false;

  constructor() {
    this.setupOffscreenDocument();
    this.setupMessageListener();
  }

  // Setup offscreen document for audio playback
  private async setupOffscreenDocument(): Promise<void> {
    try {
      // Check if offscreen document already exists
      if (await chrome.offscreen.hasDocument()) {
        this.offscreenReady = true;
        return;
      }

      // Create offscreen document
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: 'Podcast audio playback'
      });

      this.offscreenReady = true;
    } catch (error) {
      console.error('Failed to setup offscreen document:', error);
      this.offscreenReady = false;
    }
  }

  // Listen for audio state updates from offscreen document
  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'AUDIO_STATE_UPDATE') {
        this.audioState = { ...this.audioState, ...message.state };
      }
      return false; // Don't send response
    });
  }

  // Send command to offscreen document
  private async sendOffscreenCommand(command: string, payload?: any): Promise<any> {
    if (!this.offscreenReady) {
      await this.setupOffscreenDocument();
    }

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          target: 'offscreen',
          command: command,
          payload: payload
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.success) {
            if (response.state) {
              this.audioState = { ...this.audioState, ...response.state };
            }
            resolve(response);
          } else {
            reject(new Error(response?.error || 'Unknown error'));
          }
        }
      );
    });
  }

  // Audio control methods
  async loadAudio(src: string): Promise<void> {
    await this.sendOffscreenCommand('LOAD_AUDIO', { src });
  }

  async play(): Promise<void> {
    await this.sendOffscreenCommand('PLAY_AUDIO');
  }

  async pause(): Promise<void> {
    await this.sendOffscreenCommand('PAUSE_AUDIO');
  }

  async stop(): Promise<void> {
    await this.sendOffscreenCommand('STOP_AUDIO');
  }

  async setCurrentTime(time: number): Promise<void> {
    await this.sendOffscreenCommand('SET_CURRENT_TIME', { time });
  }

  async setVolume(volume: number): Promise<void> {
    await this.sendOffscreenCommand('SET_VOLUME', { volume });
  }

  // Get current audio state
  get state(): AudioState {
    return { ...this.audioState };
  }

  async updateState(): Promise<AudioState> {
    const response = await this.sendOffscreenCommand('GET_STATE');
    return response.state;
  }

  get durationPercentage(): number {
    return percentPlayed(this.audioState);
  }

  // Legacy property accessors for compatibility
  get src(): string | undefined {
    return this.audioState.loaded;
  }

  set src(value: string | undefined) {
    if (value) {
      this.loadAudio(value);
    }
  }

  get currentTime(): number {
    return this.audioState.currentTime;
  }

  set currentTime(value: number) {
    this.setCurrentTime(value);
  }

  get duration(): number {
    return this.audioState.duration;
  }

  get paused(): boolean {
    return !this.audioState.playing;
  }

  get ended(): boolean {
    return this.audioState.ended || false;
  }
}
