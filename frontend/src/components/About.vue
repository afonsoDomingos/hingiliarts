<template>
  <section class="about section bg-darker" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-image reveal">
          <div class="img-container">
            <div class="img-frame">
              <img src="/assets/img/Banner01.jpg" alt="Equipa Hingili Arts em acção">
              <div class="experience-badge">
                <span class="years">10+</span>
                <span class="exp-text">Anos de <br>Experiência</span>
              </div>
            </div>
            <!-- Decorative circle -->
            <div class="decorative-blob"></div>
          </div>
        </div>
        
        <div class="about-content reveal">
          <span class="sub-title">A Nossa Essência</span>
          <h2 class="section-title">Paixão pela Arte, <br><span class="highlight">Excelência no Detalhe</span></h2>
          <div class="divider"></div>
          
          <p class="about-text">
            A <strong>Hingili Arts</strong> nasceu do desejo de transformar <strong>ideas</strong> em narrativas visuais vibrantes. Somos uma empresa moçambicana especializada em, artes plásticas, pintura mural, pintura publicitária, artesanato e design de espaços, unindo a criatividade artística à precisão técnica.
          </p>
          <p class="about-text">
            Acreditamos que cada espaço, cada arte, tem o potencial de inspirar. Por isso, trabalhamos de mãos dadas com os nossos clientes para garantir que a identidade da marca seja capturada com perfeição.
          </p>
          
          <div class="stats-glass">
            <div class="stat-item">
              <span class="stat-num">200+</span>
              <span class="stat-label">Projetos</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">50+</span>
              <span class="stat-label">Empresas</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">100%</span>
              <span class="stat-label">Foco</span>
            </div>
          </div>
          
          <a href="#contact" class="btn btn-primary mt-3">Descobrir Mais <i class="fa-solid fa-plus"></i></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 80px;
  align-items: center;
}

.img-container {
  position: relative;
  padding: 20px;
}

.img-frame {
  position: relative;
  z-index: 2;
}

.img-frame img {
  border-radius: 12px;
  box-shadow: var(--shadow-premium);
  transition: var(--transition);
}

.decorative-blob {
  position: absolute;
  top: -30px;
  left: -30px;
  width: 200px;
  height: 200px;
  background: var(--gradient-glow);
  filter: blur(40px);
  border-radius: 50%;
  z-index: 1;
}

/* Sobrescrita para o azul da essência para evitar o ruído do azul escuro */
.highlight {
  background: linear-gradient(135deg, #0284c7, #0ea5e9) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
}

.experience-badge {
  position: absolute;
  bottom: 40px;
  right: -20px;
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  padding: 24px;
  border-radius: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 15px 30px rgba(2, 132, 199, 0.3);
  z-index: 3;
}

.years {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1;
}

.exp-text {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
}

.about-text {
  color: var(--text-secondary);
  font-size: 1.15rem;
  margin-bottom: 25px;
  line-height: 1.8;
}

.stats-glass {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
  padding: 30px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-essence);
  margin-bottom: 5px;
  font-family: var(--font-serif);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 100px;
  }
  
  .about-content {
    text-align: center;
  }
  
  .divider {
    margin-left: auto;
    margin-right: auto;
  }
  
  .stats-glass {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 600px) {
  .experience-badge {
    right: 20px;
    bottom: -20px;
    padding: 15px;
  }
  
  .years { font-size: 2rem; }
  
  .stats-glass {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
