<template>
  <section class="portfolio section" id="portfolio">
    <div class="container">
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
            </div>
            <div class="portfolio-info">
              <span class="p-category">{{ categoryLabel(item.category) }}</span>
              <h4 class="p-title">{{ item.title }}</h4>
              <div class="p-view"><i class="fa-solid fa-expand"></i></div>
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
            <h3 class="lb-title">{{ lightboxTitle }}</h3>
            <div class="lb-counter">{{ currentImageIndex + 1 }} / {{ currentAlbum.length }}</div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import API_URL from '../config/api.js';

const portfolio = ref([]);
const currentFilter = ref('all');
const isLightboxActive = ref(false);
const currentAlbum = ref([]);
const currentImageIndex = ref(0);
const lightboxTitle = ref('');

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Murais', value: 'mural' },
  { label: 'Publicidade', value: 'ads' },
  { label: 'Retratos', value: 'portrait' },
  { label: 'Decorações', value: 'mosaic' }
];

const filteredPortfolio = computed(() => {
  if (currentFilter.value === 'all') return portfolio.value;
  return portfolio.value.filter(item => item.category === currentFilter.value);
});

const fetchPortfolio = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio`);
    portfolio.value = response.data;
  } catch (error) {
    console.error('Falha ao carregar portfólio:', error);
  }
};

const openLightbox = (item) => {
  currentAlbum.value = item.images;
  currentImageIndex.value = 0;
  lightboxTitle.value = item.title;
  isLightboxActive.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  isLightboxActive.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentAlbum.value.length;
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentAlbum.value.length) % currentAlbum.value.length;
};

const categoryLabel = (cat) => {
  const map = { 
    mural: 'Mural Artístico', 
    ads: 'Publicidade & Branding', 
    portrait: 'Retrato Hiper-realista', 
    mosaic: 'Decoração' 
  };
  return map[cat] || cat;
};

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
  aspect-ratio: 4/5;
  background: var(--bg-secondary);
}

.portfolio-img-wrap {
  width: 100%;
  height: 100%;
  transition: var(--transition);
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
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  opacity: 0;
  transition: var(--transition);
}

.portfolio-card:hover .portfolio-info {
  opacity: 1;
}

.p-category {
  color: var(--accent-essence);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  display: block;
}

.p-title {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  color: #fff;
  line-height: 1.2;
}

.p-view {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transform: scale(0);
  transition: var(--transition);
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

.lb-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  color: #fff;
}

.lb-counter {
  color: var(--text-dim);
  font-weight: 600;
  letter-spacing: 2px;
}

@media (max-width: 900px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .lb-nav {
    width: 40px;
    height: 40px;
  }
  
  .lb-prev { left: 10px; }
  .lb-next { right: 10px; }
}
</style>
