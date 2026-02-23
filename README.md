# Hingile Arts Lda - Website Oficial

Website oficial da **Hingile Arts Lda** — especialistas em arte mural, pintura publicitária, retratos e mosaicos em Moçambique.

## 🏗️ Estrutura do Projecto

```
HingileArts/
├── frontend/       # Vue 3 + Vite (Interface do site e painel admin)
└── backend/        # Node.js + Express + MongoDB (API)
```

## 🚀 Como executar localmente

### 1. Backend (API)
```bash
cd backend
cp .env.example .env   # Copia e preenche com as tuas credenciais reais
npm install
node server.js
```
Backend disponível em: `http://localhost:5000`

### 2. Frontend (Site + Admin)
```bash
cd frontend
npm install
npm run dev
```
Site disponível em: `http://localhost:5173`

## 🔐 Painel Administrativo
Acede em: `http://localhost:5173/admin/login`

As credenciais de administrador são definidas nas variáveis de ambiente `.env`.

## 🛠️ Stack Tecnológico
- **Frontend**: Vue 3, Vite, Vue Router, Axios
- **Backend**: Node.js, Express, Mongoose, JWT, Bcrypt
- **Base de Dados**: MongoDB Atlas
- **Media Storage**: Cloudinary
