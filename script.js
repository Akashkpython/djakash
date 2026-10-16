/* ============================================
   DJ AKASH - www.djakash.com
   Main JavaScript
   ============================================ */

// ============================================
// Track Data
// ============================================
const tracks = [
  { name: "Aura 10", file: "audio/aura 10.mp3", format: "mp3", size: "7.0 MB" },
  { name: "Bumba Diga", file: "audio/bumba diga_DJ_AKASH.mp3", format: "mp3", size: "2.4 MB" },
  { name: "College Day", file: "audio/college day.mp3", format: "mp3", size: "6.2 MB" },
  { name: "Dhamm Power 56", file: "audio/DHAMM POWER 56.mp3", format: "mp3", size: "9.7 MB" },
  { name: "Dhruvanthar", file: "audio/dhruvanthar.mp3", format: "mp3", size: "2.4 MB" },
  { name: "Disturbia Remix", file: "audio/Disturbia_Remix_Akash.mp3", format: "mp3", size: "3.4 MB" },
  { name: "Made in Romania x Culik Aku Dong x Idli Dosa", file: "audio/made in romania x culik aku dong x idli dosa.820.mp3", format: "mp3", size: "1.8 MB" },
  { name: "Masth Malaika (Hindi Original)", file: "audio/Masth Malaika From Mark Hindi-320kbps.mp3", format: "mp3", size: "7.4 MB" },
  { name: "Masth Malika DJ Remix", file: "audio/Masth_Malikax Dj Remix Akash.mp3", format: "mp3", size: "4.8 MB" },
  { name: "Masth Malika DJ Remix (Hindi)", file: "audio/Masth_Malikax Dj Remix Hindhi Akash.mp3", format: "mp3", size: "4.8 MB" },
  { name: "Oorum Blood Song", file: "audio/oorum blood song 1.mp3", format: "mp3", size: "9.2 MB" },
  { name: "Sapan", file: "audio/Sapan123.mp3", format: "mp3", size: "3.5 MB" },
  { name: "Skyline Echo", file: "audio/Skyline Echo.mp3", format: "mp3", size: "2.4 MB" },
  { name: "Tulasi Remix", file: "audio/Tulasi Remix Akash.mp3", format: "mp3", size: "3.6 MB" },
  { name: "Tulasi Remix (Version 2)", file: "audio/Tulasi_Remix_Akash.mp3", format: "mp3", size: "3.7 MB" }
];

// ============================================
// DOM Elements
// ============================================
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progressBar');
const progressWrapper = document.getElementById('progressWrapper');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const trackList = document.getElementById('trackList');
const trackCount = document.getElementById('trackCount');
const searchInput = document.getElementById('searchInput');
const visualizer = document.getElementById('visualizer');

// ============================================
// State
// ============================================
let currentTrackIndex = -1;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentFilter = 'all';
let filteredTracks = [...tracks];

// ============================================
// Preloader
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1500);
});

// ============================================
// Navigation
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ============================================
// Logo Marquee Banner
// ============================================
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  const logoSrc = 'dj-akash-logo.png';

  // Create content that repeats
  const createMarqueeContent = () => {
    let html = '';
    for (let i = 0; i < 8; i++) {
      html += `
        <div class="marquee-item">
          <img src="${logoSrc}" alt="DJ Akash" class="marquee-logo">
          <span class="marquee-text">www.djakash.com</span>
          <span class="marquee-separator">✦</span>
          <span class="marquee-text">Remix Artist</span>
          <span class="marquee-separator">✦</span>
          <span class="marquee-text">Music Producer</span>
          <span class="marquee-separator">✦</span>
        </div>
      `;
    }
    return html;
  };

  // Double the content for seamless infinite scroll
  track.innerHTML = createMarqueeContent() + createMarqueeContent();
}

// ============================================
// Visualizer
// ============================================
function initVisualizer() {
  const barCount = 40;
  visualizer.innerHTML = '';
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    bar.style.height = '4px';
    visualizer.appendChild(bar);
  }
}

