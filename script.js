/**
 * Omnitrix Command Center — Ben 10 Intergalactic Universe Hub
 * Pure Vanilla JavaScript implementation:
 *  - Interactive Starfield Canvas
 *  - Synthesized Web Audio API Omnitrix SFX
 *  - 3D Interactive Omnitrix Dial Simulator & Transformation Countdown
 *  - Codon Stream Alien Database with real-time filtering & search
 *  - Plumber Dossier Archives (Allies vs Villains)
 *  - Interactive Galactic Star Map (Planet Telemetry)
 *  - Playable Tactical Battle Simulator (Game State Machine)
 *  - Omnitrix Themes: Ben 10 (Green), Albedo (Red), Ben 23 (Blue), Scanner (Gold), Azmuth Lab (White)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STARFIELD CANVAS ANIMATION
     ========================================================================== */
  const starCanvas = document.getElementById('starfield');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 140;

  function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.35 + 0.08,
      twinkle: Math.random() * 0.03
    });
  }

  function renderStarfield() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    
    // Read current theme neon color
    const style = getComputedStyle(document.documentElement);
    const starGlowColor = style.getPropertyValue('--neon-glow').trim() || '#00ff41';

    for (let s of stars) {
      s.y += s.speed;
      s.alpha += s.twinkle;
      if (s.alpha > 1 || s.alpha < 0.2) s.twinkle = -s.twinkle;
      if (s.y > starCanvas.height) {
        s.y = 0;
        s.x = Math.random() * starCanvas.width;
      }

      starCtx.beginPath();
      starCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha)})`;
      starCtx.shadowBlur = s.radius > 1.2 ? 6 : 0;
      starCtx.shadowColor = starGlowColor;
      starCtx.fill();
    }
    requestAnimationFrame(renderStarfield);
  }
  renderStarfield();

  /* ==========================================================================
     2. SYNTHESIZED WEB AUDIO API (OMNITRIX SOUND FX)
     ========================================================================== */
  let audioCtx = null;
  let isSoundMuted = false;

  function getAudioContext() {
    if (isSoundMuted) return null;
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Dial rotation tick
  function playDialTick(freq = 720) {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch(e) {}
  }

  // Slam Transformation Power Surge
  function playTransformationSFX() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High harmonic surge
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.18);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.55);

      // Deep Sub-Bass Impact
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(100, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(32, now + 0.58);

      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.58);
    } catch(e) {}
  }

  // Timeout alert beep (Rapid double beep)
  function playTimeoutWarning() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [0, 0.12].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now + offset);
        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    } catch(e) {}
  }

  // Combat Attack & Laser SFX
  function playCombatHitSFX() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch(e) {}
  }

  // Sound Toggle Button
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  sfxToggleBtn.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted;
    sfxToggleBtn.querySelector('.sound-icon').textContent = isSoundMuted ? '🔇' : '🔊';
    sfxToggleBtn.querySelector('.btn-text').textContent = isSoundMuted ? 'MUTED' : 'SFX';
    showToast(isSoundMuted ? 'Omnitrix Audio Synthesizer Muted' : 'Omnitrix Audio Synthesizer Active', isSoundMuted ? '🔇' : '🔊');
  });

  /* ==========================================================================
     3. THEME MODE SELECTOR (Omnitrix Green, Albedo Red, Ben 23 Blue, etc.)
     ========================================================================== */
  const htmlRoot = document.documentElement;
  const modeBtn = document.getElementById('mode-selector-btn');
  const modeMenu = document.getElementById('mode-menu');
  const currentModeLabel = document.getElementById('current-mode-label');
  const modeOptions = document.querySelectorAll('.mode-option');

  const THEME_STORAGE_KEY = 'omnitrix_active_theme';

  function applyTheme(themeKey, label) {
    htmlRoot.setAttribute('data-theme', themeKey);
    localStorage.setItem(THEME_STORAGE_KEY, themeKey);
    currentModeLabel.textContent = label;

    modeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.mode === themeKey);
    });

    playDialTick(900);
    showToast(`Omnitrix Recalibrated: ${label}`, '⚡');
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'omnitrix';
  const defaultOption = Array.from(modeOptions).find(o => o.dataset.mode === savedTheme) || modeOptions[0];
  applyTheme(savedTheme, defaultOption.textContent.trim());

  modeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = modeMenu.classList.toggle('show');
    modeBtn.setAttribute('aria-expanded', isOpen);
  });

  modeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const mode = option.dataset.mode;
      const text = option.textContent.trim();
      applyTheme(mode, text);
      modeMenu.classList.remove('show');
      modeBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!modeMenu.contains(e.target) && !modeBtn.contains(e.target)) {
      modeMenu.classList.remove('show');
      modeBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  mobileMenuBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  /* ==========================================================================
     4. THE CODON DATASET (12 ICONIC ALIENS)
     ========================================================================== */
  const ALIENS_DB = [
    {
      id: 'heatblast',
      name: 'Heatblast',
      species: 'Pyronite',
      homePlanet: 'Pyros',
      category: 'original10',
      emoji: '🔥',
      class: 'Pyrokinesis & Flight',
      quote: "Time to turn up the heat!",
      powers: "Projects intense superheated magma, plasma fireballs, terraforms rock into molten lava, and achieves thermal flight.",
      weaknesses: "Vulnerable to sudden submersion in cold water and high-yield cryogenic attacks.",
      stats: { power: 95, speed: 82, armor: 88, energy: 96 }
    },
    {
      id: 'fourarms',
      name: 'Four Arms',
      species: 'Tetramand',
      homePlanet: 'Khoros',
      category: 'original10',
      emoji: '🥊',
      class: 'Brute Force & Combat',
      quote: "You want some of this?!",
      powers: "Immense physical strength capable of lifting dozens of tons, quadruple-fist sonic claps, and high-density armored skin.",
      weaknesses: "Heavy mass limits speed in narrow corridors; vulnerable to neuro-toxins.",
      stats: { power: 98, speed: 68, armor: 96, energy: 50 }
    },
    {
      id: 'xlr8',
      name: 'XLR8',
      species: 'Kineceleran',
      homePlanet: 'Kinet',
      category: 'speed',
      emoji: '⚡',
      class: 'Hyper-Velocity Speedster',
      quote: "Too fast for you to see!",
      powers: "Accelerates over 500 mph in milliseconds, runs across water and up vertical surfaces, and generates deadly friction tornadoes.",
      weaknesses: "Lack of heavy armor makes blunt kinetic force dangerous; frictionless ice impairs footing.",
      stats: { power: 74, speed: 100, armor: 62, energy: 80 }
    },
    {
      id: 'diamondhead',
      name: 'Diamondhead',
      species: 'Petrosapien',
      homePlanet: 'Petropia',
      category: 'heavy',
      emoji: '💎',
      class: 'Taydenite Construct & Defense',
      quote: "Time for a sharp lesson!",
      powers: "Indestructible organic crystal body, projects diamond projectile shards, constructs razor barricades, and reflects lasers.",
      weaknesses: "Susceptible to specialized high-frequency sonic vibrations that can fracture crystal lattice.",
      stats: { power: 90, speed: 70, armor: 98, energy: 85 }
    },
    {
      id: 'upgrade',
      name: 'Upgrade',
      species: 'Galvanic Mechamorph',
      homePlanet: 'Galvan B',
      category: 'original10',
      emoji: '💻',
      class: 'Techno-Integration & Beams',
      quote: "Upgraded and ready for action!",
      powers: "Merges with any electronic or mechanical hardware, boosting capability by 1000x; projects optical plasma lasers.",
      weaknesses: "Vulnerable to high-voltage electromagnetic pulses (EMP) and acid that dissolves nanite circuits.",
      stats: { power: 85, speed: 80, armor: 84, energy: 94 }
    },
    {
      id: 'ripjaws',
      name: 'Ripjaws',
      species: 'Piscciss Volann',
      homePlanet: 'Piscciss',
      category: 'original10',
      emoji: '🦈',
      class: 'Deep-Ocean Aquatic Hunter',
      quote: "Let's see how well you swim!",
      powers: "Tremendous bite force capable of snapping steel submarines, underwater high-speed fin propulsion, and luminescent lure.",
      weaknesses: "Severe dehydration on dry land without constant moisture.",
      stats: { power: 88, speed: 86, armor: 80, energy: 60 }
    },
    {
      id: 'ghostfreak',
      name: 'Ghostfreak',
      species: 'Ectonurite',
      homePlanet: 'Anur Transyl',
      category: 'speed',
      emoji: '👻',
      class: 'Phasing & Possession',
      quote: "You can't strike what isn't there.",
      powers: "Complete phase intangibility, flight, invisibility, telekinesis, and body possession.",
      weaknesses: "Direct concentrated solar radiation burns Ectonurite protoplasm when outer skin is shed.",
      stats: { power: 86, speed: 85, armor: 92, energy: 90 }
    },
    {
      id: 'cannonbolt',
      name: 'Cannonbolt',
      species: 'Arburian Pelarota',
      homePlanet: 'Arburia',
      category: 'heavy',
      emoji: '🛡️',
      class: 'Kinetic Shell Ricochet',
      quote: "Roll out and wreck 'em!",
      powers: "Curls into an invulnerable armored sphere, bounces at supersonic speeds, and pulverizes enemy ranks with kinetic mass.",
      weaknesses: "Top-heavy when standing on two feet; awkward turning radius in ball form.",
      stats: { power: 92, speed: 89, armor: 99, energy: 55 }
    },
    {
      id: 'swampfire',
      name: 'Swampfire',
      species: 'Methanosian',
      homePlanet: 'Methanos',
      category: 'original10',
      emoji: '🌿',
      class: 'Chlorokinesis & Methane Fire',
      quote: "Fire and flora!",
      powers: "Shoots intense methane flame streams, controls alien plant vines, and possesses instantaneous biological limb regeneration.",
      weaknesses: "Pungent odor makes stealth impossible; extreme frost temporarily halts plant growth.",
      stats: { power: 92, speed: 76, armor: 90, energy: 92 }
    },
    {
      id: 'bigchill',
      name: 'Big Chill',
      species: 'Necrofriggian',
      homePlanet: 'Kylmyys',
      category: 'speed',
      emoji: '❄️',
      class: 'Cryokinesis & Phasing',
      quote: "Freeze out!",
      powers: "Phases through solid matter while freezing it to absolute zero, spews sub-zero cryogenic frost, and glides silently.",
      weaknesses: "Specialized heat barriers; phase-disruptor force fields.",
      stats: { power: 88, speed: 90, armor: 85, energy: 92 }
    },
    {
      id: 'humungousaur',
      name: 'Humungousaur',
      species: 'Vaxasaurian',
      homePlanet: 'Terradino',
      category: 'heavy',
      emoji: '🦖',
      class: 'Prehistoric Brute Might',
      quote: "Humungousaur smash!",
      powers: "Enormous natural strength, thick dinosaur carapace, and can amplify size up to 60 feet tall with spike plates.",
      weaknesses: "Slow acceleration against ultra-fast agile foes; vulnerable to electricity.",
      stats: { power: 99, speed: 58, armor: 97, energy: 45 }
    },
    {
      id: 'alienx',
      name: 'Alien X',
      species: 'Celestialsapien',
      homePlanet: 'Forge of Creation',
      category: 'cosmic',
      emoji: '🌌',
      class: 'Omnipotent Reality Manipulation',
      quote: "Reality itself bends to our unanimous will.",
      powers: "Total manipulation of time, space, and reality on a universal scale; immune to physical destruction.",
      weaknesses: "Internal council deadlock between personalities Serena (Compassion) and Bellicus (Rage) can cause paralysis.",
      stats: { power: 100, speed: 100, armor: 100, energy: 100 }
    }
  ];

  /* ==========================================================================
     5. OMNITRIX SIMULATOR LOGIC (HERO SECTION)
     ========================================================================== */
  let currentAlienIndex = 0;
  let dialAngle = 0;
  let isTransforming = false;
  let timeoutTimer = null;
  let countdownSeconds = 15;

  const bezel = document.getElementById('omnitrix-bezel');
  const core = document.getElementById('omnitrix-core');
  const holoSilh = document.getElementById('hologram-silhouette');
  const holoName = document.getElementById('holo-alien-name');
  const holoSpecies = document.getElementById('holo-species-label');
  const holoClass = document.getElementById('holo-class-tag');
  const holoQuote = document.getElementById('holo-quote');
  const holoPower = document.getElementById('holo-power');
  const holoSpeed = document.getElementById('holo-speed');
  const holoDurability = document.getElementById('holo-durability');
  const slamBtn = document.getElementById('slam-omnitrix-btn');
  const nextAlienBtn = document.getElementById('cycle-next-alien-btn');
  const dialPrev = document.getElementById('dial-prev');
  const dialNext = document.getElementById('dial-next');
  const flashOverlay = document.getElementById('flash-overlay');
  const timeoutBadge = document.getElementById('timeout-timer');
  const timeoutText = document.getElementById('timeout-timer-text');

  function updateHologramDisplay() {
    const alien = ALIENS_DB[currentAlienIndex];
    holoSilh.textContent = alien.emoji;
    holoName.textContent = alien.name.toUpperCase();
    holoSpecies.textContent = alien.species;
    holoClass.textContent = `Class: ${alien.class}`;
    holoQuote.textContent = `“${alien.quote}”`;
    holoPower.textContent = `${alien.stats.power}%`;
    holoSpeed.textContent = `${alien.stats.speed}%`;
    holoDurability.textContent = `${alien.stats.armor}%`;

    bezel.style.transform = `rotate(${dialAngle}deg)`;
  }
  updateHologramDisplay();

  function cycleAlien(direction = 1) {
    if (isTransforming) return;
    currentAlienIndex = (currentAlienIndex + direction + ALIENS_DB.length) % ALIENS_DB.length;
    dialAngle += direction * 30;
    playDialTick(680 + (currentAlienIndex * 25));
    updateHologramDisplay();
  }

  dialPrev.addEventListener('click', () => cycleAlien(-1));
  dialNext.addEventListener('click', () => cycleAlien(1));
  nextAlienBtn.addEventListener('click', () => cycleAlien(1));

  // Slam Transformation Trigger
  function executeTransformation() {
    if (isTransforming) return;
    isTransforming = true;

    const alien = ALIENS_DB[currentAlienIndex];

    // Sound FX
    playTransformationSFX();

    // Physical Slam Animation on Core
    core.classList.add('slammed');
    setTimeout(() => core.classList.remove('slammed'), 350);

    // Screen Flash Overlay
    flashOverlay.classList.add('active');
    setTimeout(() => flashOverlay.classList.remove('active'), 320);

    // Toast Notification
    showToast(`TRANSFORMED INTO ${alien.name.toUpperCase()}! "${alien.quote}"`, alien.emoji);

    // Initiate Timeout Countdown
    if (timeoutTimer) clearInterval(timeoutTimer);
    countdownSeconds = 15;
    timeoutBadge.classList.add('active');
    timeoutText.textContent = `OMNITRIX TIMEOUT IN: ${countdownSeconds}s`;

    timeoutTimer = setInterval(() => {
      countdownSeconds--;
      if (countdownSeconds <= 4 && countdownSeconds > 0) {
        playTimeoutWarning();
      }
      if (countdownSeconds <= 0) {
        clearInterval(timeoutTimer);
        timeoutBadge.classList.remove('active');
        isTransforming = false;
        playTimeoutWarning();
        showToast('Omnitrix Reverting to Ben Tennyson (Recharge Mode)', '⏱️');
      } else {
        timeoutText.textContent = `OMNITRIX TIMEOUT IN: ${countdownSeconds}s`;
      }
    }, 1000);
  }

  core.addEventListener('click', executeTransformation);
  slamBtn.addEventListener('click', executeTransformation);

  /* ==========================================================================
     6. CODON STREAM ALIEN DATABASE (CARDS, FILTER, SEARCH)
     ========================================================================== */
  const alienGrid = document.getElementById('alien-grid');
  const filterChips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('alien-search-input');

  function renderAlienCards(list) {
    alienGrid.innerHTML = '';
    if (list.length === 0) {
      alienGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          No alien species found in current sector telemetry.
        </div>
      `;
      return;
    }

    list.forEach(alien => {
      const card = document.createElement('article');
      card.className = 'alien-card';
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="alien-card-top">
          <div class="alien-avatar-box">${alien.emoji}</div>
          <div class="alien-info">
            <h3 class="alien-name">${alien.name}</h3>
            <span class="alien-species">${alien.species}</span>
            <span class="alien-planet">Origin: ${alien.homePlanet}</span>
          </div>
        </div>

        <p class="alien-powers">${alien.powers}</p>

        <div class="alien-stat-meters">
          <div class="stat-bar-row">
            <span class="stat-bar-label">Power</span>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width: ${alien.stats.power}%;"></div>
            </div>
          </div>
          <div class="stat-bar-row">
            <span class="stat-bar-label">Speed</span>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width: ${alien.stats.speed}%;"></div>
            </div>
          </div>
          <div class="stat-bar-row">
            <span class="stat-bar-label">Armor</span>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width: ${alien.stats.armor}%;"></div>
            </div>
          </div>
        </div>

        <div class="alien-actions">
          <button class="btn btn-primary alien-btn calibrate-btn" data-id="${alien.id}">
            Select Dial
          </button>
          <button class="btn btn-secondary alien-btn inspect-btn" data-id="${alien.id}">
            Dossier
          </button>
        </div>
      `;

      // Select for Dial
      card.querySelector('.calibrate-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = ALIENS_DB.findIndex(a => a.id === alien.id);
        if (idx !== -1) {
          currentAlienIndex = idx;
          updateHologramDisplay();
          playDialTick(880);
          showToast(`Omnitrix Dial calibrated to ${alien.name}!`, alien.emoji);
          // Smooth scroll up to simulator
          document.getElementById('omnitrix-simulator').scrollIntoView({ behavior: 'smooth' });
        }
      });

      // Open Modal on Card Click
      card.addEventListener('click', () => openAlienModal(alien));
      card.querySelector('.inspect-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openAlienModal(alien);
      });

      alienGrid.appendChild(card);
    });
  }

  renderAlienCards(ALIENS_DB);

  // Filter Chips
  let activeFilter = 'all';
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  // Search Input
  searchInput.addEventListener('input', applyFilters);

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = ALIENS_DB.filter(a => {
      const matchCategory = (activeFilter === 'all') || (a.category === activeFilter);
      const matchQuery = !query || 
        a.name.toLowerCase().includes(query) || 
        a.species.toLowerCase().includes(query) ||
        a.homePlanet.toLowerCase().includes(query) ||
        a.powers.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
    renderAlienCards(filtered);
  }

  /* ==========================================================================
     7. MODAL DOSSIER FOR ALIENS
     ========================================================================== */
  const modalBackdrop = document.getElementById('alien-modal-backdrop');
  const modalBody = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close');

  function openAlienModal(alien) {
    playDialTick(950);
    modalBody.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-size: 3.5rem; width: 80px; height: 80px; display:flex; align-items:center; justify-content:center; background: var(--dial-metallic); border-radius: 18px; border: 2px solid var(--border-bright);">
          ${alien.emoji}
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--neon-glow); font-family: 'Chakra Petch'; text-transform: uppercase;">Classified Omnitrix File</span>
          <h2 style="font-family: 'Chakra Petch'; font-size: 2.2rem; font-weight: 800; line-height: 1.1;">${alien.name}</h2>
          <span style="font-size: 0.88rem; color: var(--text-muted); font-family: 'Share Tech Mono';">Species: ${alien.species} • Planet: ${alien.homePlanet}</span>
        </div>
      </div>

      <p style="font-style: italic; color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 1.05rem;">
        “${alien.quote}”
      </p>

      <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--border-subtle); margin-bottom: 1.25rem;">
        <h4 style="font-family: 'Chakra Petch'; color: var(--neon-glow); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.4rem;">Combat Affinities</h4>
        <p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.6;">${alien.powers}</p>
      </div>

      <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
        <h4 style="font-family: 'Chakra Petch'; color: #f87171; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.4rem;">Known Tactical Vulnerabilities</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${alien.weaknesses}</p>
      </div>

      <button class="btn btn-primary" id="modal-transform-btn" style="width: 100%;">
        Load Into Omnitrix Active Dial ⚡
      </button>
    `;

    document.getElementById('modal-transform-btn').addEventListener('click', () => {
      const idx = ALIENS_DB.findIndex(a => a.id === alien.id);
      if (idx !== -1) {
        currentAlienIndex = idx;
        updateHologramDisplay();
        closeModal();
        document.getElementById('omnitrix-simulator').scrollIntoView({ behavior: 'smooth' });
        setTimeout(executeTransformation, 600);
      }
    });

    modalBackdrop.classList.add('open');
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  /* ==========================================================================
     8. PLUMBER & ROGUES DOSSIER (ALLIES VS VILLAINS)
     ========================================================================== */
  const ALLIES_DATA = [
    {
      name: 'Ben Tennyson',
      role: 'Wielder of the Omnitrix',
      emoji: '⚡',
      bio: "Saved the universe 50+ times. Master of 10,000+ alien species. Lead operative of Plumber Earth Branch.",
      tags: ['Level 10 Clearance', 'Bellwood Earth', 'Legendary']
    },
    {
      name: 'Gwen Tennyson',
      role: 'Anodite Sorceress',
      emoji: '🔮',
      bio: "Harnesses raw Anodite mana to construct force-shields, energy stepping-stones, and mystical incantations.",
      tags: ['Mana Mastery', 'Friedkin Scholar', 'Plumber Agent']
    },
    {
      name: 'Grandpa Max',
      role: 'Magister of the Plumbers',
      emoji: '🚐',
      bio: "Former astronaut and decorated Plumber veteran. Commander of the high-tech weaponry aboard the Rust Bucket.",
      tags: ['Magister Rank', 'Rust Bucket Cmd', 'Tactician']
    },
    {
      name: 'Kevin Levin',
      role: 'Osmosian Specialist',
      emoji: '🏎️',
      bio: "Absorbs solid matter (Taydenite, steel, stone) into living armor. Expert alien tech mechanic and pilot.",
      tags: ['Matter Absorption', 'Plumber Ally', 'Muscle']
    },
    {
      name: 'Rook Blonko',
      role: 'Plumber Cadet / Partner',
      emoji: '🛡️',
      bio: "Revonnahgander martial artist. Master of the Proto-Tool multi-purpose modular weapon and Proto-TRUK.",
      tags: ['Proto-Tool Master', 'Revonnah', 'Honor Graduate']
    },
    {
      name: 'Azmuth',
      role: 'First Thinker of Galvan',
      emoji: '🧠',
      bio: "Greatest intellect in 5 galaxies. Creator of the Omnitrix and the Galvanic Mechamorphs.",
      tags: ['Omnitrix Creator', 'Level 20 Intellect', 'Galvan Prime']
    }
  ];

  const VILLAINS_DATA = [
    {
      name: 'Vilgax',
      role: 'Conqueror of 10 Worlds',
      emoji: '🐙',
      bio: "Intergalactic warlord with cybernetically augmented Chimera Sui Generis physiology. Obsessed with obtaining the Omnitrix.",
      tags: ['Threat Level: Omega', 'Warlord', 'Bio-Augmented']
    },
    {
      name: 'Albedo',
      role: 'Galvan Rogue Scientist',
      emoji: '🔴',
      bio: "Former assistant to Azmuth who created the negative-frequency red Ultimatrix, trapping himself in Ben's human form.",
      tags: ['Red Ultimatrix', 'Negative DNA', 'Rogue Galvan']
    },
    {
      name: 'Dr. Aloysius Animo',
      role: 'Mad Geneticist',
      emoji: '🔬',
      bio: "Human bio-scientist who utilizes the Transmodulator helmet to mutate terrestrial animals into colossal prehistoric beasts.",
      tags: ['Transmodulator', 'Mutant King', 'Bio-Hazard']
    },
    {
      name: 'Charmcaster',
      role: 'Ledgerdomain Sorceress',
      emoji: '🪄',
      bio: "Extremely dangerous spellcaster commanding animated stone rock soldiers and lethal dark arcane arts.",
      tags: ['Ledgerdomain', 'Arcane Arts', 'High Threat']
    },
    {
      name: 'Highbreed Commander',
      role: 'Pureblood Xenophobe',
      emoji: '🌱',
      bio: "Genetically engineered conquerors attempting to purge all impure biological life across the Milky Way with DNAlien parasites.",
      tags: ['Extinction Threat', 'Pureblood', 'Bio-Warfare']
    }
  ];

  const dossierGrid = document.getElementById('dossier-grid');
  const tabAllies = document.getElementById('tab-allies');
  const tabVillains = document.getElementById('tab-villains');

  function renderDossier(data) {
    dossierGrid.innerHTML = '';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'dossier-card';
      card.innerHTML = `
        <div class="dossier-top">
          <div class="dossier-avatar">${item.emoji}</div>
          <div>
            <h3 class="dossier-name">${item.name}</h3>
            <span class="dossier-role">${item.role}</span>
          </div>
        </div>
        <p class="dossier-bio">${item.bio}</p>
        <div class="dossier-meta">
          ${item.tags.map(t => `<span class="dossier-tag">${t}</span>`).join('')}
        </div>
      `;
      dossierGrid.appendChild(card);
    });
  }

  renderDossier(ALLIES_DATA);

  tabAllies.addEventListener('click', () => {
    tabAllies.classList.add('active');
    tabVillains.classList.remove('active');
    playDialTick(600);
    renderDossier(ALLIES_DATA);
  });

  tabVillains.addEventListener('click', () => {
    tabVillains.classList.add('active');
    tabAllies.classList.remove('active');
    playDialTick(500);
    renderDossier(VILLAINS_DATA);
  });

  /* ==========================================================================
     9. GALACTIC STAR MAP (PLANETARY EXPLORER)
     ========================================================================== */
  const PLANETS = [
    {
      name: 'PYROS',
      system: 'Pyros Star System • Sector 44-B',
      overview: 'A superheated planetary star composed of semi-solid volcanic crust and plasma magma seas. Inhabited by Pyronites who harness thermal combustion.',
      species: 'Pyronite (Heatblast)',
      sector: 'Sector 44-B',
      atmosphere: 'Superheated Plasma & Sulfur',
      base: 'Plumber Outpost 91',
      hazard: 'Hazard Level: Extreme (Thermal)',
      colorGradient: 'radial-gradient(circle at 30% 30%, #ff5722 0%, #b71c1c 60%, #000 100%)',
      glowColor: 'rgba(255, 87, 34, 0.6)'
    },
    {
      name: 'KHOROS',
      system: 'Khoros Binary Stars • Sector 12',
      overview: 'A harsh desert arena planet of monolithic stone colosseums and merciless sandstorms. Cultural center of Tetramand warrior clans.',
      species: 'Tetramand (Four Arms)',
      sector: 'Sector 12',
      atmosphere: 'Nitrogen-Dry Oxygen',
      base: 'Gladiator Watchtower',
      hazard: 'Hazard Level: High (Combat Arena)',
      colorGradient: 'radial-gradient(circle at 30% 30%, #e53935 0%, #880e4f 60%, #1a0000 100%)',
      glowColor: 'rgba(229, 57, 53, 0.6)'
    },
    {
      name: 'PETROPIA',
      system: 'Petropia Ring Cluster • Sector 22',
      overview: 'A gleaming crystalline planet made of indestructible Taydenite and resonant organic diamond prisms, revived by the Omnitrix Crystalsapien matrix.',
      species: 'Petrosapien (Diamondhead)',
      sector: 'Sector 22',
      atmosphere: 'Crystalline Vapor',
      base: 'Sanctuary of Sugilite',
      hazard: 'Hazard Level: Moderate',
      colorGradient: 'radial-gradient(circle at 30% 30%, #00e5ff 0%, #007791 60%, #001f29 100%)',
      glowColor: 'rgba(0, 229, 255, 0.6)'
    },
    {
      name: 'GALVAN PRIME',
      system: 'Galvan System • Sector 01',
      overview: 'The intellectual hub of the universe. Metropolis planet of Azmuth and the Galvan civilization. Birthplace of the Omnitrix and artificial moon Galvan B.',
      species: 'Galvan & Mechamorphs',
      sector: 'Sector 01 (Central)',
      atmosphere: 'Nitrogen-Oxygen Pristine',
      base: 'Azmuth High Spire',
      hazard: 'Hazard Level: Low (Sanctuary)',
      colorGradient: 'radial-gradient(circle at 30% 30%, #00ff41 0%, #00796b 60%, #002419 100%)',
      glowColor: 'rgba(0, 255, 65, 0.6)'
    },
    {
      name: 'ANUR TRANSYL',
      system: 'Anur Dark Nebula • Sector 99',
      overview: 'A shadowy gothic celestial body orbiting dead stars. Rich in Corrodium mineral ore which triggers mutations in non-native species.',
      species: 'Ectonurite, Thep Khufan, Loboan',
      sector: 'Sector 99 (Unregulated)',
      atmosphere: 'Corrodium-Laced Vapor',
      base: 'Plumber Warning Beacon',
      hazard: 'Hazard Level: Extreme (Corrodium)',
      colorGradient: 'radial-gradient(circle at 30% 30%, #a855f7 0%, #4c1d95 60%, #0f051d 100%)',
      glowColor: 'rgba(168, 85, 247, 0.6)'
    },
    {
      name: 'EARTH (BELLWOOD)',
      system: 'Sol System • Sector 2814',
      overview: 'Primary defensive redoubt of Ben Tennyson and Plumber Base beneath Mt. Rushmore. Crossroads of covert interstellar traffic in Undertown.',
      species: 'Human & Interstellar Undertown',
      sector: 'Sector 2814',
      atmosphere: 'Nitrogen (78%) & Oxygen (21%)',
      base: 'Mt. Rushmore Plumber HQ',
      hazard: 'Hazard Level: Variable (Alien Activity)',
      colorGradient: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, #1e3a8a 60%, #020617 100%)',
      glowColor: 'rgba(59, 130, 246, 0.6)'
    }
  ];

  const planetSelector = document.getElementById('planet-selector');
  const planetSphere = document.getElementById('planet-sphere');
  const planetHazardBadge = document.getElementById('planet-hazard-badge');
  const planetSystem = document.getElementById('planet-system');
  const planetName = document.getElementById('planet-name');
  const planetOverview = document.getElementById('planet-overview');
  const planetSpecies = document.getElementById('planet-species');
  const planetSector = document.getElementById('planet-sector');
  const planetAtmo = document.getElementById('planet-atmo');
  const planetBase = document.getElementById('planet-base');

  PLANETS.forEach((planet, idx) => {
    const btn = document.createElement('button');
    btn.className = `planet-btn ${idx === 0 ? 'active' : ''}`;
    btn.textContent = planet.name;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.planet-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playDialTick(750 + idx * 30);
      displayPlanet(planet);
    });
    planetSelector.appendChild(btn);
  });

  function displayPlanet(planet) {
    planetSphere.style.background = planet.colorGradient;
    planetSphere.style.boxShadow = `0 0 45px ${planet.glowColor}, inset -15px -15px 30px rgba(0,0,0,0.9)`;
    planetHazardBadge.textContent = planet.hazard;
    planetSystem.textContent = planet.system;
    planetName.textContent = planet.name;
    planetOverview.textContent = planet.overview;
    planetSpecies.textContent = planet.species;
    planetSector.textContent = planet.sector;
    planetAtmo.textContent = planet.atmosphere;
    planetBase.textContent = planet.base;
  }
  displayPlanet(PLANETS[0]);

  /* ==========================================================================
     10. TACTICAL BATTLE LAB (PLAYABLE MINI GAME)
     ========================================================================== */
  const ARENA_HEROES = {
    'Four Arms': {
      emoji: '🥊',
      attack1: 'Heavy Four-Fist Combo (22 DMG)',
      dmg1: 22,
      attack2: 'Sonic Thunderclap (40 DMG)',
      dmg2: 40
    },
    'Heatblast': {
      emoji: '🔥',
      attack1: 'Magma Shard Barrage (20 DMG)',
      dmg1: 20,
      attack2: 'Supernova Firestorm (42 DMG)',
      dmg2: 42
    },
    'XLR8': {
      emoji: '⚡',
      attack1: 'Supersonic Slash (18 DMG)',
      dmg1: 18,
      attack2: 'Vortex Tornado Crash (38 DMG)',
      dmg2: 38
    },
    'Diamondhead': {
      emoji: '💎',
      attack1: 'Taydenite Blade Strike (24 DMG)',
      dmg1: 24,
      attack2: 'Crystal Spike Wave (36 DMG)',
      dmg2: 36
    }
  };

  let playerMaxHp = 100;
  let playerHp = 100;
  let enemyMaxHp = 120;
  let enemyHp = 120;
  let activeHero = 'Four Arms';
  let isPlayerDefending = false;
  let specialCooldown = 0;
  let isGameOver = false;

  const playerHpBar = document.getElementById('player-hp-bar');
  const playerHpText = document.getElementById('player-hp-text');
  const enemyHpBar = document.getElementById('enemy-hp-bar');
  const enemyHpText = document.getElementById('enemy-hp-text');
  const playerFighterName = document.getElementById('player-fighter-name');
  const playerFighterEmoji = document.getElementById('player-fighter-emoji');
  const action1Text = document.getElementById('action-1-text');
  const action2Text = document.getElementById('action-2-text');
  const battleLog = document.getElementById('battle-log');

  const btnAttack = document.getElementById('btn-attack');
  const btnSpecial = document.getElementById('btn-special');
  const btnDefend = document.getElementById('btn-defend');
  const btnResetBattle = document.getElementById('btn-reset-battle');
  const arenaPills = document.querySelectorAll('.arena-alien-pill');

  function updateArenaDisplay() {
    const hero = ARENA_HEROES[activeHero];
    playerFighterName.textContent = activeHero.toUpperCase();
    playerFighterEmoji.textContent = hero.emoji;
    action1Text.textContent = hero.attack1;
    action2Text.textContent = specialCooldown > 0 
      ? `Special Cooling Down (${specialCooldown} Turns)` 
      : hero.attack2;

    playerHpBar.style.width = `${Math.max(0, (playerHp / playerMaxHp) * 100)}%`;
    playerHpText.textContent = `${Math.max(0, playerHp)} / ${playerMaxHp} HP`;

    enemyHpBar.style.width = `${Math.max(0, (enemyHp / enemyMaxHp) * 100)}%`;
    enemyHpText.textContent = `${Math.max(0, enemyHp)} / ${enemyMaxHp} HP`;
  }

  function addLog(msg, type = 'sys') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${msg}`;
    battleLog.appendChild(entry);
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  // Hero Pill Selector
  arenaPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (isGameOver) return;
      arenaPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeHero = pill.dataset.alien;
      playDialTick(820);
      addLog(`Omnitrix shifted form to ${activeHero}!`, 'player');
      updateArenaDisplay();
    });
  });

  // Action 1: Basic Attack
  btnAttack.addEventListener('click', () => {
    if (isGameOver) return;
    const hero = ARENA_HEROES[activeHero];
    const dmg = Math.floor(hero.dmg1 * (0.9 + Math.random() * 0.2));
    enemyHp -= dmg;
    playCombatHitSFX();
    addLog(`${activeHero} executed attack! Dealt ${dmg} damage to Vilgax Drone.`, 'player');
    checkBattleState();
    if (!isGameOver) enemyTurn();
  });

  // Action 2: Special Attack
  btnSpecial.addEventListener('click', () => {
    if (isGameOver) return;
    if (specialCooldown > 0) {
      addLog(`Special ability charging. Wait ${specialCooldown} more turn(s)!`, 'sys');
      return;
    }
    const hero = ARENA_HEROES[activeHero];
    const dmg = Math.floor(hero.dmg2 * (0.9 + Math.random() * 0.2));
    enemyHp -= dmg;
    specialCooldown = 2;
    playTransformationSFX();
    addLog(`💥 CRITICAL! ${activeHero} unleashed special affinity for ${dmg} massive damage!`, 'player');
    checkBattleState();
    if (!isGameOver) enemyTurn();
  });

  // Action 3: Defend
  btnDefend.addEventListener('click', () => {
    if (isGameOver) return;
    isPlayerDefending = true;
    playDialTick(1000);
    addLog(`${activeHero} reinforced tactical armor! Damage will be mitigated by 60%.`, 'player');
    enemyTurn();
  });

  // Enemy Counter-Attack Turn
  function enemyTurn() {
    if (specialCooldown > 0) specialCooldown--;
    updateArenaDisplay();

    setTimeout(() => {
      if (isGameOver) return;
      let rawDmg = Math.floor(15 + Math.random() * 12);
      if (isPlayerDefending) {
        rawDmg = Math.floor(rawDmg * 0.4);
        isPlayerDefending = false;
        addLog(`Vilgax Drone fired heavy laser beam! Shield absorbed shock: took only ${rawDmg} DMG.`, 'enemy');
      } else {
        addLog(`Vilgax Drone unleashed cluster missiles! Took ${rawDmg} DMG!`, 'enemy');
      }
      playerHp -= rawDmg;
      playCombatHitSFX();
      checkBattleState();
      updateArenaDisplay();
    }, 600);
  }

  function checkBattleState() {
    updateArenaDisplay();
    if (enemyHp <= 0) {
      isGameOver = true;
      enemyHp = 0;
      updateArenaDisplay();
      addLog('🏆 VICTORY! Vilgax War Drone destroyed! Omnitrix calibration verified.', 'player');
      showToast('VICTORY! Enemy Threat Neutralized!', '🏆');
    } else if (playerHp <= 0) {
      isGameOver = true;
      playerHp = 0;
      updateArenaDisplay();
      playTimeoutWarning();
      addLog('⚠️ CRITICAL DAMAGE! Omnitrix forced emergency shutdown.', 'enemy');
      showToast('SIMULATION DEFEAT: Omnitrix Recharged Needed', '⚠️');
    }
  }

  // Reset Battle
  btnResetBattle.addEventListener('click', () => {
    playerHp = playerMaxHp;
    enemyHp = enemyMaxHp;
    specialCooldown = 0;
    isGameOver = false;
    isPlayerDefending = false;
    playDialTick(700);
    battleLog.innerHTML = `<div class="log-entry sys">> Simulation reset. Ready for combat.</div>`;
    updateArenaDisplay();
    showToast('Battle Simulation Reset', '↺');
  });

  updateArenaDisplay();

  /* ==========================================================================
     11. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimer = null;

  function showToast(msg, icon = '⚡') {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = msg;
    toastIcon.textContent = icon;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

});
