<template>
  <div class="auction-detail-page">
    <Navbar />
    
    <!-- Celebration Overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showSuccessOverlay" class="celebration-overlay">
          <div class="celebration-content reveal">
            <div class="confetti-placeholder">🎉</div>
            <h2 class="celeb-title">Parabéns!</h2>
            <p class="celeb-text">A sua licitação de <strong>{{ formatCurrency(bidForm.amount) }} MT</strong> foi registada.</p>
            <p class="celeb-sub">Agora és o licitante mais alto!</p>
            <button @click="showSuccessOverlay = false" class="btn btn-primary mt-3">Continuar a Acompanhar</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="container" v-if="auction">
      <div class="detail-grid section">
        <!-- Image Side -->
        <div class="image-side reveal">
          <div class="main-img">
            <img :src="auction.imageUrl" :alt="auction.title">
            <div class="time-badge">
              <i class="fa-regular fa-clock"></i> {{ timeLeft }} restantes
            </div>
          </div>
        </div>

        <!-- Info Side -->
        <div class="info-side reveal reveal-delay-2">
          <router-link to="/auctions" class="back-link">
            <i class="fa-solid fa-arrow-left"></i> Voltar à Galeria
          </router-link>
          
          <h1 class="a-title">{{ auction.title }}</h1>

          <div class="social-meta">
            <div class="meta-item">
              <i class="fa-solid fa-eye"></i> <span>{{ auction.views }} visualizações</span>
            </div>
            <button @click="handleLike" :class="['meta-item action', { 'liked': isLiked }]">
              <i class="fa-solid fa-heart"></i> <span>{{ auction.likes }} gostos</span>
            </button>
            <div class="share-actions">
              <button @click="share('whatsapp')" class="share-btn wa" title="Partilhar no WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
              <button @click="share('facebook')" class="share-btn fb" title="Partilhar no Facebook"><i class="fa-brands fa-facebook"></i></button>
              <button @click="share('twitter')" class="share-btn x" title="Partilhar no X"><i class="fa-brands fa-x-twitter"></i></button>
            </div>
          </div>
          
          <div class="auction-status-bar">
            <div class="current-bid">
              <span class="label">Licitação Actual</span>
              <h2 class="price">{{ formatCurrency(auction.currentPrice) }} <small>MT</small></h2>
              <p class="bidder" v-if="auction.highestBidder">
                <i class="fa-solid fa-crown"></i> {{ auction.highestBidder.name }}
              </p>
            </div>
            <div class="days-left">
              <span class="label">Estado</span>
              <h3 class="status-text">{{ isEnded ? 'Encerrado' : 'Em Directo' }}</h3>
              <p class="time-detail">{{ timeLeft }}</p>
            </div>
          </div>

          <!-- Bid Form -->
          <div v-if="auction.status === 'active' && !isEnded" class="bid-card-premium">
            <div class="card-header">
              <h3>Entrar na Disputa</h3>
              <p>Mínimo: {{ formatCurrency(auction.currentPrice + 500) }} MT</p>
            </div>
            
            <form @submit.prevent="placeBid" class="bid-form-styled">
              <div class="input-row">
                <div class="input-group">
                  <i class="fa-solid fa-user"></i>
                  <input v-model="bidForm.bidderName" type="text" placeholder="Seu Nome" required>
                </div>
                <div class="input-group">
                  <i class="fa-solid fa-envelope"></i>
                  <input v-model="bidForm.email" type="email" placeholder="Seu Email" required>
                </div>
              </div>
              <div class="input-group price-input">
                <i class="fa-solid fa-gavel"></i>
                <input v-model.number="bidForm.amount" type="number" :min="auction.currentPrice + 1" required>
                <span class="currency">MT</span>
              </div>
              <button type="submit" class="btn btn-primary btn-xl" :disabled="submitting">
                {{ submitting ? 'A processar...' : 'Efectuar Licitação' }}
              </button>
            </form>
            <p v-if="error" class="error-text">{{ error }}</p>
          </div>

          <div v-else class="ended-card-premium">
            <div class="icon-circle"><i class="fa-solid fa-check"></i></div>
            <h3>Leilão Finalizado</h3>
            <p v-if="auction.highestBidder">Obra arrematada por <strong>{{ auction.highestBidder.name }}</strong></p>
          </div>

          <!-- Active Bidders List -->
          <div class="bidding-history-section">
            <div class="section-title-sm">
              <h4>Histórico de Ofertas</h4>
              <span class="bid-count">{{ auction.bids.length }} licitações</span>
            </div>
            
            <div class="bids-scroll">
              <div v-for="(bid, index) in sortedBids" :key="index" :class="['bid-row', { 'top-bid': index === 0 }]">
                <div class="bid-user">
                  <div class="avatar">{{ bid.bidderName.charAt(0) }}</div>
                  <div class="user-meta">
                    <span class="u-name">{{ bid.bidderName }}</span>
                    <span class="u-date">{{ formatTimeAgo(bid.timestamp) }}</span>
                  </div>
                </div>
                <div class="bid-amount-box">
                  <span class="amount">{{ formatCurrency(bid.amount) }} MT</span>
                  <span class="tag" v-if="index === 0">Líder</span>
                </div>
              </div>
              
              <div v-if="auction.bids.length === 0" class="no-bids-state">
                <p>Nenhuma licitação ainda. Comece a história desta obra!</p>
              </div>
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
const showSuccessOverlay = ref(false);
const isLiked = ref(false);
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
    bidForm.value.amount = (auction.value.currentPrice || auction.value.startingPrice) + 500;
    startTimer();
    // Increment views
    axios.post(`${API_URL}/api/auctions/${route.params.id}/view`);
  } catch (err) {
    console.error('Erro:', err);
  }
};