function animateVisualizer() {
  if (!isPlaying) return;

  const bars = visualizer.querySelectorAll('.visualizer-bar');
  bars.forEach(bar => {
    const height = Math.random() * 50 + 5;
    bar.style.height = height + 'px';
  });

  requestAnimationFrame(() => {
    setTimeout(animateVisualizer, 100);
  });
}

function stopVisualizer() {
  const bars = visualizer.querySelectorAll('.visualizer-bar');
  bars.forEach(bar => {
    bar.style.height = '4px';
  });
}

// ============================================
// Track List Rendering
// ============================================
function renderTrackList(tracksToRender) {
  trackList.innerHTML = '';
  trackCount.textContent = `${tracksToRender.length} track${tracksToRender.length !== 1 ? 's' : ''}`;

  tracksToRender.forEach((track, index) => {
    const globalIndex = tracks.indexOf(track);
    const div = document.createElement('div');
    div.className = `track-item${globalIndex === currentTrackIndex ? ' active' : ''}`;
    div.dataset.index = globalIndex;

    div.innerHTML = `
      <span class="track-number">${index + 1}</span>
      <div class="track-info">
        <span class="track-name">${track.name}</span>
      </div>
      <span class="track-format">${track.format}</span>
      <span class="track-size">${track.size}</span>
      <button class="track-download" title="Download" onclick="event.stopPropagation(); downloadTrack(${globalIndex})">
        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
      </button>
    `;

    div.addEventListener('click', () => {
      loadTrack(globalIndex);
      playTrack();
    });

    trackList.appendChild(div);
  });
}

// ============================================
// Player Functions
// ============================================
function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];

  audioPlayer.src = track.file;
  nowPlayingTitle.textContent = track.name;
  nowPlayingArtist.textContent = 'DJ Akash • ' + track.format.toUpperCase();

  // Update active state in list
  document.querySelectorAll('.track-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.index) === index);
  });

  // Scroll active track into view
  const activeTrack = document.querySelector('.track-item.active');
  if (activeTrack) {
    activeTrack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function playTrack() {
  audioPlayer.play();
  isPlaying = true;
  updatePlayButton();
  animateVisualizer();
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  updatePlayButton();
  stopVisualizer();
}

function updatePlayButton() {
  if (isPlaying) {
    playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  } else {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  }
}

function nextTrack() {
  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * tracks.length);
    } while (newIndex === currentTrackIndex && tracks.length > 1);
    loadTrack(newIndex);
  } else {
    loadTrack((currentTrackIndex + 1) % tracks.length);
  }
  if (isPlaying) playTrack();
}

function prevTrack() {
  if (audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
  } else {
    loadTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
  }
  if (isPlaying) playTrack();
}

function downloadTrack(index) {
  const track = tracks[index];
  const a = document.createElement('a');
  a.href = track.file;
  a.download = track.file.split('/').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ============================================
// Time Formatting
// ============================================
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// Event Listeners
// ============================================

// Play/Pause
playBtn.addEventListener('click', () => {
  if (currentTrackIndex === -1) {
    loadTrack(0);
    playTrack();
    return;
  }
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});

// Next/Prev
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Shuffle
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? '#ffffff' : '';
  shuffleBtn.style.opacity = isShuffle ? '1' : '';
});

// Repeat
repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? '#ffffff' : '';
  repeatBtn.style.opacity = isRepeat ? '1' : '';
});

// Progress update
audioPlayer.addEventListener('timeupdate', () => {
  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }
});

audioPlayer.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
  if (isRepeat) {
    audioPlayer.currentTime = 0;
    playTrack();
  } else {
    nextTrack();
  }
});

// Progress click
progressWrapper.addEventListener('click', (e) => {
  const rect = progressWrapper.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  if (audioPlayer.duration) {
    audioPlayer.currentTime = percent * audioPlayer.duration;
  }
});

