<template>
  <section class="services section bg-darker" id="services">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="sub-title">O Que Fazemos</span>
        <h2 class="section-title">Soluções Criativas de <span class="highlight">Alto Impacto</span></h2>
        <div class="divider align-center"></div>
      </div>

      <div class="services-grid">
        <div v-for="(service, index) in services" :key="service.title" class="service-card reveal" :class="`reveal-delay-${index + 1}`">
          <div class="s-icon-box">
            <i :class="service.icon"></i>
            <div class="icon-glow"></div>
          </div>
          <h3 class="s-title">{{ service.title }}</h3>
          <p class="s-text">{{ service.text }}</p>
          <div class="s-footer">
            <span class="s-link">Saiba mais <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  { icon: 'fa-solid fa-palette', title: 'Artes Plásticas', text: 'Criações expressivas e murais monumentais que transformam qualquer edifício em uma obra de arte viva.' },
  { icon: 'fa-solid fa-bullhorn', title: 'Publicidade', text: 'Propaganda de alto impacto e estratégias visuais concebidas para destacar a sua marca no mercado.' },
  { icon: 'fa-solid fa-pen-nib', title: 'Design Gráfico', text: 'Identidade visual sofisticada e soluções digitais desenhadas com precisão para o seu negócio.' },
  { icon: 'fa-solid fa-film', title: 'Animação Cultural', text: 'Experiências vibrantes e eventos dinâmicos que celebram a cultura e unem a comunidade.' },
  { icon: 'fa-solid fa-hammer', title: 'Mosaicos & Decoração', text: 'Transformação de interiores com detalhes artísticos, mosaicos personalizados e acabamentos de luxo.' },
  { icon: 'fa-solid fa-camera-retro', title: 'Retratos & Arte', text: 'Capturamos a essência humana através de retratos hiper-realistas e obras personalizadas.' }
];
</script>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.service-card {
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  padding: 50px 40px;
  border-radius: 24px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-primary);
  background: var(--bg-secondary);
}

.s-icon-box {
  width: 70px;
  height: 70px;
  background: var(--glass);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
  transition: var(--transition);
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: var(--gradient-glow);
  filter: blur(15px);
  opacity: 0;
  transition: var(--transition);
  border-radius: 50%;
}

.service-card:hover .icon-glow {
  opacity: 1;
}

.service-card:hover .s-icon-box {
  background: var(--gradient-primary);
  color: #fff;
  transform: scale(1.1);
}

.s-title {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  margin-bottom: 15px;
  color: #fff;
  z-index: 2;
}

.s-text {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 30px;
  font-size: 1.05rem;
  z-index: 2;
}

.s-footer {
  margin-top: auto;
  z-index: 2;
}

.s-link {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
}

.service-card:hover .s-link {
  gap: 15px;
  color: #fff;
}

@media (max-width: 600px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
