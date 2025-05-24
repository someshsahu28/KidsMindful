const https = require('https');
const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '../public/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Sample sound URLs (using free sounds from Pixabay)
const sounds = {
  'breath.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'match.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/25/audio_942d9daf5b.mp3',
  'star.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'cat.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c4e86563d6.mp3',
  'dog.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_d682c54390.mp3',
  'bird.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c4c4f36c27.mp3',
  'lion.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c4c4f36c27.mp3',
  'do.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  're.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'mi.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'fa.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'happy-dance.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'inhale.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'hold.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3',
  'exhale.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b0809c07d.mp3'
};

// Download function with error handling
const downloadFile = (url, filename) => {
  const filepath = path.join(soundsDir, filename);
  
  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`${filename} already exists, skipping...`);
    return;
  }

  const file = fs.createWriteStream(filepath);

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      fs.unlink(filepath, () => {});
      console.error(`Failed to download ${filename}: Status ${response.statusCode}`);
      return;
    }

    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filepath, () => {});
    console.error(`Error downloading ${filename}:`, err.message);
  });
};

// Create placeholder files if download fails
const createPlaceholder = (filename) => {
  const filepath = path.join(soundsDir, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, '');
    console.log(`Created placeholder for ${filename}`);
  }
};

// Download all sounds
console.log('Starting sound downloads...');
Object.entries(sounds).forEach(([filename, url]) => {
  console.log(`Downloading ${filename}...`);
  downloadFile(url, filename);
});

// Create placeholders after a delay to ensure downloads have time to complete/fail
setTimeout(() => {
  Object.keys(sounds).forEach(filename => createPlaceholder(filename));
  console.log('Download process completed.');
}, 5000); 