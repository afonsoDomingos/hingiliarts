<template>
  <header :class="['header', { 'scrolled': isScrolled }]">
    <div class="container nav-container">
      <a href="#" class="logo">
        <span class="logo-text">Hingili<span class="highlight">Arts</span>, Lda.</span>
      </a>
      <nav class="navbar">
        <ul :class="['nav-list', { 'active': isMenuActive }]">
          <li v-for="link in navLinks" :key="link.href">
            <a :href="link.href" class="nav-link" @click="closeMenu">{{ link.text }}</a>
          </li>
        </ul>
        <div :class="['hamburger', { 'active': isMenuActive }]" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMenuActive = ref(false);

const navLinks = [
  { text: 'Início', href: '#home' },
  { text: 'Sobre', href: '#about' },
  { text: 'Serviços', href: '#services' },
  { text: 'Portfólio', href: '#portfolio' },
  { text: 'Processo', href: '#process' },
  { text: 'Contactos', href: '#contact' }
];

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
};

const closeMenu = () => {
  isMenuActive.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
