<template>
  <div class="app-wrapper">
    <Navbar />
    <Hero />
    <About class="reveal" />
    <MissionVision />
    
    <!-- Highlights -->
    <section class="highlights reveal">
      <div class="container">
        <div class="hl-grid">
          <div v-for="(hl, index) in highlights" :key="hl.title" :class="['hl-item', `reveal-delay-${index + 1}`]">
            <div class="icon-box"><i :class="hl.icon"></i></div>
            <h3 class="hl-title">{{ hl.title }}</h3>
            <p class="hl-text">{{ hl.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <Services class="reveal" />
    <Portfolio class="reveal" />

    <!-- Process -->
    <section class="process section" id="process">
      <div class="container text-center">
        <span class="sub-title reveal">Workflow</span>
        <h2 class="section-title reveal">Como Damos <span class="highlight">Vida</span> à sua Ideia</h2>
        <div class="divider align-center reveal"></div>
        
        <div class="process-container">
          <div v-for="(step, index) in processSteps" :key="index" :class="['process-item reveal', `reveal-delay-${index + 1}`]">
            <div class="process-head">
              <span class="process-num">{{ step.num }}</span>
              <div class="process-line" v-if="index < processSteps.length - 1"></div>
            </div>
            <div class="process-body">
              <h4 class="process-step-title">{{ step.title }}</h4>
              <p class="process-step-text">{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-banner reveal">
      <div class="container">
        <div class="cta-card">
          <div class="cta-content text-center">
            <span class="sub-title" style="color: #fff; opacity: 0.8;">Vamos Colaborar?</span>
            <h2 class="cta-title">Quer transformar o <br><span class="highlight">seu espaço</span>?</h2>
            <p class="cta-text">Traga a sua ideia. Nós damos a cor, a forma e a dimensão.</p>
            <div class="cta-btns">
              <a href="#contact" class="btn btn-primary btn-lg">Solicitar Orçamento <i class="fa-solid fa-paper-plane"></i></a>
              <a href="https://wa.me/258844473620" class="btn btn-outline btn-lg">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />

    <!-- Floating Buttons -->
    <div class="floating-controls">
      <a href="https://wa.me/258844473620" target="_blank" class="float-btn float-whatsapp">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <button 
        :class="['float-btn float-scroll-up', { 'show': showScrollTop }]" 
        @click="scrollToTop"
      >
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import Hero from '../components/Hero.vue';
import About from '../components/About.vue';
import MissionVision from '../components/MissionVision.vue';
import Services from '../components/Services.vue';
import Portfolio from '../components/Portfolio.vue';
import Footer from '../components/Footer.vue';

const showScrollTop = ref(false);

const highlights = [
  { icon: 'fa-solid fa-building', title: 'Projetos Corporativos', text: 'Experiência sólida na concepção de arte para empresas.' },
  { icon: 'fa-solid fa-handshake', title: 'Atendimento Próprio', text: 'Atendimento personalizado para entender sua visão completa.' },
  { icon: 'fa-solid fa-check-double', title: 'Execução Profissional', text: 'Técnica apurada garantindo durabilidade e impacto.' },
  { icon: 'fa-solid fa-expand', title: 'Grande Escala', text: 'Especialistas em empenas, grandes fachadas e murais.' }
];

const processSteps = [
  { num: '01', title: 'Briefing & Planejamento', text: 'Avaliamos o espaço, ideias e objetivos do cliente.' },
  { num: '02', title: 'Criação do Conceito', text: 'Elaboramos esboços e a direção artística da obra.' },
  { num: '03', title: 'Execução Profissional', text: 'Pintura ou aplicação com técnicas precisas no local.' },
  { num: '04', title: 'Entrega e Finalização', text: 'Retoques finais e entrega da obra deslumbrante.' }
];

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const initReveal = () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Uma vez animado, não precisamos mais observar
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Pequeno timeout para garantir que o DOM está pronto e evitar conflitos de carregamento
  setTimeout(initReveal, 100);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Highlights Styles */
.hl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.hl-item {
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  transition: var(--transition);
}

.hl-item:hover {
  transform: translateY(-10px);
  border-color: var(--accent-primary);
  background: var(--bg-secondary);
}

.hl-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #fff;
}

.hl-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* CTA Styles */
.cta-banner {
  padding: 120px 0;
}

.cta-card {
  background: linear-gradient(135deg, rgba(229, 46, 113, 0.1), rgba(255, 138, 0, 0.1)), url('/assets/img/Banner01.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 40px;
  padding: 100px 40px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(5, 5, 5, 0.85);
  z-index: 1;
}

.cta-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-family: var(--font-serif);
  margin-bottom: 20px;
  color: #fff;
}

.cta-text {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.cta-btns {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 600px) {
  .cta-btns {
    flex-direction: column;
  }
}
.app-wrapper {
  overflow-x: hidden;
}

/* Process Styles */
.process-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 80px;
  position: relative;
}

.process-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.process-head {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.process-num {
  width: 60px;
  height: 60px;
  background: var(--bg-accent);
  border: 2px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--accent-primary);
  z-index: 2;
  transition: var(--transition);
}

.process-item:hover .process-num {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0 20px rgba(229, 46, 113, 0.4);
  transform: scale(1.1);
}

.process-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--glass-border);
  z-index: 1;
}

.process-step-title {
  font-size: 1.3rem;
  font-family: var(--font-serif);
  margin-bottom: 12px;
  color: #fff;
}

.process-step-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 992px) {
  .process-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 60px 30px;
  }
  
  .process-line {
    display: none;
  }
}

@media (max-width: 600px) {
  .process-container {
    grid-template-columns: 1fr;
  }
}

.floating-controls {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1500;
}
</style>
