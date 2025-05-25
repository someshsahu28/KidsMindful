import { Howl } from 'howler';

// Helper function to create sound instances with error handling
const createSound = (src, volume = 0.5) => {
  try {
    console.log(`Creating sound: ${src}`); // Debug log
    const sound = new Howl({
      src: [src],
      volume,
      preload: true,
      html5: true,
      onload: () => {
        console.log(`Successfully loaded sound: ${src}`);
      },
      onloaderror: (id, error) => {
        console.error(`Failed to load sound ${src}:`, error);
      },
      onplayerror: (id, error) => {
        console.error(`Error playing sound ${src}:`, error);
        // Try to recover from play error by reloading
        sound.once('unlock', () => {
          sound.play();
        });
      }
    });

    // Return a wrapped sound object with additional error handling and debug logs
    return {
      play: () => {
        try {
          if (sound.state() === 'loaded') {
            console.log(`Playing sound: ${src}`);
            const id = sound.play();
            return id;
          } else {
            console.warn(`Attempted to play unloaded sound: ${src}`);
            // Try to load and play
            sound.load();
            return new Promise((resolve) => {
            sound.once('load', () => {
                const id = sound.play();
                resolve(id);
              });
            });
          }
        } catch (error) {
          console.error(`Error playing sound: ${src}`, error);
        }
      },
      stop: () => {
        try {
          if (sound.state() === 'loaded') {
            console.log(`Stopping sound: ${src}`);
            sound.stop();
          }
        } catch (error) {
          console.error(`Error stopping sound: ${src}`, error);
        }
      },
      volume: (val) => {
        try {
          if (sound.state() === 'loaded') {
            sound.volume(val);
          }
        } catch (error) {
          console.error(`Error setting volume: ${src}`, error);
        }
      },
      // Add method to check if sound is loaded
      isLoaded: () => {
        return sound.state() === 'loaded';
      },
      // Add method to wait for sound to load
      waitForLoad: () => {
        return new Promise((resolve) => {
          if (sound.state() === 'loaded') {
            resolve();
          } else {
            sound.once('load', resolve);
          }
        });
      },
      // Add event listener support
      on: (event, callback) => {
        try {
          sound.on(event, callback);
        } catch (error) {
          console.error(`Error adding event listener for ${src}:`, error);
        }
      },
      once: (event, callback) => {
        try {
          sound.once(event, callback);
        } catch (error) {
          console.error(`Error adding one-time event listener for ${src}:`, error);
        }
      },
      off: (event, callback) => {
        try {
          sound.off(event, callback);
        } catch (error) {
          console.error(`Error removing event listener for ${src}:`, error);
        }
      }
    };
  } catch (error) {
    console.error(`Error creating sound: ${src}`, error);
    // Return a dummy sound object that logs errors
    return {
      play: () => {
        console.error(`Cannot play sound ${src}: Sound not created properly`);
        return Promise.reject(new Error(`Cannot play sound ${src}: Sound not created properly`));
      },
      stop: () => {
        console.error(`Cannot stop sound ${src}: Sound not created properly`);
      },
      volume: () => {
        console.error(`Cannot set volume for ${src}: Sound not created properly`);
      },
      isLoaded: () => false,
      waitForLoad: () => Promise.reject(new Error(`Cannot load sound ${src}: Sound not created properly`)),
      on: () => console.error(`Cannot add event listener for ${src}: Sound not created properly`),
      once: () => console.error(`Cannot add one-time event listener for ${src}: Sound not created properly`),
      off: () => console.error(`Cannot remove event listener for ${src}: Sound not created properly`)
    };
  }
};

// Create sound instances
const sounds = {
  // Game sounds
  match: createSound('/sounds/match.mp3', 0.5),
  effects: {
    success: createSound('/sounds/success.mp3', 0.5),
    error: createSound('/sounds/error.mp3', 0.4),
    click: createSound('/sounds/click.mp3', 0.3),
    complete: createSound('/sounds/complete.mp3', 0.6)
  },
  
  // Animal sounds
  animals: {
    cat: createSound('/sounds/cat.mp3', 0.8),
    dog: createSound('/sounds/dog.mp3', 0.8),
    bird: createSound('/sounds/bird.mp3', 0.8),
    lion: createSound('/sounds/lion.mp3', 0.8),
  },
  
  // Nature sounds
  nature: {
    rain: createSound('/sounds/rain.mp3', 0.4),
    waves: createSound('/sounds/waves.mp3', 0.4),
    forest: createSound('/sounds/forest.mp3', 0.4),
    wind: createSound('/sounds/wind.mp3', 0.4)
  },
  
  // Activity sounds
  breath: createSound('/sounds/breath.mp3', 0.5),
  dance: createSound('/sounds/dance.mp3', 0.4),
  meditation: createSound('/sounds/meditation.mp3', 0.3),
  
  // Voice instructions
  instructions: {
    inhale: createSound('/sounds/inhale.mp3', 0.7),
    hold: createSound('/sounds/hold.mp3', 0.7),
    exhale: createSound('/sounds/exhale.mp3', 0.7),
  }
};

// Global sound control
const globalSoundControl = {
  muteAll: () => {
    Object.entries(sounds).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.values(value).forEach(sound => {
          if (sound.volume) sound.volume(0);
        });
      } else if (value.volume) {
        value.volume(0);
      }
    });
  },
  
  unmuteAll: () => {
    Object.entries(sounds).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.values(value).forEach(sound => {
          if (sound.volume) sound.volume(0.5);
        });
      } else if (value.volume) {
        value.volume(0.5);
      }
    });
  },
  
  stopAll: () => {
    Object.entries(sounds).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.values(value).forEach(sound => {
          if (sound.stop) sound.stop();
        });
      } else if (value.stop) {
        value.stop();
      }
    });
  },

  // Add method to wait for all sounds to load
  waitForAllSounds: async () => {
    const allSounds = [];
    Object.entries(sounds).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.values(value).forEach(sound => {
          if (sound.waitForLoad) {
            allSounds.push(sound.waitForLoad());
          }
        });
      } else if (value.waitForLoad) {
        allSounds.push(value.waitForLoad());
      }
    });
    return Promise.all(allSounds);
  }
};

export { globalSoundControl };
export default sounds; 