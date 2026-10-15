/**
 * Candy Ranger: Americký Burger Hrdina vs Jednorožci
 * Kompletní HTML5 Canvas hra s Web Audio syntézou a procedurální grafikou.
 */

// --- ZVUKOVÝ SYNTETIZÁTOR (Web Audio API bez externích souborů) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBurgerShot() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playBurgerHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Bubbly squish noise
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.1);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playColaSpray() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Sizzling carbonated noise
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playMentosBoom() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  playUnicornNeigh() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(950, now + 0.12);
    osc.frequency.linearRampToValueAtTime(700, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.27);
  }

  playPickup() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.13);
    });
  }

  playHurt() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playFanfare() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = now + idx * 0.1;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  startBGM() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    const melody = [
      261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63, 293.66,
      329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 349.23, 329.63,
      261.63, 329.63, 392.00, 523.25, 587.33, 523.25, 440.00, 392.00,
      349.23, 392.00, 440.00, 523.25, 392.00, 329.63, 293.66, 261.63
    ];
    let noteIdx = 0;
    const stepDuration = 240; // ms

    this.bgmInterval = setInterval(() => {
      if (this.muted || !this.bgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = melody[noteIdx % melody.length];
      const bassFreq = freq * 0.5;
      noteIdx++;

      // Lead note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);

      // Bass note
      const bass = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bass.type = 'sine';
      bass.frequency.value = bassFreq;
      bGain.gain.setValueAtTime(0.12, now);
      bGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      bass.connect(bGain);
      bGain.connect(this.ctx.destination);
      bass.start(now);
      bass.stop(now + 0.23);
    }, stepDuration);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

// --- TŘÍDA PRO ČÁSTICE (PARTICLES) ---
class Particle {
  constructor(x, y, vx, vy, color, size, lifetime, shape = 'circle', gravity = 0.1) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = lifetime;
    this.life = lifetime;
    this.shape = shape;
    this.gravity = gravity;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
    return this.life > 0;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    const curSize = Math.max(1, this.size * alpha);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, curSize, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = i * ((Math.PI * 2) / 5) - Math.PI / 2;
        const outerX = this.x + Math.cos(ang) * curSize;
        const outerY = this.y + Math.sin(ang) * curSize;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        const innerAng = ang + Math.PI / 5;
        ctx.lineTo(this.x + Math.cos(innerAng) * (curSize * 0.4), this.y + Math.sin(innerAng) * (curSize * 0.4));
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.shape === 'fizz') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, curSize, 0, Math.PI * 2);
      ctx.fill();
      if (curSize > 2) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - curSize * 0.3, this.y - curSize * 0.3, curSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

// --- TŘÍDA PRO PROJEKTILY (BURGERS & COCA-COLA) ---
class Projectile {
  constructor(x, y, tx, ty, speed, damage, type = 'burger', isSuper = false) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.damage = damage;
    this.isSuper = isSuper;
    this.radius = isSuper ? 24 : 16;

