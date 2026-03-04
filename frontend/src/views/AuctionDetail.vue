<template>
  <div class="auction-detail-page">
    <Navbar />
    
    <div class="container" v-if="auction">
      <div class="detail-grid section">
        <!-- Image Gallery Side -->
        <div class="image-side reveal">
          <div class="main-img reveal">
            <img :src="auction.imageUrl" :alt="auction.title">
          </div>
        </div>

        <!-- Info & Bidding Side -->
        <div class="info-side reveal reveal-delay-2">
          <router-link to="/auctions" class="back-link">
            <i class="fa-solid fa-arrow-left"></i> Voltar aos leilões
          </router-link>
          
          <h1 class="a-title">{{ auction.title }}</h1>
          <p class="a-desc">{{ auction.description }}</p>

          <div class="auction-stats">
            <div class="stat-box main">
              <span class="stat-label">Licitação Actual</span>
              <span class="stat-value highlight">{{ formatCurrency(auction.currentPrice) }} MT</span>
              <span class="stat-sub" v-if="auction.highestBidder">Por: {{ auction.highestBidder.name }}</span>
              <span class="stat-sub" v-else>Nenhuma licitação ainda</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Tempo Restante</span>
              <span class="stat-value countdown">{{ timeLeft }}</span>
            </div>
          </div>

          <!-- Bid Form -->
          <div v-if="auction.status === 'active' && !isEnded" class="bid-card">
            <h3>Fazer Licitação</h3>
            <p class="bid-info">Mínimo necessário: {{ formatCurrency(auction.currentPrice + 1) }} MT</p>
            
            <form @submit.prevent="placeBid" class="bid-form">
              <div class="form-group">
                <input v-model="bidForm.bidderName" type="text" placeholder="Seu Nome" required>
              </div>
              <div class="form-group">
                <input v-model="bidForm.email" type="email" placeholder="Seu Email" required>
              </div>
              <div class="form-group bid-input-wrap">
                <input v-model.number="bidForm.amount" type="number" :min="auction.currentPrice + 1" placeholder="Valor da Licitação" required>
                <span class="currency-tag">MT</span>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
                {{ submitting ? 'Processando...' : 'Confirmar Licitação' }}
              </button>
            </form>
            <p v-if="error" class="error-msg">{{ error }}</p>
            <p v-if="success" class="success-msg">Licitação efectuada com sucesso!</p>
          </div>

          <div v-else class="ended-card">
            <i class="fa-solid fa-lock"></i>
            <h3>Leilão Terminado</h3>
            <p v-if="auction.highestBidder">Vendido a {{ auction.highestBidder.name }} por {{ formatCurrency(auction.currentPrice) }} MT</p>
            <p v-else>Leilão encerrado sem licitações.</p>
          </div>

          <!-- Bid History -->
          <div class="bid-history">
            <h4>Histórico de Licitações ({{ auction.bids.length }})</h4>
            <div class="history-list">
              <div v-for="(bid, index) in sortedBids" :key="index" class="history-item">
                <div class="h-info">
                  <span class="h-name">{{ bid.bidderName }}</span>
                  <span class="h-time">{{ formatTimeAgo(bid.timestamp) }}</span>
                </div>
                <div class="h-amount">{{ formatCurrency(bid.amount) }} MT</div>
              </div>
              <div v-if="auction.bids.length === 0" class="no-bids">Sem licitações ainda. Seja o primeiro!</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container section text-center">
      <div class="spinner"></div>
      <p>Carregando detalhes da obra...</p>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import API_URL from '../config/api';

const route = useRoute();
const auction = ref(null);
const submitting = ref(false);
const error = ref('');
const success = ref(false);
const timeLeft = ref('');
let timerInterval = null;

const bidForm = ref({
  bidderName: '',
  email: '',
  amount: 0
});

const isEnded = computed(() => {
  if (!auction.value) return true;
  return new Date() > new Date(auction.value.endTime);
});

const sortedBids = computed(() => {
  if (!auction.value) return [];
  return [...auction.value.bids].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

const fetchAuction = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auctions/${route.params.id}`);
    auction.value = response.data;
    bidForm.value.amount = (auction.value.currentPrice || auction.value.startingPrice) + 1;
    startTimer();
  } catch (err) {
    console.error('Erro:', err);
  }
};

const placeBid = async () => {
  submitting.value = true;
  error.value = '';
  success.value = false;
  
  try {
    const response = await axios.post(`${API_URL}/api/auctions/${route.params.id}/bid`, bidForm.value);
    auction.value = response.data;
    success.value = true;
    bidForm.value.amount = auction.value.currentPrice + 500; // Increment suggestion
    setTimeout(() => { success.value = false; }, 5000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao processar licitação';
  } finally {
    submitting.value = false;
  }
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  
  const updateTimer = () => {
    if (!auction.value) return;
    
    const end = new Date(auction.value.endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) {
      timeLeft.value = 'Terminado';
      clearInterval(timerInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    timeLeft.value = `${days}d ${hours}h ${mins}m ${secs}s`;
  };
  
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-MZ').format(val);

const formatTimeAgo = (date) => {
  const diff = new Date() - new Date(date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Agora mesmo';
  if (mins < 60) return `Há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Há ${hours} h`;
  return new Date(date).toLocaleDateString();
};

onMounted(fetchAuction);
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval); });
</script>

<style scoped>
.auction-detail-page { padding-top: 100px; }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.main-img {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  position: sticky;
  top: 120px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--accent-primary);
  font-weight: 600;
  margin-bottom: 30px;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.a-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.1;
  margin-bottom: 20px;
}

.a-desc {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 40px;
}

.auction-stats {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.stat-box {
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  padding: 25px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

.stat-box.main {
  background: var(--glass);
  border-color: var(--accent-primary);
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
}

.stat-value.highlight { color: var(--accent-primary); }

.stat-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

.countdown { font-family: monospace; }

.bid-card {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 40px;
  border-radius: 24px;
  margin-bottom: 40px;
}

.bid-info {
  font-size: 0.9rem;
  color: var(--accent-primary);
  margin-bottom: 20px;
}

.bid-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bid-form input {
  width: 100%;
  padding: 15px 20px;
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  color: #fff;
}

.bid-form input:focus { border-color: var(--accent-primary); outline: none; }

.bid-input-wrap { position: relative; }
.currency-tag {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 800;
  color: var(--text-dim);
}

.ended-card {
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 0, 0, 0.1);
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  margin-bottom: 40px;
}

.ended-card i { font-size: 3rem; color: #ef4444; margin-bottom: 15px; }

.bid-history {
  margin-top: 60px;
}

.history-list {
  margin-top: 20px;
  border-top: 1px solid var(--glass-border);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--glass-border);
}

.h-name { display: block; font-weight: 700; color: #fff; }
.h-time { font-size: 0.8rem; color: var(--text-dim); }
.h-amount { font-weight: 800; color: var(--accent-primary); }

.error-msg { color: #ef4444; margin-top: 15px; text-align: center; }
.success-msg { color: #10b981; margin-top: 15px; text-align: center; }

@media (max-width: 992px) {
  .detail-grid { grid-template-columns: 1fr; }
  .main-img { position: relative; top: 0; }
  .auction-stats { grid-template-columns: 1fr; }
}
</style>
