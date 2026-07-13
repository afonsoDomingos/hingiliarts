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
        <div class="lightbox-close-area" @click="closeLightbox">
          <span class="lightbox-close">&times;</span>
        </div>
        
        <div class="lightbox-content reveal">
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
          </div>
          
          <div class="lightbox-details">
            <div class="lb-info-wrap">
              <h3 class="lb-title">{{ lightboxTitle }}</h3>
              <div class="lb-desc" v-if="lightboxDescription">
                <p 
                  v-for="(para, idx) in getParagraphs(lightboxDescription)" 
                  :key="idx" 
                  class="lb-desc-para"
                >
                  {{ para }}
                </p>
              </div>
              <div class="lb-views-count" v-if="lightboxViews !== undefined">
                <i class="fa-solid fa-eye"></i> {{ lightboxViews }} visualizações
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
            <div class="lb-counter">{{ currentImageIndex + 1 }} / {{ currentAlbum.length }}</div>
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
  expandedCards.value[id] = !expandedCards.value[id];
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

/* Lightbox Premium */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.98);
  backdrop-filter: blur(20px);
  z-index: 3000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.lightbox.active {
  display: flex;
}

.lightbox-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.lightbox-main {
  position: relative;
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-main img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: var(--shadow-premium);
}

.lightbox-close-area {
  position: absolute;
  top: 30px;
  right: 30px;
  cursor: pointer;
  z-index: 3010;
}

.lightbox-close {
  font-size: 3rem;
  color: #fff;
  line-height: 1;
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.lb-nav:hover {
  background: var(--gradient-primary);
  border-color: transparent;
}

.lb-prev { left: -30px; }
.lb-next { right: -30px; }

.lightbox-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid var(--glass-border);
  padding-top: 20px;
}

.lb-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 80%;
  text-align: left;
}

.lb-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  color: #fff;
}

.lb-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.45;
}

.lb-desc-para {
  margin-bottom: 10px;
}

.lb-desc-para:last-child {
  margin-bottom: 0;
}

.lb-views-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim);
  font-size: 0.85rem;
  margin-top: 4px;
}

.lb-counter {
  color: var(--text-dim);
  font-weight: 600;
  letter-spacing: 2px;
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

  .lb-info-wrap {
    max-width: 70%;
  }

  .lb-title {
    font-size: 1.4rem;
  }

  .lb-desc {
    font-size: 0.9rem;
  }
  
  .lb-nav {
    width: 40px;
    height: 40px;
  }
  
  .lb-prev { left: 10px; }
  .lb-next { right: 10px; }
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