    const dx = tx - x;
    const dy = ty - y;
    const dist = Math.hypot(dx, dy) || 1;
    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.spin = 0;
    this.life = type === 'burger' ? 140 : 50;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.spin += 0.22;
    this.life--;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'burger') {
      ctx.rotate(this.spin);
      const r = this.radius;

      // Golden Bun Top
      ctx.fillStyle = '#e8a953';
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.3, r, r * 0.7, 0, Math.PI, 0);
      ctx.fill();

      // Sesame seeds
      ctx.fillStyle = '#fff8e7';
      [[-r * 0.4, -r * 0.5], [0, -r * 0.7], [r * 0.4, -r * 0.5]].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(1.5, r * 0.1), 0, Math.PI * 2);
        ctx.fill();
      });

      // Lettuce ruffle
      ctx.fillStyle = '#65cf36';
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.1, r * 0.95, r * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tomato & Ketchup
      ctx.fillStyle = '#e62b2b';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.9, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Melted Cheese Corner
      ctx.fillStyle = '#ffcf2d';
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, 0);
      ctx.lineTo(r * 0.8, 0);
      ctx.lineTo(r * 0.3, r * 0.4);
      ctx.closePath();
      ctx.fill();

      // Juicy Patty
      ctx.fillStyle = '#6b321a';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.2, r * 0.9, r * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bun Bottom
      ctx.fillStyle = '#e8a953';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.45, r * 0.85, r * 0.3, 0, 0, Math.PI);
      ctx.fill();

      if (this.isSuper) {
        ctx.strokeStyle = 'rgba(255, 230, 80, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.type === 'cola_stream') {
      // Fizzy dark soda jet with sparkling foam
      ctx.fillStyle = '#3c140d';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff4d6';
      ctx.beginPath();
      ctx.arc(-2, -2, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'cola_can') {
      ctx.rotate(this.spin * 2.5);
      // Red Can
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.roundRect(-8, -14, 16, 28, 4);
      ctx.fill();
      // Wave ribbon
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-7, -2);
      ctx.lineTo(7, 2);
      ctx.stroke();
      // Fizz out of top
      ctx.fillStyle = '#fff4d6';
      ctx.beginPath();
      ctx.arc(0, -16, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// --- TŘÍDA PRO BONUSY (PICKUPS) ---
class Pickup {
  constructor(x, y, itemType) {
    this.x = x;
    this.y = y;
    this.itemType = itemType; // 'fries', 'soda', 'donut', 'golden_burger'
    this.bob = Math.random() * Math.PI * 2;
    this.life = 600;
  }

  update() {
    this.bob += 0.08;
    this.life--;
    return this.life > 0;
  }

  draw(ctx) {
    const bobY = this.y + Math.sin(this.bob) * 5;
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(100, 50, 80, 0.25)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 16, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.itemType === 'fries') {
      // Red box
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.moveTo(this.x - 10, bobY + 10);
      ctx.lineTo(this.x + 10, bobY + 10);
      ctx.lineTo(this.x + 8, bobY - 3);
      ctx.lineTo(this.x - 8, bobY - 3);
      ctx.closePath();
      ctx.fill();
      // French fries
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 3;
      [-5, -2, 1, 4].forEach(ox => {
        ctx.beginPath();
        ctx.moveTo(this.x + ox, bobY - 3);
        ctx.lineTo(this.x + ox, bobY - 14);
        ctx.stroke();
      });
    } else if (this.itemType === 'soda') {
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.roundRect(this.x - 7, bobY - 12, 14, 22, 4);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x - 5, bobY);
      ctx.lineTo(this.x + 5, bobY + 3);
      ctx.stroke();
    } else if (this.itemType === 'donut') {
      ctx.fillStyle = '#e0985c';
      ctx.beginPath();
      ctx.arc(this.x, bobY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff77a9';
      ctx.beginPath();
      ctx.arc(this.x, bobY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fce4ec';
      ctx.beginPath();
      ctx.arc(this.x, bobY, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.itemType === 'golden_burger') {
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(this.x, bobY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffb300';
      ctx.beginPath();
      ctx.arc(this.x, bobY, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// --- TŘÍDA PRO JEDNOROŽCE (UNICORNS) ---
class Unicorn {
  constructor(x, y, type = 'normal', wave = 1) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.isBoss = type === 'boss';
    this.trotCycle = Math.random() * Math.PI * 2;
    this.hitFlash = 0;
    this.fizzSlow = 0;

    if (type === 'normal') {
      this.maxHp = 30 + wave * 6;
      this.speed = 1.6 + Math.random() * 0.4;
      this.radius = 22;
      this.scoreVal = 100;
      this.coat = '#fffbfc';
      this.mane = '#ff8ec7';
    } else if (type === 'speedy') {
      this.maxHp = 22 + wave * 5;
      this.speed = 2.8 + Math.random() * 0.4;
      this.radius = 18;
      this.scoreVal = 160;
      this.coat = '#eff8ff';
      this.mane = '#7ec8ff';
    } else if (type === 'chonky') {
      this.maxHp = 90 + wave * 16;
      this.speed = 1.05;
      this.radius = 32;
      this.scoreVal = 260;
      this.coat = '#fff5f8';
      this.mane = '#c684ff';
    } else if (type === 'boss') {
      this.maxHp = 500 + wave * 95;
      this.speed = 1.25;
      this.radius = 50;
      this.scoreVal = 2000;
      this.coat = '#ffffff';
      this.mane = '#ff6da8';
      this.attackCooldown = 100;
    }

    this.hp = this.maxHp;
  }

  update(px, py) {
    this.trotCycle += 0.22;
    if (this.hitFlash > 0) this.hitFlash--;

    let effSpeed = this.speed;
    if (this.fizzSlow > 0) {
      this.fizzSlow--;
      effSpeed *= 0.45;
    }

    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > 10) {
      this.x += (dx / dist) * effSpeed;
      this.y += (dy / dist) * effSpeed;
    }

    if (this.isBoss) {
      this.attackCooldown--;
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 95;
        return true; // Boss special attack trigger
      }
    }
    return false;
  }

  draw(ctx) {
    const bob = Math.sin(this.trotCycle) * 3.5;
    const cx = this.x;
    const cy = this.y + bob;
    const r = this.radius;

    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(120, 70, 100, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, this.y + r * 0.9, r * 1.1, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    const coatColor = this.hitFlash > 0 ? '#ffb3c9' : this.coat;

    // Body
    ctx.fillStyle = coatColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.05, r * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs trotting
    const legSwing = Math.sin(this.trotCycle) * (r * 0.35);
    ctx.strokeStyle = coatColor;
    ctx.lineWidth = Math.max(3, r * 0.22);
    ctx.lineCap = 'round';

    // Front leg
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.5, cy + r * 0.3);
    ctx.lineTo(cx - r * 0.5 + legSwing, cy + r * 1.0);
    ctx.stroke();

    // Back leg
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.5, cy + r * 0.3);
    ctx.lineTo(cx + r * 0.5 - legSwing, cy + r * 1.0);
    ctx.stroke();

    // Golden hooves
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(cx - r * 0.5 + legSwing, cy + r * 1.0, Math.max(2.5, r * 0.12), 0, Math.PI * 2);
    ctx.arc(cx + r * 0.5 - legSwing, cy + r * 1.0, Math.max(2.5, r * 0.12), 0, Math.PI * 2);
    ctx.fill();

    // Fluffy tail
    const tailWobble = Math.sin(this.trotCycle * 0.8) * 5;
    ctx.fillStyle = this.mane;
    ctx.beginPath();
    ctx.arc(cx + r * 1.1, cy + tailWobble, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Head
    const hx = cx - r * 0.75;
    const hy = cy - r * 0.55;
    ctx.fillStyle = coatColor;
    ctx.beginPath();
    ctx.arc(hx, hy, r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Ear
    ctx.beginPath();
    ctx.moveTo(hx, hy - r * 0.4);
    ctx.lineTo(hx + r * 0.35, hy - r * 0.9);
    ctx.lineTo(hx + r * 0.5, hy - r * 0.35);
    ctx.closePath();
    ctx.fill();

    // Mane along neck
    ctx.fillStyle = this.mane;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx - r * 0.3 + i * r * 0.35, cy - r * 0.65 - i * 2, r * 0.36, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sparkly anime eye
    const eyeX = hx - r * 0.2;
    const eyeY = hy - r * 0.05;
    const eyeR = Math.max(3, r * 0.2);
    ctx.fillStyle = '#26122d';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX - 1, eyeY - 1, eyeR * 0.45, 0, Math.PI * 2);
    ctx.arc(eyeX + 1.2, eyeY + 1.2, eyeR * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheek
    ctx.fillStyle = 'rgba(255, 120, 160, 0.6)';
    ctx.beginPath();
    ctx.arc(hx - r * 0.1, hy + r * 0.25, r * 0.16, 0, Math.PI * 2);
    ctx.fill();

    // Golden Horn
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.3, hy - r * 0.35);
    ctx.lineTo(hx + r * 0.25, hy - r * 0.1);
    ctx.lineTo(hx - r * 0.95, hy - r * 1.25);
    ctx.closePath();
    ctx.fill();

    // Horn tip rainbow sparkle
    const rainbowColors = ['#ff6da8', '#ffd54f', '#64ffda', '#ab47bc'];
    ctx.fillStyle = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    ctx.beginPath();
    ctx.arc(hx - r * 0.95, hy - r * 1.25, Math.max(2.5, r * 0.16), 0, Math.PI * 2);
    ctx.fill();

    // If Chonky: Giant frosted donut saddle!
    if (this.type === 'chonky') {
      ctx.fillStyle = '#e8a953';
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.05, r * 0.65, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6da8';
      ctx.beginPath();
      ctx.ellipse(cx, cy - r * 0.05, r * 0.52, r * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.05, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }

    // If Boss: Royal Candy Crown
    if (this.isBoss) {
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.moveTo(hx - 12, hy - r * 0.6);
      ctx.lineTo(hx - 18, hy - r * 1.1);
      ctx.lineTo(hx - 7, hy - r * 0.8);
      ctx.lineTo(hx, hy - r * 1.2);
      ctx.lineTo(hx + 7, hy - r * 0.8);
      ctx.lineTo(hx + 18, hy - r * 1.1);
      ctx.lineTo(hx + 12, hy - r * 0.6);
      ctx.closePath();
      ctx.fill();
    }

    // Coca-Cola fizz bubbles if soaked
    if (this.fizzSlow > 0) {
      ctx.fillStyle = '#fff4d6';
      for (let i = 0; i < 2; i++) {
        const bx = cx + (Math.random() - 0.5) * r * 1.5;
        const by = cy + (Math.random() - 0.5) * r * 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, Math.random() * 3 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Health Bar
    if (this.hp < this.maxHp || this.isBoss) {
      const barW = r * 2.2;
      const barH = this.isBoss ? 9 : 6;
      const bx = cx - barW / 2;
      const by = cy - r * 1.35;
      ctx.fillStyle = 'rgba(40, 20, 30, 0.7)';
      ctx.beginPath();
      ctx.roundRect(bx - 1, by - 1, barW + 2, barH + 2, 3);
      ctx.fill();

      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = hpPct > 0.5 ? '#76ff03' : (hpPct > 0.25 ? '#ffd600' : '#ff1744');
      ctx.beginPath();
      ctx.roundRect(bx, by, barW * hpPct, barH, 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// --- TŘÍDA PRO HRÁČE: AMERICKÝ RANGER BOB ---
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 4.2;
    this.maxHp = 100;
    this.hp = 100;
    this.soda = 100;
    this.maxSoda = 100;
    this.walkCycle = 0;
    this.aimAngle = 0;
    this.facingRight = true;

    this.tripleBurger = false;
    this.tripleTimer = 0;
    this.speedBoostTimer = 0;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.invulnerableTimer = 0;

    this.burgersThrown = 0;
    this.unicornsFed = 0;
  }

  update(keys, mouseX, mouseY, touchVx = 0, touchVy = 0) {
    let dx = touchVx;
    let dy = touchVy;

    if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

    let effSpeed = this.speed * (this.speedBoostTimer > 0 ? 1.35 : 1.0);
    if (dx !== 0 && dy !== 0) effSpeed *= 0.7071;

    this.x += dx * effSpeed;
    this.y += dy * effSpeed;

    // Boundaries
    this.x = Math.max(35, Math.min(1024 - 35, this.x));
    this.y = Math.max(90, Math.min(640 - 45, this.y));

    if (dx !== 0 || dy !== 0) this.walkCycle += 0.25;

    this.aimAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
    this.facingRight = mouseX >= this.x;

    if (this.invulnerableTimer > 0) this.invulnerableTimer--;
    if (this.tripleTimer > 0 && --this.tripleTimer === 0) this.tripleBurger = false;
    if (this.speedBoostTimer > 0) this.speedBoostTimer--;
    if (this.shieldTimer > 0 && --this.shieldTimer === 0) this.shieldActive = false;

    // Gradual soda recharge
    if (this.soda < this.maxSoda) this.soda = Math.min(this.maxSoda, this.soda + 0.12);
  }

  draw(ctx) {
    const px = this.x;
    const py = this.y;

    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 1) return;

    ctx.save();

    // Shield Aura
    if (this.shieldActive) {
      ctx.strokeStyle = '#ff80ab';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(px, py, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 128, 171, 0.2)';
      ctx.fill();
    }

    // Ground Shadow
    ctx.fillStyle = 'rgba(90, 45, 75, 0.3)';
    ctx.beginPath();
    ctx.ellipse(px, py + 22, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking legs & cowboy boots
    const legSwing = Math.sin(this.walkCycle) * 8;
    ctx.strokeStyle = '#1e40af'; // Blue Jeans
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px - 8, py + 10);
    ctx.lineTo(px - 8 + legSwing, py + 24);
    ctx.moveTo(px + 8, py + 10);
    ctx.lineTo(px + 8 - legSwing, py + 24);
    ctx.stroke();

    // Brown Boots
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.roundRect(px - 11 + legSwing, py + 22, 10, 6, 2);
    ctx.roundRect(px + 5 - legSwing, py + 22, 10, 6, 2);
    ctx.fill();

    // Red Patriotic Flannel / Vest
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.roundRect(px - 14, py - 12, 28, 24, 5);
    ctx.fill();

    // Blue suspenders & gold belt buckle
    ctx.strokeStyle = '#1a237e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px - 8, py - 12);
    ctx.lineTo(px - 8, py + 12);
    ctx.moveTo(px + 8, py - 12);
    ctx.lineTo(px + 8, py + 12);
    ctx.stroke();

    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.rect(px - 5, py + 9, 10, 4);
    ctx.fill();

    // Coca-Cola Can in hip holster
    const hipX = this.facingRight ? px - 16 : px + 11;
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.roundRect(hipX, py - 2, 7, 12, 2);
    ctx.fill();

    // Face / Head
    ctx.fillStyle = '#ffcca9';
    ctx.beginPath();
    ctx.arc(px, py - 22, 12, 0, Math.PI * 2);
    ctx.fill();

    // Aviator Sunglasses
    const sgX = px + (this.facingRight ? 2 : -2);
    ctx.fillStyle = '#1c1c1e';
    ctx.beginPath();
    ctx.roundRect(sgX - 7, py - 24, 6, 5, 1);
    ctx.roundRect(sgX + 1, py - 24, 6, 5, 1);
    ctx.fill();

    // Glasses Glint
    ctx.strokeStyle = '#90caf9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sgX - 5, py - 23);
    ctx.lineTo(sgX - 3, py - 21);
    ctx.stroke();

    // Cheerful Mustache
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px - 4, py - 16, 4, 0, Math.PI);
    ctx.arc(px + 4, py - 16, 4, 0, Math.PI);
    ctx.stroke();

    // White Cowboy Hat
    const hatBaseY = py - 29;
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.ellipse(px, hatBaseY, 21, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(px - 11, hatBaseY - 14, 22, 14, [4, 4, 0, 0]);
    ctx.fill();

    // Hat ribbon (USA flag colors)
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.rect(px - 11, hatBaseY - 4, 22, 4);
    ctx.fill();
    ctx.fillStyle = '#1976d2';
    ctx.beginPath();
    ctx.arc(px, hatBaseY - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // BURGER LAUNCHER Cannon
    const gunLen = 25;
    const gunX = px + Math.cos(this.aimAngle) * gunLen;
    const gunY = py + Math.sin(this.aimAngle) * gunLen;

    ctx.strokeStyle = '#ffcca9';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(px, py - 5);
    ctx.lineTo(px + Math.cos(this.aimAngle) * 12, py - 5 + Math.sin(this.aimAngle) * 12);
    ctx.stroke();

    ctx.strokeStyle = '#424242';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(px, py - 5);
    ctx.lineTo(gunX, gunY);
    ctx.stroke();

    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px + Math.cos(this.aimAngle) * 4, py - 5 + Math.sin(this.aimAngle) * 4);
    ctx.lineTo(gunX, gunY);
    ctx.stroke();

    // Burger ready in cannon tip
    ctx.fillStyle = '#e8a953';
    ctx.beginPath();
    ctx.arc(gunX, gunY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// --- DEKORACE PROSTŘEDÍ CANDY RÁJ ---
class CandyScenery {
  constructor() {
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * 1024,
        y: Math.random() * 150 + 20,
        speed: Math.random() * 0.3 + 0.2,
        size: Math.random() * 30 + 35,
        color: ['#ffd4eb', '#ffe3f3', '#dcf1ff'][Math.floor(Math.random() * 3)]
      });
    }

    this.lollipops = [];
    const lpColors = [
      ['#ff4081', '#ffffff'],
      ['#00e5ff', '#ffffff'],
      ['#ab47bc', '#ffd54f'],
      ['#ff9100', '#fff3e0']
    ];
    for (let i = 0; i < 9; i++) {
      this.lollipops.push({
        x: 50 + i * 115 + (Math.random() - 0.5) * 35,
        y: Math.random() * 70 + 120,
        radius: Math.random() * 14 + 24,
        colors: lpColors[i % lpColors.length]
      });
    }

    this.canes = [
      { x: 30, y: 210, h: 45 },
      { x: 125, y: 220, h: 50 },
      { x: 320, y: 205, h: 48 },
      { x: 530, y: 215, h: 52 },
      { x: 720, y: 210, h: 46 },
      { x: 910, y: 220, h: 50 },
      { x: 990, y: 205, h: 45 }
    ];

    this.sparkles = [];
    for (let i = 0; i < 35; i++) {
      this.sparkles.push({
        x: Math.random() * 1024,
        y: Math.random() * 640,
        speed: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        color: ['#ff80ab', '#ffd54f', '#64ffda', '#b388ff'][Math.floor(Math.random() * 4)]
      });
    }
  }

  update() {
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x - c.size > 1024) c.x = -c.size * 2;
    });

    this.sparkles.forEach(s => {
      s.y -= s.speed;
      s.phase += 0.05;
      if (s.y < -10) {
        s.y = 650;
        s.x = Math.random() * 1024;
      }
    });
  }

  draw(ctx) {
    // 1. Pastel Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 260);
    skyGrad.addColorStop(0, '#c7ebff');
    skyGrad.addColorStop(1, '#ffd6e7');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 260);

    // 2. Cotton Candy Clouds
    this.clouds.forEach(c => {
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.arc(c.x - c.size * 0.6, c.y + c.size * 0.15, c.size * 0.7, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.6, c.y + c.size * 0.15, c.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Strawberry Frosting Hills
    ctx.fillStyle = '#f8bbd0';
    ctx.beginPath();
    ctx.moveTo(0, 240);
    for (let x = 0; x <= 1040; x += 40) {
      const hy = 210 + Math.sin(x * 0.008) * 20 + Math.cos(x * 0.015) * 15;
      ctx.lineTo(x, hy);
    }
    ctx.lineTo(1024, 640);
    ctx.lineTo(0, 640);
    ctx.closePath();
    ctx.fill();

    // 4. Giant Swirl Lollipops
    this.lollipops.forEach(lp => {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(lp.x, lp.y);
      ctx.lineTo(lp.x, lp.y + 75);
      ctx.stroke();

      const [c1, c2] = lp.colors;
      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.arc(lp.x, lp.y, lp.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let r = lp.radius - 4; r > 3; r -= 7) {
        ctx.strokeStyle = (Math.floor(r / 7) % 2 === 0) ? c2 : c1;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // 5. Candy Canes
    this.canes.forEach(cane => {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cane.x, cane.y);
      ctx.lineTo(cane.x, cane.y + cane.h);
      ctx.stroke();

      // Red stripes
      ctx.strokeStyle = '#e53935';
      ctx.lineWidth = 3;
      for (let sy = cane.y + 4; sy < cane.y + cane.h; sy += 10) {
        ctx.beginPath();
        ctx.moveTo(cane.x - 3, sy);
        ctx.lineTo(cane.x + 3, sy + 4);
        ctx.stroke();
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cane.x - 7, cane.y, 8, Math.PI, 0);
      ctx.stroke();
    });

    // 6. Vanilla Wafer Playing Turf
    ctx.fillStyle = '#fff3e0';
    ctx.fillRect(0, 255, 1024, 640 - 255);

    // Waffle grid lines
    ctx.strokeStyle = '#ffe0b2';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1024; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 255);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 255; y < 640; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // 7. Sparkle Dust
    this.sparkles.forEach(s => {
      const spAlpha = 0.4 + 0.6 * Math.sin(s.phase);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = spAlpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  }
}

// --- HLAVNÍ HERNÍ ENGINE ---
class CandyRangerGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sounds = new SoundEngine();
    this.scenery = new CandyScenery();

    this.keys = {};
    this.mouseX = 512;
    this.mouseY = 320;
    this.mouseDownLeft = false;
    this.mouseDownRight = false;

    this.touchVx = 0;
    this.touchVy = 0;

    this.initInput();
    this.reset();

    // Start loop
    requestAnimationFrame(this.loop.bind(this));
  }

  reset() {
    this.state = 'START'; // START, PLAYING, WAVE_CLEAR, GAMEOVER, VICTORY
    this.player = new Player(250, 320);
    this.projectiles = [];
    this.unicorns = [];
    this.pickups = [];
    this.particles = [];

    this.wave = 1;
    this.maxWaves = 6;
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;

    this.unicornsToSpawn = 0;
    this.spawnTimer = 0;
    this.waveClearedTimer = 0;
    this.bossSpawned = false;

    this.burgerCooldown = 0;
    this.colaCooldown = 0;
  }

  startWave(waveNum) {
    this.wave = waveNum;
    this.bossSpawned = false;
    this.unicornsToSpawn = (waveNum < this.maxWaves) ? (10 + waveNum * 6) : 6;
    this.spawnTimer = 40;
    this.sounds.playFanfare();
  }

  spawnUnicorn() {
    let x = 1060;
    let y = Math.random() * (640 - 180) + 120;

    if (this.wave === this.maxWaves && !this.bossSpawned && this.unicornsToSpawn <= 2) {
      this.unicorns.push(new Unicorn(1080, 320, 'boss', this.wave));
      this.bossSpawned = true;
      return;
    }

    const r = Math.random();
    let type = 'normal';
    if (this.wave === 2) {
      type = r < 0.4 ? 'speedy' : 'normal';
    } else if (this.wave >= 3) {
      if (r < 0.35) type = 'speedy';
      else if (r < 0.65) type = 'chonky';
      else type = 'normal';
    }

    this.unicorns.push(new Unicorn(x, y, type, this.wave));
  }

  shootBurger() {
    if (this.burgerCooldown > 0) return;
    this.burgerCooldown = 13;
    this.player.burgersThrown++;
    this.sounds.playBurgerShot();

    const dmg = 25;
    if (this.player.tripleBurger) {
      const baseAng = Math.atan2(this.mouseY - this.player.y, this.mouseX - this.player.x);
      [-0.22, 0, 0.22].forEach(oAng => {
        const ang = baseAng + oAng;
        const tx = this.player.x + Math.cos(ang) * 300;
        const ty = this.player.y + Math.sin(ang) * 300;
        this.projectiles.push(new Projectile(this.player.x, this.player.y, tx, ty, 10, dmg, 'burger', true));
      });
    } else {
      this.projectiles.push(new Projectile(this.player.x, this.player.y, this.mouseX, this.mouseY, 10, dmg, 'burger'));
    }
  }

  sprayCola() {
    if (this.player.soda < 2) return;
    this.player.soda -= 1.8;
    if (this.colaCooldown <= 0) {
      this.colaCooldown = 4;
      this.sounds.playColaSpray();
      const sx = this.mouseX + (Math.random() - 0.5) * 40;
      const sy = this.mouseY + (Math.random() - 0.5) * 40;
      this.projectiles.push(new Projectile(this.player.x, this.player.y, sx, sy, 11, 7, 'cola_stream'));
    }
  }

  triggerMentos() {
    if (this.player.soda < 40) return;
    this.player.soda -= 40;
    this.sounds.playMentosBoom();
    this.projectiles.push(new Projectile(this.player.x, this.player.y, this.mouseX, this.mouseY, 8.5, 90, 'cola_can'));

    // Shockwave bubbles around player
    for (let i = 0; i < 35; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      this.particles.push(new Particle(
        this.player.x, this.player.y,
        Math.cos(ang) * spd, Math.sin(ang) * spd,
        '#fff4d6', Math.random() * 8 + 4, 35, 'fizz', 0.02
      ));
    }
  }

  triggerSodaExplosion(x, y) {
    this.sounds.playMentosBoom();
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 8 + 3;
      this.particles.push(new Particle(
        x, y, Math.cos(ang) * spd, Math.sin(ang) * spd,
        ['#3c140d', '#fff4d6', '#ffd54f'][Math.floor(Math.random() * 3)],
        Math.random() * 10 + 5, 45, 'fizz', 0.01
      ));
    }

    this.unicorns.forEach(u => {
      const d = Math.hypot(u.x - x, u.y - y);
      if (d <= 130) {
        u.hp -= 85;
        u.hitFlash = 12;
        u.fizzSlow = 150;
        if (d > 0) {
          u.x += ((u.x - x) / d) * 45;
          u.y += ((u.y - y) / d) * 45;
        }
      }
    });
  }

  unicornDefeated(u) {
    this.sounds.playUnicornNeigh();
    this.player.unicornsFed++;
    this.score += u.scoreVal * (1 + Math.floor(this.combo / 5));
    this.combo++;
    this.comboTimer = 120;

    // Confetti burst
    const colors = ['#ff6da8', '#ffd54f', '#64ffda', '#ab47bc', '#ff8ec7'];
    for (let i = 0; i < 25; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      this.particles.push(new Particle(
        u.x, u.y, Math.cos(ang) * spd, Math.sin(ang) * spd,
        colors[Math.floor(Math.random() * colors.length)],
        Math.random() * 6 + 4, 40, 'star', 0.06
      ));
    }

    // Drops
    const roll = Math.random();
    if (roll < 0.22) this.pickups.push(new Pickup(u.x, u.y, 'fries'));
    else if (roll < 0.42) this.pickups.push(new Pickup(u.x, u.y, 'soda'));
    else if (roll < 0.54) this.pickups.push(new Pickup(u.x, u.y, 'donut'));
    else if (roll < 0.65) this.pickups.push(new Pickup(u.x, u.y, 'golden_burger'));
  }

  update() {
    this.scenery.update();
    if (this.state !== 'PLAYING') return;

    this.player.update(this.keys, this.mouseX, this.mouseY, this.touchVx, this.touchVy);

    if (this.mouseDownLeft) this.shootBurger();
    if (this.mouseDownRight) this.sprayCola();

    if (this.burgerCooldown > 0) this.burgerCooldown--;
    if (this.colaCooldown > 0) this.colaCooldown--;

    if (this.comboTimer > 0 && --this.comboTimer === 0) this.combo = 0;

    // Spawning
    if (this.unicornsToSpawn > 0) {
      if (--this.spawnTimer <= 0) {
        this.spawnUnicorn();
        this.unicornsToSpawn--;
        this.spawnTimer = Math.max(25, 75 - this.wave * 7);
      }
    }

    // Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.update()) {
        if (p.type === 'cola_can') this.triggerSodaExplosion(p.x, p.y);
        this.projectiles.splice(i, 1);
        continue;
      }

      let hit = false;
      for (let j = this.unicorns.length - 1; j >= 0; j--) {
        const u = this.unicorns[j];
        const dist = Math.hypot(u.x - p.x, u.y - p.y);
        if (dist < u.radius + p.radius) {
          hit = true;
          u.hp -= p.damage;
          u.hitFlash = 6;
          this.sounds.playBurgerHit();

          if (p.type === 'cola_stream') u.fizzSlow = 60;
          if (p.type === 'cola_can') this.triggerSodaExplosion(p.x, p.y);

          // Particles
          for (let k = 0; k < 10; k++) {
            const ang = Math.random() * Math.PI * 2;
            this.particles.push(new Particle(
              p.x, p.y, Math.cos(ang) * 4, Math.sin(ang) * 4,
              p.type === 'burger' ? '#e62b2b' : '#3c140d',
              4, 20, 'circle', 0.1
            ));
          }

          if (u.hp <= 0) {
            this.unicornDefeated(u);
            this.unicorns.splice(j, 1);
          }
          break;
        }
      }

      if (hit) this.projectiles.splice(i, 1);
    }

    // Update Unicorns
    for (let i = this.unicorns.length - 1; i >= 0; i--) {
      const u = this.unicorns[i];
      u.update(this.player.x, this.player.y);

      // Contact with player
      const dist = Math.hypot(this.player.x - u.x, this.player.y - u.y);
      if (dist < u.radius + 18) {
        if (!this.player.shieldActive && this.player.invulnerableTimer <= 0) {
          const dmg = u.isBoss ? 25 : (u.type === 'chonky' ? 15 : 10);
          this.player.hp -= dmg;
          this.player.invulnerableTimer = 45;
          this.sounds.playHurt();
          u.x += (u.x - this.player.x) * 0.4;
          u.y += (u.y - this.player.y) * 0.4;
        }
      }
    }

    // Update Pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pu = this.pickups[i];
      if (!pu.update()) {
        this.pickups.splice(i, 1);
        continue;
      }
      if (Math.hypot(this.player.x - pu.x, this.player.y - pu.y) < 32) {
        this.sounds.playPickup();
        if (pu.itemType === 'fries') this.player.speedBoostTimer = 360;
        else if (pu.itemType === 'soda') {
          this.player.soda = Math.min(this.player.maxSoda, this.player.soda + 35);
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 15);
        } else if (pu.itemType === 'donut') {
          this.player.shieldActive = true;
          this.player.shieldTimer = 450;
        } else if (pu.itemType === 'golden_burger') {
          this.player.tripleBurger = true;
          this.player.tripleTimer = 400;
        }
        this.pickups.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update()) {
        this.particles.splice(i, 1);
      }
    }

    // Game Over check
    if (this.player.hp <= 0) {
      this.state = 'GAMEOVER';
      return;
    }

    // Wave Clear check
    if (this.unicornsToSpawn === 0 && this.unicorns.length === 0) {
      if (this.wave === this.maxWaves) {
        this.state = 'VICTORY';
      } else {
        this.state = 'WAVE_CLEAR';
        this.waveClearedTimer = 110;
      }
    }
  }

  drawHUD() {
    const ctx = this.ctx;
    ctx.save();

    // Top Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.strokeStyle = '#ffb6d8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(16, 12, 1024 - 32, 52, 14);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 16px Fredoka, sans-serif';

    // 1. HP
    ctx.fillStyle = '#d32f2f';
    ctx.fillText('HP:', 32, 42);
    ctx.fillStyle = '#424242';
    ctx.beginPath();
    ctx.roundRect(65, 29, 140, 18, 5);
    ctx.fill();

    const hpPct = Math.max(0, this.player.hp / this.player.maxHp);
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.roundRect(65, 29, 140 * hpPct, 18, 5);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.fillText(`${Math.round(this.player.hp)} / 100`, 110, 43);

    // 2. Coca-Cola Meter
    ctx.font = 'bold 16px Fredoka, sans-serif';
    ctx.fillStyle = '#c2185b';
    ctx.fillText('COCA-COLA:', 230, 42);

    ctx.fillStyle = '#424242';
    ctx.beginPath();
    ctx.roundRect(335, 29, 140, 18, 5);
    ctx.fill();

    const sodaPct = Math.max(0, this.player.soda / this.player.maxSoda);
    ctx.fillStyle = sodaPct > 0.4 ? '#ffd54f' : '#ff9800';
    ctx.beginPath();
    ctx.roundRect(335, 29, 140 * sodaPct, 18, 5);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.fillText(`${Math.round(this.player.soda)}%`, 390, 43);

    // 3. Wave & Unicorns left
    ctx.font = 'bold 17px Fredoka, sans-serif';
    ctx.fillStyle = '#6a1b9a';
    ctx.fillText(`VLNA: ${this.wave}/${this.maxWaves}`, 510, 36);
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.fillStyle = '#8e24aa';
    ctx.fillText(`JEDNOROŽCI: ${this.unicornsToSpawn + this.unicorns.length}`, 510, 53);

    // 4. Score & Combo
    ctx.font = 'bold 18px Fredoka, sans-serif';
    ctx.fillStyle = '#2e7d32';
    ctx.fillText(`SKÓRE: ${this.score}`, 750, 43);

    if (this.combo > 1) {
      ctx.fillStyle = '#ff6f00';
      ctx.fillText(`${this.combo}x COMBO!`, 900, 43);
    }

    ctx.restore();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 1024, 640);

    // 1. Background
    this.scenery.draw(ctx);

    // 2. Pickups
    this.pickups.forEach(p => p.draw(ctx));

    // 3. Unicorns
    this.unicorns.forEach(u => u.draw(ctx));

    // 4. Player
    if (this.state === 'PLAYING' || this.state === 'WAVE_CLEAR') {
      this.player.draw(ctx);
    }

    // 5. Projectiles
    this.projectiles.forEach(p => p.draw(ctx));

    // 6. Particles
    this.particles.forEach(p => p.draw(ctx));

    // 7. HUD
    if (this.state === 'PLAYING' || this.state === 'WAVE_CLEAR') {
      this.drawHUD();
    }

    // OVERLAYS
    if (this.state === 'START') {
      this.drawStartScreen();
    } else if (this.state === 'WAVE_CLEAR') {
      this.drawWaveClearScreen();
    } else if (this.state === 'GAMEOVER') {
      this.drawGameOverScreen();
    } else if (this.state === 'VICTORY') {
      this.drawVictoryScreen();
    }
  }

  drawStartScreen() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(25, 10, 35, 0.75)';
    ctx.fillRect(0, 0, 1024, 640);

    ctx.textAlign = 'center';

    // Title
    ctx.font = 'bold 54px "Lilita One", cursive, sans-serif';
    ctx.fillStyle = '#ff6da8';
    ctx.fillText('CANDY RANGER', 512, 130);

    ctx.font = 'bold 24px "Fredoka", sans-serif';
    ctx.fillStyle = '#ffd54f';
    ctx.fillText('AMERICKÝ BURGER HRDINA vs JEDNOROŽCI', 512, 180);

    // Box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ff6da8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(240, 215, 544, 275, 18);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 18px Fredoka, sans-serif';
    ctx.fillStyle = '#e04586';
    ctx.fillText('🎮 JAK HRÁT A OVLÁDAT:', 270, 252);

    const tips = [
      'W, A, S, D / Šipky : Pohyb amerického rangera',
      'Levé tlačítko myši : Střelba BURGERY (krmení)',
      'Pravé tlačítko myši : Proud COCA-COLY (zpomalení)',
      'MEZERNÍK : Super Mentos Gejzír!',
      'M : Zapnout / Vypnout zvuk a hudbu',
      'Krm hladové jednorožce burgry, než tě umačkají láskou!'
    ];

    ctx.font = '15px Fredoka, sans-serif';
    ctx.fillStyle = '#37474f';
    tips.forEach((t, idx) => {
      ctx.fillText(t, 270, 288 + idx * 30);
    });

    // Start Button
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e04586';
    ctx.beginPath();
    ctx.roundRect(380, 515, 264, 54, 27);
    ctx.fill();

    ctx.font = 'bold 22px Fredoka, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('KLIKNI PRO START HRY', 512, 549);

    ctx.restore();
  }

  drawWaveClearScreen() {
    this.waveClearedTimer--;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fillRect(0, 240, 1024, 140);

    ctx.textAlign = 'center';
    ctx.font = 'bold 44px "Lilita One", sans-serif';
    ctx.fillStyle = '#e04586';
    ctx.fillText(`VLNA ${this.wave} SPLNĚNA!`, 512, 295);

    ctx.font = 'bold 20px Fredoka, sans-serif';
    ctx.fillStyle = '#4a148c';
    ctx.fillText('Jednorožci jsou přežraní burgry! Připrav se na další vlnu...', 512, 345);
    ctx.restore();

    if (this.waveClearedTimer <= 0) {
      this.startWave(this.wave + 1);
      this.state = 'PLAYING';
    }
  }

  drawGameOverScreen() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(40, 15, 30, 0.88)';
    ctx.fillRect(0, 0, 1024, 640);

    ctx.textAlign = 'center';
    ctx.font = 'bold 50px "Lilita One", sans-serif';
    ctx.fillStyle = '#ff1744';
    ctx.fillText('PŘEKANCOVÁN!', 512, 170);

    ctx.font = 'bold 22px Fredoka, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Jednorožci tě zasypali kouzly a třpytkami!', 512, 225);

    ctx.font = '18px Fredoka, sans-serif';
    ctx.fillStyle = '#ffd54f';
    ctx.fillText(`Konečné Skóre: ${this.score}`, 512, 280);
    ctx.fillText(`Nakrmeno Jednorožců: ${this.player.unicornsFed}`, 512, 312);
    ctx.fillText(`Vystřeleno Burgerů: ${this.player.burgersThrown}`, 512, 344);

    // Restart button
    ctx.fillStyle = '#e04586';
    ctx.beginPath();
    ctx.roundRect(380, 420, 264, 50, 25);
    ctx.fill();

    ctx.font = 'bold 20px Fredoka, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRÁT ZNOVU (R)', 512, 452);

    ctx.restore();
  }

  drawVictoryScreen() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(25, 20, 50, 0.9)';
    ctx.fillRect(0, 0, 1024, 640);

    ctx.textAlign = 'center';
    ctx.font = 'bold 46px "Lilita One", sans-serif';
    ctx.fillStyle = '#ffd54f';
    ctx.fillText('VÍTĚZSTVÍ! CANDY RÁJ ZACHRÁNĚN!', 512, 170);

    ctx.font = 'bold 22px Fredoka, sans-serif';
    ctx.fillStyle = '#ff80ab';
    ctx.fillText('Král Jednorožců snědl mega burger a usnul!', 512, 225);

    ctx.font = '18px Fredoka, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Skvělé Skóre: ${this.score}`, 512, 285);
    ctx.fillText('Všichni jednorožci v království jsou nasyceni!', 512, 320);

    // Restart button
    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.roundRect(380, 410, 264, 50, 25);
    ctx.fill();

    ctx.font = 'bold 20px Fredoka, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HRÁT ZNOVU (R)', 512, 442);

    ctx.restore();
  }

  initInput() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'PLAYING') {
          this.triggerMentos();
        }
      }
      if (e.code === 'KeyM') {
        const isMuted = this.sounds.toggleMute();
        this.updateSoundBtn(isMuted);
      }
      if (e.code === 'KeyR') {
        if (this.state === 'GAMEOVER' || this.state === 'VICTORY') {
          this.reset();
          this.startWave(1);
          this.state = 'PLAYING';
        }
      }
    });

    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
    });

    const updateMousePos = e => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = 1024 / rect.width;
      const scaleY = 640 / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
    };

    this.canvas.addEventListener('mousemove', updateMousePos);

    this.canvas.addEventListener('mousedown', e => {
      this.sounds.init();
      this.sounds.startBGM();

      if (this.state === 'START') {
        this.reset();
        this.startWave(1);
        this.state = 'PLAYING';
        return;
      }
      if (this.state === 'GAMEOVER' || this.state === 'VICTORY') {
        this.reset();
        this.startWave(1);
        this.state = 'PLAYING';
        return;
      }

      if (e.button === 0) {
        this.mouseDownLeft = true;
      } else if (e.button === 2) {
        this.mouseDownRight = true;
      }
    });

    window.addEventListener('mouseup', e => {
      if (e.button === 0) this.mouseDownLeft = false;
      if (e.button === 2) this.mouseDownRight = false;
    });

    // Disable context menu on canvas so right click sprays Coca-Cola
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());

    // Sound toggle button in header
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.sounds.init();
        this.sounds.startBGM();
        const isMuted = this.sounds.toggleMute();
        this.updateSoundBtn(isMuted);
      });
    }

    // Fullscreen button
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.querySelector('.canvas-container').requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Mobile touch UI controls
    this.initTouchControls();
  }

  updateSoundBtn(isMuted) {
    const icon = document.getElementById('sound-icon');
    const text = document.getElementById('sound-text');
    if (icon && text) {
      icon.textContent = isMuted ? '🔇' : '🔊';
      text.textContent = isMuted ? 'Zvuk VYP' : 'Zvuk ZAP';
    }
  }

  initTouchControls() {
    const btnBurger = document.getElementById('touch-btn-burger');
    const btnCola = document.getElementById('touch-btn-cola');
    const btnMentos = document.getElementById('touch-btn-mentos');
    const stickZone = document.getElementById('touch-stick-zone');
    const stickKnob = document.getElementById('touch-stick-knob');

    if (btnBurger) {
      btnBurger.addEventListener('touchstart', e => {
        e.preventDefault();
        this.sounds.init();
        this.sounds.startBGM();
        if (this.state === 'START' || this.state === 'GAMEOVER' || this.state === 'VICTORY') {
          this.reset();
          this.startWave(1);
          this.state = 'PLAYING';
        } else {
          this.shootBurger();
        }
      });
    }

    if (btnCola) {
      btnCola.addEventListener('touchstart', e => {
        e.preventDefault();
        this.mouseDownRight = true;
      });
      btnCola.addEventListener('touchend', e => {
        e.preventDefault();
        this.mouseDownRight = false;
      });
    }

    if (btnMentos) {
      btnMentos.addEventListener('touchstart', e => {
        e.preventDefault();
        this.triggerMentos();
      });
    }

    if (stickZone && stickKnob) {
      let touchId = null;
      stickZone.addEventListener('touchstart', e => {
        e.preventDefault();
        touchId = e.changedTouches[0].identifier;
      });
      stickZone.addEventListener('touchmove', e => {
        e.preventDefault();
        for (let t of e.changedTouches) {
          if (t.identifier === touchId) {
            const rect = stickZone.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            let dx = t.clientX - cx;
            let dy = t.clientY - cy;
            const dist = Math.hypot(dx, dy);
            const maxR = 35;
            if (dist > maxR) {
              dx = (dx / dist) * maxR;
              dy = (dy / dist) * maxR;
            }
            stickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
            this.touchVx = dx / maxR;
            this.touchVy = dy / maxR;
          }
        }
      });
      const resetStick = e => {
        touchId = null;
        stickKnob.style.transform = 'translate(0px, 0px)';
        this.touchVx = 0;
        this.touchVy = 0;
      };
      stickZone.addEventListener('touchend', resetStick);
      stickZone.addEventListener('touchcancel', resetStick);
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}

// Start game on load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new CandyRangerGame();
});