const handleLike = async () => {
  if (isLiked.value) return;
  try {
    const response = await axios.post(`${API_URL}/api/auctions/${route.params.id}/like`);
    auction.value.likes = response.data.likes;
    isLiked.value = true;
  } catch (err) {
    console.error('Erro ao gostar:', err);
  }
};

const share = (platform) => {
  const url = window.location.href;
  const text = `Vejam este leilão incrível da Hingili Arts: ${auction.value.title}`;
  
  let shareUrl = '';
  if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
  else if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  
  window.open(shareUrl, '_blank');
};

const placeBid = async () => {
  submitting.value = true;
  error.value = '';
  
  try {
    const response = await axios.post(`${API_URL}/api/auctions/${route.params.id}/bid`, bidForm.value);
    auction.value = response.data;
    showSuccessOverlay.value = true;
    // Auto-hiding overlay after 10 seconds if user doesn't close it
    setTimeout(() => { showSuccessOverlay.value = false; }, 10000);
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
    
    if (days > 0) {
        timeLeft.value = `${days}d ${hours}h ${mins}m`;
    } else {
        timeLeft.value = `${hours}h ${mins}m ${secs}s`;
    }
  };
  
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-MZ').format(val);

const formatTimeAgo = (date) => {
  const diff = new Date() - new Date(date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins}m atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  return new Date(date).toLocaleDateString();
};

onMounted(fetchAuction);
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval); });
</script>

<style scoped>
.auction-detail-page { padding-top: 80px; padding-bottom: 60px; }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: start;
}

.main-img {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  aspect-ratio: 4/3;
}

.main-img img { width: 100%; height: 100%; object-fit: cover; }

.time-badge {
  position: absolute;
  bottom: 30px;
  left: 30px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px 24px;
  border-radius: 50px;
  color: #fff;
  font-weight: 700;
  border: 1px solid var(--glass-border);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--accent-primary);
  font-weight: 700;
  margin-bottom: 15px;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1.5px;
}

.a-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  margin-bottom: 15px;
}

.social-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  color: var(--text-dim);
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-item.action {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  transition: var(--transition);
}

.meta-item.action:hover, 
.meta-item.action.liked {
  color: var(--accent-primary);
}

.share-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.share-btn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: var(--bg-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.85rem;
}

.share-btn:hover {
  transform: translateY(-3px);
  border-color: var(--accent-primary);
}

