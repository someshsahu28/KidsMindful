import sounds from './sounds';

class SoundManager {
  constructor() {
    this.currentSounds = new Set();
  }

  playSound(sound) {
    if (!sound || typeof sound.play !== 'function') return;
    
    // Stop the previous instance of this sound if it's playing
    if (this.currentSounds.has(sound)) {
      sound.stop();
    }
    
    const soundId = sound.play();
    this.currentSounds.add(sound);
    return soundId;
  }

  stopSound(sound) {
    if (!sound || typeof sound.stop !== 'function') return;
    sound.stop();
    this.currentSounds.delete(sound);
  }

  stopAllSounds() {
    // Stop all currently playing sounds
    this.currentSounds.forEach(sound => {
      if (sound && typeof sound.stop === 'function') {
        sound.stop();
      }
    });
    this.currentSounds.clear();

    // Also stop all sounds from the sounds object for safety
    if (sounds.nature) {
      Object.values(sounds.nature).forEach(sound => sound.stop?.());
    }
    if (sounds.animals) {
      Object.values(sounds.animals).forEach(sound => sound.stop?.());
    }
    if (sounds.effects) {
      Object.values(sounds.effects).forEach(sound => sound.stop?.());
    }
    if (sounds.dance) {
      sounds.dance.stop?.();
    }
    if (sounds.meditation) {
      sounds.meditation.stop?.();
    }
    if (sounds.instructions) {
      Object.values(sounds.instructions).forEach(sound => sound.stop?.());
    }
  }

  playClickSound() {
    if (sounds.effects.click) {
      this.playSound(sounds.effects.click);
    }
  }

  playMatchSound() {
    if (sounds.match) {
      this.playSound(sounds.match);
    }
  }

  playErrorSound() {
    if (sounds.effects.error) {
      this.playSound(sounds.effects.error);
    }
  }
}

export const soundManager = new SoundManager(); 