<template>
  <section class="portfolio section" id="portfolio" style="position: relative; overflow: hidden;">
    <div class="glow-blob glow-primary" style="top: 20%; left: -150px; z-index: 1;"></div>
    <div class="container" style="position: relative; z-index: 2;">
      <div class="section-header text-center reveal">
        <span class="sub-title">Portfólio</span>
        <h2 class="section-title">Nossa Galeria de <span class="highlight">Obras</span></h2>
        <div class="divider align-center"></div>
      </div>

      <div class="pg-filter reveal">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['filter-btn', { 'active': currentFilter === filter.value }]"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="portfolio-grid" v-if="filteredPortfolio.length > 0">
        <div 
          v-for="(item, index) in filteredPortfolio" 
          :key="item._id || item.id"
          :class="['portfolio-item reveal', `reveal-delay-${(index % 3) + 1}`]"
          @click="openLightbox(item)"
        >
          <div class="portfolio-card">
            <div class="portfolio-img-wrap">
              <img :src="item.images[0]" :alt="item.title">
              <div class="p-view"><i class="fa-solid fa-expand"></i></div>
            </div>
            <div class="portfolio-info">
              <div class="p-info-top">
                <span class="p-category">{{ categoryLabel(item.category) }}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="card-share-btn" @click.stop="copyShareLink(item)" title="Copiar Link">
                    <i class="fa-solid fa-share-nodes"></i>
                  </button>
                  <span class="p-views-badge" v-if="item.views">
                    <i class="fa-solid fa-eye"></i> {{ item.views }}
                  </span>
                </div>
              </div>
              <h4 class="p-title">{{ item.title }}</h4>
                <div class="p-desc" v-if="item.description">
                  <p 
                    v-for="(para, idx) in getParagraphs(getTruncatedDesc(item))" 
                    :key="idx" 
                    class="p-desc-para"
                  >
                    {{ para }}
                    <span 
                      v-if="idx === getParagraphs(getTruncatedDesc(item)).length - 1 && isLongDesc(item)" 
                      class="read-more-btn"
                      @click.stop="toggleExpand(item._id || item.id, $event)"
                    >
                      {{ expandedCards[item._id || item.id] ? ' Ler menos' : ' Ler mais' }}
                    </span>
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state reveal">
        <i class="fa-solid fa-palette text-dim mb-3" style="font-size: 3rem;"></i>
        <p class="text-secondary">Estamos a preparar novas obras para esta categoria.</p>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div :class="['lightbox', { 'active': isLightboxActive }]" @click.self="closeLightbox">
        <button class="lightbox-close-btn" @click="closeLightbox" aria-label="Fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
        
        <div class="lightbox-content">
          <!-- Coluna Esquerda: Imagem -->
          <div class="lightbox-main">
            <img :src="currentAlbum[currentImageIndex]" alt="Imagem Ampliada">
            
            <div class="lightbox-controls" v-if="currentAlbum.length > 1">
              <button class="lb-nav lb-prev" @click.stop="prevImage">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button class="lb-nav lb-next" @click.stop="nextImage">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div class="lb-counter" v-if="currentAlbum.length > 1">
              {{ currentImageIndex + 1 }} / {{ currentAlbum.length }}
            </div>
          </div>

          <!-- Coluna Direita: Detalhes com scroll -->
          <div class="lightbox-details">
            <div class="lb-details-inner">
              <span class="lb-category" v-if="currentProject">{{ categoryLabel(currentProject.category) }}</span>
              <h3 class="lb-title">{{ lightboxTitle }}</h3>

              <div class="lb-divider"></div>

              <div class="lb-desc" v-if="lightboxDescription">
                <p 
                  v-for="(para, idx) in getParagraphs(lightboxDescription)" 
                  :key="idx" 
                  class="lb-desc-para"
                >
                  {{ para }}
                </p>
              </div>

              <div class="lb-meta">
                <div class="lb-views-count" v-if="lightboxViews !== undefined">
                  <i class="fa-solid fa-eye"></i> {{ lightboxViews }} visualizações
                </div>
              </div>

              <div class="lb-share-area" v-if="currentProject">
                <span class="share-label">Partilhar:</span>
                <div class="share-buttons">
                  <button class="share-btn whatsapp" @click.stop="shareWhatsApp(currentProject)" title="Partilhar no WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                  </button>
                  <button class="share-btn facebook" @click.stop="shareFacebook(currentProject)" title="Partilhar no Facebook">
                    <i class="fa-brands fa-facebook-f"></i>
                  </button>
                  <button class="share-btn link" @click.stop="copyShareLink(currentProject)" title="Copiar Link">
                    <i class="fa-solid fa-link"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Toast Notification -->
      <Transition name="toast">
        <div v-if="showToast" class="custom-toast success">
          <i class="fa-solid fa-check-circle"></i>
          <span>{{ toastMessage }}</span>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import API_URL from '../config/api.js';