.share-btn.wa:hover { background: #25d366; border-color: #25d366; }
.share-btn.fb:hover { background: #1877f2; border-color: #1877f2; }
.share-btn.x:hover { background: #000; border-color: #fff; }

.auction-status-bar {
  display: flex;
  gap: 2px;
  background: var(--glass-border);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 40px;
  border: 1px solid var(--glass-border);
}

.current-bid, .days-left {
  flex: 1;
  background: var(--bg-accent);
  padding: 20px;
}

.current-bid { background: var(--bg-secondary); }

.label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-dim);
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.price { font-size: 2rem; font-weight: 800; color: var(--accent-primary); line-height: 1; }
.price small { font-size: 1rem; opacity: 0.6; }

.bidder {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text { font-size: 1.5rem; color: #fff; margin-bottom: 5px; }
.time-detail { color: var(--text-dim); font-size: 0.9rem; }

.bid-card-premium {
  background: var(--gradient-primary);
  padding: 25px;
  border-radius: 20px;
  color: #fff;
  margin-bottom: 30px;
}

.card-header h3 { font-size: 1.5rem; margin-bottom: 5px; }
.card-header p { opacity: 0.8; font-size: 0.85rem; margin-bottom: 20px; }

.bid-form-styled { display: flex; flex-direction: column; gap: 20px; }

.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

.input-group {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
}

.input-group:focus-within { background: rgba(255, 255, 255, 0.2); border-color: #fff; }

.input-group i { color: rgba(255, 255, 255, 0.6); margin-right: 15px; }

.input-group input {
  background: transparent;
  border: none;
  color: #fff;
  padding: 18px 0;
  width: 100%;
  font-size: 1rem;
}

.input-group input::placeholder { color: rgba(255, 255, 255, 0.4); }

.price-input input { font-size: 1.5rem; font-weight: 800; }
.currency { font-weight: 800; color: #fff; }

.btn-xl { padding: 22px; font-size: 1.1rem; border: 2px solid rgba(255, 255, 255, 0.3); }

.error-text { margin-top: 15px; text-align: center; color: #ffdada; font-weight: 600; }

.ended-card-premium {
  background: var(--bg-accent);
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  border: 1px solid var(--glass-border);
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 1.5rem;
}

/* Bids List Styling */
.bidding-history-section { margin-top: 50px; }

.section-title-sm {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.bid-count { font-size: 0.8rem; background: var(--glass-border); padding: 4px 12px; border-radius: 20px; color: var(--text-dim); }

.bids-scroll {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.bid-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--bg-accent);
  border-radius: 16px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  transition: var(--transition);
}

.bid-row.top-bid {
  background: rgba(229, 46, 113, 0.05);
  border-color: var(--accent-primary);
}

.bid-user { display: flex; align-items: center; gap: 15px; }

.avatar {
  width: 45px;
  height: 45px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--accent-primary);
  border: 1px solid var(--glass-border);
}

.user-meta { display: flex; flex-direction: column; }
.u-name { font-weight: 700; color: #fff; }
.u-date { font-size: 0.75rem; color: var(--text-dim); }

.bid-amount-box { text-align: right; }
.amount { display: block; font-weight: 800; color: #fff; font-size: 1.1rem; }
.tag { font-size: 0.65rem; background: var(--accent-primary); color: #fff; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 800; }

.no-bids-state { text-align: center; color: var(--text-dim); padding: 40px 0; }

/* Celebration Overlay Styling */
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.celebration-content {
  background: var(--bg-secondary);
  padding: 60px 40px;
  border-radius: 40px;
  text-align: center;
  max-width: 500px;
  border: 1px solid var(--accent-primary);
  box-shadow: 0 0 50px rgba(229, 46, 113, 0.3);
}

.confetti-placeholder { font-size: 5rem; margin-bottom: 20px; animation: bounce 1s infinite; }

.celeb-title { font-family: var(--font-serif); font-size: 3rem; color: #fff; margin-bottom: 20px; }
.celeb-text { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 10px; }
.celeb-sub { color: var(--accent-primary); font-weight: 700; font-size: 1.1rem; margin-bottom: 30px; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 992px) {
  .detail-grid { grid-template-columns: 1fr; gap: 40px; }
  .input-row { grid-template-columns: 1fr; }
}
</style>
