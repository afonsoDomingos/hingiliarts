<template>
  <header :class="['header', { 'scrolled': isScrolled }]">
    <div class="container nav-container">
      <a href="/" class="logo">
        <img src="/assets/img/logo-branco.png" alt="Hingili Arts Logo" class="logo-img">
      </a>
      
      <nav class="navbar">
        <ul :class="['nav-list', { 'active': isMenuActive }]">
          <li v-for="(link, index) in navLinks" :key="link.href">
            <a :href="link.href" class="nav-link" @click="closeMenu">
              <span class="nav-num">0{{ index + 1 }}</span>
              <span class="nav-link-inner">{{ link.text }}</span>
            </a>
          </li>
          <li class="nav-cta">
            <a href="/#contact" class="btn btn-primary btn-sm" @click="closeMenu">Orçamento</a>
          </li>
          
          <!-- Mobile Menu Footer inside drawer -->
          <li class="mobile-menu-footer-item">
            <div class="mobile-menu-footer">
              <span class="m-footer-title">Hingili Arts</span>
              <div class="m-socials">
                <a href="https://web.facebook.com/Xiwozramati" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://wa.me/258844473620" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>
          </li>
        </ul>
        
        <!-- Theme Toggle -->
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Activar Tema Claro' : 'Activar Tema Escuro'">
          <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>
        
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
const isDark = ref(false);

const navLinks = [
  { text: 'Início', href: '/' },
  { text: 'Sobre', href: '/#about' },
  { text: 'Serviços', href: '/#services' },
  { text: 'Portfólio', href: '/#portfolio' },
  { text: 'Leilões', href: '/auctions' },
  { text: 'Contactos', href: '/#contact' }
];

// Determinar se é dia (6h - 18h) ou noite (18h - 6h)
const isNightTime = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18;
};

// Aplicar tema ao documento
const applyTheme = (dark) => {
  isDark.value = dark;
  if (dark) {
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', 'light');
  }
};

// Toggle manual — guarda a preferência do utilizador
const toggleTheme = () => {
  const newDark = !isDark.value;
  applyTheme(newDark);
  localStorage.setItem('hingili-theme', newDark ? 'dark' : 'light');
  localStorage.setItem('hingili-theme-manual', 'true');
};

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

let themeInterval = null;

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  const savedTheme = localStorage.getItem('hingili-theme');
  const isManual = localStorage.getItem('hingili-theme-manual') === 'true';

  if (isManual && savedTheme) {
    // Respeitar a escolha manual do utilizador
    applyTheme(savedTheme === 'dark');
  } else {
    // Aplicar tema automático baseado na hora
    applyTheme(isNightTime());
  }

  // Verificar a hora a cada minuto para alternar automaticamente (se não houver override manual)
  themeInterval = setInterval(() => {
    const isManualNow = localStorage.getItem('hingili-theme-manual') === 'true';
    if (!isManualNow) {
      applyTheme(isNightTime());
    }
  }, 60 * 1000);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (themeInterval) clearInterval(themeInterval);
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
  background: var(--gradient-essence);
  transition: var(--transition);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-cta {
  margin-left: 10px;
}

.navbar {
  display: flex;
  align-items: center;
  gap: 12px;
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
    width: 320px;
    height: 100vh;
    background: rgba(13, 13, 17, 0.96);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 100px 40px 60px 40px;
    transition: right 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0);
    z-index: 2100;
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
    gap: 15px;
  }
  
  body[data-theme="light"] .nav-list {
    background: rgba(234, 234, 239, 0.96);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.08);
  }
  
  .nav-list.active { right: 0; }
  
  .nav-list li {
    width: 100%;
  }
  
  .nav-link {
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: padding 0.3s ease, color 0.3s ease;
  }
  
  body[data-theme="light"] .nav-link {
    border-bottom-color: rgba(0, 0, 0, 0.05);
  }
  
  .nav-link:hover {
    color: var(--accent-essence) !important;
    padding-left: 8px;
  }
  
  .nav-link::after {
    display: none;
  }
  
  .nav-cta { margin: 15px 0 0 0; width: 100%; }
  .nav-cta .btn { width: 100%; }
}

/* Nav Num and Mobile Footer styling */
.nav-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-essence);
  margin-right: 10px;
  font-family: var(--font-sans);
  opacity: 0.8;
}

@media (min-width: 901px) {
  .nav-num {
    display: none;
  }
  .mobile-menu-footer-item {
    display: none;
  }
}

@media (max-width: 900px) {
  .mobile-menu-footer-item {
    margin-top: auto;
    width: 100%;
    padding-top: 25px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
  
  body[data-theme="light"] .mobile-menu-footer-item {
    border-top-color: rgba(0, 0, 0, 0.08);
  }
  
  .mobile-menu-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .m-footer-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-dim);
    font-weight: 600;
  }
  
  .m-socials {
    display: flex;
    gap: 15px;
  }
  
  .m-socials a {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 1rem;
    transition: var(--transition);
  }
  
  body[data-theme="light"] .m-socials a {
    background: rgba(0, 0, 0, 0.05);
    color: #3f3f50;
  }
  
  .m-socials a:hover {
    background: var(--gradient-essence);
    color: #fff;
    transform: translateY(-2px);
  }
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
