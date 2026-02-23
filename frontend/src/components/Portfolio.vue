<template>
  <section class="portfolio section" id="portfolio">
    <div class="container">
      <div class="section-title-wrap">
        <h2 class="section-title">Nossa <span class="highlight">Galeria Visual</span></h2>
        <div class="divider"></div>
      </div>

      <div class="pg-filter">
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
          v-for="item in filteredPortfolio" 
          :key="item._id || item.id"
          class="portfolio-item"
          @click="openLightbox(item)"
        >
          <div class="portfolio-img">
            <img :src="item.images[0]" :alt="item.title">
            <div class="portfolio-overlay">
              <h4 class="p-title">{{ item.title }}</h4>
              <span class="p-cat">{{ item.description }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center mt-3">
        <p class="text-secondary">Nenhum projeto encontrado nesta categoria.</p>
      </div>
    </div>


    <!-- Lightbox Modal -->
    <div :class="['lightbox', { 'active': isLightboxActive }]" @click.self="closeLightbox">
      <span class="lightbox-close" @click="closeLightbox">&times;</span>
      <div class="lightbox-content">
        <img :src="currentAlbum[currentImageIndex]" alt="Imagem Ampliada">
        <div class="lightbox-controls" v-if="currentAlbum.length > 1">
          <button class="lightbox-btn" @click.stop="prevImage">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="lightbox-btn" @click.stop="nextImage">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div class="lightbox-caption">{{ lightboxTitle }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const portfolio = ref([]);
const currentFilter = ref('all');
const isLightboxActive = ref(false);
const currentAlbum = ref([]);
const currentImageIndex = ref(0);
const lightboxTitle = ref('');

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Murais Artísticos', value: 'mural' },
  { label: 'Publicidade & Branding', value: 'ads' },
  { label: 'Retratos', value: 'portrait' },
  { label: 'Projetos Decorativos', value: 'mosaic' }
];

const filteredPortfolio = computed(() => {
  if (currentFilter.value === 'all') return portfolio.value;
  return portfolio.value.filter(item => item.category === currentFilter.value);
});

const fetchPortfolio = async () => {
  try {
    // Attempting to fetch from backend, fallback to hardcoded if backend not running
    const response = await axios.get('http://localhost:5000/api/portfolio');
    portfolio.value = response.data;
  } catch (error) {
    console.error('Falha ao carregar portfólio do backend:', error);
  }
};

const openLightbox = (item) => {
  currentAlbum.value = item.images;
  currentImageIndex.value = 0;
  lightboxTitle.value = item.title;
  isLightboxActive.value = true;
};

const closeLightbox = () => {
  isLightboxActive.value = false;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % currentAlbum.value.length;
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + currentAlbum.value.length) % currentAlbum.value.length;
};

onMounted(() => {
  fetchPortfolio();
});
</script>
