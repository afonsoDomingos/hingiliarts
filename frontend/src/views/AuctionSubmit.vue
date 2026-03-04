<template>
  <div class="auction-submit-page">
    <Navbar />
    
    <section class="section">
      <div class="container">
        <div class="submit-container reveal">
          <div class="form-header text-center mb-5">
            <span class="sub-title">Para Artistas</span>
            <h1 class="section-title">Submeta a sua <span class="highlight">Obra</span></h1>
            <p class="section-desc">Quer que a sua arte seja leiloada na Hingili Arts? Preencha os detalhes abaixo e a nossa equipa irá analisar a sua proposta.</p>
          </div>

          <div class="submit-card">
            <form v-if="!submitted" @submit.prevent="handleSubmit" class="submit-form">
              <div class="form-grid">
                <!-- Artist Info -->
                <div class="form-section">
                  <h3><i class="fa-solid fa-user-pen"></i> Detalhes do Artista</h3>
                  <div class="form-group">
                    <label>Nome Completo / Pseudónimo *</label>
                    <input v-model="form.artistName" type="text" placeholder="Como quer ser identificado" required>
                  </div>
                  <div class="form-group">
                    <label>Contacto (Email ou Telefone) *</label>
                    <input v-model="form.artistContact" type="text" placeholder="Para entrarmos em contacto" required>
                  </div>
                </div>

                <!-- Artwork Info -->
                <div class="form-section">
                  <h3><i class="fa-solid fa-palette"></i> Detalhes da Obra</h3>
                  <div class="form-group">
                    <label>Título da Obra *</label>
                    <input v-model="form.title" type="text" placeholder="Título que aparecerá no leilão" required>
                  </div>
                  <div class="form-group">
                    <label>Preço Inicial Sugerido (MT) *</label>
                    <input v-model.number="form.startingPrice" type="number" step="0.01" required>
                  </div>
                  <div class="form-group">
                    <label>Data de Término Desejada *</label>
                    <input v-model="form.endTime" type="datetime-local" required>
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label>Descrição da Obra e Materiais Usados</label>
                <textarea v-model="form.description" rows="4" placeholder="Conte-nos a história desta peça..."></textarea>
              </div>

              <div class="form-group full-width">
                <label>Imagem da Obra *</label>
                <div class="file-upload-box" @click="$refs.fileInput.click()">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                  <p v-if="!selectedFile">Arraste ou clique para enviar a imagem principal</p>
                  <p v-else class="selected-text">{{ selectedFile.name }}</p>
                  <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" style="display:none" required>
                </div>
              </div>

              <div class="form-footer text-center mt-4">
                <p v-if="error" class="error-msg mb-3">{{ error }}</p>
                <button type="submit" class="btn btn-primary btn-lg" :disabled="submitting">
                  {{ submitting ? 'A Enviar Proposta...' : 'Enviar para Aprovação' }}
                </button>
              </div>
            </form>

            <div v-else class="success-state text-center py-5">
              <div class="success-icon"><i class="fa-solid fa-check-double"></i></div>
              <h2 class="mb-3">Proposta Recebida!</h2>
              <p>A sua obra foi enviada para a nossa equipa de curadoria. <br> Entraremos em contacto brevemente através dos dados fornecidos.</p>
              <router-link to="/auctions" class="btn btn-outline mt-4">Voltar aos Leilões</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import API_URL from '../config/api';

const submitted = ref(false);
const submitting = ref(false);
const error = ref('');
const selectedFile = ref(null);

const form = ref({
  artistName: '',
  artistContact: '',
  title: '',
  description: '',
  startingPrice: 0,
  endTime: ''
});

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleSubmit = async () => {
  submitting.value = true;
  error.value = '';

  const fd = new FormData();
  Object.keys(form.value).forEach(key => fd.append(key, form.value[key]));
  if (selectedFile.value) fd.append('image', selectedFile.value);

  try {
    await axios.post(`${API_URL}/api/auctions/submit`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    submitted.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao submeter proposta. Tente novamente.';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.auction-submit-page { padding-top: 100px; }

.submit-container { max-width: 900px; margin: 0 auto; }

.section-desc { color: var(--text-secondary); max-width: 600px; margin: 0 auto; }

.submit-card {
  background: var(--bg-accent);
  border: 1px solid var(--glass-border);
  padding: 50px;
  border-radius: 30px;
  box-shadow: var(--shadow-premium);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.form-section h3 {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 15px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  color: #fff;
  transition: var(--transition);
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--accent-primary);
  outline: none;
}

.full-width { grid-column: 1 / -1; margin-bottom: 30px; }

.file-upload-box {
  border: 2px dashed var(--glass-border);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.file-upload-box:hover {
  border-color: var(--accent-primary);
  background: rgba(229, 46, 113, 0.05);
}

.file-upload-box i { font-size: 2.5rem; color: var(--text-dim); margin-bottom: 15px; }

.selected-text { color: var(--accent-primary); font-weight: 700; }

.error-msg { color: #ef4444; font-weight: 600; }

.success-icon {
  width: 80px;
  height: 80px;
  background: var(--accent-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 30px;
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .submit-card { padding: 30px; }
}
</style>
