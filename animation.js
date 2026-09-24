// ==========================================
// 1. FALLING LEAVES CANVAS (BARGLAR YOG'ISHI)
// ==========================================
const canvas = document.getElementById('leafCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let leaves = [];

  // User provided leaf image URLs
  const leafUrls = [
    'https://png.pngtree.com/png-vector/20251030/ourmid/pngtree-large-green-tobacco-leaf-with-prominent-veins-and-texture-png-image_17849118.webp',
    'https://png.pngtree.com/png-clipart/20240308/original/pngtree-tobacco-leaf-illustration-on-isolated-background-png-image_14536432.png'
  ];

  const leafImages = [];
  let imagesLoadedCount = 0;

  leafUrls.forEach((url) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      imagesLoadedCount++;
    };
    img.onerror = () => {
      // Handled gracefully by procedural fallback
    };
    leafImages.push(img);
  });

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initLeaves();
  }

  function initLeaves() {
    leaves = [];
    const numLeaves = Math.min(28, Math.max(14, Math.floor(width / 50)));

    for (let i = 0; i < numLeaves; i++) {
      leaves.push(createLeaf(true));
    }
  }

  function createLeaf(randomY = false) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -60 - Math.random() * 50,
      size: Math.random() * 22 + 26, // 26px to 48px
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1),
      flip: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.03 + 0.015,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.35 + 0.55,
      imgIndex: Math.floor(Math.random() * leafImages.length)
    };
  }

  // Procedural realistic leaf fallback in case image isn't loaded yet
  function drawProceduralLeaf(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.bezierCurveTo(size / 2, -size / 4, size / 2, size / 4, 0, size / 2);
    ctx.bezierCurveTo(-size / 2, size / 4, -size / 2, -size / 4, 0, -size / 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();

    // Central vein
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(0, size / 2);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function renderLeaves() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];

      // Update position with organic wind drift
      leaf.y += leaf.speedY;
      leaf.x += leaf.speedX + Math.sin(leaf.swayOffset) * 0.9;
      leaf.angle += leaf.angularSpeed;
      leaf.flip += leaf.flipSpeed;
      leaf.swayOffset += leaf.swaySpeed;

      // Draw Leaf
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.angle);
      ctx.scale(Math.cos(leaf.flip), 1); // 3D tumbling effect
      ctx.globalAlpha = leaf.opacity;

      const img = leafImages[leaf.imgIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, -leaf.size / 2, -leaf.size / 2, leaf.size, leaf.size);
      } else {
        drawProceduralLeaf(ctx, leaf.size);
      }

      ctx.restore();

      // Reset when leaf exits bottom or side of screen
      if (leaf.y > height + 60 || leaf.x < -60 || leaf.x > width + 60) {
        leaves[i] = createLeaf(false);
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(renderLeaves);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  renderLeaves();
}

// ==========================================
// 2. AUDIO PLAYER (videos/eco.mp3)
// ==========================================
const audioBtn = document.getElementById('audioToggleBtn');
let ecoAudio = document.getElementById('ecoAudio');

if (!ecoAudio) {
  ecoAudio = new Audio('videos/eco.mp3');
  ecoAudio.id = 'ecoAudio';
  ecoAudio.loop = true;
  document.body.appendChild(ecoAudio);

  // Fallback if not inside videos folder
  ecoAudio.addEventListener('error', () => {
    if (!ecoAudio.src.endsWith('eco.mp3')) {
      ecoAudio.src = 'eco.mp3';
    }
  });
}

if (audioBtn) {
  audioBtn.addEventListener('click', () => {
    if (ecoAudio.paused) {
      ecoAudio.play().then(() => {
        audioBtn.classList.add('playing');
        const textSpan = audioBtn.querySelector('.audio-text');
        if (textSpan) textSpan.textContent = '🔊 Ovoz: Yoqiq';
      }).catch(err => {
        console.warn('Audio faylini ijro etishda xatolik:', err);
        // Try fallback to eco.mp3 directly
        ecoAudio.src = 'eco.mp3';
        ecoAudio.play().then(() => {
          audioBtn.classList.add('playing');
          const textSpan = audioBtn.querySelector('.audio-text');
          if (textSpan) textSpan.textContent = '🔊 Ovoz: Yoqiq';
        }).catch(() => {
          alert('Audio fayli topilmadi. "videos/eco.mp3" fayli mavjudligini tekshiring!');
        });
      });
    } else {
      ecoAudio.pause();
      audioBtn.classList.remove('playing');
      const textSpan = audioBtn.querySelector('.audio-text');
      if (textSpan) textSpan.textContent = '🎵 Ovozni Yoqish';
    }
  });
}

// ==========================================
// 3. LANDING PAGE START BUTTON
// ==========================================
const startBtn = document.getElementById('startBtn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    window.location.href = 'page.html';
  });
}

// ==========================================
// 4. MOBILE MENU & SIDEBAR TOGGLE
// ==========================================
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

if (menuBtn && sidebar) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 800 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

// ==========================================
// 5. SIDEBAR NAVIGATION & SCROLLSPY
// ==========================================
const sideLinks = document.querySelectorAll('.side-nav-btn');
const topicCards = document.querySelectorAll('.topic-card');

sideLinks.forEach(link => {
  link.addEventListener('click', () => {
    const targetId = link.dataset.target;
    const targetEl = document.getElementById(targetId);

    sideLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    if (sidebar && window.innerWidth <= 800) {
      sidebar.classList.remove('open');
    }
  });
});

if (topicCards.length > 0 && sideLinks.length > 0) {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        sideLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.target === activeId);
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: "-10% 0px -40% 0px"
  });

  topicCards.forEach(card => scrollObserver.observe(card));
}

// ==========================================
// 6. MODALS MANAGEMENT
// ==========================================
const modalOpenBtns = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');

modalOpenBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.dataset.modal;
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      modalEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

modals.forEach(modal => {
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modals.forEach(modal => modal.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

// ==========================================
// 7. VIDEO ERROR FALLBACK HANDLING
// ==========================================
document.querySelectorAll('video').forEach(vid => {
  vid.addEventListener('error', () => {
    vid.style.display = 'none';
  });
});