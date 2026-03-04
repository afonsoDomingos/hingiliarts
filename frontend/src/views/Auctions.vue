<template>
  <div class="auctions-page">
    <Navbar />
    
    <section class="auctions-hero section bg-darker py-4">
      <div class="container text-center reveal">
        <span class="sub-title">Exclusividade</span>
        <h2 class="section-title mb-2">Leilões de <span class="highlight">Obras de Arte</span></h2>
        <p class="section-desc mb-3">Dispute peças únicas da Hingili Arts. Cada licitação aproxima-o de uma obra original.</p>
        <div class="artist-cta mb-3">
          <router-link to="/auctions/submit" class="btn btn-outline small-btn">É um Artista? Submeta a sua Obra</router-link>
        </div>
        <div class="divider align-center"></div>
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
  padding-top: 60px;
}

.auctions-hero {
  padding: 40px 0 !important;
}

.section-desc {
  max-width: 600px;
  margin: 0 auto 15px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.a-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.auction-card {
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  overflow: hidden;
  transition: var(--transition);
}

.auction-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-primary);
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
  padding: 15px;
}

.a-title {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  color: #fff;
}

.a-price-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--glass);
  border-radius: 12px;
}

.p-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-dim);
  letter-spacing: 1px;
  margin-bottom: 5px;
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
