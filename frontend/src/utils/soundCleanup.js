import sounds from './sounds';

export const stopAllSounds = () => {
  // Stop all meditation sounds
  if (sounds.nature) {
    Object.values(sounds.nature).forEach(sound => {
      if (sound && typeof sound.stop === 'function') {
        sound.stop();
      }
    });
  }

  // Stop all animal sounds
  if (sounds.animals) {
    Object.values(sounds.animals).forEach(sound => {
      if (sound && typeof sound.stop === 'function') {
        sound.stop();
      }
    });
  }

  // Stop all effect sounds
  if (sounds.effects) {
    Object.values(sounds.effects).forEach(sound => {
      if (sound && typeof sound.stop === 'function') {
        sound.stop();
      }
    });
  }

  // Stop dance music
  if (sounds.dance && typeof sounds.dance.stop === 'function') {
    sounds.dance.stop();
  }

  // Stop meditation music
  if (sounds.meditation && typeof sounds.meditation.stop === 'function') {
    sounds.meditation.stop();
  }

  // Stop instruction sounds
  if (sounds.instructions) {
    Object.values(sounds.instructions).forEach(sound => {
      if (sound && typeof sound.stop === 'function') {
        sound.stop();
      }
    });
  }
}; 