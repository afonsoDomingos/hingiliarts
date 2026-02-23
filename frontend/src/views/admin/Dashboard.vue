<template>
  <div class="admin-dashboard">
    <!-- Notificação Customizada -->
    <Transition name="toast">
      <div v-if="notification.show" :class="['custom-toast', notification.type]">
        <i :class="notification.type === 'success' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle'"></i>
        <span>{{ notification.message }}</span>
      </div>
    </Transition>

    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo-text">Hingili<span class="highlight">Arts</span></h2>
        <p class="admin-label">Painel Admin</p>
      </div>
      <nav class="sidebar-nav">
        <button @click="activeTab = 'projects'" :class="{ active: activeTab === 'projects' }">
          <i class="fa-solid fa-palette"></i> <span>Portfólio</span>
        </button>
        <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }">
          <i class="fa-solid fa-envelope"></i> <span>Mensagens</span>
          <span v-if="messages.length > 0" class="badge">{{ messages.length }}</span>
        </button>
      </nav>
      <div class="sidebar-footer">
        <p class="admin-user"><i class="fa-solid fa-user"></i> <span>{{ adminUser?.name || 'Admin' }}</span></p>
        <button @click="handleLogout" class="btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> <span>Sair</span>
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

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-circle-notch fa-spin"></i> A carregar...
      </div>

      <section v-else-if="activeTab === 'projects'" class="dashboard-section">
        <div v-if="projects.length === 0" class="empty-state">
          <i class="fa-solid fa-images"></i>
          <p>Nenhum projeto encontrado. Começa por adicionar um!</p>
        </div>
        <div class="projects-admin-grid" v-else>
          <div v-for="project in projects" :key="project._id" class="project-admin-card">
            <div class="card-img-wrap">
              <img :src="project.images[0]" :alt="project.title || 'Sem título'">
              <span class="img-count" v-if="project.images && project.images.length > 1">
                <i class="fa-solid fa-images"></i> {{ project.images.length }}
              </span>
            </div>
            <div class="card-info">
              <h3>{{ project.title || 'Sem Título' }}</h3>
              <span class="category-badge">{{ categoryLabel(project.category) }}</span>
              <div class="card-actions">
                <button @click="editProject(project)" class="btn-action btn-edit" title="Editar">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="confirmDelete(project._id)" class="btn-action btn-delete" title="Eliminar">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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

    <!-- Modal Novo/Editar Projeto -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Projeto' : 'Adicionar Novo Projeto' }}</h2>
          <button class="modal-close" @click="showModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form @submit.prevent="saveProject" class="project-form">
          <div class="form-group">
            <label>Título do Projeto *</label>
            <input v-model="formData.title" type="text" placeholder="Ex: Mural Artístico" required>
          </div>
          <div class="form-group">
            <label>Categoria *</label>
            <select v-model="formData.category" required>
              <option value="" disabled>Escolha a Categoria</option>
              <option value="mural">Mural Artístico</option>
              <option value="ads">Publicidade & Branding</option>
              <option value="portrait">Retratos</option>
              <option value="mosaic">Projeto Decorativo</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="formData.description" rows="2" placeholder="Breve descrição..."></textarea>
          </div>
          
          <div class="form-group">
            <label>{{ isEditing ? 'Adicionar mais Imagens (Opcional)' : 'Imagens * (até 5 fotos)' }}</label>
            <div class="file-drop" @click="$refs.fileInput.click()">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <p v-if="selectedFiles.length === 0">Clica para seleccionar imagens</p>
              <p v-else><strong>{{ selectedFiles.length }} ficheiro(s)</strong> selecionado(s)</p>
            </div>
            <input ref="fileInput" type="file" multiple @change="handleFileChange" accept="image/*" :required="!isEditing" style="display:none">
          </div>
          
          <div v-if="isEditing" class="edit-note">
            <p><i class="fa-solid fa-camera-retro"></i> Notas: As novas imagens serão adicionadas ao projeto. Os textos atuais serão atualizados.</p>
          </div>

          <p v-if="saveError" class="error-msg">{{ saveError }}</p>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              <i v-if="isSaving" class="fa-solid fa-circle-notch fa-spin"></i>
              {{ isSaving ? 'A guardar...' : (isEditing ? 'Atualizar Projeto' : 'Criar Projeto') }}
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
const isEditing = ref(false);
const currentId = ref(null);
const saveError = ref('');
const adminUser = ref(JSON.parse(localStorage.getItem('adminUser') || 'null'));

