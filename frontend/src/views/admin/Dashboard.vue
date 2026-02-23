<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo-text">Hingili<span class="highlight">Arts</span></h2>
        <p class="admin-label">Painel Admin</p>
      </div>
      <nav class="sidebar-nav">
        <button @click="activeTab = 'projects'" :class="{ active: activeTab === 'projects' }">
          <i class="fa-solid fa-palette"></i> Portfólio
        </button>
        <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }">
          <i class="fa-solid fa-envelope"></i> Mensagens
          <span v-if="messages.length > 0" class="badge">{{ messages.length }}</span>
        </button>
      </nav>
      <div class="sidebar-footer">
        <p class="admin-user"><i class="fa-solid fa-user"></i> {{ adminUser?.name || 'Admin' }}</p>
        <button @click="handleLogout" class="btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> Sair
        </button>
      </div>
    </aside>

    <main class="content">
      <header class="content-header">
        <div>
          <h1>{{ activeTab === 'projects' ? 'Gerir Portfólio' : 'Mensagens Recebidas' }}</h1>
          <p class="sub-header">
            {{ activeTab === 'projects' ? `${projects.length} projeto(s)` : `${messages.length} mensagem(ns)` }}
          </p>
        </div>
        <button v-if="activeTab === 'projects'" @click="openModal()" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> Novo Projeto
        </button>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-circle-notch fa-spin"></i> A carregar...
      </div>

      <!-- Projects Grid -->
      <section v-else-if="activeTab === 'projects'" class="dashboard-section">
        <div v-if="projects.length === 0" class="empty-state">
          <i class="fa-solid fa-images"></i>
          <p>Nenhum projeto ainda. Clica em "Novo Projeto" para começar!</p>
        </div>
        <div class="projects-admin-grid" v-else>
          <div v-for="project in projects" :key="project._id" class="project-admin-card">
            <div class="card-img-wrap">
              <img :src="project.images[0]" :alt="project.title">
              <span class="img-count" v-if="project.images.length > 1">
                <i class="fa-solid fa-images"></i> {{ project.images.length }}
              </span>
            </div>
            <div class="card-info">
              <h3>{{ project.title }}</h3>
              <span class="category-badge">{{ categoryLabel(project.category) }}</span>
              <div class="card-actions">
                <button @click="deleteProject(project._id)" class="btn-delete" title="Eliminar">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Messages List -->
      <section v-else class="dashboard-section">
        <div v-if="messages.length === 0" class="empty-state">
          <i class="fa-solid fa-envelope-open"></i>
          <p>Nenhuma mensagem recebida ainda.</p>
        </div>
        <div class="messages-list" v-else>
          <div v-for="msg in messages" :key="msg._id" class="message-card">
            <div class="msg-header">
              <div>
                <strong>{{ msg.name }}</strong>
                <span class="msg-email">{{ msg.email }}</span>
              </div>
              <span class="msg-date">{{ formatDate(msg.createdAt) }}</span>
            </div>
            <p class="msg-text">{{ msg.message }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal Novo Projeto -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Adicionar Novo Projeto</h2>
          <button class="modal-close" @click="showModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form @submit.prevent="createProject" class="project-form">
          <div class="form-group">
            <label>Título do Projeto *</label>
            <input v-model="newProject.title" type="text" placeholder="Ex: Mural do Hospital Central" required>
          </div>
          <div class="form-group">
            <label>Categoria *</label>
            <select v-model="newProject.category" required>
              <option value="" disabled>Escolha a Categoria</option>
              <option value="mural">Mural Artístico</option>
              <option value="ads">Publicidade & Branding</option>
              <option value="portrait">Retratos</option>
              <option value="mosaic">Projeto Decorativo</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="newProject.description" rows="2" placeholder="Breve descrição do projeto..."></textarea>
          </div>
          <div class="form-group">
            <label>Imagens * (até 5 fotos)</label>
            <div class="file-drop" @click="$refs.fileInput.click()">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <p v-if="selectedFiles.length === 0">Clica para seleccionar imagens</p>
              <p v-else><strong>{{ selectedFiles.length }} ficheiro(s)</strong> seleccionado(s)</p>
            </div>
            <input ref="fileInput" type="file" multiple @change="handleFileChange" accept="image/*" required style="display:none">
          </div>

          <p v-if="saveError" class="error-msg">{{ saveError }}</p>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              <i v-if="isSaving" class="fa-solid fa-circle-notch fa-spin"></i>
              {{ isSaving ? 'A guardar...' : 'Criar Projeto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import API_URL from '../../config/api.js';

const router = useRouter();
const activeTab = ref('projects');
const projects = ref([]);
const messages = ref([]);
const showModal = ref(false);
const isSaving = ref(false);
const isLoading = ref(false);
const saveError = ref('');
const adminUser = ref(JSON.parse(localStorage.getItem('adminUser') || 'null'));

const newProject = ref({ title: '', category: '', description: '' });
const selectedFiles = ref([]);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

const categoryLabel = (cat) => {
  const map = { mural: 'Mural Artístico', ads: 'Publicidade & Branding', portrait: 'Retratos', mosaic: 'Projeto Decorativo' };
  return map[cat] || cat;
};

const formatDate = (date) => new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [pRes, mRes] = await Promise.all([
      api.get('/portfolio'),
      api.get('/admin/messages')
    ]);
    projects.value = pRes.data;
    messages.value = mRes.data;
  } catch (err) {
    if (err.response?.status === 401) handleLogout();
  } finally {
    isLoading.value = false;
  }
};

const handleFileChange = (e) => {
  selectedFiles.value = Array.from(e.target.files);
};

const openModal = () => {
  newProject.value = { title: '', category: '', description: '' };
  selectedFiles.value = [];
  saveError.value = '';
  showModal.value = true;
};

// ✅ BUG CORRIGIDO: agora usa newProject.value.title (e não newProject.title)
const createProject = async () => {
  isSaving.value = true;
  saveError.value = '';

  const formData = new FormData();
  formData.append('title', newProject.value.title);
  formData.append('category', newProject.value.category);
  formData.append('description', newProject.value.description);
  selectedFiles.value.forEach(file => formData.append('images', file));

  try {
    await api.post('/admin/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    showModal.value = false;
    newProject.value = { title: '', category: '', description: '' };
    selectedFiles.value = [];
    await fetchData();
  } catch (err) {
    saveError.value = err.response?.data?.message || 'Erro ao guardar projeto. Tente novamente.';
  } finally {
    isSaving.value = false;
  }
};

const deleteProject = async (id) => {
  if (confirm('Tens a certeza que queres eliminar este projeto?')) {
    try {
      await api.delete(`/admin/projects/${id}`);
      await fetchData();
    } catch (err) {
      alert('Erro ao eliminar: ' + (err.response?.data?.message || err.message));
    }
  }
};

const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  router.push('/admin/login');
};

onMounted(fetchData);
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--bg-main);
}

