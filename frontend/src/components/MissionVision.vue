<template>
  <section class="mvv section" id="mvv">
    <div class="container">
      <div class="mvv-grid">
        <div v-for="(item, index) in items" :key="index" class="mvv-card reveal" :class="`reveal-delay-${index + 1}`">
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="card-icon">
              <i :class="item.icon"></i>
            </div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    title: 'Nossa Missão',
    icon: 'fa-solid fa-rocket',
    text: 'Transformar espaços através da arte e design, entregando soluções visuais inovadoras que elevam a identidade e o valor dos ambientes dos nossos clientes.'
  },
  {
    title: 'Nossa Visão',
    icon: 'fa-solid fa-eye',
    text: 'Sermos reconhecidos como a empresa líder em Moçambique na convergência entre artes plásticas e publicidade, inspirando através da cor e técnica.'
  },
  {
    title: 'Nossos Valores',
    icon: 'fa-solid fa-gem',
    text: 'Excelência técnica, criatividade sem limites, compromisso com o prazo, integridade nas relações e valorização da cultura moçambicana.'
  }
];
</script>

<style scoped>
.mvv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.mvv-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 50px 40px;
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mvv-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-primary);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--gradient-glow), transparent 70%);
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}

.mvv-card:hover .card-glow {
  opacity: 1;
}

.card-icon {
  width: 80px;
  height: 80px;
  background: var(--glass);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: var(--accent-primary);
  margin-bottom: 25px;
  transition: var(--transition);
  border: 1px solid var(--glass-border);
}

.mvv-card:hover .card-icon {
  background: var(--gradient-primary);
  color: #fff;
  transform: scale(1.1) rotate(-5deg);
}

.card-title {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #fff;
}

.card-text {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.05rem;
}

@media (max-width: 600px) {
  .mvv-grid {
    grid-template-columns: 1fr;
  }
  
  .mvv-card {
    padding: 40px 25px;
  }
}
</style>