const route = useRoute();
const router = useRouter();

const portfolio = ref([]);
const currentFilter = ref('all');
const isLightboxActive = ref(false);
const currentAlbum = ref([]);
const currentImageIndex = ref(0);
const lightboxTitle = ref('');
const lightboxDescription = ref('');
const lightboxViews = ref(0);

const currentProject = ref(null);
const showToast = ref(false);
const toastMessage = ref('');

const triggerToast = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^\w\s-]/g, '')        // remove special chars
    .trim()
    .replace(/[-\s]+/g, '-')         // replace spaces and hyphens with single hyphen
    .replace(/^-+/, '')              // trim leading hyphens
    .replace(/-+$/, '');             // trim trailing hyphens
};

const getShareUrl = (project) => {
  if (!project) return window.location.origin;
  const slug = slugify(project.title);
  return `${window.location.origin}/?project=${slug}`;
};

const copyShareLink = (project) => {
  const url = getShareUrl(project);
  navigator.clipboard.writeText(url)
    .then(() => {
      triggerToast('Link copiado com sucesso! 🎉');
    })
    .catch(() => {
      triggerToast('Erro ao copiar o link. ❌');
    });
};

const shareWhatsApp = (project) => {
  const url = getShareUrl(project);
  const text = `Espreita esta obra incrível de HingiliArts: *${project.title}*\n${url}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
};

const shareFacebook = (project) => {
  const url = getShareUrl(project);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

const expandedCards = ref({});

const toggleExpand = (id, event) => {
  if (event) event.stopPropagation();
  const isExpanding = !expandedCards.value[id];
  expandedCards.value[id] = isExpanding;
  // Contabilizar visualização ao expandir (Ler mais), não ao colapsar
  if (isExpanding) {
    incrementView(id);
  }
};

const getParagraphs = (text) => {
  if (!text) return [];
  return text.replace(/\r\n/g, '\n').split('\n').map(p => p.trim()).filter(p => p.length > 0);
};

const getTruncatedDesc = (item) => {
  if (!item.description) return '';
  const limit = 120;
  if (item.description.length <= limit || expandedCards.value[item._id || item.id]) {
    return item.description;
  }
  return item.description.slice(0, limit) + '...';
};

const isLongDesc = (item) => {
  return item.description && item.description.length > 120;
};

const categoryLabel = (cat) => {
  const map = { 
    mural: 'Mural Artístico', 
    ads: 'Publicidade & Branding', 
    portrait: 'Retrato Surreal', 
    mosaic: 'Decoração' 
  };
  return map[cat] || cat;
};

const filters = computed(() => {
  const base = [{ label: 'Todos', value: 'all' }];
  const uniqueCategories = [...new Set(portfolio.value.map(item => item.category))].filter(Boolean);
  
  uniqueCategories.forEach(cat => {
    const label = categoryLabel(cat);
    if (!base.some(f => f.value === cat)) {
      base.push({ label, value: cat });
    }
  });
  
  return base;
});

const filteredPortfolio = computed(() => {
  if (currentFilter.value === 'all') return portfolio.value;
  return portfolio.value.filter(item => item.category === currentFilter.value);
});const findProjectByQuery = (queryVal) => {
  if (!queryVal) return null;
  return portfolio.value.find(p => {
    const id = p._id || p.id;
    return id === queryVal || slugify(p.title) === queryVal;
  });
};

const fetchPortfolio = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio`);
    portfolio.value = response.data;
    
    // Verificar se existe query param de projeto no carregamento inicial
    if (route.query.project) {
      const project = findProjectByQuery(route.query.project);
      if (project) {
        openLightbox(project);
      }
    }
  } catch (error) {
    console.error('Falha ao carregar portfólio:', error);
  }
};

