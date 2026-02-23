<template>
  <section class="about section bg-darker" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-image">
          <div class="img-frame">
            <img src="/assets/img/Banner01.jpg" alt="Equipa Hingili Arts em acção">
            <div class="experience-badge">
              <span class="years">10+</span>
              <span class="exp-text">Anos de <br>Experiência</span>
            </div>
          </div>
        </div>
        <div class="about-content">
          <h4 class="sub-title">Conheça a nossa história</h4>
          <h2 class="section-title">Paixão pela Arte, <span class="highlight">Excelência no Detalhe</span></h2>
          <div class="divider"></div>
          <p class="about-text">
            A <strong>Hingili Arts</strong> nasceu do desejo de transformar paredes cinzentas em narrativas visuais vibrantes. Somos uma empresa moçambicana especializada em arte mural, sinalização publicitária e design de espaços, unindo a criatividade artística à precisão técnica.
          </p>
          <p class="about-text">
            Acreditamos que cada espaço tem o potencial de inspirar. Por isso, trabalhamos de mãos dadas com os nossos clientes — desde murais urbanos de grande escala a sinalização corporativa sofisticada — garantindo que a identidade da marca ou a visão do artista seja capturada com perfeição.
          </p>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-num">200+</span>
              <span class="stat-label">Projetos Concluídos</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">50+</span>
              <span class="stat-label">Clientes Corporativos</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">100%</span>
              <span class="stat-label">Paixão & Dedicação</span>
            </div>
          </div>
          <a href="#contact" class="btn btn-primary mt-3">Saber Mais Sobre Nós</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-image {
  position: relative;
}

.img-frame {
  position: relative;
  z-index: 1;
}

.img-frame img {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  filter: grayscale(20%);
  transition: var(--transition);
}

.img-frame:hover img {
  filter: grayscale(0%);
}

.experience-badge {
  position: absolute;
  bottom: -30px;
  right: -30px;
  background: linear-gradient(135deg, #ff8a00, #e52e71);
  padding: 25px;
  border-radius: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(229, 46, 113, 0.4);
  z-index: 2;
}

.years {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.exp-text {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sub-title {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.about-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 20px;
  line-height: 1.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 35px 0;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.stat-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 80px;
  }
  
  .about-content {
    text-align: center;
  }
  
  .divider {
    margin: 0 auto 2rem;
  }
  
  .experience-badge {
    right: 50%;
    transform: translateX(50%);
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 30px;
  }
}
</style>
