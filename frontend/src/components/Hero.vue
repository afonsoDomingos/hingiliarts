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
      <h1 class="hero-title">A Arte de Transformar <br><span class="highlight">Espaços Visuais</span></h1>
      <p class="hero-subtitle">Transformamos espaços urbanos e corporativos em experiências visuais marcantes, combinando criatividade, técnica e impacto visual.</p>
      <a href="#contact" class="btn btn-primary">Solicitar Orçamento Agora <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const slides = [
  '/assets/img/Banner01.jpg',
  '/assets/img/Banner02.jpg',
  '/assets/img/Banner03.jpg',
  '/assets/img/Banner 04.jpg'
];

const currentSlide = ref(0);
let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>