const openLightbox = (item) => {
  currentProject.value = item;
  currentAlbum.value = item.images;
  currentImageIndex.value = 0;
  lightboxTitle.value = item.title;
  lightboxDescription.value = item.description || '';
  lightboxViews.value = item.views || 0;
  isLightboxActive.value = true;
  document.body.style.overflow = 'hidden';
  
  // Atualizar query parameter na URL com o slug
  const slug = slugify(item.title);
  router.replace({ query: { ...route.query, project: slug } });
  
  incrementView(item._id || item.id);
};

const incrementView = async (id) => {
  try {
    await axios.post(`${API_URL}/api/portfolio/${id}/view`);
    const project = portfolio.value.find(p => (p._id || p.id) === id);
    if (project) {
      project.views = (project.views || 0) + 1;
      lightboxViews.value = project.views;
    }
  } catch (error) {
    console.error('Falha ao registar visualização:', error);
  }
};

const closeLightbox = () => {
  isLightboxActive.value = false;
  document.body.style.overflow = '';
  currentProject.value = null;
  
  // Remover query parameter da URL
  const query = { ...route.query };
  delete query.project;
  router.replace({ query });
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentAlbum.value.length;
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentAlbum.value.length) % currentAlbum.value.length;
};

// Observar alterações no query parameter da rota (ex: botão Voltar/Avançar do browser)
watch(() => route.query.project, (newVal) => {
  if (newVal) {
    const project = findProjectByQuery(newVal);
    const currentId = currentProject.value ? (currentProject.value._id || currentProject.value.id) : null;
    const projectId = project ? (project._id || project.id) : null;
    
    if (project && currentId !== projectId) {
      openLightbox(project);
    }
  } else {
    if (isLightboxActive.value) {
      isLightboxActive.value = false;
      document.body.style.overflow = '';
      currentProject.value = null;
    }
  }
});
onMounted(() => {
  fetchPortfolio();
});
</script>

<style scoped>
.pg-filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 60px;
}

.filter-btn {
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--gradient-essence);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(2, 132, 199, 0.2);
}

.portfolio-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  aspect-ratio: auto;
  overflow: visible;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
}

.portfolio-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: rgba(13, 13, 17, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.4s, box-shadow 0.4s;
  height: 100%;
}

.portfolio-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 138, 0, 0.35);
  box-shadow: 0 20px 45px rgba(255, 138, 0, 0.12);
}

.portfolio-img-wrap {
  width: 100%;
  height: 280px;
  overflow: hidden;
  position: relative;
}

.portfolio-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.portfolio-card:hover .portfolio-img-wrap img {
  transform: scale(1.1);
}

.portfolio-info {
  position: relative;
  background: rgba(26, 26, 32, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-top: 1px solid var(--glass-border);
  flex-grow: 1;
  transition: var(--transition);
}

.p-info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.p-category {
  color: var(--accent-essence);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
}

.p-views-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-dim);
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--glass-border);
  padding: 3px 9px;
  border-radius: 50px;
  white-space: nowrap;
}

.p-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: #fff;
  line-height: 1.4;
  margin: 8px 0;
}

.p-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-top: 6px;
  text-align: left;
}

.p-desc-para {
  margin-bottom: 8px;
}

.p-desc-para:last-child {
  margin-bottom: 0;
}

.read-more-btn {
  color: var(--accent-essence);
  font-weight: 700;
  cursor: pointer;
  margin-left: 4px;
  transition: color 0.3s;
}

.read-more-btn:hover {
  color: var(--accent-primary);
}

.portfolio-img-wrap .p-view {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transform: scale(0);
  transition: var(--transition);
  z-index: 10;
}

.portfolio-card:hover .p-view {
  transform: scale(1);
}

.empty-state {
  text-align: center;
  padding: 100px 0;
}

/* Lightbox Premium — Layout Lado a Lado */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(4, 4, 8, 0.97);
  backdrop-filter: blur(24px);
  z-index: 3000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lightbox.active {
  display: flex;
}

/* Botão fechar flutuante */
.lightbox-close-btn {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 3100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.25s, transform 0.2s;
}

.lightbox-close-btn:hover {
  background: rgba(255, 80, 80, 0.7);
  transform: scale(1.1);
}

