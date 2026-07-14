<template>
  <section class="biography section" id="biografia" style="position: relative; overflow: hidden;">
    <div class="glow-blob bio-glow" style="top: 10%; right: -200px; z-index: 1;"></div>

    <div class="container" style="position: relative; z-index: 2;">
      <!-- Cabeçalho -->
      <div class="section-header text-center reveal">
        <span class="sub-title">O Artista</span>
        <h2 class="section-title">Biografia & <span class="highlight">Currículo Artístico</span></h2>
        <div class="divider align-center"></div>
      </div>

      <!-- Layout principal: foto + texto -->
      <div class="bio-grid">
        <!-- Coluna esquerda: foto + destaques -->
        <div class="bio-left reveal">
          <div class="bio-photo-wrap">
            <div class="bio-photo-frame">
              <img src="/assets/img/Banner01.jpg" alt="Hingili — Artista Plástico" class="bio-photo" />
            </div>
            <div class="bio-name-card">
              <span class="bio-real-name">Lars dos Santos Chambule</span>
              <span class="bio-art-name">Hingili</span>
              <span class="bio-origin">Maputo, Moçambique</span>
            </div>
          </div>

          <!-- Factos rápidos -->
          <div class="bio-facts">
            <div class="fact-item">
              <i class="fa-solid fa-palette fact-icon"></i>
              <div>
                <span class="fact-label">Início da Formação</span>
                <span class="fact-value">2009 — Casa da Cultura do Alto Maé</span>
              </div>
            </div>
            <div class="fact-item">
              <i class="fa-solid fa-trophy fact-icon"></i>
              <div>
                <span class="fact-label">Prémio</span>
                <span class="fact-value">3º Lugar — Concurso Municipal Juventude (2022)</span>
              </div>
            </div>
            <div class="fact-item">
              <i class="fa-solid fa-globe fact-icon"></i>
              <div>
                <span class="fact-label">Representação Internacional</span>
                <span class="fact-value">Bienal da CPLP (2015) — Desenho & Pintura</span>
              </div>
            </div>
            <div class="fact-item">
              <i class="fa-solid fa-building-columns fact-icon"></i>
              <div>
                <span class="fact-label">Empresa Registada</span>
                <span class="fact-value">Hingili Artes Lda. (2021)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna direita: texto completo com tabs -->
        <div class="bio-right reveal">
          <!-- Tabs -->
          <div class="bio-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['bio-tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon"></i> {{ tab.label }}
            </button>
          </div>

          <!-- Tab: Biografia -->
          <div v-show="activeTab === 'bio'" class="bio-tab-content">
            <p class="bio-para">
              <strong>Hingili</strong>, nome artístico de Lars dos Santos Chambule, é um artista plástico moçambicano, natural de Maputo. Desde jovem demonstrou paixão pelas artes visuais, iniciando a sua formação artística em <strong>2009</strong> na <em>Casa da Cultura do Alto Maé</em>.
            </p>
            <p class="bio-para">
              Artista multifacetado, Hingili tem-se destacado na produção de <strong>murais com forte carga simbólica e social</strong>, utilizando técnicas mistas como relevo com cimento, isopor, gesso e acrílico sobre parede ou tela, assim como assemblagem.
            </p>
            <p class="bio-para">
              Em <strong>2025</strong>, participou de duas residências artísticas promovidas pelo <em>Tamos Juntos – Colectivo de Artes e Justiça Climática</em>, onde estreou na técnica de assemblagem abordando injustiça social e justiça climática em escolas moçambicanas.
            </p>
            <p class="bio-para">
              De 2009 a 2018 trabalhou como colaborador em empresas de pintura publicitária para campanhas de várias marcas em Moçambique. Em <strong>2019</strong> decide difundir o seu talento, expandindo a pintura publicitária às zonas sul, centro e norte do país, tendo em <strong>2021</strong> registado a <strong>Hingili Artes Lda.</strong>
            </p>
            <p class="bio-para">
              Em 2025, pintou junto com a sua equipa os murais de campanha <em>TESTA–LÁ HIV</em> nos municípios de KaMavota e Marracuene, e realizou pinturas sacras com destaque para o mural de <em>Jesus e São Pedro No Mar</em>, na Igreja de São Pedro de KaTembe, Guacheni, Cidade de Maputo.
            </p>
            <p class="bio-para">
              Além da produção de obras visuais, Hingili actua em <strong>workshops de artes plásticas e poesia</strong> nas línguas Ronga, Changana e Português, promovendo o diálogo entre arte, cultura e identidade moçambicana.
            </p>
          </div>

          <!-- Tab: Obras em Destaque -->
          <div v-show="activeTab === 'obras'" class="bio-tab-content">
            <p class="bio-section-intro">Entre as obras marcantes estão:</p>
            <div class="works-list">
              <div v-for="work in majorWorks" :key="work.title" class="work-item">
                <span class="work-year">{{ work.year }}</span>
                <div class="work-info">
                  <span class="work-title">{{ work.title }}</span>
                  <span class="work-desc" v-if="work.desc">{{ work.desc }}</span>
                </div>
              </div>
            </div>
            <p class="bio-para bio-note">
              Os quadros únicos <em>(In)verdades</em>, <em>As controvérsias da esperança</em> e <em>O que vês em mim?</em>, com forte teor político-religioso, social e nacional, têm repercutido além-fronteiras.
            </p>
          </div>

          <!-- Tab: Currículo -->
          <div v-show="activeTab === 'cv'" class="bio-tab-content">
            <div class="cv-section">
              <h4 class="cv-section-title"><i class="fa-solid fa-star"></i> Distinções & Prémios</h4>
              <div class="cv-item">
                <span class="cv-year">2022</span>
                <p>3º lugar na categoria de criação artística na <strong>1ª Edição do Concurso Municipal Juventude</strong></p>
              </div>
            </div>

            <div class="cv-section">
              <h4 class="cv-section-title"><i class="fa-solid fa-earth-africa"></i> Participações Internacionais</h4>
              <div class="cv-item">
                <span class="cv-year">2015</span>
                <p><strong>Bienal da CPLP</strong> — Representou Moçambique na categoria de Desenho e Pintura</p>
              </div>
              <div class="cv-item">
                <span class="cv-year">—</span>
                <p><strong>Mostra Nacional de Jovens Criadores</strong></p>
              </div>
            </div>

            <div class="cv-section">
              <h4 class="cv-section-title"><i class="fa-solid fa-seedling"></i> Residências Artísticas</h4>
              <div class="cv-item">
                <span class="cv-year">2025</span>
                <p>Duas residências promovidas pelo <strong>Tamos Juntos – Colectivo de Artes e Justiça Climática</strong> — Estreia na técnica de assemblagem</p>
              </div>
            </div>

            <div class="cv-section">
              <h4 class="cv-section-title"><i class="fa-solid fa-brush"></i> Técnicas & Especialidades</h4>
              <div class="cv-tags">
                <span class="cv-tag" v-for="t in techniques" :key="t">{{ t }}</span>
              </div>
            </div>

            <div class="cv-section">
              <h4 class="cv-section-title"><i class="fa-solid fa-language"></i> Línguas de Trabalho</h4>
              <div class="cv-tags">
                <span class="cv-tag" v-for="l in languages" :key="l">{{ l }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('bio');

const tabs = [
  { id: 'bio',   label: 'Biografia',        icon: 'fa-solid fa-user-pen' },
  { id: 'obras', label: 'Obras em Destaque', icon: 'fa-solid fa-image' },
  { id: 'cv',    label: 'Currículo',         icon: 'fa-solid fa-scroll' },
];

const majorWorks = [
  { year: '2026', title: 'E se fosse o seu lar?', desc: 'Mural' },
  { year: '2025', title: 'Violência cibernética baseada no género', desc: 'Mural' },
  { year: '2025', title: 'Ilícito', desc: 'Mural' },
  { year: '2025', title: 'Utopia sonora', desc: 'Mural' },
  { year: '2025', title: 'Jesus e São Pedro No Mar', desc: 'Pintura Sacra — Igreja de São Pedro de KaTembe' },
  { year: '2024', title: 'Patinagem em linha', desc: 'Mural' },
  { year: '2023', title: 'Comunicando com a comunidade', desc: 'Mural' },
  { year: '2021', title: 'Heróis da pátria', desc: 'Mural' },
  { year: '—',    title: '(In)verdades', desc: 'Técnica mista — Relevo & Acrílico' },
  { year: '—',    title: 'As controvérsias da esperança', desc: 'Técnica mista' },
  { year: '—',    title: 'O que vês em mim?', desc: 'Técnica mista' },
];

const techniques = [
  'Relevo com Cimento', 'Assemblagem', 'Acrílico sobre Tela', 'Pintura Mural',
  'Gesso & Isopor', 'Arte Ecológica', 'Pintura Publicitária', 'Pintura Sacra',
  'Decoração de Interiores', 'Efeito Rocha',
];

const languages = ['Português', 'Ronga', 'Changana'];
</script>

<style scoped>
.biography {
  background: var(--bg-main);
}

.bio-glow {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 138, 0, 0.08), transparent 70%);
  border-radius: 50%;
  position: absolute;
  pointer-events: none;
}

