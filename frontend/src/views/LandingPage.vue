<template>
  <div class="app-wrapper">
    <Navbar />
    <Hero />
    <About class="reveal" />
    
    <!-- Highlights -->
    <section class="highlights section">
      <div class="container">
        <div class="hl-grid">
          <div v-for="(hl, index) in highlights" :key="hl.title" :class="['hl-item reveal', `reveal-delay-${index + 1}`]">
            <div class="icon-box"><i :class="hl.icon"></i></div>
            <h3>{{ hl.title }}</h3>
            <p>{{ hl.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <Services class="reveal" />
    <Portfolio class="reveal" />

    <!-- Process -->
    <section class="process section bg-darker" id="process">
      <div class="container text-center">
        <h2 class="section-title reveal">Processo de <span class="highlight">Trabalho</span></h2>
        <div class="divider align-center reveal"></div>
        <div class="process-wrapper">
          <div v-for="(step, index) in processSteps" :key="index" :class="['process-step reveal', `reveal-delay-${index + 1}`]">
            <div class="step-num">{{ step.num }}</div>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-banner reveal">
      <div class="container text-center cta-content">
        <h2 class="cta-title">Quer transformar o seu espaço?</h2>
        <p>Traga a sua ideia. Nós damos a col e a dimensão.</p>
        <a href="#contact" class="btn btn-primary btn-lg mt-3">Solicitar Orçamento Agora <i class="fa-solid fa-envelope"></i></a>
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
.app-wrapper {
  overflow-x: hidden;
}

.floating-controls {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1500;
}
</style>
