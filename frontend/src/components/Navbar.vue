<template>
  <header :class="['header', { 'scrolled': isScrolled }]">
    <div class="container nav-container">
      <a href="/" class="logo">
        <img src="/assets/img/logo.png" alt="Hingili Arts Logo" class="logo-img">
      </a>
      
      <nav class="navbar">
        <ul :class="['nav-list', { 'active': isMenuActive }]">
          <li v-for="link in navLinks" :key="link.href">
            <a :href="link.href" class="nav-link" @click="closeMenu">
              <span class="nav-link-inner">{{ link.text }}</span>
            </a>
          </li>
          <li class="nav-cta">
            <a href="/#contact" class="btn btn-primary btn-sm" @click="closeMenu">Orçamento</a>
          </li>
        </ul>
        
        <div :class="['hamburger', { 'active': isMenuActive }]" @click="toggleMenu">
          <div class="hb-inner">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </div>
  </header>
  
  <!-- Overlay for mobile menu -->
  <div :class="['menu-overlay', { 'active': isMenuActive }]" @click="closeMenu"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMenuActive = ref(false);

const navLinks = [
  { text: 'Início', href: '/' },
  { text: 'Sobre', href: '/#about' },
  { text: 'Serviços', href: '/#services' },
  { text: 'Portfólio', href: '/#portfolio' },
  { text: 'Leilões', href: '/auctions' },
  { text: 'Contactos', href: '/#contact' }
];

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
  document.body.style.overflow = isMenuActive.value ? 'hidden' : '';
};

const closeMenu = () => {
  isMenuActive.value = false;
  document.body.style.overflow = '';
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

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 30px 0;
  z-index: 2000;
  transition: var(--transition);
}

.header.scrolled {
  background: var(--glass);
  backdrop-filter: blur(20px);
  padding: 15px 0;
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-secondary);
  position: relative;
  transition: var(--transition);
}

.nav-link:hover {
  color: #fff;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: var(--transition);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-cta {
  margin-left: 10px;
}

.btn-sm {
  padding: 10px 24px;
  font-size: 0.75rem;
}

/* Hamburger */
.hamburger {
  display: none;
  cursor: pointer;
  z-index: 2101;
}

.hb-inner {
  width: 30px;
  height: 20px;
  position: relative;
}

.hb-inner span {
  display: block;
  width: 100%;
  height: 2px;
  background: #fff;
  position: absolute;
  transition: var(--transition);
}

.hb-inner span:nth-child(1) { top: 0; }
.hb-inner span:nth-child(2) { top: 50%; transform: translateY(-50%); }
.hb-inner span:nth-child(3) { bottom: 0; }

.hamburger.active span:nth-child(1) { transform: rotate(45deg); top: 9px; }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg); bottom: 9px; }

/* Mobile Menu Styles */
@media (max-width: 900px) {
  .hamburger { display: block; }
  
  .nav-list {
    position: fixed;
    top: 0;
    right: -100%;
    width: 300px;
    height: 100vh;
    background: var(--bg-secondary);
    flex-direction: column;
    justify-content: center;
    padding: 60px 40px;
    transition: var(--transition);
    z-index: 2100;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  }
  
  .nav-list.active { right: 0; }
  
  .nav-cta { margin: 20px 0 0 0; width: 100%; }
  .nav-cta .btn { width: 100%; }
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 2050;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition);
}

.menu-overlay.active {
  opacity: 1;
  pointer-events: auto;
}
</style>