// Volume
volumeSlider.addEventListener('input', (e) => {
  audioPlayer.volume = e.target.value / 100;
  updateVolumeIcon(e.target.value);
});

volumeBtn.addEventListener('click', () => {
  if (audioPlayer.volume > 0) {
    audioPlayer.volume = 0;
    volumeSlider.value = 0;
    updateVolumeIcon(0);
  } else {
    audioPlayer.volume = 0.8;
    volumeSlider.value = 80;
    updateVolumeIcon(80);
  }
});

function updateVolumeIcon(value) {
  if (value == 0) {
    volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
  } else if (value < 50) {
    volumeIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
  } else {
    volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  }
}

// Search
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  filterAndRender(query, currentFilter);
});

// Filter buttons
document.querySelectorAll('.track-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.track-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    const query = searchInput.value.toLowerCase();
    filterAndRender(query, currentFilter);
  });
});

function filterAndRender(query, filter) {
  filteredTracks = tracks.filter(track => {
    const matchesQuery = !query || track.name.toLowerCase().includes(query);
    const matchesFilter = filter === 'all' || track.format === filter;
    return matchesQuery && matchesFilter;
  });
  renderTrackList(filteredTracks);
}

// Set initial volume
audioPlayer.volume = 0.8;

// ============================================
// Scroll Reveal Animation
// ============================================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// Keyboard Controls
// ============================================
document.addEventListener('keydown', (e) => {
  // Ignore if typing in search
  if (document.activeElement === searchInput) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      if (currentTrackIndex === -1) {
        loadTrack(0);
        playTrack();
      } else if (isPlaying) {
        pauseTrack();
      } else {
        playTrack();
      }
      break;
    case 'ArrowRight':
      if (audioPlayer.duration) {
        audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 5, audioPlayer.duration);
      }
      break;
    case 'ArrowLeft':
      audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 5, 0);
      break;
    case 'ArrowUp':
      e.preventDefault();
      audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
      volumeSlider.value = audioPlayer.volume * 100;
      updateVolumeIcon(volumeSlider.value);
      break;
    case 'ArrowDown':
      e.preventDefault();
      audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
      volumeSlider.value = audioPlayer.volume * 100;
      updateVolumeIcon(volumeSlider.value);
      break;
    case 'KeyN':
      nextTrack();
      break;
    case 'KeyP':
      prevTrack();
      break;
  }
});

// ============================================
// Visitor Counter
// ============================================
function animateCounter(element, target) {
  let current = 0;
  const increment = Math.max(1, Math.floor(target / 60));
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current.toLocaleString();
  }, 20);
}

async function updateVisitorCount() {
  const counterEl = document.getElementById('visitorCount');
  if (!counterEl) return;

  const hasVisited = sessionStorage.getItem('djakash_visited');

  try {
    if (!hasVisited) {
      // New visit - increment counter
      const res = await fetch('https://api.counterapi.dev/v1/djakash-official-website/visits/up');
      const data = await res.json();
      sessionStorage.setItem('djakash_visited', 'true');
      localStorage.setItem('djakash_visitor_count', data.count);
      animateCounter(counterEl, data.count);
    } else {
      // Returning visit in same session - just get current count
      const res = await fetch('https://api.counterapi.dev/v1/djakash-official-website/visits');
      const data = await res.json();
      animateCounter(counterEl, data.count);
    }
  } catch (err) {
    // Fallback to localStorage
    let count = parseInt(localStorage.getItem('djakash_visitor_count') || '0');
    if (!hasVisited) {
      count++;
      localStorage.setItem('djakash_visitor_count', count.toString());
      sessionStorage.setItem('djakash_visited', 'true');
    }
    animateCounter(counterEl, count || 1);
  }
}

// ============================================
// Initialize
// ============================================
initMarquee();
initVisualizer();
renderTrackList(tracks);
updateVisitorCount();