/* ====== Sidebar ====== */
.sidebar {
  width: 270px;
  background: var(--bg-secondary);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 0 30px 30px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 20px;
}

.admin-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 5px;
}

.sidebar-nav { flex: 1; }

.sidebar-nav button {
  width: 100%;
  text-align: left;
  padding: 15px 30px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 15px;
  font-family: var(--font-sans);
}

.sidebar-nav button.active,
.sidebar-nav button:hover {
  color: #fff;
  background: rgba(255, 138, 0, 0.1);
  border-left: 3px solid #ff8a00;
}

.badge {
  background: #ff8a00;
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 20px;
  margin-left: auto;
}

.sidebar-footer {
  padding: 20px 30px 0;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.admin-user {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-logout {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 15px;
  border-radius: 8px;
  width: 100%;
  font-family: var(--font-sans);
  transition: var(--transition);
}

.btn-logout:hover { background: rgba(239,68,68,0.1); }

/* ====== Content ====== */
.content {
  flex: 1;
  padding: 40px;
  margin-left: 270px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.sub-header {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 4px;
}

/* ====== States ====== */
.loading-state, .empty-state {
  text-align: center;
  padding: 80px;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
  color: rgba(255,138,0,0.3);
}

/* ====== Projects Grid ====== */
.projects-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.project-admin-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition);
}

.project-admin-card:hover {
  border-color: rgba(255,138,0,0.3);
  transform: translateY(-3px);
}

.card-img-wrap { position: relative; }

.card-img-wrap img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.img-count {
  position: absolute;
  bottom: 8px; right: 8px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 20px;
}

.card-info { padding: 15px; }

.card-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-badge {
  font-size: 0.75rem;
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  width: 32px; height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover { background: rgba(239,68,68,0.3); }

/* ====== Messages ====== */
.message-card {
  background: var(--bg-card);
  padding: 20px 25px;
  border-radius: 12px;
  margin-bottom: 15px;
  border-left: 3px solid #ff8a00;
  transition: var(--transition);
}

.message-card:hover { background: rgba(255,255,255,0.04); }

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.msg-header strong { display: block; font-size: 1rem; }

.msg-email {
  color: #ff8a00;
  font-size: 0.85rem;
  margin-top: 3px;
  display: block;
}

.msg-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.msg-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* ====== Modal ====== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  background: var(--bg-secondary);
  padding: 35px;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  border: 1px solid rgba(255,255,255,0.05);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.3rem;
  cursor: pointer;
  transition: var(--transition);
}

.modal-close:hover { color: #fff; }

.project-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff8a00;
}

.form-group select option { background: #131317; }

.file-drop {
  border: 2px dashed rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-secondary);
}

.file-drop:hover {
  border-color: #ff8a00;
  color: #fff;
}

.file-drop i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
  color: #ff8a00;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  padding: 10px;
  background: rgba(239,68,68,0.1);
  border-radius: 8px;
  border-left: 3px solid #ef4444;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 5px;
}
</style>
