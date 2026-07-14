<template>
  <section class="hero" id="home">

    <!-- Slider de fundo -->
    <div class="hero-slider">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        :class="['slide', { 'active': currentSlide === index }]"
        :style="{ backgroundImage: `url(${slide.img})` }"
      ></div>
    </div>

    <!-- Overlay multicamada para controlo profissional da opacidade -->
    <div class="hero-overlay"></div>
    <div class="hero-vignette"></div>

    <!-- Linha decorativa lateral -->
    <div class="hero-side-line">
      <span class="side-text">Hingili Arts</span>
    </div>

    <!-- Conteúdo principal -->
    <div class="container hero-body">
      <div class="hero-content">

        <!-- Tag com linha decorativa -->
        <div class="hero-eyebrow">
          <span class="eyebrow-line"></span>
          <span class="eyebrow-text">Arte Plástica Moçambicana</span>
        </div>

        <!-- Título principal -->
        <h1 class="hero-title">
          <span class="title-line">Nossa Arte,</span>
          <span class="title-line title-accent">Sua <em>Realização</em></span>
        </h1>

        <!-- Subtítulo -->
        <p class="hero-subtitle">
          Do mural urbano à sinalização corporativa de luxo.<br>
          Visão artística aliada à execução técnica impecável.
        </p>

        <!-- Botões -->
        <div class="hero-btns">
          <a href="/#contact" class="btn btn-primary btn-hero">
            Solicitar Orçamento <i class="fa-solid fa-arrow-right"></i>
          </a>
          <a href="#portfolio" class="btn btn-ghost">
            <i class="fa-solid fa-images"></i> Ver Portfólio
          </a>
        </div>

        <!-- Stats rápidos -->
        <div class="hero-stats">
          <div class="h-stat" v-for="s in stats" :key="s.label">
            <span class="h-stat-num">{{ s.num }}</span>
            <span class="h-stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- Indicador de slide -->
      <div class="slide-indicator">
        <button
          v-for="(slide, i) in slides"
          :key="i"
          :class="['slide-dot', { active: currentSlide === i }]"
          @click="goToSlide(i)"
          :aria-label="`Slide ${i + 1}`"
        ></button>
      </div>
    </div>

    <!-- Scroll down -->
    <a href="#about" class="scroll-indicator" title="Rolar para baixo">
      <div class="scroll-line"></div>
      <span class="scroll-label">Explorar</span>
    </a>

  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const slides = [
  { img: '/assets/img/nossobanner.jpeg' },
  { img: '/assets/img/Banner01.jpg' },
];

const currentSlide = ref(0);
let interval = null;

const goToSlide = (i) => {
  currentSlide.value = i;
};

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 7000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

const stats = [
  { num: '10+', label: 'Anos de Experiência' },
  { num: '200+', label: 'Obras Realizadas' },
  { num: '50+', label: 'Clientes Corporativos' },
];
</script>

<style scoped>
/* ── Base ── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* ── Slider ── */
.hero-slider {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1.05);
}

.slide.active {
  opacity: 1;
  animation: heroZoom 9s ease-in-out forwards;
}

@keyframes heroZoom {
  from { transform: scale(1.06); }
  to   { transform: scale(1.0); }
}

/* ── Overlays controlados ── */
/* Escurece a imagem a ~70% para texto legível sem perder a imagem */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    135deg,
    rgba(4, 4, 10, 0.78) 0%,
    rgba(4, 4, 10, 0.55) 50%,
    rgba(4, 4, 10, 0.40) 100%
  );
}

/* Gradiente em baixo para transição suave para a próxima secção */
.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(4, 4, 10, 0.6) 80%,
    rgba(5, 5, 5, 1) 100%
  );
  pointer-events: none;
}

/* ── Linha lateral decorativa ── */
.hero-side-line {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-side-line::before,
.hero-side-line::after {
  content: '';
  display: block;
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent);
}

.side-text {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* ── Corpo principal ── */
.hero-body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 100px;
  padding-bottom: 120px;
  gap: 40px;
}

.hero-content {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Eyebrow ── */
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  animation: fadeUp 0.9s ease-out both;
}

.eyebrow-line {
  display: block;
  width: 40px;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 2px;
  flex-shrink: 0;
}

.eyebrow-text {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255,255,255,0.55);
}

/* ── Título ── */
.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 6.5vw, 5.5rem);
  line-height: 1.08;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-line {
  display: block;
  animation: fadeUp 1s ease-out both;
}

.title-line:nth-child(2) { animation-delay: 0.1s; }

.title-accent em {
  font-style: normal;
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── Subtítulo ── */
.hero-subtitle {
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  color: rgba(200, 200, 215, 0.80);
  line-height: 1.75;
  margin-bottom: 38px;
  max-width: 520px;
  animation: fadeUp 1.1s ease-out 0.2s both;
}

/* ── Botões ── */
.hero-btns {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeUp 1.2s ease-out 0.3s both;
  margin-bottom: 56px;
}

.btn-hero {
  box-shadow: 0 12px 32px rgba(229, 46, 113, 0.30);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.85);
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(6px);
}

.btn-ghost:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
  transform: translateY(-2px);
}

/* ── Stats ── */
.hero-stats {
  display: flex;
  gap: 40px;
  animation: fadeUp 1.3s ease-out 0.4s both;
}

.h-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.h-stat:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 4px;
  height: 70%;
  width: 1px;
  background: rgba(255,255,255,0.12);
}

.h-stat-num {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.h-stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.4);
}

/* ── Slide Dots ── */
.slide-indicator {
  display: flex;
  gap: 8px;
  align-self: flex-end;
  margin-bottom: 10px;
}

.slide-dot {
  width: 28px;
  height: 3px;
  border-radius: 2px;
  border: none;
  background: rgba(255,255,255,0.2);
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
}

.slide-dot.active {
  background: var(--gradient-primary);
  width: 48px;
}

/* ── Scroll Down ── */
.scroll-indicator {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
}

.scroll-indicator:hover {
  transform: translateX(-50%) translateY(5px);
}

.scroll-line {
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50%       { opacity: 1;   transform: scaleY(1.1); }
}

.scroll-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.35);
}

/* ── Animações ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsivo ── */
@media (max-width: 768px) {
  .hero-side-line { display: none; }

  .hero-body {
    padding-top: 80px;
    padding-bottom: 100px;
  }

  .hero-stats {
    gap: 24px;
  }

  .h-stat:not(:last-child)::after {
    right: -12px;
  }

  .h-stat-num { font-size: 1.4rem; }

  .hero-btns {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-hero, .btn-ghost {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    gap: 16px;
  }

  .h-stat-num { font-size: 1.2rem; }
  .h-stat-label { font-size: 0.62rem; }

  .slide-indicator { display: none; }
}
</style>
