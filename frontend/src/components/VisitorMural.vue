<template>
  <section class="visitor-mural-section section reveal">
    <div class="container">
      <div class="mural-header text-center">
        <span class="sub-title">Comunidade</span>
        <h2 class="section-title">Mural de <span class="highlight">Visitantes</span></h2>
        <p class="section-desc">Deixe a sua marca artística na história da Hingili Arts. Carimbe o seu nome no nosso mural interativo.</p>
      </div>

      <div class="mural-container">
        <!-- Input Form -->
        <div class="stamp-form-container">
          <form @submit.prevent="submitStamp" class="stamp-form">
            <input 
              v-model="newName" 
              type="text" 
              placeholder="Escreva o seu nome..." 
              maxlength="30"
              required
              class="stamp-input"
            >
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'A Carimbar...' : 'Carimbar Mural' }}
            </button>
          </form>
          <p v-if="error" class="error-msg text-center mt-3">{{ error }}</p>
          <p v-if="success" class="success-msg text-center mt-3">Carimbado com sucesso! ✨</p>
        </div>

        <!-- The Wall -->
        <div class="mural-wall" ref="wall">
          <TransitionGroup name="stamp">
            <div 
              v-for="stamp in stamps" 
              :key="stamp._id" 
              class="visitor-stamp"
              :style="getStampStyle(stamp)"
            >
              <div class="stamp-content">
                <span class="visitor-name">{{ stamp.name }}</span>
                <span class="stamp-date">{{ formatDate(stamp.createdAt) }}</span>
              </div>
              <div class="stamp-bg"></div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import API_URL from '../config/api';

const stamps = ref([]);
const newName = ref('');
const submitting = ref(false);
const error = ref('');
const success = ref(false);

const fetchStamps = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/stamps`);
    stamps.value = res.data;
  } catch (err) {
    console.error('Erro ao carregar mural:', err);
  }
};

const submitStamp = async () => {
  if (!newName.value.trim()) return;
  submitting.value = true;
  error.value = '';
  success.value = false;
  
  try {
    const res = await axios.post(`${API_URL}/api/stamps`, { name: newName.value });
    stamps.value.unshift(res.data);
    newName.value = '';
    success.value = true;
    setTimeout(() => { success.value = false; }, 3000);
    
    // Limit visually
    if (stamps.value.length > 50) stamps.value.pop();
  } catch (err) {
    console.error('Erro ao carimbar:', err);
    error.value = 'Erro ao carimbar. Tente novamente.';
  } finally {
    submitting.value = false;
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const getStampStyle = (stamp) => {
  const styles = [
    { font: "'Playfair Display', serif", color: '#ff8a00', rotate: '-5deg', scale: 1 },
    { font: "'Outfit', sans-serif", color: '#e52e71', rotate: '3deg', scale: 1.1 },
    { font: "cursive", color: '#fff', rotate: '-2deg', scale: 0.9 },
    { font: "'Outfit', sans-serif", color: '#ff8a00', rotate: '4deg', scale: 1.05 },
    { font: "serif", color: '#a1a1aa', rotate: '-4deg', scale: 0.95 },
    { font: "'Playfair Display', serif", color: '#fff', rotate: '2deg', scale: 1.15 },
    { font: "sans-serif", color: '#e52e71', rotate: '-3deg', scale: 1 },
    { font: "cursive", color: '#ff8a00', rotate: '5deg', scale: 1.02 }
  ];
  
  const style = styles[stamp.styleIndex % styles.length];
  return {
    fontFamily: style.font,
    color: style.color,
    transform: `rotate(${style.rotate}) scale(${style.scale})`,
    opacity: 0.9
  };
};

onMounted(fetchStamps);
</script>

<style scoped>
.mural-container {
  margin-top: 50px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.stamp-form-container {
  max-width: 500px;
  margin: 0 auto 60px;
  position: relative;
  z-index: 10;
}

.stamp-form {
  display: flex;
  gap: 15px;
  background: var(--bg-accent);
  padding: 10px;
  border-radius: 100px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.stamp-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding-left: 25px;
  font-size: 1rem;
}

.stamp-input:focus { outline: none; }

.mural-wall {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px 40px;
  min-height: 200px;
}

.visitor-stamp {
  position: relative;
  padding: 10px 20px;
  cursor: default;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.visitor-stamp:hover {
  scale: 1.2 !important;
  z-index: 5;
  filter: drop-shadow(0 0 15px currentColor);
}

.stamp-content {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.visitor-name {
  font-size: 1.8rem;
  font-weight: 800;
  white-space: nowrap;
}

.stamp-date {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.5;
  margin-top: 4px;
}

/* Animations */
.stamp-enter-active,
.stamp-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stamp-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.5);
}

@media (max-width: 768px) {
  .stamp-form { flex-direction: column; border-radius: 20px; padding: 20px; }
  .visitor-name { font-size: 1.4rem; }
  .mural-wall { gap: 20px; }
}
</style>
