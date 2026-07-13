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

    <!-- Clickable Scroll Down Indicator -->
    <a href="#about" class="scroll-indicator" title="Rolar para Baixo">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrows">
        <span></span>
        <span></span>
      </div>
    </a>
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

/* Scroll Indicator (Mouse / Clickable) */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.7;
  z-index: 10;
  cursor: pointer;
  transition: var(--transition);
}

.scroll-indicator:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(4px);
}

.mouse {
  width: 24px;
  height: 38px;
  border: 2px solid #fff;
  border-radius: 20px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: #fff;
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s infinite;
}

.arrows span {
  display: block;
  width: 8px;
  height: 8px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  transform: rotate(45deg);
  margin: -4px;
  animation: scrollArrows 2s infinite;
}

.arrows span:nth-child(2) {
  animation-delay: 0.2s;
}

@keyframes scrollWheel {
  0% { opacity: 1; top: 6px; }
  100% { opacity: 0; top: 20px; }
}

@keyframes scrollArrows {
  0% { opacity: 0; transform: rotate(45deg) translate(-8px, -8px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: rotate(45deg) translate(8px, 8px); }
}

@media (max-width: 600px) {
  .scroll-indicator {
    bottom: 20px;
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
