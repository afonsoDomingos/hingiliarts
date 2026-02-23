<template>
  <footer class="footer bg-darker" id="contact">
    <div class="container footer-grid">
      <div class="footer-info">
        <h3>Hingili <span class="highlight">Arts</span>, Lda.</h3>
        <p>Especializada em arte mural, pintura publicitária e projetos artísticos personalizados. Moçambique.</p>
        <div class="socials">
          <a href="https://web.facebook.com/Xiwozramati" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
          <a href="https://wa.me/258844473620" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>

      <div class="footer-contacts">
        <h4>Contactos Rápidos</h4>
        <ul class="contact-list">
          <li><i class="fa-solid fa-phone"></i> +258 84 447 3620</li>
          <li><i class="fa-brands fa-whatsapp"></i> +258 84 447 3620</li>
          <li><i class="fa-solid fa-envelope"></i> hingiliarteslda@gmail.com</li>
          <li><i class="fa-solid fa-location-dot"></i> Av. Das FPLM. Bairro De Maxaquene - D. Q. 28, N. 127.</li>
        </ul>
      </div>

      <div class="footer-form">
        <h4>Fale Conosco</h4>
        <form @submit.prevent="submitForm" class="contact-form">
          <input v-model="form.name" type="text" placeholder="Seu Nome" required>
          <input v-model="form.email" type="email" placeholder="Seu Email" required>
          <textarea v-model="form.message" rows="3" placeholder="Sua Mensagem" required></textarea>
          <button type="submit" class="btn btn-secondary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
          </button>
          <div v-if="successMsg" class="success-msg" style="color:#10b981; margin-top:10px;">
            {{ successMsg }}
          </div>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-content">
        <p>&copy; 2026 Hingili Arts Lda. Todos os direitos reservados. Design e Desenvolvimento Vibe <a href="https://linkedin.com/in/afonso-domingos-6b59361a5/" target="_blank" style="color: #ff8a00; text-decoration: none;">Afonso Domingos</a>.</p>
        <router-link to="/admin/login" class="admin-link-subtle">Acesso Restrito</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import API_URL from '../config/api.js';

const form = reactive({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const successMsg = ref('');

const submitForm = async () => {
  isSubmitting.value = true;
  successMsg.value = '';
  
  try {
    await axios.post(`${API_URL}/api/contact`, form);
    successMsg.value = 'Mensagem enviada com sucesso!';
    form.name = '';
    form.email = '';
    form.message = '';
    
    setTimeout(() => {
      successMsg.value = '';
    }, 5000);
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    successMsg.value = 'Erro ao enviar. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.admin-link-subtle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
  transition: var(--transition);
}

.admin-link-subtle:hover {
  color: #ff8a00;
}

@media (max-width: 768px) {
  .footer-bottom-content {
    justify-content: center;
    text-align: center;
  }
}
</style>
