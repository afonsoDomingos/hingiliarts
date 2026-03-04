<template>
  <section class="hero" id="home">
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
      <h1 class="hero-title reveal">A Arte de <br><span class="highlight">Impactar</span> Espaços</h1>
      <p class="hero-subtitle reveal">Do mural urbano à sinalização corporativa de luxo. Unimos a visão artística à execução técnica impecável.</p>
      
      <div class="hero-btns reveal">
        <a href="/#contact" class="btn btn-primary">Solicitar Orçamento <i class="fa-solid fa-arrow-right"></i></a>
        <a href="#portfolio" class="btn btn-outline">Ver Portfólio</a>
      </div>
    </div>

    <!-- Scroll Down Indicator -->
    <div class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrows">
        <span></span>
        <span></span>
      </div>
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

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.6;
}

.mouse {
  width: 26px;
  height: 42px;
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
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s infinite;
}

.arrows span {
  display: block;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  transform: rotate(45deg);
  margin: -5px;
  animation: scrollArrows 2s infinite;
}

.arrows span:nth-child(2) {
  animation-delay: 0.2s;
}

@keyframes scrollWheel {
  0% { opacity: 1; top: 8px; }
  100% { opacity: 0; top: 24px; }
}

@keyframes scrollArrows {
  0% { opacity: 0; transform: rotate(45deg) translate(-10px, -10px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: rotate(45deg) translate(10px, 10px); }
}

@media (max-width: 600px) {
  .hero-btns {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-tag {
    font-size: 0.75rem;
    letter-spacing: 2px;
  }
}
</style>