const notification = ref({ show: false, message: '', type: 'success' });

const formData = ref({ title: '', category: '', description: '' });
const selectedFiles = ref([]);
const fileInput = ref(null);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

const showToast = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 4000);
};

const categoryLabel = (cat) => {
  const map = { mural: 'Mural Artístico', ads: 'Publicidade & Branding', portrait: 'Retratos', mosaic: 'Projeto Decorativo' };
  return map[cat] || 'Sem Categoria';
};

const formatDate = (date) => new Date(date).toLocaleDateString();

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
  isEditing.value = false;
  currentId.value = null;
  formData.value = { title: '', category: '', description: '' };
  selectedFiles.value = [];
  saveError.value = '';
  showModal.value = true;
};

const editProject = (project) => {
  isEditing.value = true;
  currentId.value = project._id;
  formData.value = { 
    title: project.title, 
    category: project.category, 
    description: project.description 
  };
  selectedFiles.value = [];
  saveError.value = '';
  showModal.value = true;
};

const saveProject = async () => {
  isSaving.value = true;
  saveError.value = '';

  const fd = new FormData();
  fd.append('title', formData.value.title);
  fd.append('category', formData.value.category);
  fd.append('description', formData.value.description || '');
  
  if (selectedFiles.value.length > 0) {
    selectedFiles.value.forEach(file => fd.append('images', file));
  }

  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };

    if (isEditing.value) {
      await api.put(`/admin/projects/${currentId.value}`, fd, config);
      showToast('Projeto atualizado com sucesso!');
    } else {
      await api.post('/admin/projects', fd, config);
      showToast('Projeto criado com sucesso!');
    }
    
    showModal.value = false;
    await fetchData();
  } catch (err) {
    showToast('Erro ao guardar dados.', 'error');
    saveError.value = err.response?.data?.message || 'Erro ao guardar dados.';
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (id) => {
  // Nota: Para ser 100% custom precisariamos de um modal de confirmação. 
  // Por agora mantemos o confirm do JS mas as respostas de sucesso/erro serão toasts.
  if (confirm('Queres mesmo eliminar este projeto?')) {
    deleteProject(id);
  }
};

const deleteProject = async (id) => {
  try {
    await api.delete(`/admin/projects/${id}`);
    showToast('Projeto eliminado.');
    await fetchData();
  } catch (err) {
    showToast('Erro ao eliminar.', 'error');
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
  background: #0d0d0f;
}

/* Custom Toast Notification */
.custom-toast {
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 16px 24px;
  border-radius: 12px;
  background: rgba(25, 25, 30, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.custom-toast.success { border-left: 4px solid #10b981; }
.custom-toast.error { border-left: 4px solid #ef4444; }

.custom-toast i {
  font-size: 1.2rem;
}
.custom-toast.success i { color: #10b981; }
.custom-toast.error i { color: #ef4444; }

/* Toast Animation */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from { opacity: 0; transform: translateX(100px); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }

/* Sidebar & Layout Styles */
.sidebar {
  width: 270px;
  background: #131317;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
}
.sidebar-header { padding: 0 30px 30px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px; }
.admin-label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 2px; }
.sidebar-nav { flex: 1; }
.sidebar-nav button {
  width: 100%; text-align: left; padding: 15px 30px; background: transparent; border: none; color: #888; font-size: 1rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 15px;
}
.sidebar-nav button.active, .sidebar-nav button:hover { color: #fff; background: rgba(255, 138, 0, 0.1); border-left: 3px solid #ff8a00; }
.badge { background: #ff8a00; color: #fff; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; margin-left: auto; }
.sidebar-footer { padding: 20px 30px; border-top: 1px solid rgba(255,255,255,0.05); }
.admin-user { font-size: 0.85rem; color: #888; margin-bottom: 15px; }
.btn-logout { background: transparent; border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 8px 15px; border-radius: 8px; cursor: pointer; width: 100%; transition: 0.3s; }
.btn-logout:hover { background: rgba(239,68,68,0.1); }

/* Content Area */
.content { flex: 1; padding: 50px; margin-left: 270px; }
.content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
.sub-header { color: #666; font-size: 0.9rem; margin-top: 5px; }

/* Grid */
.projects-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
.project-admin-card { background: #1a1a20; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.03); transition: 0.4s ease; }
.project-admin-card:hover { transform: translateY(-5px); border-color: rgba(255, 138, 0, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.card-img-wrap { position: relative; height: 200px; }
.card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.img-count { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; backdrop-filter: blur(5px); }
.card-info { padding: 20px; }
.card-info h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 5px; color: #eee; }
.category-badge { font-size: 0.75rem; color: #ff8a00; text-transform: uppercase; letter-spacing: 1px; }
.card-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.btn-action { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.3s; }
.btn-edit { background: rgba(255, 255, 255, 0.05); color: #fff; }
.btn-edit:hover { background: rgba(255, 138, 0, 0.2); color: #ff8a00; }
.btn-delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.btn-delete:hover { background: #ef4444; color: #fff; }

/* States */
.empty-state { text-align: center; padding: 100px; color: #555; }
.loading-state { text-align: center; padding: 50px; font-size: 1.2rem; color: #ff8a00; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
.modal-card { background: #1a1a20; padding: 40px; border-radius: 24px; width: 100%; max-width: 500px; border: 1px solid rgba(255,255,255,0.05); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.modal-close { background: transparent; border: none; color: #555; font-size: 1.5rem; cursor: pointer; }
.project-form { display: flex; flex-direction: column; gap: 20px; }
.form-group label { font-size: 0.8rem; color: #888; margin-bottom: 8px; display: block; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 14px; background: #131317; border: 1px solid #333; border-radius: 12px; color: #fff; font-size: 1rem; }
.form-group input:focus { border-color: #ff8a00; outline: none; }
.file-drop { border: 2px dashed #333; padding: 20px; text-align: center; border-radius: 12px; cursor: pointer; }
.file-drop:hover { border-color: #ff8a00; }
.edit-note { font-size: 0.8rem; color: #ffb700; background: rgba(255, 183, 0, 0.1); padding: 10px; border-radius: 8px; line-height: 1.4; }
.modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }

/* Messages */
.message-card { background: #1a1a20; padding: 25px; border-radius: 16px; margin-bottom: 20px; border-left: 4px solid #ff8a00; }

/* ====== Responsive Adjustments ====== */
@media (max-width: 992px) {
  .sidebar { width: 80px; padding: 20px 0; }
  .sidebar-header h2, .admin-label, .sidebar-nav button span, .admin-user, .btn-logout span { display: none; }
  .sidebar-nav button { justify-content: center; padding: 15px; }
  .content { margin-left: 80px; padding: 30px; }
}

@media (max-width: 768px) {
  .content-header { flex-direction: column; gap: 20px; align-items: flex-start; }
  .projects-admin-grid { grid-template-columns: 1fr; }
  .modal-card { padding: 25px; }
  .custom-toast { top: 20px; right: 20px; left: 20px; justify-content: center; }
}

@media (max-width: 480px) {
  .sidebar { width: 60px; }
  .content { margin-left: 60px; padding: 20px; }
  .logo-text { font-size: 1.2rem; }
}
</style>