/* ── Layout Grid ── */
.bio-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 70px;
  align-items: flex-start;
  margin-top: 70px;
}

/* ── Coluna Esquerda ── */
.bio-left {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: sticky;
  top: 100px;
}

.bio-photo-wrap {
  position: relative;
}

.bio-photo-frame {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-premium);
}

.bio-photo-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(4,4,8,0.85) 100%);
  z-index: 1;
  pointer-events: none;
}

.bio-photo {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
}

.bio-photo-wrap:hover .bio-photo {
  transform: scale(1.04);
}

.bio-name-card {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bio-real-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.bio-art-name {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.bio-origin {
  font-size: 0.8rem;
  color: var(--accent-essence);
  font-weight: 600;
}

/* Facts */
.bio-facts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fact-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 14px 18px;
  transition: var(--transition);
}

.fact-item:hover {
  border-color: rgba(255, 138, 0, 0.25);
  background: rgba(255,138,0,0.04);
}

.fact-icon {
  color: var(--accent-primary);
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.fact-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-dim);
  margin-bottom: 2px;
}

.fact-value {
  display: block;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* ── Coluna Direita ── */
.bio-right {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Tabs */
.bio-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.bio-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  color: var(--text-dim);
  cursor: pointer;
  transition: var(--transition);
}

.bio-tab:hover {
  color: var(--text-secondary);
  border-color: rgba(255,255,255,0.12);
}

.bio-tab.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 20px rgba(229, 46, 113, 0.2);
}