/* Wrapper principal — dois painéis lado a lado */
.lightbox-content {
  width: 100%;
  max-width: 1300px;
  height: 88vh;
  display: flex;
  flex-direction: row;
  gap: 0;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(14, 14, 20, 0.95);
  border: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
}

/* Painel Esquerdo — Imagem */
.lightbox-main {
  position: relative;
  flex: 0 0 58%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
}

.lightbox-main img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  z-index: 10;
}

.lb-nav:hover {
  background: var(--gradient-primary);
  border-color: transparent;
}

.lb-prev { left: 16px; }
.lb-next { right: 16px; }

.lb-counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: rgba(255,255,255,0.8);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 5px 14px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
}

/* Painel Direito — Detalhes com scroll */
.lightbox-details {
  flex: 0 0 42%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255,255,255,0.07);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.lightbox-details::-webkit-scrollbar {
  width: 4px;
}
.lightbox-details::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}

.lb-details-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px 36px;
}

.lb-category {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--accent-essence);
}

.lb-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  line-height: 1.3;
  color: #fff;
  margin: 0;
}

.lb-divider {
  height: 1px;
  background: linear-gradient(to right, rgba(255,138,0,0.4), transparent);
  margin: 2px 0;
}

.lb-desc {
  color: rgba(220, 220, 230, 0.88);
  font-size: 0.97rem;
  line-height: 1.75;
  text-align: justify;
}

.lb-desc-para {
  margin-bottom: 14px;
}

.lb-desc-para:last-child {
  margin-bottom: 0;
}

.lb-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 4px;
}

.lb-views-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim);
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 5px 12px;
  border-radius: 50px;
}

@media (max-width: 900px) {
  .pg-filter {
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 10px 0;
    margin-bottom: 30px;
    gap: 10px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .pg-filter::-webkit-scrollbar {
    display: none;
  }

  .filter-btn {
    flex-shrink: 0;
    padding: 8px 18px;
    font-size: 0.8rem;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }

  .portfolio-img-wrap {
    height: 240px;
  }

  .portfolio-info {
    padding: 20px;
  }

  .p-title {
    font-size: 1.3rem;
  }

  .portfolio-img-wrap .p-view {
    transform: scale(1);
    width: 40px;
    height: 40px;
    top: 15px;
    right: 15px;
  }

  /* Lightbox mobile: coluna única (imagem em cima, texto em baixo) */
  .lightbox {
    padding: 0;
    align-items: flex-end;
  }

  .lightbox-content {
    max-width: 100%;
    height: 95svh;
    flex-direction: column;
    border-radius: 20px 20px 0 0;
  }

  .lightbox-main {
    flex: 0 0 45%;
    border-left: none;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .lightbox-details {
    flex: 1;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .lb-details-inner {
    padding: 24px 20px;
    gap: 12px;
  }

  .lb-title {
    font-size: 1.3rem;
  }

  .lb-desc {
    font-size: 0.92rem;
    line-height: 1.65;
  }
  
  .lb-nav {
    width: 38px;
    height: 38px;
  }

  .lb-counter {
    font-size: 0.72rem;
  }
}

/* Estilos de Partilha */
.lb-share-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
}

.share-label {
  color: var(--text-dim);
  font-size: 0.85rem;
  font-weight: 600;
}

.share-buttons {
  display: flex;
  gap: 8px;
}

.share-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.share-btn:hover {
  transform: translateY(-2px);
}

.share-btn.whatsapp:hover {
  background: #25d366;
  border-color: transparent;
  color: #fff;
}

.share-btn.facebook:hover {
  background: #1877f2;
  border-color: transparent;
  color: #fff;
}

.share-btn.link:hover {
  background: var(--gradient-primary);
  border-color: transparent;
  color: #fff;
}

.card-share-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: var(--transition);
}

.card-share-btn:hover {
  color: var(--accent-essence);
  transform: scale(1.1);
}

/* Toast Global/Local */
.custom-toast {
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 16px 24px;
  border-radius: 12px;
  background: rgba(25, 25, 30, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.custom-toast.success { border-left: 4px solid #10b981; }
.custom-toast.success i { color: #10b981; }

.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from { opacity: 0; transform: translateX(100px); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }
</style>
