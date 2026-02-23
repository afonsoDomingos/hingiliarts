<template>
  <section class="services section bg-darker" id="services">
    <div class="container">
      <div class="section-title-wrap text-center">
        <h2 class="section-title">Os Nossos <span class="highlight">Serviços</span></h2>
        <div class="divider"></div>
      </div>

      <div class="services-grid">
        <div v-for="service in services" :key="service.title" class="service-card">
          <div class="s-icon"><i :class="service.icon"></i></div>
          <h3 class="s-title">{{ service.title }}</h3>
          <p class="s-text">{{ service.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  { icon: 'fa-solid fa-palette', title: 'Artes Plásticas', text: 'Criações expressivas, artísticas e murais que transformam qualquer ambiente com cor e técnica.' },
  { icon: 'fa-solid fa-hammer', title: 'Artesanato', text: 'Peças únicas e exclusivas desenvolvidas com dedicação, mestria e tradição.' },
  { icon: 'fa-solid fa-masks-theater', title: 'Artes Performativas', text: 'Atuações imersivas que dão vida à arte em palco ou através de intervenções criativas.' },
  { icon: 'fa-solid fa-pen-nib', title: 'Desenho Gráfico', text: 'Identidade visual digital e soluções criativas modernas desenhadas à medida da sua marca.' },
  { icon: 'fa-solid fa-bullhorn', title: 'Publicidade', text: 'Estratégias visuais, propaganda de impacto e arte publicitária para destacar negócios.' },
  { icon: 'fa-solid fa-film', title: 'Animação Cultural', text: 'Eventos vibrantes e dinâmicas criativas que celebram a cultura e unem a comunidade.' }
];
</script>
