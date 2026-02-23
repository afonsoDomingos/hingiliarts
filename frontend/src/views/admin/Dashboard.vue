<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo-text">Hingili<span class="highlight">Arts</span></h2>
      </div>
      <nav class="sidebar-nav">
        <button @click="activeTab = 'projects'" :class="{ active: activeTab === 'projects' }">
          <i class="fa-solid fa-palette"></i> Portfólio
        </button>
        <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }">
          <i class="fa-solid fa-envelope"></i> Mensagens
        </button>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> Sair
        </button>
      </div>
    </aside>

    <main class="content">
      <header class="content-header">
        <h1>{{ activeTab === 'projects' ? 'Gerir Portfólio' : 'Mensagens Recebidas' }}</h1>
        <button v-if="activeTab === 'projects'" @click="showModal = true" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> Novo Projeto
        </button>
      </header>

      <!-- Projects Grid -->
      <section v-if="activeTab === 'projects'" class="dashboard-section">
        <div class="projects-admin-grid">
          <div v-for="project in projects" :key="project._id" class="project-admin-card">
            <img :src="project.images[0]" :alt="project.title">
            <div class="card-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.category }}</p>
              <button @click="deleteProject(project._id)" class="btn-delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Messages List -->
      <section v-if="activeTab === 'messages'" class="dashboard-section">
        <div class="messages-list">
          <div v-for="msg in messages" :key="msg._id" class="message-card">
            <div class="msg-header">
              <strong>{{ msg.name }}</strong>
              <span>{{ new Date(msg.createdAt).toLocaleDateString() }}</span>
            </div>
            <p class="msg-email">{{ msg.email }}</p>
            <p class="msg-text">{{ msg.message }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal for New Project -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h2>Adicionar Novo Projeto</h2>
        <form @submit.prevent="createProject" class="project-form">
          <input v-model="newProject.title" type="text" placeholder="Título do Projeto" required>
          <select v-model="newProject.category" required>
            <option value="" disabled>Escolha a Categoria</option>
            <option value="mural">Mural Artístico</option>
            <option value="ads">Publicidade & Branding</option>
            <option value="portrait">Retratos</option>
            <option value="mosaic">Projeto Decorativo</option>
          </select>
          <textarea v-model="newProject.description" placeholder="Descrição"></textarea>
          
          <div class="file-input">
            <label>Imagens (Selecione até 5)</label>
            <input type="file" multiple @change="handleFileChange" accept="image/*" required>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Guardando...' : 'Criar Projeto' }}
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

const newProject = ref({
  title: '',
  category: '',
  description: ''
});
const selectedFiles = ref([]);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

const fetchData = async () => {
  try {
    const [pRes, mRes] = await Promise.all([
      api.get('/portfolio'),
      api.get('/admin/messages')
    ]);
    projects.value = pRes.data;
    messages.value = mRes.data;
  } catch (err) {
    if (err.response?.status === 401) handleLogout();
  }
};

const handleFileChange = (e) => {
  selectedFiles.value = Array.from(e.target.files);
};

const createProject = async () => {
  isSaving.value = true;
  const formData = new FormData();
  formData.append('title', newProject.title);
  formData.append('category', newProject.category);
  formData.append('description', newProject.description);
  selectedFiles.value.forEach(file => formData.append('images', file));

  try {
    await api.post('/admin/projects', formData);
    showModal.value = false;
    newProject.value = { title: '', category: '', description: '' };
    fetchData();
  } catch (err) {
    alert('Erro ao guardar projeto');
  } finally {
    isSaving.value = false;
  }
};

const deleteProject = async (id) => {
  if (confirm('Tem certeza?')) {
    try {
      await api.delete(`/admin/projects/${id}`);
      fetchData();
    } catch (err) {
      alert('Erro ao apagar');
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

.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 30px 0;
}

.sidebar-header {
  padding: 0 30px 40px;
}

.sidebar-nav {
  flex: 1;
}

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
}

.sidebar-nav button.active, .sidebar-nav button:hover {
  color: #fff;
  background: rgba(255, 138, 0, 0.1);
  border-right: 3px solid #ff8a00;
}

.sidebar-footer {
  padding: 0 30px;
}

.btn-logout {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

/* Grids */
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
}

.project-admin-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.card-info {
  padding: 15px;
  position: relative;
}

.btn-delete {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
}

/* Messages */
.message-card {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #ff8a00;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.msg-email {
  color: #ff8a00;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.project-form input, .project-form select, .project-form textarea {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}
</style>