/* Tab Content */
.bio-tab-content {
  animation: tabFadeIn 0.35s ease;
}

@keyframes tabFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.bio-para {
  color: rgba(200, 200, 215, 0.88);
  font-size: 1rem;
  line-height: 1.85;
  margin-bottom: 20px;
  text-align: justify;
}

.bio-para strong { color: #fff; }
.bio-para em { color: var(--accent-essence); font-style: normal; }

/* Obras em Destaque */
.bio-section-intro {
  color: var(--text-dim);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 20px;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 28px;
}

.work-item {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--bg-accent);
  transition: var(--transition);
}

.work-item:hover {
  border-color: rgba(255, 138, 0, 0.2);
  background: rgba(255,138,0,0.03);
  transform: translateX(4px);
}

.work-year {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--accent-primary);
  min-width: 38px;
  padding-top: 2px;
  letter-spacing: 0.5px;
}

.work-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.work-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.work-desc {
  font-size: 0.78rem;
  color: var(--text-dim);
}

.bio-note {
  font-size: 0.92rem;
  border-left: 3px solid var(--accent-essence);
  padding-left: 16px;
  color: rgba(180,180,200,0.8);
}

/* Currículo */
.cv-section {
  margin-bottom: 36px;
}

.cv-section-title {
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent-essence);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--glass-border);
}

.cv-item {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.cv-year {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--accent-primary);
  min-width: 38px;
  padding-top: 3px;
}

.cv-item p {
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.6;
}

.cv-item p strong { color: var(--text-primary); }

.cv-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cv-tag {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 50px;
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  transition: var(--transition);
}

.cv-tag:hover {
  border-color: rgba(255,138,0,0.3);
  color: var(--text-primary);
}

/* ── Responsivo ── */
@media (max-width: 1100px) {
  .bio-grid {
    grid-template-columns: 320px 1fr;
    gap: 50px;
  }
}

@media (max-width: 900px) {
  .bio-grid {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .bio-left {
    position: static;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }

  .bio-photo {
    height: 360px;
  }

  .bio-tabs {
    justify-content: center;
  }

  .bio-para {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .bio-photo { height: 280px; }
  .bio-tab { padding: 8px 16px; font-size: 0.78rem; }
  .bio-art-name { font-size: 1.8rem; }
}
</style>
