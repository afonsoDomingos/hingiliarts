<template>
  <section class="hero" id="home" style="position: relative; overflow: hidden;">
    <div class="glow-blob glow-primary" style="top: 10%; left: -100px; z-index: 0;"></div>
    <div class="hero-slider">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        :class="['slide', { 'active': currentSlide === index }]"
        :style="{ backgroundImage: `url(${slide})` }"
      ></div>
    </div>
    
    <div class="container hero-content">
      <div class="hero-tag reveal">Transformando o Comum em <span class="highlight">Extraordinário</span></div>
      <h1 class="hero-title reveal">Nossa Arte, <br>Sua <span class="highlight">Realização</span></h1>
      <p class="hero-subtitle reveal">Do mural urbano à sinalização corporativa de luxo. Unimos a visão artística à execução técnica impecável.</p>
      
      <div class="hero-btns reveal">
        <a href="/#contact" class="btn btn-primary">Solicitar Orçamento <i class="fa-solid fa-arrow-right"></i></a>
        <a href="#portfolio" class="btn btn-outline">Ver Portfólio</a>
      </div>
    </div>

    <!-- Side Scroll Indicator -->
    <div class="side-scroll">
      <div class="side-scroll-line"></div>
      <span class="side-scroll-label">Scroll</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const slides = [
  '/assets/img/nossobanner.jpeg',
  '/assets/img/Banner01.jpg'
];

const currentSlide = ref(0);
let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 6000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.hero-tag {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 20px;
  color: var(--text-secondary);
}

.hero-btns {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #fff;
}

/* ── Premium Side Scroll Indicator ── */
.side-scroll {
  position: absolute;
  right: 48px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  z-index: 10;
}

.side-scroll-line {
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 40%, rgba(255,255,255,0) 100%);
  background-size: 100% 200%;
  animation: scrollLine 2s ease-in-out infinite;
  border-radius: 2px;
}

@keyframes scrollLine {
  0%   { background-position: 0% 0%;   opacity: 0; }
  30%  { opacity: 1; }
  70%  { opacity: 1; }
  100% { background-position: 0% 100%; opacity: 0; }
}

.side-scroll-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

@media (max-width: 600px) {
  .side-scroll {
    display: none;
  }

  .hero-btns {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .hero-btns .btn {
    padding: 11px 20px;
    font-size: 0.72rem;
    letter-spacing: 1px;
    gap: 8px;
    flex: 1;
    min-width: 0;
    justify-content: center;
  }

  .hero-tag {
    font-size: 0.75rem;
    letter-spacing: 2px;
  }
}
</style>
