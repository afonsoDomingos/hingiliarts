<template>
  <div class="auctions-page">
    <Navbar />
    
    <section class="auctions-header section">
      <div class="container container-flex">
        <div class="header-content reveal">
          <span class="sub-title">Exclusividade</span>
          <h1 class="comp-title">Leilões de <span class="highlight-linear">Arte</span></h1>
          <p class="comp-desc">Dispute peças únicas da <span class="text-white">Hingili Arts</span>. Cada licitação aproxima-o de uma obra original.</p>
        </div>
        <div class="header-actions reveal">
          <router-link to="/auctions/submit" class="artist-badge">
            <i class="fa-solid fa-palette"></i>
            <span>É um Artista? <strong>Submeta aqui</strong></span>
          </router-link>
        </div>
      </div>
    </section>

    <section class="auctions-grid section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando leilões activos...</p>
        </div>
        
        <div v-else-if="auctions.length > 0" class="a-grid">
          <div v-for="auction in auctions" :key="auction._id" class="auction-card reveal">
            <div class="a-img-box">
              <img :src="auction.imageUrl" :alt="auction.title">
              <div class="a-badge" :class="auction.status">{{ auction.status === 'active' ? 'Em Curso' : 'Agendado' }}</div>
            </div>
            <div class="a-content">
              <h3 class="a-title">{{ auction.title }}</h3>
              <div class="a-price-box">
                <span class="p-label">Licitação Actual</span>
                <span class="p-value">{{ formatCurrency(auction.currentPrice || auction.startingPrice) }} MT</span>
              </div>
              <div class="a-timer">
                <i class="fa-regular fa-clock"></i> 
                <span>Termina em: {{ formatTimeLeft(auction.endTime) }}</span>
              </div>
              <router-link :to="`/auctions/${auction._id}`" class="btn btn-primary w-100 mt-3">
                Licitar Agora <i class="fa-solid fa-gavel"></i>
              </router-link>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state reveal">
          <i class="fa-solid fa-gavel text-dim" style="font-size: 4rem; margin-bottom: 20px;"></i>
          <h3>Nenhum leilão activo de momento.</h3>
          <p class="text-secondary">Fique atento às nossas redes sociais para o anúncio de novas peças.</p>
          <router-link to="/" class="btn btn-outline mt-3">Voltar ao Início</router-link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import API_URL from '../config/api';

const auctions = ref([]);
const loading = ref(true);

const fetchAuctions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auctions`);
    auctions.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar leilões:', err);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-MZ').format(val);
};

const formatTimeLeft = (endTime) => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end - now;
  
  if (diff <= 0) return 'Terminado';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`;
};

onMounted(fetchAuctions);
</script>

<style scoped>
.auctions-page {
  padding-top: 80px;
  background: radial-gradient(circle at top right, rgba(229, 46, 113, 0.05), transparent 400px),
              radial-gradient(circle at bottom left, rgba(255, 138, 0, 0.05), transparent 400px);
}

.auctions-header {
  padding: 40px 0 20px !important;
}

.container-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
}

.comp-title {
  font-family: var(--font-serif);
  font-size: 3rem;
  line-height: 1.1;
  margin-bottom: 10px;
}

.highlight-linear {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.comp-desc {
  color: var(--text-dim);
  max-width: 500px;
  font-size: 0.95rem;
}

.artist-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 138, 0, 0.1);
  border: 1px solid rgba(255, 138, 0, 0.2);
  border-radius: 50px;
  color: #fff;
  font-size: 0.85rem;
  transition: var(--transition);
  text-decoration: none;
}

.artist-badge i {
  color: var(--accent-primary);
  font-size: 1.1rem;
}

.artist-badge:hover {
  background: var(--gradient-glow);
  border-color: transparent;
  transform: translateX(-5px);
}

@media (max-width: 768px) {
  .container-flex { flex-direction: column; align-items: flex-start; }
}

.a-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.auction-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.auction-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--accent-primary);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.a-img-box {
  position: relative;
  aspect-ratio: 3/2; /* Even more compact aspect ratio */
  overflow: hidden;
}

.a-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.auction-card:hover .a-img-box img {
  transform: scale(1.05);
}

.a-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.a-badge.active { background: #10b981; color: #fff; }
.a-badge.scheduled { background: #f59e0b; color: #fff; }

.a-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.a-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
}

.a-price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border-left: 3px solid var(--accent-primary);
}

.p-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-dim);
  letter-spacing: 1px;
}

.p-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--accent-primary);
}

.a-timer {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 100px 0;
}

.w-100 { width: 100%; }
</style>
