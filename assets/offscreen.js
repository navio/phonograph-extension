// Offscreen document for audio playback in Manifest V3
// This script runs in a hidden DOM context to handle audio operations

let audioElement = null;
let audioState = {
  currentTime: 0,
  duration: 0,
  playing: false,
  loaded: null,
  ended: false
};

// Initialize audio element
function initializeAudio() {
  if (audioElement) return audioElement;
  
  audioElement = document.createElement('audio');
  audioElement.preload = 'metadata';
  
  // Audio event listeners
  audioElement.addEventListener('loadedmetadata', () => {
    audioState.duration = audioElement.duration;
    sendAudioStateUpdate('loadedmetadata');
  });
  
  audioElement.addEventListener('loadeddata', () => {
    audioState.loaded = audioElement.src;
    sendAudioStateUpdate('loadeddata');
  });
  
  audioElement.addEventListener('timeupdate', () => {
    audioState.currentTime = audioElement.currentTime;
    sendAudioStateUpdate('timeupdate');
  });
  
  audioElement.addEventListener('play', () => {
    audioState.playing = true;
    sendAudioStateUpdate('play');
  });
  
  audioElement.addEventListener('pause', () => {
    audioState.playing = false;
    sendAudioStateUpdate('pause');
  });
  
  audioElement.addEventListener('ended', () => {
    audioState.playing = false;
    audioState.ended = true;
    sendAudioStateUpdate('ended');
  });
  
  audioElement.addEventListener('error', (error) => {
    console.error('Audio error:', error);
    sendAudioStateUpdate('error', { error: error.message });
  });
  
  // Append to document to enable playback
  document.body.appendChild(audioElement);
  return audioElement;
}

// Send audio state updates to service worker
function sendAudioStateUpdate(event, additionalData = {}) {
  const message = {
    type: 'AUDIO_STATE_UPDATE',
    event: event,
    state: { ...audioState },
    ...additionalData
  };
  
  chrome.runtime.sendMessage(message).catch(error => {
    console.error('Failed to send audio state update:', error);
  });
}

// Get current audio state
function getAudioState() {
  if (!audioElement) return audioState;
  
  audioState.currentTime = audioElement.currentTime;
  audioState.duration = audioElement.duration;
  audioState.playing = !audioElement.paused;
  audioState.ended = audioElement.ended;
  audioState.loaded = audioElement.src;
  
  return audioState;
}

// Message handler for audio commands from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;
  
  const audio = initializeAudio();
  
  try {
    switch (message.command) {
      case 'LOAD_AUDIO':
        audio.src = message.payload.src;
        audioState.loaded = message.payload.src;
        sendResponse({ success: true, state: getAudioState() });
        break;
        
      case 'PLAY_AUDIO':
        audio.play().then(() => {
          sendResponse({ success: true, state: getAudioState() });
        }).catch(error => {
          sendResponse({ success: false, error: error.message });
        });
        break;
        
      case 'PAUSE_AUDIO':
        audio.pause();
        sendResponse({ success: true, state: getAudioState() });
        break;
        
      case 'SET_CURRENT_TIME':
        audio.currentTime = message.payload.time;
        audioState.currentTime = message.payload.time;
        sendResponse({ success: true, state: getAudioState() });
        break;
        
      case 'SET_VOLUME':
        audio.volume = message.payload.volume;
        sendResponse({ success: true, state: getAudioState() });
        break;
        
      case 'GET_STATE':
        sendResponse({ success: true, state: getAudioState() });
        break;
        
      case 'STOP_AUDIO':
        audio.pause();
        audio.currentTime = 0;
        audioState.currentTime = 0;
        sendResponse({ success: true, state: getAudioState() });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown command: ' + message.command });
    }
  } catch (error) {
    console.error('Offscreen audio error:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep message channel open for async response
});

// Initialize audio on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Offscreen document loaded for audio playback');
  initializeAudio();
});